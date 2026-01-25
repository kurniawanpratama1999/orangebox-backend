import { prisma } from "#orm/lib/prisma.js";

const ProductSeed = async () => {
  const product = await prisma.products.createMany({
    data: [
      {
        name: "",
        category_id: "",
        description: "",
        price: "",
        photo: "",
        is_favorite: "",
        is_new: "",
      },
    ],
  });

  const allProduct = await prisma.products.findMany();

  console.log("All Product:", allProduct);
};

export default ProductSeed;
