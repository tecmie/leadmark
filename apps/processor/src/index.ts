import { createApp } from './app';
import secrets from './secrets';
import RedisService from './services/redis';
import WorkerService from './services/worker';

async function startServer(): Promise<void> {
  try {
    const redisService = RedisService.getInstance();
    await redisService.connect();

    const workerService = WorkerService.getInstance();

    const app = createApp();

    const server = app.listen(secrets.PORT, () => {
      console.log(`Server running on port ${secrets.PORT}`);
      console.log(`Redis connected to ${secrets.BULL_REDIS_URL}`);
      console.log(`Worker started and listening for jobs`);
    });

    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed');
      });

      try {
        await workerService.close();
        console.log('Worker closed');
        
        await redisService.disconnect();
        console.log('Redis disconnected');
        
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();