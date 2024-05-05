"use client";
import { UserDetailsInterface } from "@/server/controllers/users";
import { Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { getPosts } from "../actions";

type Props = {
  profile: UserDetailsInterface;
};

const postsCached = new Map();

type Post = {
  slug: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
};

export default function Posts(props: Props) {
  const [posts, setPosts] = React.useState<Post[]>([]);

  const fetchPosts = useCallback(
    async (cached = true) => {
      const cachedId = props.profile!.username + "_posts";
      if (postsCached.has(cachedId) && cached) {
        setPosts(postsCached.get(cachedId)!);
        return;
      }
      const _posts = await getPosts(props.profile!.username);
      postsCached.set(cachedId, _posts);
      setPosts(_posts);
    },
    [props.profile]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="grid my-8 gap-4 sm:grid-cols-3 md:grid-cols-4 max-w-[850px] mx-auto">
      {posts.map((post, index) => (
        <div
          className="card p-2.5_ relative shadow rounded-md border overflow-hidden grid gap-4"
          key={index}
        >
          <Image
            width={350}
            height={200}
            src={post.thumbnailUrl || post.fileUrl}
            alt="Post Image"
            objectFit="cover"
            className="w-full h-full rounded post-author-img"
          />

          <Link
            className="absolute flex items-center transition-all justify-center bg-black/25 hover:opacity-100 opacity-0 inset-0"
            href={`/posts/${post.slug}`}
          >
            <span className="p-2 inline-flex items-center justify-center gap-1 bg-black/10">
              <span className="font-semibold text-xl">View</span>
              <Navigation width={32} height={32} />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}

const posts = new Array(10).fill({
  author: "Jane Doe",
  slug: "post-1",
  file_url: "https://picsum.photos/200/300",
});
