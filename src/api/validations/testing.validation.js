import z from "zod";

export const TestingValidation = {
  create: z.object({
    firstname: z.string("must be a text"),
    lastname: z.string("must be a text"),
    age: z.coerce.number("must be a number"),
  }),

  uploadImage: z.object({
    originalname: z.string(),
    mimetype: z.string().startsWith("image", "file should an image"),
    size: z
      .number()
      .max(1024 * 1024 * 10 * 2, "file image should less then 20 Mb"),
    buffer: z.instanceof(Buffer),
  }),
};
