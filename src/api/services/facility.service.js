import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandleImage } from "#utils/HandleImage.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const key = "facility:all";

const configHandleImage = {
  folderName: "facility",
  prefixName: "facilityImage",
  qualityPercentage: 60,
  sizePixel: "auto",
  targetKb: "none",
};

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
      throw new AppError("facility id not found", HTTP_FAILED.BAD_REQUEST);
    }

    const facility_id = Number(id);

    if (Number.isNaN(facility_id)) {
      throw new AppError("invalid facility id", HTTP_FAILED.BAD_REQUEST);
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
      throw new AppError("facility not found", HTTP_FAILED.NOT_FOUND);
    }

    return facilityById;
  },

  async create(reqBody, reqFile) {
    let created;
    try {
      const handleImage = new HandleImage(configHandleImage);

      await handleImage.convert(reqFile.buffer);

      const data = { ...reqBody, photo: handleImage.fileName };

      created = await prisma.facilities.create({
        data,
      });

      await handleImage.save();

      const facilities = useCache.get(key) ?? [];
      useCache.set(key, [...facilities, created]);

      return created;
    } catch (e) {
      if (created?.id) {
        await prisma.facilities.delete({ where: { id: created.id } });
      }
      throw HandlePrismaError(e, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "facility already exist",
        },
      });
    }
  },

  async update(id, reqBody, reqFile) {
    try {
      if (!id) {
        throw new AppError("facility id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const facility_id = Number(id);

      if (Number.isNaN(facility_id)) {
        throw new AppError("invalid facility id", HTTP_FAILED.BAD_REQUEST);
      }

      let data = reqBody;

      const handleImage = new HandleImage(configHandleImage);

      if (reqFile) {
        await handleImage.convert(reqFile.buffer);

        data = { ...reqBody, photo: handleImage.fileName };
      }

      const result = await prisma.$transaction(async (trx) => {
        const facility = await trx.facilities.findUnique({
          where: { id: facility_id },
        });

        if (!facility) {
          throw new AppError("facility not found", HTTP_FAILED.NOT_FOUND);
        }

        const updated = await trx.facilities.update({
          where: { id: facility_id },
          data,
        });

        return { facility, updated };
      });

      if (reqFile) {
        await handleImage.save();
        if (result.facility?.photo) {
          await HandleImage.delete(result.facility.photo);
        }
      }

      const facilities = useCache.get(key) ?? [];

      useCache.set(
        key,
        facilities.map((facility) =>
          facility.id === updated.id ? updated : facility,
        ),
      );

      return updated;
    } catch (e) {
      throw HandlePrismaError(e, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "facility already exist",
        },
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "facility id not found",
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("facility id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const facility_id = Number(id);

      if (Number.isNaN(facility_id)) {
        throw new AppError("invalid facility id", HTTP_FAILED.BAD_REQUEST);
      }

      const deleted = await prisma.facilities.delete({
        where: { id: facility_id },
      });

      if (deleted.photo) {
        await HandleImage.delete(deleted.photo);
      }

      const facilities = useCache.get(key) ?? [];
      useCache.set(
        key,
        facilities.filter((facility) => facility.id !== facility_id),
      );

      return deleted;
    } catch (e) {
      throw HandlePrismaError(e, {
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "facility id not found",
        },
        P2003: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "facility still use on other table",
        },
      });
    }
  },
};
