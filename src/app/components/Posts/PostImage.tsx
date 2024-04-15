"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import slugify from "slugify";

export default function PostImage({ post }: any) {
  const router = useRouter();

  function navigate() {
    const url = `/posts/${slugify(post.slug, {
      lower: true,
      strict: true,
    })}`;
    console.log(url);
    router.push(url);
  }

  return (
    <div className="block mx-auto" onClick={navigate}>
      <Image
        width={600}
        height={400}
        src={`/test${post.id}.png`}
        alt="Post Image"
      />
    </div>
  );
}
