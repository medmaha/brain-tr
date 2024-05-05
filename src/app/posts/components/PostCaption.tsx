"use client";
import { useMemo, useState } from "react";
import { PostFeedsInterface } from "@/server/controllers/posts";

type Props = {
  caption: string;
  mediaName?: string | null;
};

// Post Card for individual posts
export default function PostCaption({ caption, mediaName }: Props) {
  //
  const [full, setFull] = useState(false);
  const canToggle = useMemo(() => caption.length >= 200, [caption]);

  function toggleCaption() {
    if (!canToggle) return;
    setFull((p) => !p);
  }

  return (
    <div className="text-sm">
      {mediaName && (
        <p className="pb-1">
          <span className="font-semibold">{mediaName}</span>
        </p>
      )}
      <p
        className={`${full ? "" : "line-clamp-2"} ${
          mediaName ? "text-xs" : ""
        }`}
      >
        {caption}
      </p>
      {canToggle && (
        <button onClick={toggleCaption} className="text-sky-600">
          view {full ? "less ..." : "more?"}
        </button>
      )}
    </div>
  );
}
