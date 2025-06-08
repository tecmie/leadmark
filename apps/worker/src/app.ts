import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { MessageResponse } from "~/interfaces/response.interface";
import api from "./api";
import * as middlewares from "./middlewares";

export function createApp(): express.Application {
  const app = express();

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", api);

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);

  app.get<{}, MessageResponse>("/", (_req, res) => {
    res.json({
      message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
    });
  });

  return app;
}
