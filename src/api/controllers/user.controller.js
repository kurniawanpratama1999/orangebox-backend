import { UserService } from "#api/services/user.service.js";
import { AppError } from "#utils/AppError.js";
import { Flash, HTTP_FAILED, HTTP_SUCCESS } from "#utils/Flash.js";

export const UserController = {
  async index(req, res, next) {
    try {
      const user = await UserService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get all user",
        results: user,
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
        status: HTTP_SUCCESS.OK,
        message: "get user",
        results: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const user = await UserService.create(req.body, req.file);

      return Flash.success(res, {
        status: HTTP_SUCCESS.CREATED,
        message: "user created",
        results: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      await UserService.update(id, req.body, req.file);

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "user updated",
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const id = req.params.id;

      await UserService.updatePassword(id, req.body);

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "password updated",
      });
    } catch (error) {
      next(error);
    }
  },
  async destroy(req, res, next) {
    try {
      const id = req.params.id;

      await UserService.destroy(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.NO_CONTENT,
        message: "user deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};
