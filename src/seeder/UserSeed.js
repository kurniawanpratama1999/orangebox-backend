import { prisma } from "#orm/lib/prisma.js";
import { Hash } from "#utils/Hash.js";

const UserSeed = async () => {
  const user = await prisma.users.create({
    data: {
      name: "operator",
      password: await Hash.make("operator#123"),
      username: "operator",
    },
  });

  console.log("Create User:", user);

  const allUser = await prisma.users.findMany();

  console.log("All User:", allUser);
};

UserSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  });
