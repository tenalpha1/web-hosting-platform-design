import 'server-only'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let client: NeonQueryFunction<false, false> | null = null
let schemaReady: Promise<void> | null = null

function getClient() {
  if (!client) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error('DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables.')
    }
    client = neon(url)
  }
  return client
}

/**
 * Creates the Cloudnest tables the first time they're needed.
 * Safe to run repeatedly — every statement uses IF NOT EXISTS.
 */
async function ensureSchema() {
  const sql = getClient()
  await sql`
    CREATE TABLE IF NOT EXISTS cloudnest_users (
      id             SERIAL PRIMARY KEY,
      name           TEXT        NOT NULL,
      email          TEXT        NOT NULL UNIQUE,
      password_hash  TEXT        NOT NULL,
      plan           TEXT        NOT NULL DEFAULT 'starter',
      billing        TEXT        NOT NULL DEFAULT 'yearly',
      desired_domain TEXT,
      status         TEXT        NOT NULL DEFAULT 'pending',
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  await sql`
    CREATE TABLE IF NOT EXISTS cloudnest_sessions (
      token_hash TEXT        PRIMARY KEY,
      user_id    INTEGER     NOT NULL REFERENCES cloudnest_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  await sql`CREATE INDEX IF NOT EXISTS cloudnest_sessions_user_idx ON cloudnest_sessions (user_id)`
}

/** Returns the database client, making sure the tables exist first. */
export async function db() {
  if (!schemaReady) {
    schemaReady = ensureSchema().catch((error) => {
      schemaReady = null
      throw error
    })
  }
  await schemaReady
  return getClient()
}
