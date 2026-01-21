import { UserRoutes } from "#routes/user.routes.js";
import express from "express";
<<<<<<< HEAD

export const app = express();

=======
import cors from "cors";

export const app = express();

app.use(cors());

>>>>>>> riyan-branch
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", UserRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    success: false,
    code: "InternalServerError",
    data: null,
  });
});
