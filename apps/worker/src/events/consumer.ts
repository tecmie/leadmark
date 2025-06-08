import { Worker, Job, JobProgress } from 'bullmq';
import { FLOW_KEY_PREFIX } from './bullmq';
import { ioRedisConnection as connection } from '../db/ioredis';

interface ConsumerOptions {
  queueName: string;
  autoRun?: boolean;
  callback: (job: Job) => Promise<any>;
}

export default class Consumer {
  private worker: Worker;

  constructor({ queueName, callback, autoRun = false }: ConsumerOptions) {
    this.worker = new Worker(queueName, callback, { autorun: autoRun, connection, prefix: FLOW_KEY_PREFIX });

    this.worker.on('completed', (job: Job, returnValue: any) => {
      console.log(`[${queueName} Job ${job.id}] -- complete value:`, returnValue);
    });

    this.worker.on('progress', (job: Job, progress: JobProgress) => {
      console.log(`[${queueName} Job ${job.id}] -- progress: ${progress}`);
    });


    this.worker.on('failed', (job: any, error: Error) => {
      console.error(`[${queueName} Job ${job.id}] -- failed with error ${error.message}`);
    });
  }

  run() {
    this.worker.run();
  }
}
