import z from "zod";

export const TestimonyValidation = {
  create: z.object({
    name: z.string(),
    photo: z.string(),
    description: z.string(),
  }),

  update: z.object({
    name: z.string().nullable(),
    photo: z.string().nullable(),
    description: z.string().nullable(),
  }),
};
