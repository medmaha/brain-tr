import { generateUniqueSlug } from "@/lib/utils";
import { sql } from "drizzle-orm";
import { pgTable, timestamp, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  phone: varchar("phone", { length: 256 }).unique().notNull(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull().default(""),
  avatar: varchar("avatar_url", { length: 256 }),
  biography: text("biography"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
  slug: varchar("slug", { length: 256 })
    .unique()
    .$defaultFn(generateUniqueSlug),
});

export type UserInterafce = typeof users.$inferSelect;
