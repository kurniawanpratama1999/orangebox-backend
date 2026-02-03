import { ContentService } from "#api/services/content.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const ContentController = {
  async index(req, res, next) {
    try {
      const contents = await ContentService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get content is success",
        results: contents,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const updateContent = await ContentService.update(req.body, req.files);

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "content updated",
        results: updateContent,
      });
    } catch (e) {
      next(e);
    }
  },
};
