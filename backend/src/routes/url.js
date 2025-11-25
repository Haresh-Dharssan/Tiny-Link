import express from "express";
import { pool } from "../db.js";
import { generateCode } from "../utils/generateCode.js";
import { nanoid } from "nanoid";

const router = express.Router();

// GET /:code - redirect to long URL
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

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

router.get("/code/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      `SELECT id, short_code, target_url, click_count, last_clicked_at, created_at
       FROM links
       WHERE short_code = $1`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json({ ok: true, data: result.rows[0] });

  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /shorten - create a short link
router.post("/shorten", async (req, res) => {
  try {
    const { url, customCode, ownerId = null } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Malformed URL" });
    }

    const code = customCode || generateCode(6);
    const id = nanoid(12); // primary key for links.id

    // Check if code already exists
    const existing = await pool.query(
      "SELECT id FROM links WHERE short_code = $1",
      [code]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Short code already in use" });
    }

    // Insert link
    await pool.query(
      `INSERT INTO links (id, short_code, target_url, owner_id)
       VALUES ($1, $2, $3, $4)`,
      [id, code, url, ownerId]
    );

    return res.status(201).json({
      ok: true,
      id,
      code,
      short_url: `${process.env.BASE_URL}/${code}`
    });

  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
