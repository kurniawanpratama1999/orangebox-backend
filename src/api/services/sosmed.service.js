import { prisma } from "#orm/lib/prisma.js";
import { useCache } from "#store/cache.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";

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
      throw new AppError("SosmedIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const sosmed_id = Number(id);

    if (Number.isNaN(sosmed_id)) {
      throw new AppError("InvalidSosmedId", HTTP_FAILED.BAD_REQUEST);
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
      throw new AppError("SosmedNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return sosmedById;
  },

  async create({ name, description, link }) {
    try {
      const newData = await prisma.sosmeds.create({
        data: {
          name,
          description,
          link,
        },
      });

      const sosmeds = useCache.get(key) ?? [];
      useCache.set(key, [...sosmeds, newData]);

      return newData;
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

      const updated = await prisma.sosmeds.update({
        data: {
          name,
          description,
          link,
        },
        where: { id: sosmed_id },
      });

      if (!updated) {
        throw new AppError("SosmedNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const sosmeds = useCache.get(key);

      useCache.set(
        key,
        sosmeds.map((s) => (s.id === sosmed_id ? updated : s)),
      );

      return updated;
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

      const deleted = await prisma.sosmeds.delete({ where: { id: sosmed_id } });

      const sosmeds = useCache.get(key);

      useCache.set(
        key,
        sosmeds.filter((s) => s.id !== sosmed_id),
      );

      return deleted;
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
