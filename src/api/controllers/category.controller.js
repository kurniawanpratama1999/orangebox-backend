import { CategoryService } from "#api/services/category.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const CategoryController = {
  async index(req, res, next) {
    try {
      const categories = await CategoryService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetCategoriesIsSuccess",
        data: categories,
      });
    } catch (e) {
      next(e);
    }
  },

  async show(req, res, next) {
    try {
      const id = req.params.id;

      const categoryById = await CategoryService.show(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetCategoryIsSuccess",
        data: categoryById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const body = req.body;

      const createCategory = await CategoryService.create({
        name: body.name,
        description: body.description,
      });

      return Flash.success(res, {
        status: "NewCategoryIsCreated",
        code: HTTP_SUCCESS.CREATED,
        data: createCategory,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const body = req.body;

      const updateCategoryById = await CategoryService.update(id, {
        name: body.name,
        description: body.description,
      });

      return Flash.success(res, {
        status: "UpdateCategoryIsSuccess",
        code: HTTP_SUCCESS.OK,
        data: updateCategoryById,
      });
    } catch (e) {
      next(e);
    }
  },

  async destroy(req, res, next) {
    try {
      const id = req.params.id;

      await CategoryService.destroy(id);

      return Flash.success(res, {
        status: "CategoryIsDeleted",
        code: HTTP_SUCCESS.NO_CONTENT,
      });
    } catch (e) {
      next(e);
    }
  },
};
