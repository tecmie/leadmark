import express from "express";

import { MessageResponse } from "~/interfaces/response.interface";
import emojis from "./emojis";
import postman from "./postman";

const router: express.Router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/postman", postman);

export default router;
