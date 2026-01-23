import z from "zod";

export const AuthValidation = {
  login: z.object({
    username: z.string(),
    password: z.string(),
  }),
};
