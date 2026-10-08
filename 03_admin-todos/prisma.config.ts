import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Falta la variable DATABASE_URL");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    //url: databaseUrl,
    url: env("DATABASE_URL"),
  }
});
