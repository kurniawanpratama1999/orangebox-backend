import express from "express";
import cors from "cors";

import { UserRoutes } from "#routes/user.routes.js";
import { AppError } from "#utils/AppError.js";
import { Flash } from "#utils/Flash.js";

export const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", UserRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  const status = 500;
  const code = "InternalServerError";

  if (err instanceof AppError) {
    return Flash.fail(res, { status: err.status, code: err.message });
  }

  return Flash.fail(res, { status, code });
});
