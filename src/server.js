import { app } from "#app/index.js";
import { env } from "#config/env.js";

const port = env.server.port;
app.listen(port, () => {
  console.log(`app running on: http://localhost:${port}`);
});
