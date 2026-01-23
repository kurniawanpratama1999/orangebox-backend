import { TokenRepository } from "#api/repositories/token.repository.js";
import { AuthService } from "#api/services/auth.service.js";
import { AppError } from "#utils/AppError.js";
import { Flash, HTTP_FAILED, HTTP_SUCCESS } from "#utils/Flash.js";
import { Hash } from "#utils/Hash.js";
import { jwt } from "#utils/Jwt.js";
import { randomUUID } from "crypto";

export const AuthController = {
  async login(req, res, next) {
    try {
      const body = req.body;
      const username = body.username;
      const password = body.password;

      const loginService = await AuthService.login(username, password);

      res.cookie("refresh_token", loginService.refreshToken, {
        maxAge: 1000 * 60 * 15,
        path: "/",
        secure: false,
        sameSite: "lax",
        httpOnly: true,
      });

      return Flash.success(res, {
        status: HTTP_SUCCESS.ACCEPTED,
        code: "LoginSuccess",
        data: loginService.accessToken,
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const cookies = req.cookies;
      const cookieRefreshToken = cookies.refresh_token;

      const refreshService = await AuthService.refreshToken(cookieRefreshToken);

      res.cookie("refresh_token", refreshService.newRefreshToken, {
        maxAge: 1000 * 60 * 15,
        path: "/",
        secure: false,
        sameSite: "lax",
        httpOnly: true,
      });

      return Flash.success(res, {
        status: HTTP_SUCCESS.CREATED,
        code: "NewAccessCreated",
        data: refreshService.accessToken,
      });
    } catch (error) {
      next(error);
    }
  },
};
