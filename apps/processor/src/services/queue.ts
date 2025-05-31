import { Queue, Job } from 'bullmq';
import RedisService from './redis';
import { JobData, JobType } from '../interfaces/job';

class QueueService {
  private static instance: QueueService;
  private queue: Queue;

  private constructor() {
    const redisService = RedisService.getInstance();
    this.queue = new Queue('processing', {
      connection: redisService.getClient(),
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  public async addJob(type: JobType, data: JobData): Promise<Job> {
    const job = await this.queue.add(type, data, {
      priority: this.getPriority(type),
    });
    return job;
  }

  public async getJob(jobId: string): Promise<Job | undefined> {
    return await this.queue.getJob(jobId);
  }

  public async getWaiting(): Promise<Job[]> {
    return await this.queue.getWaiting();
  }

  public async getActive(): Promise<Job[]> {
    return await this.queue.getActive();
  }

  public async getCompleted(): Promise<Job[]> {
    return await this.queue.getCompleted();
  }

  public async getFailed(): Promise<Job[]> {
    return await this.queue.getFailed();
  }

  public getQueue(): Queue {
    return this.queue;
  }

  private getPriority(type: JobType): number {
    const priorities = {
      email: 1,
      'data-processing': 2,
      default: 3,
    };
    return priorities[type] || priorities.default;
  }

  public async close(): Promise<void> {
    await this.queue.close();
  }
}

export default QueueService;