import { TestimonyService } from "#api/services/testimony.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const TestimonyController = {
  async index(req, res, next) {
    try {
      const testimonies = await TestimonyService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetTestimoniesIsSuccess",
        data: testimonies,
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
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetTestimonyIsSuccess",
        data: testimonyById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const body = req.body;

      const createTestimony = await TestimonyService.create({
        name: body.name,
        photo: body.photo,
        description: body.description,
      });

      return Flash.success(res, {
        status: "NewTestimonyIsCreated",
        code: HTTP_SUCCESS.CREATED,
        data: createTestimony,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const body = req.body;

      const updateTestimonyById = await TestimonyService.update(id, {
        name: body.name,
        photo: body.photo,
        description: body.description,
      });

      return Flash.success(res, {
        status: "UpdateTestimonyIsSuccess",
        code: HTTP_SUCCESS.OK,
        data: updateTestimonyById,
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
        status: "TestimonyIsDeleted",
        code: HTTP_SUCCESS.NO_CONTENT,
      });
    } catch (e) {
      next(e);
    }
  },
};
