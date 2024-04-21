import { migrate } from "drizzle-orm/postgres-js/migrator";
import DB from "./connection";

export default async function performMigrations(folder = "./drizzle") {
  await migrate(DB, { migrationsFolder: folder });
}
