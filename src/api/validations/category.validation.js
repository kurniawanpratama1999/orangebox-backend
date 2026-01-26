import z from "zod";

export const CategoryValidation = {
  create: z.object({
    name: z.string(),
    description: z.string().nullable(),
  }),

  update: z.object({
    name: z.string().nullable(),
    description: z.string().nullable(),
  }),
};
