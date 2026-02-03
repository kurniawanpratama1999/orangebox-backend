import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandleImage } from "#utils/HandleImage.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const key = "testimony:all";

const configHandleImage = {
  folderName: "testimony",
  prefixName: "testimonyImage",
  qualityPercentage: 60,
  sizePixel: {
    width: 100,
    height: 100,
  },
  targetKb: 100,
};

export const TestimonyService = {
  async index() {
    if (useCache.has(key)) {
      console.log("from cache");
      return useCache.get(key);
    }

    const testimonies = await prisma.testimonies.findMany();
    useCache.set(key, testimonies);

    return testimonies;
  },

  async show(id) {
    if (!id) {
      throw new AppError("testimony id not found", HTTP_FAILED.BAD_REQUEST);
    }

    const testimony_id = Number(id);

    if (Number.isNaN(testimony_id)) {
      throw new AppError("invalid testimony id", HTTP_FAILED.BAD_REQUEST);
    }

    const testimonies = useCache.get(key) ?? [];
    if (testimonies) {
      const testimonyById = testimonies.find((t) => t.id === testimony_id);

      if (testimonyById) {
        console.log("from cache");
        return testimonyById;
      }
    }

    const testimonyById = await prisma.testimonies.findUnique({
      where: { id: testimony_id },
    });

    if (!testimonyById) {
      throw new AppError("testimony not found", HTTP_FAILED.NOT_FOUND);
    }

    return testimonyById;
  },

  async create(reqBody, reqFile) {
    let created;
    try {
      const handleImage = new HandleImage(configHandleImage);

      await handleImage.convert(reqFile.buffer);

      const data = { ...reqBody, photo: handleImage.fileName };

      created = await prisma.testimonies.create({
        data,
      });

      await handleImage.save();

      const testimonies = useCache.get(key) ?? [];
      useCache.set(key, [...testimonies, created]);
      return created;
    } catch (error) {
      if (created?.id) {
        await prisma.testimonies.delete({ where: { id: created.id } });
      }
      throw HandlePrismaError(error, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "testimony already exist",
        },
      });
    }
  },

  async update(id, reqBody, reqFile) {
    try {
      if (!id) {
        throw new AppError("testimony id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const testimony_id = Number(id);

      if (Number.isNaN(testimony_id)) {
        throw new AppError("invalid testimony id", HTTP_FAILED.BAD_REQUEST);
      }

      let data = reqBody;

      const handleImage = new HandleImage(configHandleImage);

      if (reqFile) {
        await handleImage.convert(reqFile.buffer);

        data = { ...reqBody, photo: handleImage.fileName };
      }

      const result = await prisma.$transaction(async (trx) => {
        const testimony = await trx.testimonies.findUnique({
          where: { id: testimony_id },
        });

        if (!testimony) {
          throw new AppError("testimony not found", HTTP_FAILED.NOT_FOUND);
        }

        const updated = await trx.testimonies.update({
          where: { id: testimony_id },
          data,
        });

        return { testimony, updated };
      });

      if (reqFile) {
        await handleImage.save();
        if (result.testimony?.photo) {
          await HandleImage.delete(result.testimony.photo);
        }
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
          message: "testimony already exist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          message: "testimony id not found",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("testimony id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const testimony_id = Number(id);

      if (Number.isNaN(testimony_id)) {
        throw new AppError("invalid testimony id", HTTP_FAILED.BAD_REQUEST);
      }

      const deleted = await prisma.testimonies.delete({
        where: { id: testimony_id },
      });

      if (deleted.photo) {
        await HandleImage.delete(deleted.photo);
      }

      const testimonies = useCache.get(key);

      useCache.set(
        key,
        testimonies.filter((t) => t.id !== testimonies),
      );

      return deleted;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2025: {
          message: "testimony id not found",
          status: HTTP_FAILED.NOT_FOUND,
        },
        P2003: {
          message: "testimony still use on other table",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },
};
