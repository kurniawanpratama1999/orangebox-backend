import { UserService } from "#api/services/user.service.js";
import { AppError } from "#utils/AppError.js";
import { Flash, HTTP_FAILED, HTTP_SUCCESS } from "#utils/Flash.js";

export const UserController = {
  async index(req, res, next) {
    try {
      const user = await UserService.index();

      return Flash.success(res, {
        code: "GetUsersIsSuccess",
        status: HTTP_SUCCESS.ACCEPTED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async show(req, res, next) {
    try {
      const id = req.params.id;

      const user = await UserService.showById(id);

      return Flash.success(res, {
        code: "GetUserIsSuccess",
        status: HTTP_SUCCESS.OK,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const body = req.body;

      const user = await UserService.create({
        name: body.name,
        username: body.username,
        password: body.password,
        password_confirmation: body.password_confirmation,
      });

      return Flash.success(res, {
        code: "CreateNewUserIsSuccess",
        status: HTTP_SUCCESS.CREATED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("ParamsIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const id = Number(userId);

      if (Number.isNaN(id)) {
        throw new AppError("InvalidParamsId", HTTP_FAILED.BAD_REQUEST);
      }

      const body = req.body;
      await UserService.update(id, {
        name: body.name,
        username: body.username,
      });

      return Flash.success(res, {
        code: "UpdateUserIsSuccess",
        status: HTTP_SUCCESS.OK,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("ParamsIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const id = Number(userId);

      if (Number.isNaN(id)) {
        throw new AppError("InvalidParamsId", HTTP_FAILED.BAD_REQUEST);
      }

      const body = req.body;
      await UserService.updatePassword(id, {
        password: body.password,
        password_confirmation: body.password_confirmation,
      });

      return Flash.success(res, {
        code: "UpdatePasswordIsSuccess",
        status: HTTP_SUCCESS.OK,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  async destroy(req, res, next) {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new AppError("ParamsIdNotFound", HTTP_FAILED.BAD_REQUEST);
      }

      const id = Number(userId);

      if (Number.isNaN(id)) {
        throw new AppError("InvalidParamsId", HTTP_FAILED.BAD_REQUEST);
      }

      await UserService.destroy(id);

      return Flash.success(res, {
        code: "DeleteUserIsSuccess",
        status: HTTP_SUCCESS.NO_CONTENT,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
