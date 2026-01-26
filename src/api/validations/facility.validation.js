import z from "zod";

export const FacilityValidation = {
  create: z.object({
    name: z.string(),
    photo: z.string(),
  }),

  update: z.object({
    name: z.string().nullable(),
    photo: z.string().nullable(),
  }),
};
