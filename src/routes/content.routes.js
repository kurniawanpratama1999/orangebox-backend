import { ContentController } from "#api/controllers/content.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ReqBodyMiddleware } from "#api/middlewares/ReqBodyMiddleware.js";
import { ContentValidation } from "#api/validations/content.validation.js";
import { Router } from "express";

export const ContentRoutes = Router();

ContentRoutes.get("/", ContentController.index);

ContentRoutes.put(
  "/",
  AuthMiddleware,
  ReqBodyMiddleware(ContentValidation.update),
  ContentController.update,
);
