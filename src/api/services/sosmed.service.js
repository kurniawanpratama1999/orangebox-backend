import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandleImage } from "#utils/HandleImage.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

const configHandleImage = {
  folderName: "sosmed",
  prefixName: "sosmedImage",
  qualityPercentage: 60,
  sizePixel: {
    width: 100,
    height: 100,
  },
  targetKb: 100,
};

const key = "sosmed:all";
export const SosmedService = {
  async index() {
    if (useCache.has(key)) {
      console.log("from cache");
      return useCache.get(key);
    }

    const sosmeds = await prisma.sosmeds.findMany();
    useCache.set(key, sosmeds);

    return sosmeds;
  },

  async show(id) {
    if (!id) {
      throw new AppError("sosmed id not found", HTTP_FAILED.BAD_REQUEST);
    }

    const sosmed_id = Number(id);

    if (Number.isNaN(sosmed_id)) {
      throw new AppError("invalid sosmed id", HTTP_FAILED.BAD_REQUEST);
    }

    const sosmeds = useCache.get(key) ?? [];
    if (sosmeds) {
      const sosmedById = sosmeds.find((s) => s.id === sosmed_id);

      if (sosmedById) {
        console.log("from cache");
        return sosmedById;
      }
    }

    const sosmedById = await prisma.sosmeds.findUnique({
      where: { id: sosmed_id },
    });

    if (!sosmedById) {
      throw new AppError("sosmed not found", HTTP_FAILED.NOT_FOUND);
    }

    return sosmedById;
  },

  async create(reqBody, reqFile) {
    let created = null;
    try {
      const handleImage = new HandleImage(configHandleImage);

      await handleImage.convert(reqFile.buffer);

      const data = { ...reqBody, photo: handleImage.fileName };

      created = await prisma.sosmeds.create({
        data,
      });

      await handleImage.save();

      const sosmeds = useCache.get(key) ?? [];
      useCache.set(key, [...sosmeds, created]);

      return created;
    } catch (error) {
      if (created?.id) {
        await prisma.sosmeds.delete({ where: { id: created.id } });
      }

      throw HandlePrismaError(error, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "sosmed already exist",
        },
      });
    }
  },

  async update(id, reqBody, reqFile) {
    try {
      if (!id) {
        throw new AppError("sosmed id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const sosmed_id = Number(id);

      if (Number.isNaN(sosmed_id)) {
        throw new AppError("invalid sosmed id", HTTP_FAILED.BAD_REQUEST);
      }

      let data = reqBody;
      const handleImage = new HandleImage(configHandleImage);

      if (reqFile) {
        await handleImage.convert(reqFile.buffer);

        data = { ...reqBody, photo: handleImage.fileName };
      }

      const result = await prisma.$transaction(async (trx) => {
        const sosmed = await trx.sosmeds.findUnique({
          where: { id: sosmed_id },
        });

        if (!sosmed) {
          throw new AppError("sosmed not found", HTTP_FAILED.NOT_FOUND);
        }

        const updated = await trx.sosmeds.update({
          where: { id: sosmed_id },
          data,
        });

        return { sosmed, updated };
      });

      if (reqFile) {
        await handleImage.save();
        if (result.sosmed?.photo) {
          await HandleImage.delete(result.sosmed.photo);
        }
      }

      const sosmeds = useCache.get(key);

      useCache.set(
        key,
        sosmeds.map((s) => (s.id === sosmed_id ? updated : s)),
      );

      return result.updated;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "sosmed already exist",
        },
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "sosmed id not found",
        },
      });
    }
  },

  async destroy(id) {
    try {
      if (!id) {
        throw new AppError("sosmed id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const sosmed_id = Number(id);

      if (Number.isNaN(sosmed_id)) {
        throw new AppError("invalid sosmed id", HTTP_FAILED.BAD_REQUEST);
      }

      const deleted = await prisma.sosmeds.delete({ where: { id: sosmed_id } });

      if (deleted.photo) {
        await HandleImage.delete(deleted.photo);
      }

      const sosmeds = useCache.get(key);

      useCache.set(
        key,
        sosmeds.filter((s) => s.id !== sosmed_id),
      );

      return deleted;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "sosmed id not found",
        },
        P2003: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "sosmed still use on other table",
        },
      });
    }
  },
};
