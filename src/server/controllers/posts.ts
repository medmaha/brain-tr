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

export async function getPostDetail(slug: string) {
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
      comments: {
        columns: {
          authorId: false,
          createdAt: false,
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
          replies: {
            columns: {
              authorId: false,
              // repliesCount: false,
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

            orderBy(reply, { asc }) {
              return [asc(reply.updatedAt)];
            },
          },
        },
      },
    },
  });
  return posts;
}

export async function getPostForUser(username: string) {
  const user = await DB.query.users.findFirst({
    where: sql`username=${username}`,
  });
  const posts = await DB.query.posts.findMany({
    where: sql`author_id=${user?.id}`,
    columns: {
      slug: true,
      thumbnailUrl: true,
      fileUrl: true,
    },
  });
  return posts;
}

export type PostFeedsInterface = Awaited<ReturnType<typeof getPostFeeds>>[0];
export type PostDetailInterface = Awaited<ReturnType<typeof getPostDetail>>;
