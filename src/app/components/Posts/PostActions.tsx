"use client";
import { PostFeedsInterface } from "@/server/controllers/posts";
import {
  Heart,
  ImageIcon,
  Loader2,
  LucideBookmark,
  MessageCircle,
  Send,
  Share2,
  SortAscIcon,
  User2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { getComments, makeComment } from "./actions";
import toast from "react-hot-toast";
import { CommentInterface } from "@/server/models/comment_and_likes";
import { CommentListInterface } from "@/server/controllers/comments";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VoiceComment from "./VoiceComment";
import { format, formatDistance } from "date-fns";
import TextComment from "./TextComment";
import CommentsWrapper from "./CommentsWrapper";

type Props = {
  user?: AuthUser;
  post: PostFeedsInterface;
};

const commentsCached = new Map();

// Post Card for individual posts
export default function PostActions({ post, user }: Props) {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [openComments, toggleOpenComments] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaValid, setTextAreaValid] = useState(false);

  async function submitForm(formData: FormData) {
    if (!user?.username) {
      router.push("/auth/login");
      return false;
    }
    formData.append("post_slug", post.slug!);
    try {
      const response = await makeComment(formData);
      if (response.success) {
        toast.success("Comment created");
        return true;
      }
      toast.error(response.message);
      return false;
    } catch (error) {
      toast.error("Error uploading audio");
      return false;
    }
  }

  const submitVoiceComment = async (file: File): Promise<boolean> => {
    if (!file) {
      toast.error("Audio file not found");
      return false;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("comment_type", "audio");
    return submitForm(formData);
  };
  const submitTextComment = async () => {
    if (!textAreaValid) {
      toast.error("Comments cannot be empty");
      return false;
    }
    const formData = new FormData();
    formData.append("text", commentRef.current?.value!);
    formData.append("comment_type", "text");
    const created = await submitForm(formData);
    if (created && commentRef.current) {
      commentRef.current.value = "";
      setTextAreaValid(false);
    }
  };

  return (
    <div className={`pb-2`}>
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <button className="text-red-300 p-0.5 px-2 inline-flex items-center gap-1 outline outline-1 outline-red-300 rounded-full">
            <Heart
              width={14}
              className={`${openComments ? "fill-red-300" : ""}`}
            />
            <small className="font-light text-[10px] opacity-80">124</small>
          </button>
          <button
            className={`text-sky-300 transition-all p-0.5 px-2 inline-flex items-center gap-1 outline ${
              openComments ? "outline-1" : "outline-1"
            } outline-sky-300 rounded-full`}
            onClick={() => toggleOpenComments((p) => !p)}
          >
            <MessageCircle
              width={18}
              className={`${openComments ? "fill-sky-300" : ""}`}
            />
            <small
              className={`${
                openComments ? "" : "opacity-80"
              } font-light text-[10px]`}
            >
              124
            </small>
          </button>
          <button className="text-green-300 p-0.5 px-2 inline-flex items-center gap-1 outline outline-1 outline-green-300 rounded-full">
            <LucideBookmark
              width={18}
              className={`${openComments ? "fill-green-300" : ""}`}
            />
            <small className="font-light text-[10px] opacity-80">124</small>
          </button>
        </div>
        <button className="text-orange-300 p-0.5 px-2 inline-flex items-center gap-1 outline outline-1 outline-orange-300 rounded-full">
          <Share2
            width={18}
            className={`${openComments ? "fill-orange-300" : ""}`}
          />
          <small className="font-light text-[10px] opacity-80">124</small>
        </button>
      </div>

      {openComments && (
        <>
          <div className="mt-4 relative h-max flex">
            <textarea
              ref={commentRef}
              className="input flex-1 resize-none relative w-full m-0 p-2 text-sm pr-9 min-h-[70px]"
              autoFocus
              disabled={recording}
              placeholder={!recording ? "Add a comment..." : ""}
              onChange={async ({ target: { value } }) => {
                setTextAreaValid(value?.length > 0);
              }}
            ></textarea>

            <div className="w-9 h-[90%]">
              <div className="flex justify-evenly h-full gap-1 flex-col items-center p-0.5 py-1">
                <AudioRecorder
                  recording={recording}
                  setRecording={setRecording}
                  sendFile={submitVoiceComment}
                />
                <button
                  className="scale-95 h-[20px] w-[20px] border border-opacity-80 rounded-full text-sm inline-flex items-center justify-center"
                  title="Photo Message"
                >
                  <ImageIcon className="text-white" width={15} height={15} />
                </button>
                <button
                  onClick={() => submitTextComment()}
                  disabled={textAreaValid === false}
                  className="scale-95 h-[20px] group hover:bg-primary transition-all disabled:border-gray-500/40 border-primaryHover w-[20px] border border-opacity-80 rounded-full text-sm inline-flex items-center justify-center"
                  title="Text Comment"
                >
                  <Send
                    className="text-primary group-disabled:text-white group-hover:text-white"
                    width={14}
                    height={14}
                  />
                </button>
              </div>
            </div>
          </div>

          <CommentsWrapper user={user} post={post} />
        </>
      )}
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
