import { FacilityController } from "#api/controllers/facility.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ZodMiddleware } from "#api/middlewares/ZodMiddleware.js";
import { FacilityValidation } from "#api/validations/facility.validation.js";
import { Router } from "express";

export const FacilityRoutes = Router();

FacilityRoutes.get("/", FacilityController.index);

FacilityRoutes.get("/:id", FacilityController.show);

FacilityRoutes.post(
  "/",
  AuthMiddleware,
  ZodMiddleware(FacilityValidation.create),
  FacilityController.create,
);

FacilityRoutes.put(
  "/:id",
  AuthMiddleware,
  ZodMiddleware(FacilityValidation.update),
  FacilityController.update,
);

FacilityRoutes.delete("/:id", AuthMiddleware, FacilityController.destroy);
