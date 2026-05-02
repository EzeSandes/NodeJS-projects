import { env as loadEnv } from 'custom-env';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTesting = process.env.NODE_ENV === 'test';

if (isDevelopment) {
  loadEnv();
} else if (isTesting) {
  loadEnv('test');
}

let env = process.env;

export const isProd = () => env.NODE_ENV === 'production';
export const isDev = () => env.NODE_ENV === 'development';
export const isTest = () => env.NODE_ENV === 'test';

export { env };
export default env;
