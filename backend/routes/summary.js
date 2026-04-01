const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

router.get('/', async (req, res) => {
  try {

    const [[{ totalRevenue }]] = await pool.execute(
      `SELECT COALESCE(SUM(revenue), 0) AS totalRevenue FROM campaigns`
    );

    const [[{ activeCampaigns }]] = await pool.execute(
      `SELECT COUNT(*) AS activeCampaigns FROM campaigns WHERE status = 'Active'`
    );

    const [[{ avgROI }]] = await pool.execute(
      `SELECT COALESCE(
        AVG(CASE WHEN spent > 0 THEN ((revenue - spent) / spent) * 100 ELSE 0 END)
      , 0) AS avgROI FROM campaigns`
    );

    // ✅ correct column name is engagement_rate not engagementRate
    const [[{ avgEngagement }]] = await pool.execute(
      `SELECT COALESCE(AVG(engagement_rate), 0) AS avgEngagement FROM influencers`
    );

    const [trafficSources] = await pool.execute(
      `SELECT platform, COUNT(*) AS count FROM videos GROUP BY platform`
    );

    const [recentCampaigns] = await pool.execute(
      `SELECT id, name, brand, status, revenue
       FROM campaigns ORDER BY created_at DESC LIMIT 5`
    );

    const [monthlyRevenue] = await pool.execute(
      `SELECT 
         DATE_FORMAT(created_at, '%b') AS month,
         DATE_FORMAT(created_at, '%Y-%m') AS month_key,
         SUM(revenue) AS revenue
       FROM campaigns
       GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
       ORDER BY month_key ASC`
    );

    res.json({
      totalRevenue:    Number(totalRevenue),
      activeCampaigns: Number(activeCampaigns),
      avgROI:          Math.round(Number(avgROI)),
      avgEngagement:   parseFloat(Number(avgEngagement).toFixed(1)),
      trafficSources,
      recentCampaigns,
      monthlyRevenue
    });

  } catch (e) {
    console.error('Summary error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;