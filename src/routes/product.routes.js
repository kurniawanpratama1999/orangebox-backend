import { ProductController } from "#api/controllers/product.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ReqBodyMiddleware } from "#api/middlewares/ReqBodyMiddleware.js";
import { ReqFileMiddleware } from "#api/middlewares/ReqFileMiddleware.js";
import { ProductValidation } from "#api/validations/product.validation.js";
import { Router } from "express";
import multer from "multer";

export const ProductRoutes = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
});

ProductRoutes.get("/", ProductController.index);

ProductRoutes.get("/:id", ProductController.show);

ProductRoutes.post(
  "/",
  AuthMiddleware,
  imageUpload.single("photo"),
  ReqBodyMiddleware(ProductValidation.create),
  ReqFileMiddleware.singleImage(ProductValidation.photo),
  ProductController.create,
);

ProductRoutes.put(
  "/:id",
  AuthMiddleware,
  imageUpload.single("photo"),
  ReqBodyMiddleware(ProductValidation.update),
  ReqFileMiddleware.singleImage(ProductValidation.photo.optional()),
  ProductController.update,
);

ProductRoutes.delete("/:id", AuthMiddleware, ProductController.destroy);
