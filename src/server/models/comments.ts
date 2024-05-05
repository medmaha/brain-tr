import { users } from "./users";
import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  integer,
  serial,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { likes } from "./likes";

const fields = {
  id: serial("id").primaryKey(),
  text: text("caption"),
  authorId: integer("author_id").notNull(),
  postSlug: varchar("post_slug").notNull(),
  fileUrl: varchar("file_url", { length: 256 }),
  hashtags: varchar("hashtags", { length: 256 }),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
  commentType: varchar("file_type", {
    length: 20,
    enum: ["image", "audio", "text"],
  }),
};

// prettier-ignore
export const comments = pgTable("comments", {
  ...fields,
  repliesCount: integer("replies_count").default(0),
});
export const replies = pgTable("replies", {
  ...fields,
  parentId: integer("comment_id"),
});

export const repliesRelations = relations(replies, ({ one, many }) => ({
  author: one(users, {
    fields: [replies.authorId],
    references: [users.id],
  }),
  likes: many(likes, {
    relationName: "reply_likes",
  }),
  parent: one(comments, {
    fields: [replies.parentId],
    references: [comments.id],
    relationName: "comment_replies",
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postSlug],
    references: [posts.slug],
    relationName: "post_comments",
  }),
  likes: many(likes, {
    relationName: "comment_likes",
  }),
  replies: many(replies, {
    relationName: "comment_replies",
  }),
}));

export type ReplyInterface = typeof replies.$inferSelect;
export type CommentInterface = typeof comments.$inferSelect;
