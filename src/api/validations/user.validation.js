import z from "zod";

export const UserValidation = {
  create: z.object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
  }),

  update: z.object({
    name: z.string(),
    username: z.string(),
  }),

  updatePassword: z.object({
    password: z.string(),
    password_confirmation: z.string(),
  }),
};
