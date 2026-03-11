const pool = require('../config/db');

const influencerController = {
  // Get all influencers
  getAllInfluencers: async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM influencers ORDER BY created_at DESC'
      );
      res.json(rows);
    } catch (error) {
      console.error('Error fetching influencers:', error);
      res.status(500).json({ error: 'Failed to fetch influencers' });
    }
  },

  // Create influencer
  createInfluencer: async (req, res) => {
    try {
      const { name, platform, followers, engagement_rate, revenue = 0 } = req.body;

      // Validate input
      if (!name || !platform || followers === undefined || engagement_rate === undefined) {
        return res.status(400).json({
          error: 'Name, platform, followers, and engagement_rate are required'
        });
      }

      // Insert influencer
      const [result] = await pool.execute(
        'INSERT INTO influencers (name, platform, followers, engagement_rate, revenue) VALUES (?, ?, ?, ?, ?)',
        [name, platform, followers, engagement_rate, revenue]
      );

      const [rows] = await pool.execute('SELECT * FROM influencers WHERE id = ?', [result.insertId]);

      res.status(201).json(rows[0]);

    } catch (error) {
      console.error('Error creating influencer:', error);
      res.status(500).json({ error: 'Failed to create influencer' });
    }
  },

  // Update influencer
  updateInfluencer: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, platform, followers, engagement_rate, revenue } = req.body;

      await pool.execute(
        'UPDATE influencers SET name = ?, platform = ?, followers = ?, engagement_rate = ?, revenue = ? WHERE id = ?',
        [name, platform, followers, engagement_rate, revenue, id]
      );

      const [rows] = await pool.execute('SELECT * FROM influencers WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Influencer not found' });
      }

      res.json(rows[0]);

    } catch (error) {
      console.error('Error updating influencer:', error);
      res.status(500).json({ error: 'Failed to update influencer' });
    }
  },

  // Delete influencer
  deleteInfluencer: async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await pool.execute('DELETE FROM influencers WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Influencer not found' });
      }

      res.json({ message: 'Influencer deleted successfully' });

    } catch (error) {
      console.error('Error deleting influencer:', error);
      res.status(500).json({ error: 'Failed to delete influencer' });
    }
  }
};

module.exports = influencerController;