import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import schema from "../models";
import performMigrations from "./migration";

const connectionString = process.env.DATABASE_URL!;

const dbClient = postgres(connectionString, { prepare: false });
const DB = drizzle(dbClient, { schema });

const migrate = async () => {
  await performMigrations();
  return { DB, dbClient };
};
// migrate();

export default DB;
