import { ContentService } from "#api/services/content.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const ContentController = {
  async index(req, res, next) {
    try {
      const contents = await ContentService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetContentsIsSuccess",
        data: contents,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const body = req.body;

      const updateContent = await ContentService.update(body);

      return Flash.success(res, {
        status: "UpdateContentIsSuccess",
        code: HTTP_SUCCESS.OK,
        data: updateContent,
      });
    } catch (e) {
      next(e);
    }
  },
};
