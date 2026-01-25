import { prisma } from "#orm/lib/prisma.js";
import { Hash } from "#utils/Hash.js";

const UserSeed = async () => {
  const user = await prisma.users.create({
    data: {
      name: "admin toko",
      password: await Hash.make("admin#123"),
      username: "admintoko",
    },
  });

  console.log("Create User:", user);

  const allUser = await prisma.users.findMany();

  console.log("All User:", allUser);
};

export default UserSeed;
