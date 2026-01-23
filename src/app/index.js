import express from "express";
import cors from "cors";

import { UserRoutes } from "#routes/user.routes.js";
import { AppError } from "#utils/AppError.js";
import { Flash } from "#utils/Flash.js";
import { AuthRoutes } from "#routes/auth.routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";

export const app = express();

const corsConfig = cors({
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "content-type",
    "Authorization",
    "authorization",
    "X-Url",
    "x-url",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  origin: ["http://localhost:5173"],
});

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
// app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
app.use(corsConfig);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", AuthRoutes);

app.use("/user", AuthMiddleware, UserRoutes);

app.use((err, req, res, next) => {
  const status = 500;
  const code = "InternalServerError";

  if (err instanceof AppError) {
    return Flash.fail(res, { status: err.status, code: err.message });
  }

  return Flash.fail(res, { status, code });
});
