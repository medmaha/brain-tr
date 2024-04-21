import React from "react";
import Post from "./PostCard";
import { PostFeedsInterface } from "@/server/controllers/posts";

type Props = {
  posts: Array<PostFeedsInterface>;
};

export default function PostsWrapper({ posts }: Props) {
  return (
    <div className="w-full grid gap-4 items-center justify-center">
      {posts.map((post) => {
        return <Post key={post.slug} post={post} />;
      })}
    </div>
  );
}
