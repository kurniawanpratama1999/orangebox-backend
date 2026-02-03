import { UserController } from "#api/controllers/user.controller.js";
import { ReqBodyMiddleware } from "#api/middlewares/ReqBodyMiddleware.js";
import { ReqFileMiddleware } from "#api/middlewares/ReqFileMiddleware.js";
import { UserValidation } from "#api/validations/user.validation.js";
import { Router } from "express";
import multer from "multer";

export const UserRoutes = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
});

UserRoutes.get("/", UserController.index);

UserRoutes.get("/:id", UserController.show);

UserRoutes.post(
  "/",
  imageUpload.single("photo"),
  ReqBodyMiddleware(UserValidation.create),
  ReqFileMiddleware.singleImage(UserValidation.photo),
  UserController.create,
);

UserRoutes.put(
  "/:id",
  imageUpload.single("photo"),
  ReqBodyMiddleware(UserValidation.update),
  ReqFileMiddleware.singleImage(UserValidation.photo.optional()),
  UserController.update,
);

UserRoutes.patch(
  "/:id",
  ReqBodyMiddleware(UserValidation.updatePassword),
  UserController.updatePassword,
);

UserRoutes.delete("/:id", UserController.destroy);
