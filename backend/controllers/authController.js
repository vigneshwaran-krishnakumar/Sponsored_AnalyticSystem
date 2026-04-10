const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authController = {

  // ── Signup ───────────────────────────────────────────────
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newId = Date.now().toString();

      const [result] = await pool.execute(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [newId, name, email, hashedPassword]
      );

      res.status(201).json({
        message: 'User created successfully',
        userId: newId
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ── Login ────────────────────────────────────────────────
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const [users] = await pool.execute(
        'SELECT id, name, email, password FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ── Me (token validation on app load) ───────────────────
  me: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const [users] = await pool.execute(
        'SELECT id, name, email FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.json({ user: users[0] });

    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;