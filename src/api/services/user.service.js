import { UserRepository } from "#api/repositories/user.respository.js";
import { HTTP_FAILED, HTTP_SUCCESS } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";
import { Hash } from "#utils/Hash.js";

export const UserService = {
  async index() {
    const users = await UserRepository.index();

    return {
      ok: true,
      status: HTTP_SUCCESS.OK,
      code: "FindAllUser",
      data: users,
    };
  },

  async showById(id) {
    const user = await UserRepository.show(id);
    if (!user) {
      return {
        ok: false,
        status: HTTP_FAILED.NOT_FOUND,
        code: "UserNotFound",
        data: null,
      };
    }
    return {
      ok: true,
      status: HTTP_SUCCESS.OK,
      code: "FindUserById",
      data: user,
    };
  },

  async showByUsername(username) {
    const user = await UserRepository.showByUsername(username);

    if (!user) {
      return {
        ok: false,
        status: HTTP_FAILED.NOT_FOUND,
        code: "UserNotFound",
        data: null,
      };
    }

    return {
      ok: true,
      status: HTTP_SUCCESS.OK,
      code: "FindUserByUsername",
      data: user,
    };
  },

  async create({ name, username, password, password_confirmation }) {
    try {
      if (password !== password_confirmation) {
        return {
          ok: false,
          status: HTTP_FAILED.BAD_REQUEST,
          code: "PasswordNotMatch",
          data: null,
        };
      }

      const hashPassword = await Hash.make(password);

      const createUser = await UserRepository.create({
        name,
        username,
        password: hashPassword,
      });

      return {
        ok: true,
        status: HTTP_SUCCESS.CREATED,
        code: "CreateUserSuccess",
        data: createUser,
      };
    } catch (error) {
      return HandlePrismaError(error, {
        P2002: "UsernameAlreadyExist",
      });
    }
  },
  async update(id, { name, username }) {
    try {
      const updateUser = await UserRepository.update(id, { name, username });

      return {
        ok: true,
        status: HTTP_SUCCESS.OK,
        code: "UpdateUserSuccess",
        data: updateUser,
      };
    } catch (error) {
      return HandlePrismaError(error, {
        P2002: "UsernameAlreadyExist",
        P2025: "UserIdNotFound",
      });
    }
  },

  async updatePassword(id, { password, password_confirmation }) {
    try {
      if (password !== password_confirmation) {
        return {
          ok: false,
          status: HTTP_FAILED.BAD_REQUEST,
          code: "PasswordNotMatch",
          data: null,
        };
      }

      const hashPassword = await Hash.make(password);
      const updateUserPassword = await UserRepository.updatePassword(id, {
        password: hashPassword,
      });

      return {
        ok: true,
        status: HTTP_SUCCESS.OK,
        code: "UpdatePasswordSuccess",
        data: updateUserPassword,
      };
    } catch (error) {
      return HandlePrismaError(error, {
        P2025: "UserIdNotFound",
      });
    }
  },
  async destroy(id) {
    try {
      await UserRepository.destroy(id);
      return {
        ok: true,
        status: HTTP_SUCCESS.NO_CONTENT,
        code: "DeleteUserSuccess",
      };
    } catch (error) {
      return HandlePrismaError(error, {
        P2003: "UserInUse",
        P2025: "UserIdNotFound",
      });
    }
  },
};
