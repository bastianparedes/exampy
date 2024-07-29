import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import * as schema from './schema';

const DATABASE_PROTOCOL = process.env['DATABASE_PROTOCOL'] ?? '';
const DATABASE_USER = process.env['DATABASE_USER'] ?? '';
const DATABASE_PASSWORD = process.env['DATABASE_PASSWORD'] ?? '';
const DATABASE_HOST = process.env['DATABASE_HOST'] ?? '';
const DATABASE_PORT = process.env['DATABASE_PORT'] ?? '';
const DATABASE_NAME = process.env['DATABASE_NAME'] ?? '';
const DATABASE_SSL_MODE = process.env['DATABASE_SSL_MODE'] ?? '';
const URI = `${DATABASE_PROTOCOL}://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?sslmode=${DATABASE_SSL_MODE}`;

const client = new Client({
  connectionString: URI,
});

client.connect();
const db = drizzle(client, { schema });

export default db;
