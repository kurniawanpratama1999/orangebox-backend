import { AuthController } from "#api/controllers/auth.controller.js";
import { ZodMiddleware } from "#api/middlewares/ZodMiddleware.js";
import { AuthValidation } from "#api/validations/auth.validation.js";
import { Router } from "express";

export const AuthRoutes = Router();

AuthRoutes.get("/login", (req, res) => {
  return res.send("Auth Routes Login");
});

AuthRoutes.post(
  "/login",
  ZodMiddleware(AuthValidation.login),
  AuthController.login,
);

AuthRoutes.post("/refresh", AuthController.refresh);

AuthRoutes.get("/remember-me", AuthController.hasLogin);
