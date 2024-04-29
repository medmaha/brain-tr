import { pgTable, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const followers = pgTable("followers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // The user that is being followed
  followerId: integer("follower_id").notNull(), // The user that is following
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const followerRelations = relations(followers, ({ one }) => ({
  account: one(users, {
    fields: [followers.userId],
    references: [users.id],
  }),
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.id],
  }),
}));
