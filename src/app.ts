import express, { Response, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';
import { morganMiddleware } from './config/morgan.config';
import { appConfig } from './config/app.config';
import { sendError } from './utils/response.util';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morganMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: true, message: 'Server is running', data: null });
});

app.use(appConfig.apiPrefix!, router);

// Catch 404 routes
app.use((req: Request, res: Response) => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
});

// Global error handler
app.use(errorHandler);

export default app;
