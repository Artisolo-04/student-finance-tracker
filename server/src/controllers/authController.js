import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/pool.js'
import { seedDefaultCategories } from './categoryController.js'

export const register = async (req, res) => {
  const { full_name, email, password } = req.body

  if (!full_name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' })

  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' })

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' })

    const password_hash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [full_name, email, password_hash]
    )

    const user = result.rows[0]

    await seedDefaultCategories(user.id)

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ user, token })

  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' })

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' })

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at
      },
      token
    })

  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = $1',
      [req.userId]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' })

    res.json({ user: result.rows[0] })

  } catch (err) {
    console.error('GetMe error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateProfile = async (req, res) => {
  const { full_name, email } = req.body
  if (!full_name || !email)
    return res.status(400).json({ error: 'Name and email are required' })
  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, req.userId]
    )
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already in use' })
    const result = await pool.query(
      `UPDATE users SET full_name = $1, email = $2
       WHERE id = $3
       RETURNING id, full_name, email, created_at`,
      [full_name, email, req.userId]
    )
    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('updateProfile error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updatePassword = async (req, res) => {
  const { current_password, new_password } = req.body
  if (!current_password || !new_password)
    return res.status(400).json({ error: 'All fields are required' })
  if (new_password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.userId]
    )
    const user = result.rows[0]
    const isMatch = await bcrypt.compare(current_password, user.password_hash)
    if (!isMatch)
      return res.status(401).json({ error: 'Current password is incorrect' })
    const password_hash = await bcrypt.hash(new_password, 10)
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [password_hash, req.userId]
    )
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('updatePassword error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
