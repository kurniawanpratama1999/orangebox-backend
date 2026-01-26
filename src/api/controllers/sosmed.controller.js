import { SosmedService } from "#api/services/sosmed.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const SosmedController = {
  async index(req, res, next) {
    try {
      const sosmeds = await SosmedService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetSosmedsIsSuccess",
        data: sosmeds,
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
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetSosmedIsSuccess",
        data: sosmedById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const body = req.body;

      const createSosmed = await SosmedService.create({
        name: body.name,
        description: body.description,
        link: body.link,
      });

      return Flash.success(res, {
        status: "NewSosmedIsCreated",
        code: HTTP_SUCCESS.CREATED,
        data: createSosmed,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const body = req.body;

      const updateSosmedById = await SosmedService.update(id, {
        name: body.name,
        description: body.description,
        link: body.link,
      });

      return Flash.success(res, {
        status: "UpdateSosmedIsSuccess",
        code: HTTP_SUCCESS.OK,
        data: updateSosmedById,
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
        status: "SosmedIsDeleted",
        code: HTTP_SUCCESS.NO_CONTENT,
      });
    } catch (e) {
      next(e);
    }
  },
};
