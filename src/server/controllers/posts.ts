import { sql } from "drizzle-orm";
import DB from "../db/connection";

export async function getPostFeeds(limit = 10, page = 1, sort = "desc") {
  const posts = await DB.query.posts.findMany({
    limit,
    offset: (page - 1) * limit,
    columns: {
      id: false,
      updatedAt: false,
    },
    with: {
      author: {
        columns: {
          name: true,
          username: true,
          avatar: true,
          slug: true,
        },
      },
    },
  });
  return posts.reverse();
}

export async function getPostDetail(slug: string, page: any) {
  const posts = await DB.query.posts.findFirst({
    where: sql`slug=${slug}`,
    columns: {
      id: false,
    },
    with: {
      author: {
        columns: {
          name: true,
          username: true,
          avatar: true,
          slug: true,
        },
      },
    },
  });
  return posts;
}

export type PostFeedsInterface = Awaited<ReturnType<typeof getPostFeeds>>[0];
export type PostDetailInterface = Awaited<ReturnType<typeof getPostDetail>>;
