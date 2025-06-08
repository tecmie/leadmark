import EventQueue, { PgEventQueueType, WebhookEventQueueType } from './eventemitter';

// export const postmanWebhookEvent = new EventQueue(WebhookEventQueueType.PostmanMailInbound);
export const conversationKVStoreEvent = new EventQueue(PgEventQueueType.InsertMessage);
export const conversationVectorStoreEvent = new EventQueue(PgEventQueueType.InsertMessage);

/* derived exports */
export { default as EventQueueEmitter } from './eventemitter';
export { default as EventProducerMQ } from './producer';
export { default as EventConsumerMQ } from './consumer';
export { PostmanEventMQName } from './producer';
export type { EventProducerMQOptions } from './producer';

/* ------- consumer events from packages and features ---- */
export * from '~/services/postman/consumer';
