import { prisma } from "#orm/lib/prisma.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

export const ContentService = {
  async index() {
    return await prisma.content.findFirst();
  },

  async update(data) {
    try {
      const findFirst = await prisma.content.findFirst();

      const firstId = findFirst.id;

      const contentById = await prisma.content.update({
        data,
        where: { id: firstId },
      });

      if (!contentById) {
        throw new AppError("ContentNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      return contentById;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "ContentAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "ContentIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },
};
