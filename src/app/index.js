import path from "path";
import { UserRoutes } from "#routes/user.routes.js";
import { AppError } from "#utils/AppError.js";
import { Flash } from "#utils/Flash.js";
import { AuthRoutes } from "#routes/auth.routes.js";
import { AuthMiddleware } from "#api/middlewares/AuthMiddleware.js";
import { appMiddleware as appRoutes } from "./middleware.js";
import { CategoryRoutes } from "#routes/category.routes.js";
import { SosmedRoutes } from "#routes/sosmed.routes.js";
import { FacilityRoutes } from "#routes/facility.routes.js";
import { TestimonyRoutes } from "#routes/testimony.routes.js";

appRoutes.get("/", (req, res) => {
  res.sendFile(path.resolve("README.md"));
});

appRoutes.use("/auth", AuthRoutes);

appRoutes.use("/user", AuthMiddleware, UserRoutes);

appRoutes.use("/category", CategoryRoutes);

appRoutes.use("/sosmed", SosmedRoutes);

appRoutes.use("/facility", FacilityRoutes);

appRoutes.use("/testimony", TestimonyRoutes);

appRoutes.use((err, req, res, next) => {
  const status = 500;
  const code = "InternalServerError";

  console.error(err);

  if (err instanceof AppError) {
    return Flash.fail(res, { status: err.status, code: err.message });
  }

  return Flash.fail(res, { status, code });
});

export { appRoutes };
