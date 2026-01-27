# OrangeBox Backend (Express.js)

Backend service untuk mendukung frontend **Profile UMKM OrangeBox**.
Dibangun menggunakan **Express.js** sebagai web framework dan **Prisma ORM** sebagai database layer.

Project ini dirancang dengan arsitektur yang **sederhana, konsisten, dan mudah dikolaborasikan**, mengikuti praktik backend industri namun tetap realistis untuk tim kecil.

---

## Tech Stack

- Node.js (ESM)
- Express.js
- Prisma ORM
- MySQL
- Zod (Request Validation)

---

## Arsitektur Aplikasi

Aplikasi ini **tidak menaruh business logic di Controller**.
Controller hanya bertugas menerima request dan mengirim response.

Alur data:

```
Route → Controller → Service → Prisma → Database
```

### Kenapa tidak ada Repository & Model?

Pada arsitektur klasik:

```
Controller → Service → Repository → Model → Database
```

Namun karena menggunakan **Prisma ORM**:

- Model sudah didefinisikan di `schema.prisma`
- Query database ditangani langsung oleh Prisma Client

Sehingga layer **Repository & Model tidak diperlukan**.

---

## Struktur Folder

```
DIR/
│
├── node_modules/
├── prisma/
├── src/
│    ├── api/
│    │    ├── controllers/      # kirim response success
│    │    ├── middlewares/      # custom middlewares
│    │    ├── services/         # bisnis logic
│    │    └── validation/       # zod schema
│    │
│    ├── app/
│    │    ├── index.js          # app setup & global error handler
│    │    └── middleware.js     # app middlware seperti cors
│    │
│    ├── config/                # pengaturan env dalam bentuk object
│    ├── orm/                   # genereted prisma
│    ├── routes/                # routing API
│    ├── seeder/                # bantuan untuk isi database di awal aplikasi
│    └── utils/                 # kumpulan alat untuk konsistensi kode
│
└── .env                        # awas jangan di up ke github
```

---

## Standard Response (Flash)

Semua response API menggunakan format yang konsisten melalui **Flash Helper**.

### HTTP Status Code

```js
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
```

### Flash Helper

```js
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
```

---

## Error Handling (AppError)

Digunakan `AppError` untuk melempar error business logic secara konsisten.

```js
export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
```

Semua error **wajib dilempar dari Service**, bukan langsung di Controller.

---

## Contoh Implementasi

### Service

```js
const showById = async (user_id) => {
  if (!user_id) {
    throw new AppError("UserIdNotFound", HTTP_FAILED.NOT_FOUND);
  }

  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw new AppError("UserNotFound", HTTP_FAILED.NOT_FOUND);
  }

  return user;
};
```

### Controller

```js
const showUser = async (req, res, next) => {
  try {
    const user = await showById(req.params.id);

    return Flash.success(res, {
      status: HTTP_SUCCESS.OK,
      code: "GetUserIsSuccess",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Global Error Handler

Semua error ditangani di satu tempat.

```js
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return Flash.fail(res, {
      status: err.status,
      code: err.message,
    });
  }

  return Flash.fail(res, {
    status: HTTP_FAILED.INTERNAL_SERVER_ERROR,
    code: "InternalServerError",
  });
});
```

---

## Handling Prisma Error

Prisma memiliki error code khusus (contoh: `P2002`, `P2025`).
Agar tetap konsisten, digunakan helper berikut:

```js
export const HandlePrismaError = (error, map) => {
  if (error?.code && map[error.code]) {
    return new AppError(map[error.code].code, map[error.code].status);
  }

  return new AppError("InternalServerError", HTTP_FAILED.UNPROCESSABLE_ENTITY);
};
```

### Contoh

```js
try {
  // prisma logic
} catch (error) {
  throw HandlePrismaError(error, {
    P2002: {
      code: "UsernameAlreadyExist",
      status: HTTP_FAILED.BAD_REQUEST,
    },
    P2025: {
      code: "UserNotFound",
      status: HTTP_FAILED.NOT_FOUND,
    },
  });
}
```

---

## Validation (Zod Middleware)

Semua input divalidasi sebelum masuk ke Controller.

```js
export const ZodMiddleware = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return Flash.fail(res, {
        status: HTTP_FAILED.BAD_REQUEST,
        code: "InvalidInput",
        error: error.flatten(),
      });
    }
    next(error);
  }
};
```

---

## Routing Convention

Routing mengikuti gaya RESTful.

```js
router.get("/", Controller.index);
router.get("/:id", Controller.show);
router.post("/", Controller.create);
router.put("/:id", Controller.update);
router.patch("/:id/password", Controller.updatePassword);
router.delete("/:id", Controller.destroy);
```

---

## Template Controller & Service

### Controller

```js
export const Controller = {
  async index() {},
  async show() {},
  async create() {},
  async update() {},
  async destroy() {},
};
```

### Service

```js
export const Service = {
  async index() {},
  async show() {},
  async create() {},
  async update() {},
  async destroy() {},
};
```

_Last updated: 26 Januari 2026_

---

## Kumpulan Public API

diperlukan oleh frontend untuk customer tanpa perlu access token dan refresh token

### Base URL

tanpa versioning, dipakai untuk semua

```
http://localhost:3001/api
```

---

## Autentikasi

untuk menandai user yang sudah login, dan membuat access token dalam mengakses url

### 1. Login

- Endpoint

  ```
  POST: /auth/login
  ```

- Fetch Api

  ```json
  {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "credentials": "include"
    },
    "body": {
      "username": "_string_",
      "password": "_string_"
    }
  }
  ```

- Response

  ```json
  // 201: CREATED

  {
    "success": true,
    "code": "LoginSuccess",
    "data": "<AccessToken>"
  }


  // 400: BAD REQUEST

  {
    "success": false,
    "code": "WrongUsernameOrPassword",
    "data": null
  }
  ```

### 2. Refresh Token

- Endpoint

  ```
  POST: /auth/refresh
  ```

- Fetch Api

  ```json
  {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    }
  }
  ```

- Response

  ```json
  // 201: CREATED

  {
    "success": true,
    "code": "NewAccessCreated",
    "data": "<NEW_TOKEN>"
  }


  // 401: UNAUTHORIZED | Butuh RefreshToken

  {
    "success": false,
    "code": "CredentialNotFound",
    "data": null
  }
  ```

---

## Indexing Data untuk Frontend

- Fetch API

  ```json
  {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    }
  }
  ```

### # Sosial Media

- Endpoint

  ```
  GET: /sosmed
  ```

- Response

  ```json
  // 202: ACCEPTED

  {
    "success": true,
    "code": "GetSosmedsIsSuccess",
    "data": [
      {
        "id": "integer",
        "name": "string",
        "description": "string",
        "link": "string"
      }
      // _next records_ //
    ]
  }
  ```

### # Fasilitas dan Tempat

- Endpoint

  ```
  GET: /facility
  ```

- Response

  ```json
  // 202: ACCEPTED

  {
    "success": true,
    "code": "GetFacilitiesIsSuccess",
    "data": [
      {
        "id": "integer",
        "name": "string",
        "photo": "string"
      }
      // _next records_ //
    ]
  }
  ```

### # Kategori Produk

- Endpoint

  ```
  GET: /category
  ```

- Response

  ```json
  // 202: ACCEPTED

  {
    "success": true,
    "code": "GetCategoriesIsSuccess",
    "data": [
      {
        "id": "integer",
        "name": "string",
        "description": "string"
      }
      // _next records_ //
    ]
  }
  ```

### # Kumpulan Produk

- Endpoint

  ```
  GET: /product
  ```

- Response

  ```json
  // 202: ACCEPTED

  {
    "success": true,
    "code": "GetProductsIsSuccess",
    "data": [
      {
        "id": "integer",
        "category_id": "integer",
        "category_name": "string",
        "photo": "string",
        "name": "string",
        "description": "string",
        "price": "decimal",
        "is_favorite": "boolean",
        "is_new": "boolean",
        "created_at": "date",
        "updated_at": "date"
      }
      // _next records_ //
    ]
  }
  ```

### # Testimoni

- Endpoint

  ```
  GET: /testimony
  ```

- Response

  ```json
  // 202: ACCEPTED

  {
    "success": true,
    "code": "GetFacilitiesIsSuccess",
    "data": [
      {
        "id": "integer",
        "name": "string",
        "photo": "string",
        "description": "string"
      }
      // _next records_ //
    ]
  }
  ```

### # Content

- Endpoint

  ```
  GET: /content
  ```

- Response

  ```json
  // 202: ACCEPTED

  {
    "success": true,
    "code": "GetContentIsSuccess",
    "data": [
      {
        "id": "integer",
        "umkm_name": "String",
        "umkm_address": "String",

        "hero_photo": "String",
        "hero_headline": "String",
        "hero_subheadline": "String",
        "hero_description": "String",

        "favorite_title": "String",
        "favorite_information": "String",
        "favorite_max_product": "Int",

        "facility_title": "String",
        "facility_information": "String",

        "cta_title": "String",
        "cta_button": "String",
        "cta_link_id": "Int",

        "testimoni_title": "String",
        "testimoni_information": "String",

        "location_photo": "String",
        "location_title": "String",
        "location_maps": "String",
        "location_button": "String",
        "location_link_id": "Int"
      }
      // _next records_ //
    ]
  }
  ```

_Last updated: 27 Januari 2026_

## Notes

- Semua logic **wajib di Service**
- Controller **tidak boleh query database**
- Response **wajib menggunakan Flash**
- Error **wajib menggunakan AppError**

---
