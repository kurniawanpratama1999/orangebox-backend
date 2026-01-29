import { appRoutes } from "#app/index.js";
import { env } from "#config/env.js";

const port = env.server.port;

appRoutes.get("/home", (req, res) => {
  res.render("home");
});

appRoutes.listen(port, () => {
  console.log(`app running on: http://localhost:${port}/api`);
});
