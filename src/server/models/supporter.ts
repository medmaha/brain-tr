import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  serial,
  text,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const supporter = pgTable("supporter", {
  id: serial("id").primaryKey(),
  genres: text("genres").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const supporterRelations = relations(supporter, ({ one }) => ({
  user: one(users, {
    fields: [supporter.userId],
    references: [users.id],
  }),
}));

export type SupporterInterface = typeof supporter.$inferSelect;
