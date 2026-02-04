import { Flash, HTTP_FAILED } from "#utils/Flash.js";

export const ReqBodyMiddleware = (ZodObject) => (req, res, next) => {
  try {
    req.body = ZodObject.parse(req.body);

    next();
  } catch (error) {
    if (error?.issues) {
      const message = error.issues.map((issue) => [
        `${issue.path[0]}: ${issue.message}`,
      ]);

      return Flash.fail(res, { status: HTTP_FAILED.BAD_REQUEST, message });
    }

    next(error);
  }
};
