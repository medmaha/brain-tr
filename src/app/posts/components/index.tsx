import React from "react";
import Post from "./PostCard";
import { PostFeedsInterface } from "@/server/controllers/posts";
import { getAuthenticatedUser } from "@/lib/auth";

type Props = {
  posts: Array<PostFeedsInterface>;
};

export default function PostsWrapper({ posts }: Props) {
  const user = getAuthenticatedUser() || undefined;
  return (
    <div className="w-full grid gap-4 items-center justify-center">
      {posts.map((post) => {
        return <Post key={post.slug} post={post} user={user} />;
      })}
    </div>
  );
}
