import "dotenv/config";

export const env = {
  database: {
    name: process.env.DATABASE_NAME ?? "",
    host: process.env.DATABASE_HOST ?? "",
    user: process.env.DATABASE_USER ?? "",
    password: process.env.DATABASE_PASSWORD ?? "",
    port: process.env.DATABASE_PORT ?? "",
    url: process.env.DATABASE_URL ?? "",
  },

  server: {
    port: process.env.SERVER_PORT ?? 3000,
  },

  token: {
    refresh: process.env.REFRESH_TOKEN,
    access: process.env.ACCESS_TOKEN,
  },
};
