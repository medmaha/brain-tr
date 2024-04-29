import { sql } from "drizzle-orm";
import DB from "../db/connection";

export async function getPostComments(slug: string, limit = 15, page = 1) {
  const data = await DB.query.comments.findMany({
    limit,
    where: sql`post_slug=${slug}`,
    offset: (page - 1) * limit,
    columns: {
      authorId: false,
      createdAt: false,
    },
    with: {
      author: {
        columns: {
          name: true,
          avatar: true,
          username: true,
        },
      },
    },
  });

  return data;
}

export type CommentListInterface = Awaited<
  Promise<ReturnType<typeof getPostComments>>
>;
