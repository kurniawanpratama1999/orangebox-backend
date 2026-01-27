import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const key = "testimony:all";
export const TestimonyService = {
  async index() {
    if (useCache.has(key)) {
      console.log("from cache");
      return useCache.get(key);
    }

    const testimonies = await prisma.facilities.findMany();
    useCache.set(key, testimonies);

    return testimonies;
  },

  async show(id) {
    if (!id) {
      throw new AppError("TestimonyIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const testimony_id = Number(id);

    if (Number.isNaN(testimony_id)) {
      throw new AppError("InvalidTestimonyId", HTTP_FAILED.BAD_REQUEST);
    }

    const testimonies = useCache.get(key) ?? [];
    if (testimonies) {
      const testimonyById = testimonies.find((t) => t.id === testimony_id);

      if (testimonyById) {
        console.log("from cache");
        return testimonyById;
      }
    }

    const testimonyById = await prisma.facilities.findUnique({
      where: { id: testimony_id },
    });

    if (!testimonyById) {
      throw new AppError("TestimonyNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return testimonyById;
  },

  async create({ name, photo, description }) {
    try {
      const newData = await prisma.facilities.create({
        data: {
          name,
          photo,
          description,
        },
      });

      const testimonies = useCache.get(key) ?? [];
      useCache.set(key, [...testimonies, newData]);
      return newData;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "TestimonyAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },

  async update(id, { name, photo, description }) {
    try {
      if (!id) {
        throw new AppError("TestimonyIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const testimony_id = Number(id);

      if (Number.isNaN(testimony_id)) {
        throw new AppError("InvalidTestimonyId", HTTP_FAILED.BAD_REQUEST);
      }

      const updated = await prisma.facilities.update({
        data: {
          name,
          photo,
          description,
        },
        where: { id: testimony_id },
      });

      if (!updated) {
        throw new AppError("TestimonyNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const testimonies = useCache.get(key);

      useCache.set(
        key,
        testimonies.map((t) => (t.id === testimony_id ? updated : t)),
      );

      return updated;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "TestimonyAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "TestimonyIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("TestimonyIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const testimony_id = Number(id);

      if (Number.isNaN(testimony_id)) {
        throw new AppError("InvalidTestimonyId", HTTP_FAILED.BAD_REQUEST);
      }

      const deleted = await prisma.facilities.delete({
        where: { id: testimony_id },
      });

      const testimonies = useCache.get(key);

      useCache.set(
        key,
        testimonies.filter((t) => t.id !== testimonies),
      );

      return deleted;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2025: {
          code: "TestimonyIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
        P2003: {
          code: "TestimonyInUse",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },
};
