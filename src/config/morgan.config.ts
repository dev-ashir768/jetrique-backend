import morgan from 'morgan';
import { logger } from '@config/logger.config';

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] bytes - :response-time ms',
  {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  },
);
