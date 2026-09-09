// Shared Neon connection for all server-side API handlers.
import { neon } from '@neondatabase/serverless';

let _sql = null;

/** Returns a tagged-template SQL function, or throws if DATABASE_URL is unset. */
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  if (!_sql) _sql = neon(url);
  return _sql;
}

export function hasDb() {
  return Boolean(process.env.DATABASE_URL);
}
