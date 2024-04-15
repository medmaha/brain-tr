import PostImage from "./PostImage";
import PostCaption from "./PostCaption";
import PostActions from "./PostActions";
import Image from "next/image";

// Post Card for individual posts
export default function Post({ post }: any) {
  return (
    <div className="grid grid-cols-1 gap-2 shadow-md p-2 rounded-b-2xl bg-white max-w-[600px]">
      <div className="grid items-center gap-2 justify-center">
        <PostImage post={post} />
        <PostCaption />
      </div>
      <div className="flex items-center justify-between gap-3 p-2">
        <PostActions />
      </div>
      <PostAuthor post={post} />
    </div>
  );
}

function PostAuthor({ post }: any) {
  return (
    <div className="px-2 flex gap-2">
      <div className="w-[50px] h-[50px] border rounded-full bg-red-200">
        <Image
          width={100}
          height={100}
          src={`/test${post.id}.png`}
          alt="avatar"
          className="rounded-full border post-author-img"
        />
      </div>
      <div className="">
        <p className="">Mahammed Touray</p>
        <p className="text-sm opacity-60">@mahammedtouray</p>
      </div>
    </div>
  );
}
