export {}; //forces the file to be treated as a module instead of a global script.

/**
 * run this command to extract keys in array.
 * node -e 'console.log(require("fs").readFileSync(".env","utf8").match(new RegExp("^[A-Z0-9_]+(?==)", "gm")))'
 *
 * replace the envs variable with new array of keys.
 *
 * or add manually */
const envs = [
  'DATABASE_URL',
  'BACKEND_URL',
  'REDIS_URL',
  'FRONTEND_URL',
  'STORAGE_PATH',
  'JWT_SECRET',
  'SALT_ROUNDS',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'REDIS_USERNAME',
  'REDIS_TLS_CA',
  'REDIS_TLS_CERT',
  'REDIS_TLS_KEY',
] as const;

type Envs = (typeof envs)[number];
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<Envs, string> {
      NODE_ENV: 'development' | 'production' | 'testing';
      STORAGE_PROVIDER: 'local' | 'cloudinary';
    }
  }
}
