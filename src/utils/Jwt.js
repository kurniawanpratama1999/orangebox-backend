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
        throw new AppError("CredentialExpired", HTTP_FAILED.UNAUTHORIZED);
      }

      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        throw new AppError("InvalidToken", HTTP_FAILED.UNAUTHORIZED);
      }

      throw new AppError("InternalServerError", HTTP_FAILED.UNAUTHORIZED);
    }
  },

  verifyAccessToken(token) {
    try {
      return jsonwebtoken.verify(token, tokenEnv.access);
    } catch (error) {
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        throw new AppError("AccessExpired", HTTP_FAILED.UNAUTHORIZED);
      }

      if (error instanceof jsonwebtoken.JsonWebTokenError) {
        throw new AppError("InvalidToken", HTTP_FAILED.UNAUTHORIZED);
      }

      throw new AppError("InternalServerError", HTTP_FAILED.UNAUTHORIZED);
    }
  },
};
