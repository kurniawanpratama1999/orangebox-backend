import { ProductService } from "#api/services/product.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const ProductController = {
  async index(req, res, next) {
    try {
      const products = await ProductService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get all product",
        results: products,
      });
    } catch (e) {
      next(e);
    }
  },

  async show(req, res, next) {
    try {
      const id = req.params.id;

      const productById = await ProductService.show(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get product",
        results: productById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const createProduct = await ProductService.create(req.body, req.file);

      return Flash.success(res, {
        status: HTTP_SUCCESS.CREATED,
        message: "product created",
        results: createProduct,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const updateProductById = await ProductService.update(
        id,
        req.body,
        req.file,
      );

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "product updated",
        results: updateProductById,
      });
    } catch (e) {
      next(e);
    }
  },

  async destroy(req, res, next) {
    try {
      const id = req.params.id;

      await ProductService.destroy(id);

      return Flash.success(res, {
        status: "product deleted",
        message: HTTP_SUCCESS.NO_CONTENT,
      });
    } catch (e) {
      next(e);
    }
  },
};
