export default Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  ADDRESS: process.env.ADDRESS ?? '127.0.0.1',
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  DATABASE_PROTOCOL: process.env.DATABASE_PROTOCOL ?? '',
  DATABASE_USER: process.env.DATABASE_USER ?? '',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? '',
  DATABASE_HOST: process.env.DATABASE_HOST ?? '',
  DATABASE_PORT: process.env.DATABASE_PORT ?? '',
  DATABASE_NAME: process.env.DATABASE_NAME ?? '',
  DATABASE_SSL_MODE: process.env.DATABASE_SSL_MODE ?? 'prefer',
});
