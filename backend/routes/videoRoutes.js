const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT v.*, 
             c.name AS campaign_name,
             i.name AS influencer_name
      FROM videos v
      LEFT JOIN campaigns   c ON v.campaign_id   = c.id
      LEFT JOIN influencers i ON v.influencer_id = i.id
      ORDER BY v.created_at DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const {
      title, platform, url, duration, thumbnail,
      publish_date, campaign_id, influencer_id,
      views, likes, comments, shares, watch_time_hrs, revenue
    } = req.body;
    await pool.execute(
      `INSERT INTO videos
       (title,platform,url,duration,thumbnail,publish_date,
        campaign_id,influencer_id,views,likes,comments,shares,watch_time_hrs,revenue)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [title, platform, url||'', duration||'', thumbnail||'',
       publish_date||null, campaign_id||null, influencer_id||null,
       views||0, likes||0, comments||0, shares||0, watch_time_hrs||0, revenue||0]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      title, platform, views, likes,
      comments, shares, watch_time_hrs, revenue,
      campaign_id, influencer_id
    } = req.body;
    await pool.execute(
      `UPDATE videos
       SET title=?, platform=?, views=?, likes=?, comments=?,
           shares=?, watch_time_hrs=?, revenue=?,
           campaign_id=?, influencer_id=?
       WHERE id=?`,
      [title, platform, views, likes, comments, shares,
       watch_time_hrs, revenue,
       campaign_id||null, influencer_id||null, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM videos WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;