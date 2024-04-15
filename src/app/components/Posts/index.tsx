import React from "react";
import Post from "./PostCard";

export default function PostsWrapper() {
  return (
    <div className="w-full grid gap-4 items-center justify-center">
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            post={{ ...post, slug: "I am | / slug " + post.id }}
          />
        );
      })}
    </div>
  );
}

const posts = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
