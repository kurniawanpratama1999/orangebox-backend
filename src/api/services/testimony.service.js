import { prisma } from "#orm/lib/prisma.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

export const TestimonyService = {
  async index() {
    return await prisma.facilities.findMany();
  },

  async show(id) {
    if (!id) {
      throw new AppError("TestimonyIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const testimony_id = Number(id);

    if (Number.isNaN(testimony_id)) {
      throw new AppError("InvalidTestimonyId", HTTP_FAILED.BAD_REQUEST);
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
      return prisma.facilities.create({
        data: {
          name,
          photo,
          description,
        },
      });
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

      const testimonyById = await prisma.facilities.update({
        data: {
          name,
          photo,
          description,
        },
        where: { id: testimony_id },
      });

      if (!testimonyById) {
        throw new AppError("TestimonyNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      return testimonyById;
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

      return await prisma.facilities.delete({ where: { id: testimony_id } });
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
