"use client";
import { useMemo, useState } from "react";

// Post Card for individual posts
export default function PostCaption() {
  //
  const [full, setFull] = useState(false);
  const canToggle = useMemo(() => caption.length >= 200, []);

  function toggleCaption() {
    if (!canToggle) return;
    setFull((p) => !p);
  }

  return (
    <div className="text-sm px-1">
      <p className={`${full ? "" : "line-clamp-2"}`}>{caption}</p>
      {canToggle && (
        <button onClick={toggleCaption} className="text-sky-600">
          view {full ? "less ..." : "more?"}
        </button>
      )}
    </div>
  );
}

const caption = `This is a sample caption for the post. It can be long or short,
describing the content of the post. This is a sample caption for the
post. It can be long or short, describing the content of the post.
This is a sample caption for the post
describing the content of the post. This is a sample caption for the
post. It can be long or short, describing the content of the post.
This is a sample caption for the post
describing the content of the post. This is a sample caption for the
post. It can be long or short, describing the content of the post.
This is a sample caption for the post
`;
