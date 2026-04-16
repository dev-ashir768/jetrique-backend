import "dotenv/config";
import app from "./app";
import { appConfig } from "@config/app.config";

app.listen(appConfig.port, () => {
  console.log(`Server running on port ${appConfig.port}`);
});