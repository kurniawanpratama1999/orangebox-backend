import "dotenv/config";

export const env = {
  database: {
    name: process.env.DB_NAME ?? "",
    host: process.env.DB_HOST ?? "",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASS ?? "",
    port: process.env.DB_PORT ?? "",
    url: process.env.DB_URL ?? "",
  },

  server: {
    port: process.env.SERVER_PORT ?? 3000,
  },

  token: {
    refresh: process.env.REFRESH_TOKEN,
    access: process.env.ACCESS_TOKEN,
  },
};
