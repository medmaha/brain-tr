"use client";
import { Heart, LucideBookmark, MessageCircle, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

// Post Card for individual posts
export default function PostActions({ post }: any) {
  const router = useRouter();

  const iconSize = useMemo(() => 25, []);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <button className="">
          <Heart className="text-red-300" />
        </button>
        <button className="action-btn">
          <MessageCircle className="text-sky-300" />
        </button>
        <button className="action-btn">
          <LucideBookmark className="text-green-300" />
        </button>
      </div>
      <button className="action-btn">
        <Share2 />
      </button>
    </>
  );
}
