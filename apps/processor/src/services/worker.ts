import { Worker } from 'bullmq';
import RedisService from './redis';
import { processJob } from '../processors';

class WorkerService {
  private static instance: WorkerService;
  private worker: Worker;

  private constructor() {
    const redisService = RedisService.getInstance();
    
    this.worker = new Worker('processing', processJob, {
      connection: redisService.getClient(),
      concurrency: 5,
      removeOnComplete: 100,
      removeOnFail: 50,
    });

    this.setupEventListeners();
  }

  public static getInstance(): WorkerService {
    if (!WorkerService.instance) {
      WorkerService.instance = new WorkerService();
    }
    return WorkerService.instance;
  }

  private setupEventListeners(): void {
    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      console.log(`Job ${job?.id} failed:`, err.message);
    });

    this.worker.on('error', (err) => {
      console.error('Worker error:', err);
    });

    this.worker.on('stalled', (jobId) => {
      console.warn(`Job ${jobId} stalled`);
    });
  }

  public getWorker(): Worker {
    return this.worker;
  }

  public async close(): Promise<void> {
    await this.worker.close();
  }
}

export default WorkerService;