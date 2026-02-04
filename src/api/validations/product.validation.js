import z from "zod";

export const ProductValidation = {
  create: z.object({
    category_id: z.coerce.number(),
    name: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    is_favorite: z.coerce.boolean(),
    is_new: z.coerce.boolean(),
  }),

  update: z.object({
    category_id: z.coerce.number().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    price: z.coerce.number().nullable(),
    is_favorite: z.coerce.boolean().nullable(),
    is_new: z.coerce.boolean().nullable(),
  }),

  photo: z.object({
    originalname: z.string(),
    mimetype: z.string().startsWith("image"),
    buffer: z.instanceof(Buffer),
    size: z.number().max(1024 * 1024 * 10, "file image should less then 10mb"),
  }),
};
