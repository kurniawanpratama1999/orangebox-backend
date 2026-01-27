import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const key = "category:all";

export const CategoryService = {
  async index() {
    if (useCache.has(key)) {
      console.log("from cache");
      return useCache.get(key);
    }

    const categories = await prisma.categories.findMany();
    useCache.set(key, categories);

    console.log("from prisma");
    return categories;
  },

  async show(id) {
    if (!id) {
      throw new AppError("CategoryIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const category_id = Number(id);

    if (Number.isNaN(category_id)) {
      throw new AppError("InvalidCategoryId", HTTP_FAILED.BAD_REQUEST);
    }

    if (useCache.has(key)) {
      const categories = useCache.get(key);
      const categoryById = categories.find((c) => c.id == category_id);

      if (categoryById) {
        console.log("from cache");
        return categoryById;
      }
    }

    const categoryById = await prisma.categories.findUnique({
      where: { id: category_id },
    });

    if (!categoryById) {
      throw new AppError("CategoryNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return categoryById;
  },

  async create({ name, description }) {
    try {
      const newData = await prisma.categories.create({
        data: {
          name,
          description,
        },
      });

      const categories = useCache.get(key) ?? [];
      useCache.set(key, [...categories, newData]);

      return newData;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "CategoryAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },

  async update(id, { name, description }) {
    try {
      if (!id) {
        throw new AppError("CategoryIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const category_id = Number(id);

      if (Number.isNaN(category_id)) {
        throw new AppError("InvalidCategoryId", HTTP_FAILED.BAD_REQUEST);
      }

      const updated = await prisma.categories.update({
        data: {
          name,
          description,
        },
        where: { id: category_id },
      });

      if (!updated) {
        throw new AppError("CategoryNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const categories = useCache.get(key) ?? [];

      useCache.set(
        key,
        categories.map((c) => (c.id === category_id ? updated : c)),
      );

      return updated;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "CategoryAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "CategoryIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("CategoryIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const category_id = Number(id);

      if (Number.isNaN(category_id)) {
        throw new AppError("InvalidCategoryId", HTTP_FAILED.BAD_REQUEST);
      }

      if (category_id == 1) {
        throw new AppError("CannotDeleteOnlyUpdate", HTTP_FAILED.BAD_REQUEST);
      }

      const deleteRow = await prisma.categories.delete({
        where: { id: category_id },
      });

      const categories = useCache.get(key) ?? [];
      useCache.set(
        key,
        categories.filter((category) => category.id !== category_id),
      );

      return deleteRow;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2025: {
          code: "CategoryIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
        P2003: {
          code: "CategoryInUse",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },
};
