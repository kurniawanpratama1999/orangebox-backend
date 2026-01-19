import { HTTP_FAILED } from "#utils/Flash.js";

export const HandlePrismaError = (error, map) => {
  if (error?.code && map[error.code]) {
    return {
      ok: false,
      status: HTTP_FAILED.UNPROCESSABLE_ENTITY,
      code: map[error.code],
      data: null,
    };
  }

  return {
    ok: false,
    status: HTTP_FAILED.INTERNAL_SERVER_ERROR,
    code: "InternalServerError",
    data: null,
  };
};
