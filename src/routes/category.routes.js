import { CategoryController } from "#api/controllers/category.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ZodMiddleware } from "#api/middlewares/ZodMiddleware.js";
import { CategoryValidation } from "#api/validations/category.validation.js";
import { Router } from "express";

export const CategoryRoutes = Router();

CategoryRoutes.get("/", CategoryController.index);

CategoryRoutes.get("/:id", CategoryController.show);

CategoryRoutes.post(
  "/",
  AuthMiddleware,
  ZodMiddleware(CategoryValidation.create),
  CategoryController.create,
);

CategoryRoutes.put(
  "/:id",
  AuthMiddleware,
  ZodMiddleware(CategoryValidation.update),
  CategoryController.update,
);

CategoryRoutes.delete("/:id", AuthMiddleware, CategoryController.destroy);
