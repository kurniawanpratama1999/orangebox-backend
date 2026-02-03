import { FacilityController } from "#api/controllers/facility.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ReqBodyMiddleware } from "#api/middlewares/ReqBodyMiddleware.js";
import { ReqFileMiddleware } from "#api/middlewares/ReqFileMiddleware.js";
import { FacilityValidation } from "#api/validations/facility.validation.js";
import { Router } from "express";
import multer from "multer";

export const FacilityRoutes = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
});

FacilityRoutes.get("/", FacilityController.index);

FacilityRoutes.get("/:id", FacilityController.show);

FacilityRoutes.post(
  "/",
  AuthMiddleware,
  imageUpload.single("photo"),
  ReqBodyMiddleware(FacilityValidation.create),
  ReqFileMiddleware.singleImage(FacilityValidation.photo),
  FacilityController.create,
);

FacilityRoutes.put(
  "/:id",
  AuthMiddleware,
  imageUpload.single("photo"),
  ReqBodyMiddleware(FacilityValidation.update),
  ReqFileMiddleware.singleImage(FacilityValidation.photo.optional()),
  FacilityController.update,
);

FacilityRoutes.delete("/:id", AuthMiddleware, FacilityController.destroy);
