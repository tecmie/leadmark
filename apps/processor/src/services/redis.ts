import Redis from 'ioredis';
import { config } from '../config/env';

class RedisService {
  private static instance: RedisService;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.client.on('close', () => {
      console.log('Redis connection closed');
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  public async connect(): Promise<void> {
    if (this.client.status !== 'ready') {
      await this.client.connect();
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

export default RedisService;