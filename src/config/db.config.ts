import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_HOST) throw new Error('DATABASE_HOST missing');
if (!process.env.DATABASE_USER) throw new Error('DATABASE_USER missing');
if (!process.env.DATABASE_PASSWORD) throw new Error('DATABASE_PASSWORD missing');
if (!process.env.DATABASE_NAME) throw new Error('DATABASE_NAME missing');

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT) || 3306,
  connectionLimit: 15,
});

const isProduction = process.env.NODE_ENV === 'production';

const prisma = new PrismaClient({
  adapter,
  log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
});

export { prisma };
