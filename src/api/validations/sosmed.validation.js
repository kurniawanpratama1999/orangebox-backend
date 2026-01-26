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
};
