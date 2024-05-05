import { generateUniqueSlug } from "@/lib/utils";
import { users } from "./users";
import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  serial,
  text,
  varchar,
  timestamp,
  PgTable,
} from "drizzle-orm/pg-core";
import { comments } from "./comments";
import { likes } from "./likes";

// prettier-ignore
export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    authorId: integer("author_id"),
    caption: text("caption").notNull(),
    fileUrl: varchar("file_url", { length: 256 }).notNull(),
    mediaName: varchar("media_name", { length: 100 }),
    thumbnailUrl: varchar("thumbnail", { length: 256 }),
    hashtags: varchar("hashtags", { length: 256 }),
    likesCount: integer("likes_count").default(0),
    commentsCount: integer("comments_count").default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    fileType: varchar("file_type", {length:25, enum: ["image", "video", "audio", "other" , "avatar", "comment"] }).notNull(),
    slug: varchar("slug", { length: 100 }).unique().$defaultFn(generateUniqueSlug),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: "post_author",
  }),
  likes: many(likes, {
    relationName: "post_likes",
  }),
  comments: many(comments, {
    relationName: "post_comments",
  }),
}));

export type PostInterface = typeof posts.$inferSelect;
