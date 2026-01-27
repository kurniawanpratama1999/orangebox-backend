import { ContentController } from "#api/controllers/content.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ZodMiddleware } from "#api/middlewares/ZodMiddleware.js";
import { ContentValidation } from "#api/validations/content.validation.js";
import { Router } from "express";

export const ContentRoutes = Router();

ContentRoutes.get("/", ContentController.index);

ContentRoutes.put(
  "/",
  AuthMiddleware,
  ZodMiddleware(ContentValidation.update),
  ContentController.update,
);
