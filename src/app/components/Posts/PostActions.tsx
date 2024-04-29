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
import VoiceNotePlayer from "./VoiceNotePlayer";
import { format, formatDistance } from "date-fns";

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
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState<CommentListInterface>();

  const submitVoiceComment = async (file: File): Promise<boolean> => {
    if (!user?.username) {
      router.push("/auth/login");
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("post_slug", post.slug!);
    formData.append("comment_type", "audio");
    try {
      const response = await makeComment(formData);
      if (response.success) {
        setComments((p) => [
          ...(p || []),
          {
            ...response.data,
            author: {
              name: user?.name,
              avatar: user?.avatar,
              username: user?.username,
            } as any,
          },
        ]);
        return true;
      }
      toast.error(response.message);
      return false;
    } catch (error) {
      toast.error("Error uploading audio");
      return false;
    }
  };

  useEffect(() => {
    return () => {
      commentsCached.clear();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingComments(true);
      if (commentsCached.has(post.slug!)) {
        setComments(commentsCached.get(post.slug!));
        setLoadingComments(false);
        return;
      }
      const response = await getComments(post.slug!);
      if (response.success) {
        setComments([...response.data, ...response.data]);
        commentsCached.set(post.slug!, response.data);
      }
      setLoadingComments(false);
    };
    if (openComments) fetchData();
  }, [post.slug, openComments]);

  return (
    <div className={`${comments?.length && openComments ? "p-2" : "pb-4"}}`}>
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
              className="input flex-1 resize-none relative w-full m-0 p-2 text-sm pr-9 min-h-[70px]"
              autoFocus
              disabled={recording}
              placeholder={!recording ? "Add a comment..." : ""}
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
                  title="Voice Message"
                >
                  <ImageIcon className="text-white" width={15} height={15} />
                </button>
                <button
                  className="scale-95 h-[20px] w-[20px] border border-opacity-80 rounded-full text-sm inline-flex items-center justify-center"
                  title="Voice Message"
                >
                  <Send className="text-white" width={15} height={15} />
                </button>
              </div>
            </div>
          </div>

          {loadingComments && (
            <div className="pt-6 justify-center items-center flex">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          {comments && (
            <div className="mt-4 border-t">
              <h4 className="font-semibold text-sm pt-2 pb-0.5">
                Comments {comments.length}
              </h4>
              {comments.map((comment) => (
                <div className="" key={comment.id}>
                  <div className="border-t mt-2 pt-4 odd:pb-1.5">
                    <div className="flex items-center space-x-2">
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
                        <p className="font-semibold text-xs">
                          {comment.author?.name}
                        </p>
                        <p className="text-xs opacity-70">
                          @{comment.author?.username}
                        </p>
                      </div>
                    </div>
                    {comment.commentType === "text" && (
                      <p className="text-sm mt-1">
                        {comment.text || "No content provided"}
                      </p>
                    )}
                    {comment.commentType === "image" && (
                      <div className="">Image</div>
                    )}
                    {comment.commentType === "audio" && (
                      <div className="gap-2 mt-2 space-y-1">
                        <VoiceNotePlayer src={comment.fileUrl!} />
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
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
