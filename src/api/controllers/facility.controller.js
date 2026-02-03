import { FacilityService } from "#api/services/facility.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const FacilityController = {
  async index(req, res, next) {
    try {
      const facilities = await FacilityService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get all facility",
        results: facilities,
      });
    } catch (e) {
      next(e);
    }
  },

  async show(req, res, next) {
    try {
      const id = req.params.id;

      const facilityById = await FacilityService.show(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "get facility",
        results: facilityById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const createFacility = await FacilityService.create(req.body, req.file);

      return Flash.success(res, {
        status: HTTP_SUCCESS.CREATED,
        message: "facility created",
        results: createFacility,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const updateFacilityById = await FacilityService.update(
        id,
        req.body,
        req.file,
      );

      return Flash.success(res, {
        status: HTTP_SUCCESS.OK,
        message: "facility updated",
        results: updateFacilityById,
      });
    } catch (e) {
      next(e);
    }
  },

  async destroy(req, res, next) {
    try {
      const id = req.params.id;

      await FacilityService.destroy(id);

      return Flash.success(res, {
        status: HTTP_SUCCESS.NO_CONTENT,
        message: "facility deleted",
      });
    } catch (e) {
      next(e);
    }
  },
};
