import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./drizzle",
  schema: "./src/server/models/*",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
