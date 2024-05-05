"use client";
import { ImageIcon, Mic, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TextComment from "../TextComment";
import VoiceComment from "../VoiceComment";
import { format } from "date-fns";
import {
  CommentListInterface,
  CommentReplyInterface,
} from "@/server/controllers/comments";
import Textarea from "@/app/components/UI/Textarea";
import ReplyItem from "./ReplyItem";
import { makeCommentReply } from "../actions";
import toast from "react-hot-toast";

type CommentProps = {
  user?: AuthUser;
  comment: CommentListInterface[0];
};

export default function CommentItem({ comment: data, user }: CommentProps) {
  const [comment, setComment] = useState(data);
  const [reply, toggleReply] = useState(false);
  const [submitting, toggleSubmitting] = useState(false);

  const submitReply = async (textarea: HTMLTextAreaElement) => {
    if (submitting) return;

    const formData = new FormData();

    const data = {
      text: textarea.value,
      comment_type: "text",
      parent_id: comment.id,
      post_slug: comment.postSlug,
    };

    toggleSubmitting(true);
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    const response = await makeCommentReply(formData);
    toggleSubmitting(false);

    if (!response.success) {
      toast.error(response.message, { duration: 5_000 });
      return;
    }

    textarea.value = "";
    const reply = {
      ...response.data,
      author: {
        name: user!.name,
        avatar: user!.avatar,
        username: user!.username,
      },
    };

    setComment((prev) => {
      const replies = prev.replies || [];
      replies.unshift(reply);

      let cleanedReplies = {} as { [key: string]: (typeof replies)[0] };

      replies.forEach((reply) => {
        cleanedReplies[reply.id] = reply;
      });

      const data = {
        ...prev,
        replies: Object.values(cleanedReplies),
      };
      const event = new CustomEvent("cache-post-comments", {
        detail: { commentId: comment.id, data: data },
      });
      document.dispatchEvent(event);
      return data;
    });
    toggleReply(false);

    toast.success("Reply created successfully", {
      duration: 5_000,
      position: "bottom-left",
    });

    const event = new CustomEvent("increment-post-interaction-counts", {
      detail: { type: "comment" },
    });
    document.dispatchEvent(event);
  };

  return (
    <div className={`flex flex-col gap-1`}>
      <div key={comment.id} className="last:border-none border-b pt-2 pb-1">
        <Link
          href={`/${comment.author?.username}`}
          className="flex items-center space-x-2"
        >
          <div className="flex w-8 h-8 border rounded-full overflow-hidden">
            {comment.author?.avatar && (
              <Image
                width={32} // Set width and height to maintain aspect ratio
                height={32}
                src={comment.author.avatar}
                alt="avatar"
                className="w-full h-full rounded-full comment-author-img"
              />
            )}
            {!comment.author?.avatar && (
              <div className="h-full w-full dark:bg-black/30 flex items-center justify-center">
                <User2 width={28} height={28} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-xs">{comment.author?.name}</p>
            <p className="text-xs opacity-70">@{comment.author?.username}</p>
          </div>
        </Link>
        {comment.commentType === "text" && (
          <div className="space-y-1 mt-2">
            <TextComment
              text={comment.text!}
              replied={false}
              liked={false}
              toggleLike={async () => {}}
              toggleReply={() => toggleReply((p) => !p)}
            />
            <CommentDate comment={comment} />
          </div>
        )}
        {comment.commentType === "image" && <div className="">Image</div>}
        {comment.commentType === "audio" && (
          <div className="mt-2 space-y-1">
            <VoiceComment
              src={comment.fileUrl!}
              replied={false}
              liked={false}
              toggleLike={async () => {}}
              toggleReply={() => toggleReply((p) => !p)}
            />
            <CommentDate comment={comment} />
          </div>
        )}
        {reply && (
          <div className="my-2 relative ml-8">
            <Textarea
              rows={1}
              autoFocus
              placeholder={`Reply to ${comment.author?.name.toLowerCase()}...`}
              className="min-h-[30px] pr-[60px]"
              onKeyDown={(e) => {
                e.key === "Enter" && submitReply(e.currentTarget);
                e.key === "Escape" && toggleReply((p) => !p);

                if (e.key === "Enter" || e.key === "Escape") e.preventDefault();
              }}
            />
            <div className="absolute w-[60px] right-0 bottom-2">
              <div className="flex items-center gap-1">
                <button className="p-1.5 transition-all opacity-90 hover:opacity-100 dark:hover:bg-gray-700 hover:bg-gray-500 rounded-full">
                  <Mic width={16} height={16} />
                </button>
                <button className="p-1.5 transition-all opacity-90 hover:opacity-100 dark:hover:bg-gray-700 hover:bg-gray-500 rounded-full">
                  <ImageIcon width={16} height={16} />
                </button>
              </div>
            </div>
            {submitting && (
              <div className="absolute bottom-0 left-0 w-[calc(100%-36px)] overflow-hidden rounded-b-md">
                <div className="animate-translate-left-and-right h-[2px] rounded shadow bg-primary"></div>
              </div>
            )}
          </div>
        )}
        {comment.replies?.length > 0 &&
          comment.replies.map((reply: any) => (
            <ReplyItem key={reply.id} comment={reply} />
          ))}
      </div>
    </div>
  );
}

function CommentDate({ comment }: any) {
  return (
    <div className="text-xs gap-2 text-nowrap opacity-60 flex justify-between">
      <p className="text-nowrap pl-2 flex justify-between">
        <small>
          {format(new Date(comment.updatedAt), "PPp", {
            firstWeekContainsDate: 4,
            weekStartsOn: 5,
          })}
        </small>
      </p>
      <div className="flex items-center gap-4">
        <p>
          <small>
            Likes <b>{comment.likesCount}</b>
          </small>
        </p>
        <p>
          <small>
            Replies <b>{comment.likesCount}</b>
          </small>
        </p>
      </div>
    </div>
  );
}
