import 'dotenv/config';
import app from './app';
import { appConfig } from '@config/app.config';
import { verifyMailer } from './config/mailer.config';

verifyMailer();

app.listen(appConfig.port, () => {
  console.log(`Server running on port ${appConfig.port}`);
});
