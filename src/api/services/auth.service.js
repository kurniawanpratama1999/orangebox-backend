import { TokenRepository } from "#api/repositories/token.repository.js";
import { UserRepository } from "#api/repositories/user.respository.js";
import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { HandlePrismaError } from "#utils/HandlePrismaError.js";
import { Hash } from "#utils/Hash.js";
import { jwt } from "#utils/Jwt.js";
import { randomUUID } from "crypto";

export const AuthService = {
  async login(username, password) {
    try {
      const user = await UserRepository.showByUsername(username);
      if (!user) {
        throw new AppError("WrongUsernameOrPassword", HTTP_FAILED.BAD_REQUEST);
      }

      const comparePassword = await Hash.compare(password, user.password);

      if (!comparePassword) {
        throw new AppError("WrongUsernameOrPassword", HTTP_FAILED.BAD_REQUEST);
      }

      const userId = user.id;
      const jti = randomUUID();

      if (user.tokens) {
        await TokenRepository.destroy(user.tokens?.id);
      }

      const refreshToken = jwt.createRefreshToken(userId, jti);
      const accessToken = jwt.createAccessToken(userId);

      const hashRefreshToken = await Hash.make(refreshToken);
      await TokenRepository.create(jti, hashRefreshToken, userId);

      return {
        refreshToken,
        accessToken,
      };
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "TokenAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2003: {
          code: "TokenInUse",
          status: HTTP_FAILED.BAD_REQUEST,
        },
        P2025: {
          code: "TokenNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },

  async refreshToken(cookieRefreshToken) {
    try {
      if (!cookieRefreshToken) {
        throw new AppError("CredentialNotFound", HTTP_FAILED.UNAUTHORIZED);
      }

      const verifyRefreshToken = jwt.verifyRefreshToken(cookieRefreshToken);

      const sub = verifyRefreshToken?.sub;
      const jti = verifyRefreshToken?.jti;

      const findRefreshToken = await TokenRepository.findById(jti);
      if (!findRefreshToken) {
        throw new AppError("CredentialNotFound", HTTP_FAILED.UNAUTHORIZED);
      }

      const compareRefreshToken = await Hash.compare(
        cookieRefreshToken,
        findRefreshToken.token,
      );

      if (!compareRefreshToken) {
        throw new AppError("CredentialNotMatch", HTTP_FAILED.UNAUTHORIZED);
      }

      const newJti = randomUUID();

      const newRefreshToken = jwt.createRefreshToken(sub, newJti);

      const hashRefreshToken = await Hash.make(newRefreshToken);

      await TokenRepository.update(jti, newJti, hashRefreshToken);

      const accessToken = jwt.createAccessToken(sub);

      return { newRefreshToken, accessToken };
    } catch (error) {
      throw HandlePrismaError(error, {
        P2002: {
          code: "TokenAlreadyExist",
          status: HTTP_FAILED.BAD_REQUEST,
        },

        P2003: {
          code: "TokenInUse",
          status: HTTP_FAILED.BAD_REQUEST,
        },

        P2025: {
          code: "TokenNotFound",
          status: HTTP_FAILED.NOT_FOUND,
        },
      });
    }
  },
};
