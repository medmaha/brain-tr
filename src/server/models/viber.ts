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

export const viber = pgTable("viber", {
  id: serial("id").primaryKey(),
  genres: text("genres").notNull(),
  userId: integer("user_id").notNull(),
  youtube: varchar("youtube", { length: 256 }),
  facebook: varchar("facebook", { length: 256 }),
  instagram: varchar("instagram", { length: 256 }),
  category: varchar("category", { enum: ["artists"] }).notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const viberRelations = relations(viber, ({ one }) => ({
  user: one(users, {
    fields: [viber.userId],
    references: [users.id],
  }),
}));

export type ViberInterafce = typeof viber.$inferSelect;
