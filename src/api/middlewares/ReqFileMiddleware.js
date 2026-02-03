import { Flash, HTTP_FAILED } from "#utils/Flash.js";

export const ReqFileMiddleware = {
  singleImage: (ZodObject) => (req, res, next) => {
    try {
      if (!req.file) return next();

      req.file = ZodObject.parse(req.file);

      next();
    } catch (error) {
      if (error?.issues) {
        const message = error.issues[0].message;

        return Flash.fail(res, { status: HTTP_FAILED.BAD_REQUEST, message });
      }

      next(error);
    }
  },
};
