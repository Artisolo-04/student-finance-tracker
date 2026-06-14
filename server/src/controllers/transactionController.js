import pool from '../db/pool.js'
import { seedDefaultCategories } from './categoryController.js'

const calculateBalance = async (userId) => {
  const lastIncomeResult = await pool.query(
    `SELECT id, amount, date, created_at
     FROM transactions
     WHERE user_id = $1 AND type = 'income'
     ORDER BY date DESC, created_at DESC
     LIMIT 1`,
    [userId]
  )

  if (lastIncomeResult.rows.length === 0) return 0

  const lastIncome = lastIncomeResult.rows[0]

  const expensesResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_expenses
     FROM transactions
     WHERE user_id = $1
       AND type = 'expense'
       AND created_at > $2`,
    [userId, lastIncome.created_at]
  )

  const expenses = parseFloat(expensesResult.rows[0].total_expenses)

  return parseFloat(lastIncome.amount) - expenses
}

export const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.date DESC, t.created_at DESC`,
      [req.userId]
    )

    const balance = await calculateBalance(req.userId)

    res.json({
      transactions: result.rows,
      balance: parseFloat(balance.toFixed(2))
    })
  } catch (err) {
    console.error('getTransactions error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const createTransaction = async (req, res) => {
  const { type, amount, category_id, note, date } = req.body

  if (!type || !amount)
    return res.status(400).json({ error: 'Type and amount are required' })

  if (!['income', 'expense'].includes(type))
    return res.status(400).json({ error: 'Type must be income or expense' })

  if (parseFloat(amount) <= 0)
    return res.status(400).json({ error: 'Amount must be greater than 0' })

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    if (type === 'income') {
      const currentBalance = await calculateBalance(req.userId)

      if (currentBalance > 0) {
        await client.query(
          `INSERT INTO savings (user_id, amount, note)
          VALUES ($1, $2, $3)`,
          [
            req.userId,
            currentBalance,
            `Auto-saved on ${date || new Date().toISOString().split('T')[0]}`
          ]
        )
        console.log(`💰 Auto-saved ${currentBalance} DT for user ${req.userId}`)
      }
    }

    const result = await client.query(
      `INSERT INTO transactions (user_id, type, amount, category_id, note, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, type, amount, category_id || null, note || null, date || new Date()]
    )

    const transaction = result.rows[0]

    await client.query('COMMIT')

    const catCount = await pool.query(
      'SELECT COUNT(*) FROM categories WHERE user_id = $1',
      [req.userId]
    )
    if (parseInt(catCount.rows[0].count) === 0) {
      await seedDefaultCategories(req.userId)
    }

    const newBalance = await calculateBalance(req.userId)

    res.status(201).json({
      transaction,
      balance: parseFloat(newBalance.toFixed(2)),
      alert: newBalance >= 0 && newBalance <= 20
    })

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('createTransaction error:', err.message)
    res.status(500).json({ error: 'Server error' })
  } finally {
    client.release()
  }
}

export const deleteTransaction = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    )
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Transaction not found' })

    await pool.query('DELETE FROM transactions WHERE id = $1', [id])

    const newBalance = await calculateBalance(req.userId)

    res.json({
      message: 'Transaction deleted',
      balance: parseFloat(newBalance.toFixed(2)),
      alert: newBalance >= 0 && newBalance <= 20
    })
  } catch (err) {
    console.error('deleteTransaction error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getBalance = async (req, res) => {
  try {
    const balance = await calculateBalance(req.userId)
    res.json({
      balance: parseFloat(balance.toFixed(2)),
      alert: balance >= 0 && balance <= 20
    })
  } catch (err) {
    console.error('getBalance error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
