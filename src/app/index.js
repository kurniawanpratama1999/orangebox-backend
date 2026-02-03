import express from "express";
import path from "path";
import multer from "multer";

import { UserRoutes } from "#routes/user.routes.js";
import { AppError } from "#utils/AppError.js";
import { Flash } from "#utils/Flash.js";
import { AuthRoutes } from "#routes/auth.routes.js";

import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { appMiddleware as appRoutes } from "./middleware.js";
import { ReqBodyMiddleware } from "#api/middlewares/ReqBodyMiddleware.js";
import { ReqFileMiddleware } from "#api/middlewares/ReqFileMiddleware.js";

import { CategoryRoutes } from "#routes/category.routes.js";
import { SosmedRoutes } from "#routes/sosmed.routes.js";
import { FacilityRoutes } from "#routes/facility.routes.js";
import { TestimonyRoutes } from "#routes/testimony.routes.js";
import { ContentRoutes } from "#routes/content.routes.js";
import { ProductRoutes } from "#routes/product.routes.js";
import { TestingValidation } from "#api/validations/testing.validation.js";

import { upload } from "#api/controllers/upload.js";

export const imageUpload = multer({
  storage: multer.memoryStorage(),
});

appRoutes.get("/api", (req, res) => {
  res.sendFile(path.resolve("README.md"));
});

appRoutes.use("/api/auth", AuthRoutes);

appRoutes.use("/api/user", AuthMiddleware, UserRoutes);

appRoutes.use("/api/category", CategoryRoutes);

appRoutes.use("/api/product", ProductRoutes);

appRoutes.use("/api/sosmed", SosmedRoutes);

appRoutes.use("/api/facility", FacilityRoutes);

appRoutes.use("/api/testimony", TestimonyRoutes);

appRoutes.use("/api/content", ContentRoutes);

appRoutes.post(
  "/api/upload",
  imageUpload.single("photo"),
  ReqBodyMiddleware(TestingValidation.create),
  ReqFileMiddleware.singleImage(TestingValidation.uploadImage),
  upload,
);

appRoutes.use((err, req, res, next) => {
  console.log(err);
  const status = 500;
  const message = "internal server error";

  if (err instanceof AppError) {
    return Flash.fail(res, { status: err.status, message: err.message });
  }

  return Flash.fail(res, { status, message });
});

appRoutes.use(
  "/uploads",
  express.static("src/uploads", {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

export { appRoutes };
