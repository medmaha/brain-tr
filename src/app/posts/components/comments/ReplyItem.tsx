"use client";
import { User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import TextComment from "../TextComment";
import VoiceComment from "../VoiceComment";
import { format } from "date-fns";
import {
  CommentListInterface,
  CommentReplyInterface,
} from "@/server/controllers/comments";
import Textarea from "@/app/components/UI/Textarea";

type CommentProps = {
  comment: CommentReplyInterface;
};

export default function ReplyItem({ comment: data }: CommentProps) {
  const [comment, setComment] = useState(data);

  return (
    <div className={`flex flex-col gap-1 pl-8`}>
      <div key={comment.id} className="last:border-none border-t pt-2 pb-1">
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
            />
            <CommentDate comment={comment} />
          </div>
        )}
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
