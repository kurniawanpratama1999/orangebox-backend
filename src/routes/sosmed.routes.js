import { SosmedController } from "#api/controllers/sosmed.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ZodMiddleware } from "#api/middlewares/ZodMiddleware.js";
import { SosmedValidation } from "#api/validations/sosmed.validation.js";
import { Router } from "express";

export const SosmedRoutes = Router();

SosmedRoutes.get("/", SosmedController.index);

SosmedRoutes.get("/:id", SosmedController.show);

SosmedRoutes.post(
  "/",
  AuthMiddleware,
  ZodMiddleware(SosmedValidation.create),
  SosmedController.create,
);

SosmedRoutes.put(
  "/:id",
  AuthMiddleware,
  ZodMiddleware(SosmedValidation.update),
  SosmedController.update,
);

SosmedRoutes.delete("/:id", AuthMiddleware, SosmedController.destroy);
