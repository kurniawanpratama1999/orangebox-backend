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
import { ContentRoutes } from "#routes/content.routes.js";

appRoutes.get("/api", (req, res) => {
  res.sendFile(path.resolve("README.md"));
});

appRoutes.use("/api/auth", AuthRoutes);

appRoutes.use("/api/user", AuthMiddleware, UserRoutes);

appRoutes.use("/api/category", CategoryRoutes);

appRoutes.use("/api/sosmed", SosmedRoutes);

appRoutes.use("/api/facility", FacilityRoutes);

appRoutes.use("/api/testimony", TestimonyRoutes);

appRoutes.use("/api/content", ContentRoutes);

appRoutes.use((err, req, res, next) => {
  const status = 500;
  const code = "InternalServerError";

  if (err instanceof AppError) {
    return Flash.fail(res, { status: err.status, code: err.message });
  }

  return Flash.fail(res, { status, code });
});

export { appRoutes };
