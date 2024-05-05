"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PostFeedsInterface } from "@/server/controllers/posts";

type Props = {
  post: PostFeedsInterface;
  width?: number;
  height?: number;
};

export default function PostImage({ post, ...props }: Props) {
  const router = useRouter();

  function navigate() {
    const url = `/posts/${post.slug}`;
    router.push(url);
  }

  return (
    <div className="block mx-auto cursor-pointer" onClick={navigate}>
      <Image
        className=""
        width={props.width || 600}
        height={props.height || 400}
        src={`${post.fileUrl || "/placeholder-img.jpeg"}`}
        alt="Post Image"
      />
    </div>
  );
}
