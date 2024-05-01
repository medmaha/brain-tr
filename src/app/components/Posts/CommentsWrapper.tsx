import { Loader2, SortAscIcon, SortDescIcon, User2 } from "lucide-react";
import { CommentListInterface } from "@/server/controllers/comments";
import { PostFeedsInterface } from "@/server/controllers/posts";
import React, { useEffect, useState } from "react";
import VoiceComment from "./VoiceComment";
import TextComment from "./TextComment";
import { getComments } from "./actions";
import { format } from "date-fns";
import Image from "next/image";

type Props = {
  user?: AuthUser;
  post: PostFeedsInterface;
};

const commentsCached = new Map();
const defaultSort: "asc" | "desc" = "desc";

export default function CommentsWrapper({ user, post }: Props) {
  const [fetching, toggleFetching] = useState(false);
  const [comments, setComments] = useState<CommentListInterface>();
  const [sort, setSort] = useState(defaultSort);

  useEffect(() => {
    commentsCached.set("sort", defaultSort);
    return () => {
      commentsCached.clear();
    };
  }, []);

  useEffect(() => {
    const eventHandler = (event: CustomEventInit) => {
      const comment = event.detail as any;
      const sort = commentsCached.get("sort") as typeof defaultSort;
      let _comments: any;
      if (commentsCached.has(post.slug!)) {
        if (sort === "asc") {
          _comments = [comment, ...commentsCached.get(post.slug!)!];
        } else {
          _comments = [...commentsCached.get(post.slug!)!, comment];
        }
        setComments(_comments);
        commentsCached.set(post.slug!, _comments);
      } else {
        if (sort === "asc") {
          setComments((prev) => {
            const data = [comment, ...(prev || [])];
            commentsCached.set(post.slug!, data);
            return data;
          });
        } else {
          setComments((prev) => {
            const data = [...(prev || []), comment];
            commentsCached.set(post.slug!, data);
            return data;
          });
        }
      }
    };
    document.addEventListener("new-comment", eventHandler);

    const fetchData = async () => {
      toggleFetching(true);
      if (commentsCached.has(post.slug!)) {
        setComments(commentsCached.get(post.slug!));
        toggleFetching(false);
        return;
      }
      const response = await getComments(post.slug!);
      if (response.success) {
        setComments(response.data);
        commentsCached.set(post.slug!, response.data);
      }
      toggleFetching(false);
    };
    fetchData();

    return () => {
      document.removeEventListener("new-comment", eventHandler);
    };
  }, [post.slug]);

  const sortComments = () => {
    let sortType: typeof sort;
    if (sort === "asc") {
      sortType = "desc";
    } else {
      sortType = "asc";
    }

    let sortedComments: typeof comments;

    if (sort === "asc") {
      sortedComments = comments?.sort(
        (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
      );
    } else {
      sortedComments = comments?.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
    }

    setSort(sortType);
    setComments([...sortedComments!]);
    commentsCached.set("sort", sortType);
  };

  return (
    <>
      <div className="mt-4">
        <div className="flex border-y dark:border-gray-500/70 py-1 items-center justify-between">
          <h4 className="sm:font-semibold text-sm dark:opacity-90">
            Comments {comments && comments.length}
          </h4>
          <div className="flex items-center h-full">
            <button
              onClick={sortComments}
              className="hover:bg-gray-500/30 hover:border-gray-500/60 transition border border-transparent p-0.5 rounded-full"
            >
              {sort === "desc" && <SortAscIcon className="w-4 h-4" />}
              {sort === "asc" && <SortDescIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {fetching && (
          <div className="pt-6 justify-center items-center flex">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        {comments && !comments.length && <p>No comments yet</p>}
        {comments &&
          comments.map((comment) => (
            <div
              key={comment.id}
              className="last:border-none border-b pt-2 pb-1"
            >
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
                <div className="space-y-1 mt-2">
                  <TextComment text={comment.text!} />
                  <CommentDate comment={comment} />
                </div>
              )}
              {comment.commentType === "image" && <div className="">Image</div>}
              {comment.commentType === "audio" && (
                <div className="mt-2 space-y-1">
                  <VoiceComment src={comment.fileUrl!} />
                  <CommentDate comment={comment} />
                </div>
              )}
            </div>
          ))}
      </div>
    </>
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
