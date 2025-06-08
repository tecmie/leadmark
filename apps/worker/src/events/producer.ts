import { FlowProducer, JobNode } from "bullmq";
import { postmanFlowProducer } from "./bullmq";
import { InboundMessageDetails } from "postmark/dist/client/models";
import { IMailboxWithIUser } from "@repo/types";

export interface EventProducerMQOptions {
  mailbox: IMailboxWithIUser;
  producer?: FlowProducer;
}

export enum PostmanEventMQName {
  VALIDATE = "ppmq-validate",
  PREPROCESS = "ppmq-preprocess",
  DISPATCH = "ppmq-dispatch",
}

export default class EventProducerMQ {
  producer: FlowProducer;
  mailbox: EventProducerMQOptions["mailbox"];

  /**
   * @constructs EventProducerMQ
   * @description Constructs a EventProducerMQ instance.
   */
  constructor({
    mailbox,
    producer = postmanFlowProducer,
  }: EventProducerMQOptions) {
    this.producer = producer;
    this.mailbox = mailbox;
  }

  /**
   * @method canProcessInboundQuery
   * @private
   * @description Checks if the mailbox is open or able to auto-respond to messages.
   * @returns {Boolean} True or false
   */

  private canProcessInboundQuery(): boolean {
    return this.mailbox.status === "active";
  }

  /**
   * @method postman
   * @public
   * @description The postman flow handles inbound workflow for messages via email
   * @param {InboundMessageDetails} payload - The payload received from our inbound mail processor.
   * @returns {Promise<undefined>} Returns a Promise which resolves when the job is added and the workflow is completed.
   * @example
   * await producer.postman(payload);
   */
  async postman(payload: InboundMessageDetails): Promise<JobNode | undefined> {
    try {
      if (!this.canProcessInboundQuery()) {
        throw new Error("Mailbox is not active");
      }

      return await this.producer.add({
        name: "POSTMAN_WEBHOOK_FINAL_JOB",
        queueName: PostmanEventMQName.DISPATCH,
        data: {}, // We use the data from children
        opts: { removeOnComplete: true, delay: 500 },
        children: [
          {
            name: PostmanEventMQName.PREPROCESS,
            data: {}, // use the data from job.getChildrenValues()
            queueName: PostmanEventMQName.PREPROCESS,
            opts: { removeOnComplete: true, failParentOnFailure: true },
            children: [
              {
                name: PostmanEventMQName.VALIDATE,
                data: { payload, mailbox: this.mailbox },
                queueName: PostmanEventMQName.VALIDATE,
                opts: { removeOnComplete: true, failParentOnFailure: true },
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error, "[EventProducerMQ.postman]");
    }
  }

  /**
   * @method dispatch
   * @public
   * @description Instantiates and returns a new DispatchOperator.
   * @returns {DispatchOperator} A new DispatchOperator instance.
   */
  unstable_dispatch() {
    return new Object();
  }
}
