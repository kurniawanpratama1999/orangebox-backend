import { HTTP_FAILED } from "#utils/Flash.js";
import { AppError } from "./AppError.js";

export const HandlePrismaError = (error, map) => {
  if (error?.code && map[error.code]) {
    throw new AppError(map[error.code].code, map[error.code].status);
  }

  throw new AppError("DataNotProccess", HTTP_FAILED.UNPROCESSABLE_ENTITY);
};
