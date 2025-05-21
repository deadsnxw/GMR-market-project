import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
const JWT_SECRET  = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const balance = 0.00;
    const isShop  = 0;

    await db.execute(
      `INSERT INTO users
         (username, email, password_hash, balance, is_shop)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, hash, balance, isShop]
    );

    res.status(201).json({ message: 'Користувача створено' });
  } catch (err) {
    console.error('‼ Register Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const [rows] = await db.execute(
      `SELECT id, username, email, password_hash
         FROM users
        WHERE email = ? OR username = ?`,
      [login, login]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    const { id, username, email, password_hash } = rows[0];
    const ok = await bcrypt.compare(password, password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }
    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id, username, email } });
  } catch (err) {
    console.error('‼ Login Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
