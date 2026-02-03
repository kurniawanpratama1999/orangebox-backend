import { SosmedController } from "#api/controllers/sosmed.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ReqBodyMiddleware } from "#api/middlewares/ReqBodyMiddleware.js";
import { ReqFileMiddleware } from "#api/middlewares/ReqFileMiddleware.js";
import { SosmedValidation } from "#api/validations/sosmed.validation.js";
import { Router } from "express";
import multer from "multer";

export const SosmedRoutes = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
});

SosmedRoutes.get("/", SosmedController.index);

SosmedRoutes.get("/:id", SosmedController.show);

SosmedRoutes.post(
  "/",
  AuthMiddleware,
  imageUpload.single("photo"),
  ReqBodyMiddleware(SosmedValidation.create),
  ReqFileMiddleware.singleImage(SosmedValidation.photo),
  SosmedController.create,
);

SosmedRoutes.put(
  "/:id",
  imageUpload.single("photo"),
  AuthMiddleware,
  ReqBodyMiddleware(SosmedValidation.update),
  ReqFileMiddleware.singleImage(SosmedValidation.photo.optional()),
  SosmedController.update,
);

SosmedRoutes.delete("/:id", AuthMiddleware, SosmedController.destroy);
