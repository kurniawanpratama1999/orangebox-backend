import { SosmedService } from "#api/services/sosmed.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const SosmedController = {
  async index(req, res, next) {
    try {
      const sosmeds = await SosmedService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get all sosmed",
        results: sosmeds,
      });
    } catch (e) {
      next(e);
    }
  },

  async show(req, res, next) {
    try {
      const id = req.params.id;

      const sosmedById = await SosmedService.show(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get sosmed",
        results: sosmedById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const createSosmed = await SosmedService.create(req.body, req.file);

      return Flash.success(res, {
        status: HTTP_SUCCESS.CREATED,
        message: "sosmed created",
        results: createSosmed,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const updateSosmedById = await SosmedService.update(
        id,
        req.body,
        req.file,
      );

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "sosmed updated",
        results: updateSosmedById,
      });
    } catch (e) {
      next(e);
    }
  },

  async destroy(req, res, next) {
    try {
      const id = req.params.id;

      await SosmedService.destroy(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.NO_CONTENT,
        message: "sosmed deleted",
      });
    } catch (e) {
      next(e);
    }
  },
};
