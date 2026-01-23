import { prisma } from "#orm/lib/prisma.js";

export const UserRepository = {
  /* ========= DEFAULT FUNCTION ========= */

  async index() {
    // tanpa password
    return await prisma.users.findMany({ omit: { password: true } });
  },

  async show(id) {
    // tanpa password
    return await prisma.users.findUnique({
      where: { id },
      omit: { password: true },
    });
  },

  async create({ name, username, password }) {
    // sembunyikan password
    return await prisma.users.create({
      data: { name, username, password },
      omit: { password: true },
    });
  },

  async update(id, { name, username }) {
    // sembunyikan password
    return await prisma.users.update({
      where: { id },
      data: { name, username },
      omit: { password: true },
    });
  },
  async destroy(id) {
    // kasih tau usernamenya aja
    return await prisma.users.delete({ where: { id }, select: { username } });
  },

  /* ========= ADJUST FUNCTION ========= */

  async showByUsername(username) {
    // untuk verifikasi login
    return await prisma.users.findUnique({
      include: { tokens: true },
      where: { username },
    });
  },

  async updatePassword(id, { password }) {
    // hanya untuk update password
    // tapi sembunyikan passwordnya
    return await prisma.users.update({
      where: { id },
      data: { password },
      omit: { password: true },
    });
  },
};
