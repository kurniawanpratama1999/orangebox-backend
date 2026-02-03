import z from "zod";

export const FacilityValidation = {
  create: z.object({
    name: z.string(),
  }),

  update: z.object({
    name: z.string().nullable(),
  }),

  photo: z.object({
    originalname: z.string(),
    mimetype: z.string().startsWith("image"),
    buffer: z.instanceof(Buffer),
    size: z.number().max(1024 * 1024 * 10, "file image should less then 10mb"),
  }),
};
