import { UserController } from "#api/controllers/user.controller.js";
import { ZodMiddleware } from "#api/middlewares/ZodMiddleware.js";
import { UserValidation } from "#api/validations/user.validation.js";
import { Router } from "express";

export const UserRoutes = Router();

UserRoutes.get("/", UserController.index);
UserRoutes.get("/:id", UserController.show);
UserRoutes.post(
  "/",
  ZodMiddleware(UserValidation.create),
  UserController.create
);
UserRoutes.put(
  "/:id",
  ZodMiddleware(UserValidation.update),
  UserController.update
);
UserRoutes.patch(
  "/:id",
  ZodMiddleware(UserValidation.updatePassword),
  UserController.updatePassword
);
UserRoutes.delete("/:id", UserController.destroy);
