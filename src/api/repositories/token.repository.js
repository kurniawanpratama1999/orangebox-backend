import { prisma } from "#orm/lib/prisma.js";

export const TokenRepository = {
  async findById(jti) {
    return prisma.tokens.findUnique({ where: { id: jti } });
  },

  async create(jti, hashToken, user_id) {
    return prisma.tokens.create({
      data: { id: jti, token: hashToken, user_id },
    });
  },

  async update(jti, hashToken) {
    return prisma.tokens.update({
      data: { id: jti, token: hashToken },
      where: { id: jti },
    });
  },

  async destroy(jti) {
    return prisma.tokens.delete({ where: { id: jti } });
  },
};
