import { TestimonyService } from "#api/services/testimony.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const TestimonyController = {
  async index(req, res, next) {
    try {
      const testimonies = await TestimonyService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get all testimony",
        results: testimonies,
      });
    } catch (e) {
      next(e);
    }
  },

  async show(req, res, next) {
    try {
      const id = req.params.id;

      const testimonyById = await TestimonyService.show(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get testimony",
        results: testimonyById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const body = req.body;

      const createTestimony = await TestimonyService.create(req.body, req.file);

      return Flash.success(res, {
        status: HTTP_SUCCESS.CREATED,
        message: "testimony created",
        results: createTestimony,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const updateTestimonyById = await TestimonyService.update(
        id,
        req.body,
        req.file,
      );

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "testimony updated",
        results: updateTestimonyById,
      });
    } catch (e) {
      next(e);
    }
  },

  async destroy(req, res, next) {
    try {
      const id = req.params.id;

      await TestimonyService.destroy(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.NO_CONTENT,
        message: "testimony deleted",
      });
    } catch (e) {
      next(e);
    }
  },
};
