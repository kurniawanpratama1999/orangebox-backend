import { UserRoutes } from "#routes/user.routes.js";
import { AppError } from "#utils/AppError.js";
import { Flash } from "#utils/Flash.js";
import { AuthRoutes } from "#routes/auth.routes.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { appMiddleware as appRoutes } from "./middleware.js";

appRoutes.get("/", (req, res) => {
  res.send("Hello World");
});

appRoutes.use("/auth", AuthRoutes);

appRoutes.use("/user", AuthMiddleware, UserRoutes);

appRoutes.use((err, req, res, next) => {
  const status = 500;
  const code = "InternalServerError";

  if (err instanceof AppError) {
    return Flash.fail(res, { status: err.status, code: err.message });
  }

  return Flash.fail(res, { status, code });
});

export { appRoutes };
