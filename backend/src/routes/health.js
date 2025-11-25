import express from "express";
import os from "os";
const router = express.Router();

router.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    "app version": "1.0",
    'node version': process.version,
    hostname: os.hostname(),
  });
});

export default router;