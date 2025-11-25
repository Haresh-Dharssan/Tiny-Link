import express from "express";
import { pool } from "../db.js";
import { generateCode } from "../utils/generateCode.js";
import { nanoid } from "nanoid";

const router = express.Router();

/* ---------------------------------------
   POST /api/links
   Create a new short link
---------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { url, customCode, ownerId = null } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Malformed URL" });
    }

    const shortCode = customCode || generateCode(6);
    const id = nanoid(12);

    // Check if code already exists
    const existing = await pool.query(
      "SELECT id FROM links WHERE short_code = $1",
      [shortCode]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Short code already exists" });
    }

    // Insert
    await pool.query(
      `INSERT INTO links (id, short_code, target_url, owner_id)
       VALUES ($1, $2, $3, $4)`,
      [id, shortCode, url, ownerId]
    );

    return res.status(201).json({
      ok: true,
      id,
      short_code: shortCode,
      short_url: `${process.env.BASE_URL}/${shortCode}`
    });

  } catch (err) {
    console.error("POST /api/links error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ---------------------------------------
   GET /api/links
   List all links
---------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, short_code, target_url, click_count, last_clicked_at, created_at
       FROM links
       ORDER BY created_at DESC`
    );

    return res.json({
      ok: true,
      count: result.rows.length,
      links: result.rows
    });

  } catch (err) {
    console.error("GET /api/links error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ---------------------------------------
   GET /api/links/:code
   Stats for a single code
---------------------------------------- */
router.get("/:code", async (req, res) => {
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

    return res.json({ ok: true, data: result.rows[0] });

  } catch (err) {
    console.error("GET /api/links/:code error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* ---------------------------------------
   DELETE /api/links/:code
---------------------------------------- */
router.delete("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "DELETE FROM links WHERE short_code = $1 RETURNING id",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    return res.json({ ok: true, deleted: code });

  } catch (err) {
    console.error("DELETE /api/links/:code error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
