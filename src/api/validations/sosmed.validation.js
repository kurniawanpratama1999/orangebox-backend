import z from "zod";

export const SosmedValidation = {
  create: z.object({
    name: z.string(),
    description: z.string(),
    link: z.string(),
  }),

  update: z.object({
    name: z.string().nullable(),
    description: z.string().nullable(),
    link: z.string().nullable(),
  }),

  photo: z.object({
    originalname: z.string(),
    mimetype: z.string().startsWith("image"),
    buffer: z.instanceof(Buffer),
    size: z.number().max(1024 * 1024 * 10, "file image should less then 10mb"),
  }),
};
