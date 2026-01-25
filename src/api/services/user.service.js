import { prisma } from "#orm/lib/prisma.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";
import { Hash } from "#utils/Hash.js";

export const UserService = {
  async index() {
    return await prisma.users.findMany({ omit: { password: true } });
  },

  async showById(user_id) {
    if (!user_id) {
      throw new AppError("ParamsIdNotFound", HTTP_FAILED.BAD_REQUEST);
    }

    const id = Number(user_id);

    if (Number.isNaN(id)) {
      throw new AppError("InvalidParamsId", HTTP_FAILED.BAD_REQUEST);
    }
    const user = await prisma.users.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new AppError("UserNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return user;
  },

  async showByUsername(username) {
    const user = await prisma.users.findUnique({
      include: { tokens: true },
      where: { username },
    });

    if (!user) {
      throw new AppError("UserNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return user;
  },

  async create({ name, username, password, password_confirmation }) {
    try {
      if (password !== password_confirmation) {
        throw new AppError("PasswordNotMatch", HTTP_FAILED.BAD_REQUEST);
      }

      const hashPassword = await Hash.make(password);

      return await prisma.users.create({
        data: { name, username, password: hashPassword },
        omit: { password: true },
      });
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "UsernameAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
      });
    }
  },
  async update(id, { name, username }) {
    try {
      return await prisma.users.update({
        where: { id },
        data: { name, username },
        omit: { password: true },
      });
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "UsernameAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "UserIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async updatePassword(id, { password, password_confirmation }) {
    try {
      if (password !== password_confirmation) {
        throw new AppError("PasswordNotMatch", HTTP_FAILED.BAD_REQUEST);
      }

      const hashPassword = await Hash.make(password);

      return await prisma.users.update({
        where: { id },
        data: { password: hashPassword },
        omit: { password: true },
      });
    } catch (error) {
      throw HandlePrismaError(error, {
        P2025: {
          code: "UserIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },
  async destroy(id) {
    try {
      return await prisma.users.delete({ where: { id }, select: { username } });
    } catch (error) {
      throw HandlePrismaError(error, {
        P2003: {
          code: "UserInUse",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "UserIdNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },
};
