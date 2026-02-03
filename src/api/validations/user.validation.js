import z from "zod";

export const UserValidation = {
  create: z.object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
  }),

  update: z.object({
    name: z.string().nullable(),
    username: z.string().nullable(),
  }),

  updatePassword: z.object({
    password: z.string(),
    password_confirmation: z.string(),
  }),

  photo: z.object({
    originalname: z.string(),
    mimetype: z.string().startsWith("image"),
    buffer: z.instanceof(Buffer),
    size: z.number().max(1024 * 1024 * 10, "file image should less then 10mb"),
  }),
};
