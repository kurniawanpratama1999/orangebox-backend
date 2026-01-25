import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const appMiddleware = express();

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

appMiddleware.use(cookieParser());

appMiddleware.use(express.json());

appMiddleware.use(helmet());

// appMiddleware.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

appMiddleware.use(corsConfig);
