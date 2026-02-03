import { prisma } from "#orm/lib/prisma.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandleImage } from "#utils/HandleImage.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";
import { Hash } from "#utils/Hash.js";

const configHandleImage = {
  folderName: "user",
  prefixName: "userImage",
  qualityPercentage: 60,
  sizePixel: {
    width: 100,
    height: 100,
  },
  targetKb: 100,
};

export const UserService = {
  async index() {
    return await prisma.users.findMany({ omit: { password: true } });
  },

  async showById(user_id) {
    if (!user_id) {
      throw new AppError("user id not found", HTTP_FAILED.BAD_REQUEST);
    }

    const id = Number(user_id);

    if (Number.isNaN(id)) {
      throw new AppError("invalid user id", HTTP_FAILED.BAD_REQUEST);
    }
    const user = await prisma.users.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new AppError("user not found", HTTP_FAILED.NOT_FOUND);
    }

    return user;
  },

  async showByUsername(username) {
    const user = await prisma.users.findUnique({
      include: { tokens: true },
      where: { username },
    });

    if (!user) {
      throw new AppError("user not found", HTTP_FAILED.NOT_FOUND);
    }

    return user;
  },

  async create(reqBody, reqFile) {
    let created;
    try {
      if (reqBody.password !== reqBody.password_confirmation) {
        throw new AppError("password not match", HTTP_FAILED.BAD_REQUEST);
      }

      reqBody.password = await Hash.make(reqBody.password);

      const handleImage = new HandleImage(configHandleImage);

      await handleImage.convert(reqFile.buffer);

      const { password_confirmation, ...data } = reqBody;

      const addPhoto = { ...data, photo: handleImage.fileName };

      created = await prisma.users.create({
        data: addPhoto,
        omit: { password: true },
      });

      await handleImage.save();

      return created;
    } catch (error) {
      if (created?.id) {
        await prisma.users.delete({ where: { id: created.id } });
      }

      throw HandlePrismaError(error, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "user already exist",
        },
      });
    }
  },
  async update(id, reqBody, reqFile) {
    try {
      if (!id) {
        throw new AppError("user id not found", HTTP_FAILED.BAD_REQUEST);
      }

      const user_id = Number(id);

      if (Number.isNaN(user_id)) {
        throw new AppError("invalid user id", HTTP_FAILED.BAD_REQUEST);
      }

      let data = reqBody;

      const handleImage = new HandleImage(configHandleImage);

      if (reqFile) {
        await handleImage.convert(reqFile.buffer);

        data = { ...reqBody, photo: handleImage.fileName };
      }

      const result = await prisma.$transaction(async (trx) => {
        const user = await trx.users.findUnique({
          where: { id: user_id },
          omit: { password: true },
        });

        if (!user) {
          throw new AppError("user not found", HTTP_FAILED.NOT_FOUND);
        }

        const updated = await trx.users.update({
          where: { id: user_id },
          data,
          omit: { password: true },
        });

        return { user, updated };
      });

      if (reqFile) {
        await handleImage.save();
        if (result.user?.photo) {
          await HandleImage.delete(result.user.photo);
        }
      }

      return result.updated;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "user already exist",
        },
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "user id not found",
        },
      });
    }
  },

  async updatePassword(id, reqBody) {
    try {
      if (reqBody.password !== reqBody.password_confirmation) {
        throw new AppError("password not match", HTTP_FAILED.BAD_REQUEST);
      }

      reqBody.password = await Hash.make(reqBody.password);

      return await prisma.users.update({
        where: { id },
        data: { password: reqBody.password },
        omit: { password: true },
      });
    } catch (error) {
      throw HandlePrismaError(error, {
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "user id not found",
        },
      });
    }
  },
  async destroy(id) {
    try {
      const deleted = await prisma.users.delete({
        where: { id },
        omit: { password: true },
      });

      if (deleted.photo) {
        await HandleImage.delete(deleted.photo);
      }

      return deleted;
    } catch (error) {
      throw HandlePrismaError(error, {
        P2003: {
          status: HTTP_FAILED.BAD_REQUEST,
          message: "user still use on other table",
        },
        P2025: {
          status: HTTP_FAILED.NOT_FOUND,
          message: "user id not found",
        },
      });
    }
  },
};
