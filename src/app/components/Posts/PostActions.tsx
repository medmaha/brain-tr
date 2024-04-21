"use client";
import { PostFeedsInterface } from "@/server/controllers/posts";
import { Heart, LucideBookmark, MessageCircle, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  post: PostFeedsInterface;
};

// Post Card for individual posts
export default function PostActions({ post }: Props) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-3">
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
