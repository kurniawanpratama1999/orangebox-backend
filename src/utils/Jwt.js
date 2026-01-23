import { env } from "#config/env.js";
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import { AppError } from "./AppError.js";
import { HTTP_FAILED } from "./Flash.js";

const tokenEnv = env.token;
export const jwt = {
  createRefreshToken(sub, jti) {
    return sign({}, tokenEnv.refresh, {
      subject: sub,
      expiresIn: "15m",
      jwtid: jti,
    });
  },

  createAccessToken(sub) {
    return sign({}, tokenEnv.access, {
      subject: sub,
      expiresIn: "1m",
    });
  },

  verifyRefreshToken(token, sub, jti) {
    try {
      return verify(token, tokenEnv.refresh, {
        subject: sub,
        jwtid: jti,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AppError("CredentialExpired", HTTP_FAILED.UNAUTHORIZED);
      }

      if (error instanceof JsonWebTokenError) {
        throw new AppError("InvalidToken", HTTP_FAILED.UNAUTHORIZED);
      }

      throw new AppError("InternalServerError", HTTP_FAILED.UNAUTHORIZED);
    }
  },

  verifyAccessToken(token, sub) {
    try {
      return verify(token, tokenEnv.access, {
        subject: sub,
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AppError("AccessExpired", HTTP_FAILED.UNAUTHORIZED);
      }

      if (error instanceof JsonWebTokenError) {
        throw new AppError("InvalidToken", HTTP_FAILED.UNAUTHORIZED);
      }

      throw new AppError("InternalServerError", HTTP_FAILED.UNAUTHORIZED);
    }
  },
};
