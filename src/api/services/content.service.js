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

  async update(reqBody) {
    try {
      const findFirst = await prisma.content.findFirst();

      const firstId = findFirst.id;

      const updated = await prisma.content.update({
        data: reqBody,
        where: { id: firstId },
      });

      if (!updated) {
        throw new AppError("content not found", HTTP_FAILED.BAD_REQUEST);
      }

      useCache.set(key, updated);
      return updated;
    } catch (e) {
      throw HandlePrismaError(e, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "content already exist",
        },
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "content not found",
        },
      });
    }
  },
};
