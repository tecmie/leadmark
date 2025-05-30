import { EventEmitter } from 'events';

export enum PgEventQueueType {
  InsertMessage = 'insert_new_message',
  UpdateMessage = 'update_message',
}

export enum WebhookEventQueueType {
  PostmanMailInbound = 'postman_mail_inbound',
  PostmanMailOutbound = 'postman_mail_outbound',
}

export class EventQueueEmitter {
  private emitter: EventEmitter;

  private eventName: string;

  constructor(eventName: string) {
    this.emitter = new EventEmitter();
    this.eventName = eventName;
  }

  /**
   * @function onQuery
   * @description Register a listener for the event
   * @param {Function} callback - The callback function to run when the event is emitted
   *
   * @example
   *
   * const myEvent = new EventQueue('eventName');
   *
   * myEvent.onQuery<TelegrafMessageContext>((ctx) => {
   *  // Handle the event, with access to the Telegram bot context
   * console.log('Event received:', ctx.message.text);
   * });
   */
  onQuery<T>(callback: (ctx: T) => void) {
    this.emitter.on(this.eventName, callback);
  }

  // Emit the event
  emit<T>(ctx: T) {
    this.emitter.emit(this.eventName, ctx);
  }
}

export default EventQueueEmitter;
