import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { morganMiddleware } from "./config/morgan.config";
import { appConfig } from "./config/app.config";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morganMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: true, message: "Server is running", data: null });
});

app.use(appConfig.apiPrefix!, router);
app.use(errorHandler);

export default app;
