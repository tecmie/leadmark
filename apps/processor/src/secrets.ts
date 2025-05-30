import 'dotenv/config';

const secrets = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  VECTOR_DB_DIR: process.env.VECTOR_DB_DIR,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
  MONGO_URI: process.env.MONGO_URI,
  BULL_REDIS_URL: process.env.BULL_REDIS_URL || 'redis://localhost:6379',
  UNSTRUCTURED_API_KEY: process.env.UNSTRUCTURED_API_KEY,
  PORT: process.env.PORT || 3000,
};

type SecretObject = Record<keyof typeof secrets, string>;
export default secrets as SecretObject;
