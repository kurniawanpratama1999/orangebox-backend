import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const key = "facility:all";
export const FacilityService = {
  async index() {
    if (useCache.has(key)) {
      console.log("from cache");
      return useCache.get(key);
    }

    const facilities = await prisma.facilities.findMany();
    useCache.set(key, facilities);

    return facilities;
  },

  async show(id) {
    if (!id) {
      throw new AppError("FacilityIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const facility_id = Number(id);

    if (Number.isNaN(facility_id)) {
      throw new AppError("InvalidFacilityId", HTTP_FAILED.BAD_REQUEST);
    }

    const facilities = useCache.get(key) ?? [];

    if (facilities) {
      const facility = facilities.find((f) => f.id === facility_id);

      if (facility) {
        console.log("from cache");
        return facility;
      }
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
      const newData = await prisma.facilities.create({
        data: {
          name,
          photo,
        },
      });

      const facilities = useCache.get(key) ?? [];
      useCache.set(key, [...facilities, newData]);

      return newData;
    } catch (error) {
      throw HandlePrismaError(error, {
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

      const updated = await prisma.facilities.update({
        data: {
          name,
          photo,
        },
        where: { id: facility_id },
      });

      if (!updated) {
        throw new AppError("FacilityNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const facilities = useCache.get(key) ?? [];

      useCache.set(
        key,
        facilities.map((facility) =>
          facility.id === updated.id ? updated : facility,
        ),
      );

      return updated;
    } catch (error) {
      throw HandlePrismaError(error, {
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

      const deleted = await prisma.facilities.delete({
        where: { id: facility_id },
      });

      const facilities = useCache.get(key) ?? [];
      useCache.set(
        key,
        facilities.filter((facility) => facility.id !== facility_id),
      );

      return deleted;
    } catch (error) {
      throw HandlePrismaError(error, {
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
