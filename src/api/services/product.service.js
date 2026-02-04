import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandleImage } from "#utils/HandleImage.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const key = "product:all";

const configHandleImage = {
  folderName: "product",
  prefixName: "productImage",
  qualityPercentage: 100,
  sizePixel: {
    width: 500,
    height: 500,
  },
  targetKb: 2000,
};

export const ProductService = {
  async index() {
    if (useCache.has(key)) {
      console.log("from cache");
      return useCache.get(key);
    }

    const products = await prisma.products.findMany();
    useCache.set(key, products);

    return products;
  },

  async show(id) {
    if (!id) {
      throw new AppError("product id not found", HTTP_FAILED.BAD_REQUEST);
    }

    const product_id = Number(id);

    if (Number.isNaN(product_id)) {
      throw new AppError("invalid product id", HTTP_FAILED.BAD_REQUEST);
    }

    const products = useCache.get(key) ?? [];

    if (products) {
      const productById = products.find((t) => t.id === product_id);

      if (productById) {
        console.log("from cache");
        return productById;
      }
    }

    const productById = await prisma.products.findUnique({
      where: { id: product_id },
    });

    if (!productById) {
      throw new AppError("product not found", HTTP_FAILED.NOT_FOUND);
    }

    return productById;
  },

  async create(reqBody, reqFile) {
    let created;
    try {
      const handleImage = new HandleImage(configHandleImage);

      await handleImage.convert(reqFile.buffer);

      const data = { ...reqBody, photo: handleImage.fileName };

      created = await prisma.products.create({
        data,
      });

      await handleImage.save();

      const products = useCache.get(key) ?? [];
      useCache.set(key, [...products, created]);
      return created;
    } catch (error) {
      if (created?.id) {
        await prisma.products.delete({ where: { id: created.id } });
      }
      throw HandlePrismaError(error, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "product already exist",
        },
      });
    }
  },

  async update(id, reqBody, reqFile) {
    try {
      if (!id) {
        throw new AppError("product id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const product_id = Number(id);

      if (Number.isNaN(product_id)) {
        throw new AppError("invalid product id", HTTP_FAILED.BAD_REQUEST);
      }

      let data = reqBody;

      const handleImage = new HandleImage(configHandleImage);

      if (reqFile) {
        await handleImage.convert(reqFile.buffer);

        data = { ...reqBody, photo: handleImage.fileName };
      }

      const result = await prisma.$transaction(async (trx) => {
        const product = await trx.products.findUnique({
          where: { id: product_id },
        });

        if (!product) {
          throw new AppError("product not found", HTTP_FAILED.NOT_FOUND);
        }

        const updated = await trx.products.update({
          where: { id: product_id },
          data,
        });

        return { product, updated };
      });

      if (reqFile) {
        await handleImage.save();
        if (result.product?.photo) {
          await HandleImage.delete(result.product.photo);
        }
      }

      const products = useCache.get(key);

      useCache.set(
        key,
        products.map((t) => (t.id === product_id ? updated : t)),
      );

      return updated;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          message: "product already exist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          message: "product id not found",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("product id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const product_id = Number(id);

      if (Number.isNaN(product_id)) {
        throw new AppError("invalid product id", HTTP_FAILED.BAD_REQUEST);
      }

      const deleted = await prisma.products.delete({
        where: { id: product_id },
      });

      if (deleted.photo) {
        await HandleImage.delete(deleted.photo);
      }

      return deleted;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2003: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "product still use on other table",
        },
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "product not found",
        },
      });
    }
  },
};
