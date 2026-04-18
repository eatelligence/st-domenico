import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'libsql://localhost',
  authToken: process.env.TURSO_AUTH_TOKEN ?? '',
})
