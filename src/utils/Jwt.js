import { env } from "#config/env.js";
import jsonwebtoken from "jsonwebtoken";
import { AppError } from "./AppError.js";
import { HTTP_FAILED } from "./Flash.js";

const tokenEnv = env.token;
export const jwt = {
  createRefreshToken(sub, jti) {
    return jsonwebtoken.sign({}, tokenEnv.refresh, {
      subject: String(sub),
      expiresIn: "15m",
      jwtid: jti,
    });
  },

  createAccessToken(sub) {
    return jsonwebtoken.sign({}, tokenEnv.access, {
      subject: String(sub),
      expiresIn: "1m",
    });
  },

  verifyRefreshToken(token) {
    try {
      return jsonwebtoken.verify(token, tokenEnv.refresh);
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        throw new AppError("session expired", HTTP_FAILED.UNAUTHORIZED);
      }

      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        throw new AppError("session ivalid", HTTP_FAILED.UNAUTHORIZED);
      }

      throw new AppError("internal server error", HTTP_FAILED.UNAUTHORIZED);
    }
  },

  verifyAccessToken(token) {
    try {
      return jsonwebtoken.verify(token, tokenEnv.access);
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        throw new AppError("access expired", HTTP_FAILED.UNAUTHORIZED);
      }

      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        throw new AppError("access invalid", HTTP_FAILED.UNAUTHORIZED);
      }

      throw new AppError("internal server error", HTTP_FAILED.UNAUTHORIZED);
    }
  },
};
