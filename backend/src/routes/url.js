import express from "express";
import { pool } from "../db.js";
import { generateCode } from "../utils/generateCode.js";
import { nanoid } from "nanoid";

const router = express.Router();

// GET /:code - redirect to long URL
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const pattern = /^[A-Za-z0-9]{6,8}$/;
    if (!pattern.test(code)) {
      return res.status(404).send("Short link Not found");
    }
    // Find target URL
    const result = await pool.query(
      "SELECT target_url FROM links WHERE short_code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Short link not found");
    }

    const target = result.rows[0].target_url;

    // Update click_count + last_clicked_at
    await pool.query(
      `UPDATE links
       SET click_count = click_count + 1,
           last_clicked_at = NOW()
       WHERE short_code = $1`,
      [code]
    );

    // Redirect (302 Found)
    return res.redirect(302, target);

  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).send("Server error");
  }
});

router.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0"
  });
});


export default router;
