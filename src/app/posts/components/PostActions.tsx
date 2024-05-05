"use client";
import { PostFeedsInterface } from "@/server/controllers/posts";
import {
  Heart,
  ImageIcon,
  LucideBookmark,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { makeComment } from "./actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import CommentsWrapper from "./CommentsWrapper";

type Props = {
  user?: AuthUser;
  post: PostFeedsInterface;
  size?: keyof typeof btnStyles;
};

// Post Card for individual posts
export default function PostActions({ post, user, ...props }: Props) {
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const [submitting, toggleSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [textAreaValid, setTextAreaValid] = useState(false);
  const [openComments, toggleOpenComments] = useState(false);

  const [counts, setCounts] = useState({
    likes: post.likesCount,
    comments: post.commentsCount,
  });

  useEffect(() => {
    const incrementCommentCount = (event: CustomEventInit) => {
      const type = event.detail.type as "like" | "comment";
      switch (type) {
        case "comment":
          setCounts((prev) => ({
            ...prev,
            comments: (prev.comments || 0) + 1,
          }));
          break;
        case "like":
          setCounts((prev) => ({
            ...prev,
            likes: (prev.likes || 0) + 1,
          }));
        default:
          break;
      }
    };

    document.addEventListener(
      "increment-post-interaction-counts",
      incrementCommentCount
    );
    return () => {
      document.removeEventListener(
        "increment-post-interaction-counts",
        incrementCommentCount
      );
    };
  }, []);

  async function submitForm(formData: FormData) {
    if (submitting) {
      toast.loading("Please wait...");
      return false;
    }
    if (!user?.username) {
      router.push("/auth/login");
      return false;
    }
    formData.append("post_slug", post.slug!);
    try {
      toggleSubmitting(true);
      const response = await makeComment(formData);
      toggleSubmitting(false);
      if (response.success) {
        const author = {
          name: user.name,
          avatar: user.avatar,
          username: user.username,
        };
        const comment = response.data as any;
        comment.author = author;

        const newEvent = new CustomEvent("new-comment", { detail: comment });
        document.dispatchEvent(newEvent);
        setCounts((prev) => ({ ...prev, comments: prev.comments || 0 + 1 }));
        return true;
      }
      toast.error(response.message);
      return false;
    } catch ({ message }: any) {
      toast.error(message);
      return false;
    } finally {
      toggleSubmitting(false);
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
      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <ActionButton
            color="red"
            count={counts.likes!}
            icon={Heart}
            size={props.size || "md"}
            iconClassName={`${false ? "fill-red-300" : ""}`}
          />
          <ActionButton
            color="sky"
            count={counts.comments!}
            icon={MessageCircle}
            size={props.size || "md"}
            onClick={() => toggleOpenComments((p) => !p)}
            iconClassName={`${openComments ? "fill-sky-300" : ""}`}
          />
          <ActionButton // Bookmark
            color="green"
            count={10}
            icon={LucideBookmark}
            size={props.size || "md"}
            iconClassName={`${false ? "fill-green-300" : ""}`}
          />
        </div>
        <ActionButton // Shares
          color="orange"
          count={18}
          icon={Share2}
          size={props.size || "md"}
          iconClassName={`${false ? "fill-orange-300" : ""}`}
        />
      </div>

      {openComments && (
        <>
          <div className="mt-4 relative h-max flex">
            <textarea
              readOnly={recording || submitting}
              ref={commentRef}
              className="input read-only:cursor-not-allowed flex-1 resize-none relative w-full m-0 p-2 text-sm pr-9 min-h-[70px]"
              disabled={recording}
              placeholder={!recording ? "Add a comment..." : ""}
              onChange={async ({ target: { value } }) => {
                setTextAreaValid(value?.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitTextComment();
                }
              }}
            ></textarea>

            {submitting && (
              <div className="absolute bottom-0 left-0 w-[calc(100%-36px)] overflow-hidden rounded-b-md">
                <div className="animate-translate-left-and-right h-[2px] rounded shadow bg-primary"></div>
              </div>
            )}

            <div className="w-9 h-[90%]">
              <div className="flex justify-evenly h-full gap-1 flex-col items-center p-0.5 py-1">
                <AudioRecorder
                  disabled={recording || submitting}
                  recording={recording}
                  setRecording={(value) => {
                    if (submitting) return;
                    setRecording(value);
                  }}
                  sendFile={async (file) => {
                    if (submitting) return false;
                    return await submitVoiceComment(file!);
                  }}
                />
                <button
                  disabled={submitting}
                  className="scale-95 h-[20px] w-[20px] border border-opacity-80 rounded-full text-sm inline-flex items-center justify-center"
                  title="Photo Message"
                >
                  <ImageIcon
                    className="text-white"
                    width={!props.size ? 15 : 13}
                    height={!props.size ? 15 : 13}
                  />
                </button>
                <button
                  onClick={() => submitTextComment()}
                  disabled={textAreaValid === false || submitting}
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
          {!(post as any).comments && (
            <CommentsWrapper user={user} post={post} />
          )}
        </>
      )}
    </div>
  );
}

const btnStyles = {
  sm: "text-xs py-0.5 px-1",
  md: "text-sm py-1 px-1.5",
  lg: "text-base py-1.5 px-2",
};

type ActionButtonProps = {
  size: keyof typeof btnStyles;
  icon: any;
  count: number;
  iconClassName: string;
  color: "red" | "sky" | "green" | "orange";
  onClick?: any;
};

function ActionButton(props: ActionButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`inline-flex ${
        props.color === "red" && "text-red-300 outline-red-300"
      } ${props.color === "orange" && "text-orange-300 outline-orange-300"} ${
        props.color === "sky" && "text-sky-300 outline-sky-300"
      } ${props.color === "green" && "text-green-300 outline-green-300"} ${
        props.color === "sky" && "text-sky-300 outline-sky-300"
      }  ${
        btnStyles[props.size]
      } opacity-80 hover:opacity-100 transition-all items-center gap-1 outline outline-1 rounded-full`}
    >
      <ActionButtonIcon
        size={props.size}
        Component={props.icon}
        className={props.iconClassName}
      />

      <small className="text-[10px] opacity-80">{props.count}</small>
    </button>
  );
}

const iconStyles = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

type ActionButtonIconProps = {
  Component: any;
  className: string;
  size: keyof typeof iconStyles;
};

function ActionButtonIcon({
  Component,
  size,
  className,
}: ActionButtonIconProps) {
  return <Component className={`${className} ${iconStyles[size]}`} />;
}
