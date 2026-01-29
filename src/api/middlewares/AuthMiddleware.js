import { AppError } from "#utils/AppError.js";
import { HTTP_FAILED } from "#utils/Flash.js";
import { jwt } from "#utils/Jwt.js";

export const AuthMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new AppError("AccessNotFound", HTTP_FAILED.UNAUTHORIZED);
    }

    if (!authorization.startsWith("Bearer ")) {
      throw new AppError(
        "InvalidAuthorizationFormat",
        HTTP_FAILED.UNAUTHORIZED,
      );
    }

    const accessToken = authorization.split(" ")[1];

    const verifyAccessToken = jwt.verifyAccessToken(accessToken);
    const sub = verifyAccessToken?.sub;

    if (!sub) {
      throw new AppError("InvalidUserId", HTTP_FAILED.UNAUTHORIZED);
    }

    const user_id = Number(sub);
    if (Number.isNaN(user_id)) {
      throw new AppError("InvalidUserId", HTTP_FAILED.UNAUTHORIZED);
    }

    req.user_id = user_id;
    next();
  } catch (error) {
    next(error);
  }
};
