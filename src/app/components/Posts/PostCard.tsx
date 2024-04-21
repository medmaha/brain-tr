import { format } from "date-fns";

import PostImage from "./PostImage";
import PostCaption from "./PostCaption";
import PostActions from "./PostActions";
import Image from "next/image";
import PostVideo from "./PostVideo";
import { PostFeedsInterface } from "@/server/controllers/posts";
import { User2 } from "lucide-react";

type Props = {
  post: PostFeedsInterface;
};

// Post Card for individual posts
export default function Post({ post }: Props) {
  return (
    <div className="grid lg:mb-4 grid-cols-1 shadow-md rounded-b rounded-md overflow-hidden card max-w-[550px]">
      <div className="grid items-center gap-2 justify-center">
        {post.fileType === "image" && <PostImage post={post} />}
        {post.fileType === "video" && <PostVideo post={post} />}
        {post.fileType === "other" && <p>Unknown file type!</p>}
      </div>
      <div className="space-y-4 p-2">
        <PostCaption post={post} />

        <div className="flex items-center justify-between gap-3">
          <PostActions post={post} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <PostAuthor post={post} />
          <p className="text-sm opacity-70">
            <small>
              <time>{format(post.createdAt, "MMM d 'at' h:mm a")}</time>
              {/* <time>
                {formatDistance(new Date(post.created_at), new Date(), {
                  addSuffix: true,
                })}
              </time> */}
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

type Props2 = {
  post: PostFeedsInterface;
};

function PostAuthor({ post }: Props2) {
  return (
    <div className="flex gap-2">
      <div className="w-11 h-11 border border-gray-400 rounded-full overflow-hidden">
        {post.author?.avatar && (
          <Image
            width={44} // Set width and height to maintain aspect ratio
            height={44}
            src={post.author.avatar}
            alt="avatar"
            className="w-full h-full rounded-full post-author-img"
          />
        )}
        {!post.author?.avatar && (
          <div className="h-full w-full dark:bg-black/30 flex items-center justify-center">
            <User2 width={28} height={28} />
          </div>
        )}
      </div>
      <div className="flex items-center_">
        <div className="">
          <p className="">Mahammed Touray</p>
          <p className="leading-none text-sm opacity-60">@mahammedtouray</p>
        </div>
      </div>
    </div>
  );
}
