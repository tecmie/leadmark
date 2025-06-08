import 'dotenv/config';

const secrets = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
  BULL_REDIS_URL: process.env.BULL_REDIS_URL || 'redis://localhost:6379',
  PORT: process.env.PORT || 3000,
};

type SecretObject = Record<keyof typeof secrets, string>;
export default secrets as SecretObject;
