import pool from '../db/pool.js'

export const getSavings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM savings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    )

    const total = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM savings WHERE user_id = $1`,
      [req.userId]
    )

    res.json({
      savings: result.rows,
      total: parseFloat(parseFloat(total.rows[0].total).toFixed(2))
    })
  } catch (err) {
    console.error('getSavings error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
