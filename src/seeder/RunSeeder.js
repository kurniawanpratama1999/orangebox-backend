import { prisma } from "#orm/lib/prisma.js";
import { UserSeed } from "./UserSeed.js";

// Run with npm run seeder

UserSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  });
