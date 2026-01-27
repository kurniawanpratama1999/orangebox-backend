import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const key = "content:all";
export const ContentService = {
  async index() {
    if (useCache.has(key)) {
      console.log("from cache");
      return useCache.get(key);
    }

    const content = await prisma.content.findFirst();
    useCache.set(key, content);

    return content;
  },

  async update(data) {
    try {
      const findFirst = await prisma.content.findFirst();

      const firstId = findFirst.id;

      const updated = await prisma.content.update({
        data,
        where: { id: firstId },
      });

      if (!updated) {
        throw new AppError("ContentNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      useCache.set(key, updated);
      return updated;
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
