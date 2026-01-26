import { prisma } from "#orm/lib/prisma.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

export const FacilityService = {
  async index() {
    return await prisma.facilities.findMany();
  },

  async show(id) {
    if (!id) {
      throw new AppError("FacilityIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const facility_id = Number(id);

    if (Number.isNaN(facility_id)) {
      throw new AppError("InvalidFacilityId", HTTP_FAILED.BAD_REQUEST);
    }

    const facilityById = await prisma.facilities.findUnique({
      where: { id: facility_id },
    });

    if (!facilityById) {
      throw new AppError("FacilityNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return facilityById;
  },

  async create({ name, photo }) {
    try {
      return prisma.facilities.create({
        data: {
          name,
          photo,
        },
      });
    } catch (error) {
      throw HandlePrismaError({
        P2002: {
          code: "FacilityAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },

  async update(id, { name, photo }) {
    try {
      if (!id) {
        throw new AppError("FacilityIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const facility_id = Number(id);

      if (Number.isNaN(facility_id)) {
        throw new AppError("InvalidFacilityId", HTTP_FAILED.BAD_REQUEST);
      }

      const facilityById = await prisma.facilities.update({
        data: {
          name,
          photo,
        },
        where: { id: facility_id },
      });

      if (!facilityById) {
        throw new AppError("FacilityNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      return facilityById;
    } catch (error) {
      throw HandlePrismaError({
        P2002: {
          code: "FacilityAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "FacilityIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("FacilityIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const facility_id = Number(id);

      if (Number.isNaN(facility_id)) {
        throw new AppError("InvalidFacilityId", HTTP_FAILED.BAD_REQUEST);
      }

      return await prisma.facilities.delete({ where: { id: facility_id } });
    } catch (error) {
      throw HandlePrismaError({
        P2025: {
          code: "FacilityIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
        P2003: {
          code: "FacilityInUse",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },
};
