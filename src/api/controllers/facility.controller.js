import { FacilityService } from "#api/services/facility.service.js";
import { Flash, HTTP_SUCCESS } from "#utils/Flash.js";

export const FacilityController = {
  async index(req, res, next) {
    try {
      const facilities = await FacilityService.index();

      return Flash.success(res, {
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetFacilitiesIsSuccess",
        data: facilities,
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
        status: HTTP_SUCCESS.ACCEPTED,
        code: "GetFacilityIsSuccess",
        data: facilityById,
      });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const body = req.body;

      const createFacility = await FacilityService.create({
        name: body.name,
        photo: body.photo,
      });

      return Flash.success(res, {
        status: "NewFacilityIsCreated",
        code: HTTP_SUCCESS.CREATED,
        data: createFacility,
      });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const id = req.params.id;

      const body = req.body;

      const updateFacilityById = await FacilityService.update(id, {
        name: body.name,
        photo: body.photo,
      });

      return Flash.success(res, {
        status: "UpdateFacilityIsSuccess",
        code: HTTP_SUCCESS.OK,
        data: updateFacilityById,
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
        status: "FacilityIsDeleted",
        code: HTTP_SUCCESS.NO_CONTENT,
      });
    } catch (e) {
      next(e);
    }
  },
};
