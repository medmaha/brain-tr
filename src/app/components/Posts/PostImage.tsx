"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PostFeedsInterface } from "@/server/controllers/posts";

type Props = {
  post: PostFeedsInterface;
};

export default function PostImage({ post }: Props) {
  const router = useRouter();

  function navigate() {
    const url = `/posts/${post.slug}`;
    router.push(url);
  }

  return (
    <div className="block mx-auto" onClick={navigate}>
      <Image
        className="max-h-[90svh] md:max-h-auto"
        width={600}
        height={500}
        src={`${post.fileUrl || "/placeholder-img.jpeg"}`}
        alt="Post Image"
      />
    </div>
  );
}
