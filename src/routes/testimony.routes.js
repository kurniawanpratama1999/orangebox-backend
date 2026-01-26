import { TestimonyController } from "#api/controllers/testimony.controller.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { ZodMiddleware } from "#api/middlewares/ZodMiddleware.js";
import { TestimonyValidation } from "#api/validations/testimony.validation.js";
import { Router } from "express";

export const TestimonyRoutes = Router();

TestimonyRoutes.get("/", TestimonyController.index);

TestimonyRoutes.get("/:id", TestimonyController.show);

TestimonyRoutes.post(
  "/",
  AuthMiddleware,
  ZodMiddleware(TestimonyValidation.create),
  TestimonyController.create,
);

TestimonyRoutes.put(
  "/:id",
  AuthMiddleware,
  ZodMiddleware(TestimonyValidation.update),
  TestimonyController.update,
);

TestimonyRoutes.delete("/:id", AuthMiddleware, TestimonyController.destroy);
