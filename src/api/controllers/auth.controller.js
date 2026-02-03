import { AuthService } from "#api/services/auth.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";
import { jwt } from "#utils/Jwt.js";

export const AuthController = {
  async login(req, res, next) {
    try {
      const loginService = await AuthService.login(req.body);

      res.cookie("refresh_token", loginService.refreshToken, {
        maxAge: 1000 * 60 * 15,
        path: "/",
        secure: false,
        sameSite: "lax",
        httpOnly: true,
      });

      return Flash.success(res, {
        status: HTTP_SUCCESS.CREATED,
        message: "login success",
        results: loginService.accessToken,
      });
    } catch (e) {
      next(e);
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
        results: refreshService.accessToken,
      });
    } catch (error) {
      next(error);
    }
  },

  async hasLogin(req, res) {
    const cookies = req.cookies;
    const refresh_token = cookies.refresh_token;

    const rememberMe = await AuthService.hasLogin(refresh_token);

    if (!rememberMe) {
      throw new AppError("CannotIdentify", 404);
    }

    return Flash.success(res, {
      code: "YouAreLoggedIn",
      status: HTTP_SUCCESS.ACCEPTED,
      results: rememberMe,
    });
  },
};
