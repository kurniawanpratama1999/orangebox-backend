import { TestimonyController } from "#api/controllers/testimony.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ReqBodyMiddleware } from "#api/middlewares/ReqBodyMiddleware.js";
import { ReqFileMiddleware } from "#api/middlewares/ReqFileMiddleware.js";
import { TestimonyValidation } from "#api/validations/testimony.validation.js";
import { Router } from "express";
import multer from "multer";

export const TestimonyRoutes = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
});

TestimonyRoutes.get("/", TestimonyController.index);

TestimonyRoutes.get(
  "/:id",
  imageUpload.single("photo"),
  TestimonyController.show,
);

TestimonyRoutes.post(
  "/",
  AuthMiddleware,
  imageUpload.single("photo"),
  ReqBodyMiddleware(TestimonyValidation.create),
  ReqFileMiddleware.singleImage(TestimonyValidation.photo),
  TestimonyController.create,
);

TestimonyRoutes.put(
  "/:id",
  AuthMiddleware,
  imageUpload.single("photo"),
  ReqBodyMiddleware(TestimonyValidation.update),
  ReqFileMiddleware.singleImage(TestimonyValidation.photo.optional()),
  TestimonyController.update,
);

TestimonyRoutes.delete("/:id", AuthMiddleware, TestimonyController.destroy);
