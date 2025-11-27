import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get DATABASE_URL, fallback to POSTGRES_URL for compatibility
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable must be set');
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
