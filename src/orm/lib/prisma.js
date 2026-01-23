import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "#orm/generated/prisma/client.ts";
import { env } from "#config/env.js";

const db = env.database;
const adapter = new PrismaMariaDb({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.name,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
