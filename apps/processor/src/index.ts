import { createApp } from "./app";
import secrets from "./secrets";

async function startServer(): Promise<void> {
  try {
    const app = createApp();

    const server = app.listen(secrets.PORT, () => {
      console.log(`Server running on port ${secrets.PORT}`);
    });

    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);

      server.close(() => {
        console.log("HTTP server closed");
      });

      try {
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
