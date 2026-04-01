require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    // Allow all localhost origins
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

// ── ROUTES — using YOUR actual file names ──
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/influencers', protect, require('./routes/influencerRoutes'));
app.use('/api/videos',      protect, require('./routes/videoRoutes'));
app.use('/api/summary',     protect, require('./routes/summary'));
app.use('/api/campaigns',   protect, require('./routes/campaignRoutes')); // ← need to create this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});