import { UserService } from "#api/services/user.service.js";
import { Flash, HTTP_FAILED } from "#utils/Flash.js";

export const UserController = {
  async index(req, res) {
    const user = await UserService.index();

    return user.ok
      ? Flash.success(res, {
          code: user.code,
          status: user.status,
          data: user.data,
        })
      : Flash.fail(res, { code: user.code, status: user.status });
  },

  async show(req, res) {
    const userId = req.params.id;

<<<<<<< HEAD
    if (!userId) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "ParamsIdNotFound",
      });
    }
=======
    // if (!userId) {
    //   return Flash.fail(res, {
    //     status: HTTP_FAILED.BAD_REQUEST,
    //     code: "ParamsIdNotFound",
    //   });
    // }
>>>>>>> riyan-branch

    const id = Number(userId);

    if (Number.isNaN(id)) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "InvalidUserId",
      });
    }
    const user = await UserService.showById(id);

    return user.ok
      ? Flash.success(res, {
          code: user.code,
          status: user.status,
          data: user.data,
        })
      : Flash.fail(res, { code: user.code, status: user.status });
  },

  async create(req, res) {
    const body = req.body;

    const user = await UserService.create({
      name: body.name,
      username: body.username,
      password: body.password,
      password_confirmation: body.password_confirmation,
    });

    return user.ok
      ? Flash.success(res, {
          code: user.code,
          status: user.status,
          data: user.data,
        })
      : Flash.fail(res, { code: user.code, status: user.status });
  },

  async update(req, res) {
    const userId = req.params.id;
    if (!userId) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "ParamsIdNotFound",
      });
    }
    const id = Number(userId);
    if (Number.isNaN(id)) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "InvalidUserId",
      });
    }

    const body = req.body;
    const user = await UserService.update(id, {
      name: body.name,
      username: body.username,
    });

    return user.ok
      ? Flash.success(res, {
          code: user.code,
          status: user.status,
          data: user.data,
        })
      : Flash.fail(res, { code: user.code, status: user.status });
  },

  async updatePassword(req, res) {
    const userId = req.params.id;
    if (!userId) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "ParamsIdNotFound",
      });
    }
    const id = Number(userId);
    if (Number.isNaN(id)) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "InvalidUserId",
      });
    }

    const body = req.body;
    const user = await UserService.updatePassword(id, {
      password: body.password,
      password_confirmation: body.password_confirmation,
    });

    return user.ok
      ? Flash.success(res, {
          code: user.code,
          status: user.status,
          data: user.data,
        })
      : Flash.fail(res, { code: user.code, status: user.status });
  },
  async destroy(req, res) {
    const userId = req.params.id;

    if (!userId) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "ParamsIdNotFound",
      });
    }
    const id = Number(userId);
    if (Number.isNaN(id)) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "InvalidUserId",
      });
    }

    const user = await UserService.destroy(id);

    return user.ok
      ? Flash.success(res, {
          code: user.code,
          status: user.status,
          data: user.data,
        })
      : Flash.fail(res, { code: user.code, status: user.status });
  },
};
