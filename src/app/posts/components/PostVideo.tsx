"use client";
import VideoPlayer from "@/app/components/Globals/VideoPlayer";
import { PostFeedsInterface } from "@/server/controllers/posts";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  width?: number;
  autoPlay?: boolean;
  post: PostFeedsInterface;
  detailPage?: boolean;
};

export default function PostVideo({ post, ...props }: Props) {
  const router = useRouter();
  const [play, setPlay] = useState(props.autoPlay || false);

  function navigate() {
    router.push(`/posts/${post.slug}`);
  }

  return (
    <div
      className="block mx-auto relative cursor-pointer w-full h-full"
      onClick={() => {
        if (!props.detailPage) return navigate();
      }}
    >
      {!play && post.thumbnailUrl && (
        <div className="group absolute top-0 left-0 transition w-full h-full cursor-pointer z-[1] hover:bg-black/20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-6 bg-black/30 rounded-2xl group-btn">
              <Play
                className="group-hover:pointer-events-auto group-hover:scale-150 transition pointer-events-none text-white"
                width={38}
              />
            </div>
          </div>
        </div>
      )}

      {props.detailPage && (
        <VideoPlayer
          poster={post.thumbnailUrl!}
          src={post.fileUrl!}
          autoPlay={props.autoPlay}
        />
      )}

      {!props.detailPage && (
        <video
          width={props.width || 600}
          controls={false}
          className="rounded-b-none"
          poster={post.thumbnailUrl!}
        />
      )}
    </div>
  );
}
