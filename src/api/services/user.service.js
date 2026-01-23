import { UserRepository } from "#api/repositories/user.respository.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";
import { Hash } from "#utils/Hash.js";

export const UserService = {
  async index() {
    return await UserRepository.index();
  },

  async showById(id) {
    const user = await UserRepository.show(id);
    if (!user) {
      throw new AppError("UserNotFound", HTTP_FAILED.NOT_FOUND);
    }

    return user;
  },

  async showByUsername(username) {
    const user = await UserRepository.showByUsername(username);

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

      return await UserRepository.create({
        name,
        username,
        password: hashPassword,
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
      return await UserRepository.update(id, { name, username });
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

      return await UserRepository.updatePassword(id, {
        password: hashPassword,
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
      return await UserRepository.destroy(id);
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
