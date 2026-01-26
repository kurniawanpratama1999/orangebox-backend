import { appRoutes } from "#app/index.js";
import { env } from "#config/env.js";
import express from "express";

const app = express();
const port = env.server.port;

app.use("/api", appRoutes);

app.get("/home", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`app running on: http://localhost:${port}`);
});
