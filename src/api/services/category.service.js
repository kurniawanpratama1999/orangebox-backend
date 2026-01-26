import { prisma } from "#orm/lib/prisma.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

export const CategoryService = {
  async index() {
    return await prisma.categories.findMany();
  },

  async show(id) {
    if (!id) {
      throw new AppError("CategoryIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const category_id = Number(id);

    if (Number.isNaN(category_id)) {
      throw new AppError("InvalidCategoryId", HTTP_FAILED.BAD_REQUEST);
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
      return prisma.categories.create({
        data: {
          name,
          description,
        },
      });
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

      const updateCategoryById = await prisma.categories.update({
        data: {
          name,
          description,
        },
        where: { id: category_id },
      });

      if (!updateCategoryById) {
        throw new AppError("CategoryNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      return updateCategoryById;
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

      return await prisma.categories.delete({ where: { id: category_id } });
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
