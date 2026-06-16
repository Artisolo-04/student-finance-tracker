import pool from '../db/pool.js'

export const getBudgets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.category_id, c.name AS category_name,
              c.color AS category_color, c.icon AS category_icon,
              b.monthly_limit,
              COALESCE(SUM(t.amount), 0) AS spent
       FROM budgets b
       JOIN categories c ON c.id = b.category_id
       LEFT JOIN transactions t
              ON t.category_id = b.category_id
             AND t.user_id = b.user_id
             AND t.type = 'expense'
             AND date_trunc('month', t.date) = date_trunc('month', CURRENT_DATE)
       WHERE b.user_id = $1
       GROUP BY b.id, b.category_id, c.name, c.color, c.icon, b.monthly_limit
       ORDER BY c.name`,
      [req.userId]
    )

    const budgets = result.rows.map(b => ({
      ...b,
      monthly_limit: parseFloat(b.monthly_limit),
      spent: parseFloat(b.spent),
    }))

    res.json({ budgets })
  } catch (err) {
    console.error('getBudgets error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const upsertBudget = async (req, res) => {
  const { category_id, monthly_limit } = req.body

  if (!category_id || !monthly_limit)
    return res.status(400).json({ error: 'category_id and monthly_limit are required' })

  if (parseFloat(monthly_limit) <= 0)
    return res.status(400).json({ error: 'monthly_limit must be greater than 0' })

  try {
    const catCheck = await pool.query(
      'SELECT id, name, color, icon FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, req.userId]
    )
    if (catCheck.rows.length === 0)
      return res.status(404).json({ error: 'Category not found' })

    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, monthly_limit)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, category_id)
       DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit, updated_at = NOW()
       RETURNING *`,
      [req.userId, category_id, monthly_limit]
    )

    const spentResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS spent
       FROM transactions
       WHERE user_id = $1 AND category_id = $2 AND type = 'expense'
         AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)`,
      [req.userId, category_id]
    )

    const budget = {
      ...result.rows[0],
      category_name: catCheck.rows[0].name,
      category_color: catCheck.rows[0].color,
      category_icon: catCheck.rows[0].icon,
      monthly_limit: parseFloat(result.rows[0].monthly_limit),
      spent: parseFloat(spentResult.rows[0].spent),
    }

    res.status(201).json({ budget })
  } catch (err) {
    console.error('upsertBudget error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const deleteBudget = async (req, res) => {
  const { categoryId } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM budgets WHERE category_id = $1 AND user_id = $2 RETURNING id',
      [categoryId, req.userId]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Budget not found' })

    res.json({ message: 'Budget deleted', category_id: categoryId })
  } catch (err) {
    console.error('deleteBudget error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
