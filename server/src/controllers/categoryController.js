import pool from '../db/pool.js'

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food', color: '#7F77DD', icon: 'food' },
  { name: 'Transport', color: '#1D9E75', icon: 'transport' },
  { name: 'Education', color: '#EF9F27', icon: 'education' },
  { name: 'Health', color: '#E24B4A', icon: 'health' },
  { name: 'Entertainment', color: '#D4537E', icon: 'entertainment' },
  { name: 'Shopping', color: '#378ADD', icon: 'shopping' },
  { name: 'Bills', color: '#888780', icon: 'bills' },
  { name: 'Other', color: '#5DCAA5', icon: 'other' },
]

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Famille', color: '#1D9E75', icon: 'family' },
  { name: 'Freelance', color: '#7F77DD', icon: 'freelance' },
  { name: 'Bourse', color: '#EF9F27', icon: 'bourse' },
  { name: 'Salaire', color: '#378ADD', icon: 'salaire' },
  { name: 'Cadeau', color: '#D4537E', icon: 'cadeau' },
]

export const seedDefaultCategories = async (userId) => {
  for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (user_id, name, color, icon, is_default, category_type)
       VALUES ($1, $2, $3, $4, true, 'expense')
       ON CONFLICT DO NOTHING`,
      [userId, cat.name, cat.color, cat.icon]
    )
  }
  for (const cat of DEFAULT_INCOME_CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (user_id, name, color, icon, is_default, category_type)
       VALUES ($1, $2, $3, $4, true, 'income')
       ON CONFLICT DO NOTHING`,
      [userId, cat.name, cat.color, cat.icon]
    )
  }
}

export const getCategories = async (req, res) => {
  const { type } = req.query
  try {
    let query = `SELECT * FROM categories WHERE user_id = $1`
    const params = [req.userId]

    if (type === 'income') {
      query += ` AND category_type = 'income'`
    } else if (type === 'expense') {
      query += ` AND category_type = 'expense'`
    }

    query += ` ORDER BY is_default DESC, name ASC`

    const result = await pool.query(query, params)
    res.json({ categories: result.rows })
  } catch (err) {
    console.error('getCategories error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const createCategory = async (req, res) => {
  const { name, color, icon, category_type } = req.body

  if (!name)
    return res.status(400).json({ error: 'Category name is required' })

  if (!['income', 'expense'].includes(category_type))
    return res.status(400).json({ error: 'Type must be income or expense' })

  try {
    const existing = await pool.query(
      `SELECT id FROM categories
       WHERE user_id = $1 AND LOWER(name) = LOWER($2) AND category_type = $3`,
      [req.userId, name, category_type]
    )
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Category already exists' })

    const result = await pool.query(
      `INSERT INTO categories (user_id, name, color, icon, is_default, category_type)
       VALUES ($1, $2, $3, $4, false, $5)
       RETURNING *`,
      [req.userId, name, color || '#7F77DD', icon || 'other', category_type]
    )
    res.status(201).json({ category: result.rows[0] })
  } catch (err) {
    console.error('createCategory error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const deleteCategory = async (req, res) => {
  const { id } = req.params
  try {
    const cat = await pool.query(
      `SELECT * FROM categories WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
    )
    if (cat.rows.length === 0)
      return res.status(404).json({ error: 'Category not found' })

    if (cat.rows[0].is_default)
      return res.status(403).json({ error: 'Cannot delete default categories' })

    await pool.query('DELETE FROM categories WHERE id = $1', [id])
    res.json({ message: 'Category deleted' })
  } catch (err) {
    console.error('deleteCategory error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
