import express from "express";

const router = express.Router();

// GET /healthz - basic health check
router.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0"
  });
});

export default router;
