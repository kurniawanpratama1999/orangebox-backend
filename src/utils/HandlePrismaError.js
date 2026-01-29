import { HTTP_FAILED } from "#utils/Flash.js";
import { AppError } from "./AppError.js";

export const HandlePrismaError = (error, map) => {
  if (error?.code && map[error.code]) {
    return new AppError(map[error.code].code, map[error.code].status);
  }

  console.log(error);
  return new AppError("InternalServerError", HTTP_FAILED.UNPROCESSABLE_ENTITY);
};
