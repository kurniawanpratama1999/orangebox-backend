import z from "zod";

export const ProductValidation = {
  create: z.object({
    category_id: z.number(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    is_favorite: z.boolean(),
    is_new: z.boolean(),
  }),

  update: z.object({
    category_id: z.number().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    price: z.number().nullable(),
    is_favorite: z.boolean().nullable(),
    is_new: z.boolean().nullable(),
  }),

  photo: z.object({
    originalname: z.string(),
    mimetype: z.string().startsWith("image"),
    buffer: z.instanceof(Buffer),
    size: z.number().max(1024 * 1024 * 10, "file image should less then 10mb"),
  }),
};
