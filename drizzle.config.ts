import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./drizzle",
  schema: "./src/server/schema/*",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
