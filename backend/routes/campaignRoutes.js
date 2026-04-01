const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM campaigns ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { 
      id, name, brand, status, 
      budget, spent, revenue, 
      start_date, end_date 
    } = req.body;

    // ── id is optional — use provided or generate one ──
    const campaignId = id || Date.now().toString(36);

    await pool.execute(
      `INSERT INTO campaigns 
       (id, name, brand, status, budget, spent, revenue, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        campaignId,
        name,
        brand,
        status  || 'Active',
        budget  || 0,
        spent   || 0,
        revenue || 0,
        start_date || null,   // ← null if not provided
        end_date   || null    // ← null if not provided
      ]
    );
    res.json({ success: true });
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, brand, status, budget, spent, revenue } = req.body;
    await pool.execute(
      `UPDATE campaigns SET name=?, brand=?, status=?, budget=?, spent=?, revenue=? WHERE id=?`,
      [name, brand, status, budget, spent, revenue, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM campaigns WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;