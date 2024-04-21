"use client";
import { useMemo, useState } from "react";
import { PostFeedsInterface } from "@/server/controllers/posts";

type Props = {
  post: PostFeedsInterface;
};

// Post Card for individual posts
export default function PostCaption({ post }: Props) {
  //
  const [full, setFull] = useState(false);
  const canToggle = useMemo(() => post.caption.length >= 200, [post.caption]);

  function toggleCaption() {
    if (!canToggle) return;
    setFull((p) => !p);
  }

  return (
    <div className="text-sm">
      {post.mediaName && (
        <p className="pb-1">
          <span className="font-semibold">{post.mediaName}</span>
        </p>
      )}
      <p
        className={`${full ? "" : "line-clamp-2"} ${
          post.mediaName ? "text-xs" : ""
        }`}
      >
        {post.caption}
      </p>
      {canToggle && (
        <button onClick={toggleCaption} className="text-sky-600">
          view {full ? "less ..." : "more?"}
        </button>
      )}
    </div>
  );
}
