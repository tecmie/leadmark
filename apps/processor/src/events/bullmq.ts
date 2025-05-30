import { FlowProducer } from 'bullmq';
import { ioRedisConnection } from '../db/ioredis';

export const FLOW_KEY_PREFIX = '__postman_prd_';

/**
 * @class FlowProducer
 * When our Redis is offline, we can use enableOfflineQueue to return a 500
 * @see https://docs.bullmq.io/patterns/failing-fast-when-redis-is-down
 */
export const postmanFlowProducer = new FlowProducer({
  connection: Object.assign(ioRedisConnection, { enableOfflineQueue: false }),
  prefix: FLOW_KEY_PREFIX,
});
