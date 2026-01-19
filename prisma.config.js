import { defineConfig } from "prisma/config";
import { env } from "#config/env.js";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DB_URL,
  },
});
