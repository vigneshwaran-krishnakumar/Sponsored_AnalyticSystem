const express = require("express");
require("dotenv").config();
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const influencerRoutes = require("./routes/influencerRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Influencer routes (protected)
app.use('/api/influencers', authMiddleware, influencerRoutes);

/* -------- ROI API -------- */
app.get("/api/roi", authMiddleware, async (req, res) => {
  try {
    // For now, return static data since we removed Analytics model
    // In a real app, you'd have an analytics table in MySQL
    const data = {
      revenue: 100000,
      cost: 75000
    };

    const roi = ((data.revenue - data.cost) / data.cost) * 100;

    res.json({
      revenue: data.revenue,
      cost: data.cost,
      roi: roi.toFixed(2) + "%"
    });

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});


/* -------- Campaign APIs -------- */

// Get campaigns
app.get("/api/campaigns", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM campaigns ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

// Create campaign
app.post("/api/campaigns", authMiddleware, async (req, res) => {
  try {
    const { name, brand, status = 'active', budget, spent, revenue } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO campaigns (name, brand, status, budget, spent, revenue) VALUES (?, ?, ?, ?, ?, ?)',
      [name, brand, status, budget, spent, revenue]
    );

    const [rows] = await pool.execute('SELECT * FROM campaigns WHERE id = ?', [result.insertId]);

    res.json(rows[0]);

  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

// Update campaign
app.put("/api/campaigns/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, status, budget, spent, revenue } = req.body;

    await pool.execute(
      'UPDATE campaigns SET name = ?, brand = ?, status = ?, budget = ?, spent = ?, revenue = ? WHERE id = ?',
      [name, brand, status, budget, spent, revenue, id]
    );

    const [rows] = await pool.execute('SELECT * FROM campaigns WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: "Failed to update campaign" });
  }
});

// Delete campaign
app.delete("/api/campaigns/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM campaigns WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted successfully" });

  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});