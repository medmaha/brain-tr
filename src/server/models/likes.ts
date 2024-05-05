import {
  pgTable,
  integer,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull(),
  objectID: integer("object_id").notNull(),
  objectType: varchar("object_type", {
    length: 10,
    enum: ["posts", "comments"],
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type LikeInterface = typeof likes.$inferSelect;
