import { getAuthenticatedUser } from "@/lib/auth";
import PostsWrapper from "./posts/components";
import { getPostFeeds } from "@/server/controllers/posts";

export default async function Page(props: PageProps) {
  const user = getAuthenticatedUser();

  const searchParams = props.searchParams;

  const posts = await getPostFeeds();

  return (
    <>
      <div className="">
        <PostsWrapper posts={posts} />
      </div>
    </>
  );
}
