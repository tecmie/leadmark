import IORedis from 'ioredis';
import secrets from '../secrets';

const __CONNECTION_URL__ = secrets.BULL_REDIS_URL;
export const ioRedisConnection = new IORedis(__CONNECTION_URL__, { maxRetriesPerRequest: null });
