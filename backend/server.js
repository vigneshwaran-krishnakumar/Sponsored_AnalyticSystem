if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();   // Only load .env locally
}

const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const db      = require('./config/db');

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
}

app.get('/setup', async (req, res) => {
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(20) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','editor','viewer') DEFAULT 'editor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS campaigns (
      id VARCHAR(20) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NOT NULL,
      status ENUM('Active','Paused','Completed','Draft') DEFAULT 'Active',
      budget DECIMAL(12,2) DEFAULT 0,
      spent DECIMAL(12,2) DEFAULT 0,
      revenue DECIMAL(12,2) DEFAULT 0,
      roi INT DEFAULT 0,
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS influencers (
      id VARCHAR(20) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      handle VARCHAR(100),
      platform ENUM('YouTube','Instagram','TikTok','Twitter','Facebook') NOT NULL,
      followers BIGINT DEFAULT 0,
      avg_views BIGINT DEFAULT 0,
      engagement_rate DECIMAL(10,2) DEFAULT 0,
      revenue DECIMAL(12,2) DEFAULT 0,
      niche VARCHAR(100),
      status ENUM('Active','Inactive','Negotiating') DEFAULT 'Active',
      campaigns_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await db.execute(`CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(20) PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      platform ENUM('YouTube','Instagram','TikTok','Twitter','Facebook','Other') NOT NULL,
      url VARCHAR(1000),
      duration VARCHAR(20),
      thumbnail LONGTEXT,
      publish_date DATE,
      campaign_id VARCHAR(20),
      influencer_id VARCHAR(20),
      views BIGINT DEFAULT 0,
      likes BIGINT DEFAULT 0,
      comments BIGINT DEFAULT 0,
      shares BIGINT DEFAULT 0,
      watch_time_hrs DECIMAL(10,2) DEFAULT 0,
      revenue DECIMAL(12,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    res.json({ success: true, message: 'All tables created!' });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── ROUTES — using YOUR actual file names ──
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/influencers', protect, require('./routes/influencerRoutes'));
app.use('/api/videos',      protect, require('./routes/videoRoutes'));
app.use('/api/summary',     protect, require('./routes/summary'));
app.use('/api/campaigns',   protect, require('./routes/campaignRoutes')); // ← need to create this

const PORT = process.env.PORT || 8080;   // Railway uses process.env.PORT
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});