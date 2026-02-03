import { HTTP_FAILED } from "#utils/Flash.js";
import { AppError } from "./AppError.js";

export const HandlePrismaError = (error, map) => {
  if (error?.message && map[error.message]) {
    return new AppError(map[error.message].message, map[error.message].status);
  }

  console.log(error);
  return new AppError(
    "internal server error",
    HTTP_FAILED.UNPROCESSABLE_ENTITY,
  );
};
