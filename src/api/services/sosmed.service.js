import { prisma } from "#orm/lib/prisma.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

export const SosmedService = {
  async index() {
    return await prisma.sosmeds.findMany();
  },

  async show(id) {
    if (!id) {
      throw new AppError("SosmedIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const sosmed_id = Number(id);

    if (Number.isNaN(sosmed_id)) {
      throw new AppError("InvalidSosmedId", HTTP_FAILED.BAD_REQUEST);
    }

    const sosmedById = await prisma.sosmeds.findUnique({
      where: { id: sosmed_id },
    });

    if (!sosmedById) {
      throw new AppError("SosmedNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return sosmedById;
  },

  async create({ name, description, link }) {
    try {
      return prisma.sosmeds.create({
        data: {
          name,
          description,
          link,
        },
      });
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "SosmedAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },

  async update(id, { name, description, link }) {
    try {
      if (!id) {
        throw new AppError("SosmedIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const sosmed_id = Number(id);

      if (Number.isNaN(sosmed_id)) {
        throw new AppError("InvalidSosmedId", HTTP_FAILED.BAD_REQUEST);
      }

      const updateSosmedById = await prisma.sosmeds.update({
        data: {
          name,
          description,
          link,
        },
        where: { id: sosmed_id },
      });

      if (!updateSosmedById) {
        throw new AppError("SosmedNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      return updateSosmedById;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "SosmedAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "SosmedIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("SosmedIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const sosmed_id = Number(id);

      if (Number.isNaN(sosmed_id)) {
        throw new AppError("InvalidSosmedId", HTTP_FAILED.BAD_REQUEST);
      }

      return await prisma.sosmeds.delete({ where: { id: sosmed_id } });
    } catch (error) {
      throw HandlePrismaError(error, {
        P2025: {
          code: "SosmedIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
        P2003: {
          code: "SosmedInUse",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },
};
