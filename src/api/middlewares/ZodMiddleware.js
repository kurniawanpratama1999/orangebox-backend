import { Flash, HTTP_FAILED } from "#utils/Flash.js";
import { ZodError } from "zod";

export const ZodMiddleware = (ZodObject) => (req, res, next) => {
  try {
    req.body = ZodObject.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues;

      const flatten = issues.map((issue, index) => {
        const path = issue.path ?? "path" + index;
        const message = issue.message;

        return [path, message];
      });

      const obj = Object.fromEntries(flatten);

      return Flash.fail(res, {
        code: "InvalidInput",
        status: HTTP_FAILED.BAD_REQUEST,
        error: obj,
      });
    }
    return next(error);
  }
};
