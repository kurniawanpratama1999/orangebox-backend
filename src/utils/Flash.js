export const HTTP_FAILED = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export const HTTP_SUCCESS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

export const Flash = {
  success(res, { status, code, data }) {
    return res.status(status).send({
      success: true,
      code,
      data,
    });
  },

  fail(res, { status, code, error = null }) {
    return res.status(status).send({
      success: false,
      code,
      data: null,
      error,
    });
  },
};
