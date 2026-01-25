import { prisma } from "#orm/lib/prisma.js";

const CategorySeed = async () => {
  const categories = await prisma.categories.createMany({
    data: [
      { name: "Minuman", description: "" },
      { name: "Cemilan", description: "" },
      { name: "Makanan", description: "" },
    ],
  });

  console.log("Create categories:", categories.count);

  const allCategory = await prisma.categories.findMany();

  console.log("All Category:", allCategory);
};

export default CategorySeed;
