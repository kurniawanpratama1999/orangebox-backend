import { compare, genSalt, hash } from "bcrypt";

export const Hash = {
  async make(plain_text) {
    const salt = await genSalt(10);
    return await hash(plain_text, salt);
  },

  async compare(data, hash) {
    return await compare(data, hash);
  },
};
