import pool from '../db/pool.js'

/**
 * Gets the current active income cycle for a user.
 * Current cycle = the most recent income transaction.
 * Returns { id, amount, date, created_at } or null if no income yet.
 */
const getCurrentCycle = async (userId) => {
  const result = await pool.query(
    `SELECT id, amount, date, created_at
     FROM transactions
     WHERE user_id = $1 AND type = 'income'
     ORDER BY date DESC, created_at DESC
     LIMIT 1`,
    [userId]
  )
  return result.rows[0] || null
}

/**
 * GET /api/budgets
 * Returns current cycle budgets with spent, remaining, daily_remaining.
 * Also returns cycle summary: income, allocated, unallocated.
 */
export const getBudgets = async (req, res) => {
  try {
    const cycle = await getCurrentCycle(req.userId)

    if (!cycle) {
      return res.json({
        budgets: [],
        summary: {
          income: 0,
          allocated: 0,
          unallocated: 0,
          cycle_start: null,
          income_transaction_id: null,
        }
      })
    }

    // Get budgets for current cycle
    const result = await pool.query(
      `SELECT b.id, b.category_id, c.name AS category_name,
              c.color AS category_color, c.icon AS category_icon,
              b.allocated, b.cycle_start,
              COALESCE(SUM(t.amount), 0) AS spent
       FROM budgets b
       JOIN categories c ON c.id = b.category_id
       LEFT JOIN transactions t
              ON t.category_id = b.category_id
             AND t.user_id = b.user_id
             AND t.type = 'expense'
             AND (
               t.date > $2
               OR (t.date = $2 AND t.created_at > $3)
             )
       WHERE b.user_id = $1
         AND b.income_transaction_id = $4
         AND b.cycle_end IS NULL
       GROUP BY b.id, b.category_id, c.name, c.color, c.icon, b.allocated, b.cycle_start
       ORDER BY c.name`,
      [req.userId, cycle.date, cycle.created_at, cycle.id]
    )

    // Days remaining in cycle (until next income — we estimate 30 days from cycle start)
    const cycleStart = new Date(cycle.date)
    const today = new Date()
    const daysElapsed = Math.max(0, Math.floor((today - cycleStart) / (1000 * 60 * 60 * 24)))
    const daysRemaining = Math.max(1, 30 - daysElapsed)

    const budgets = result.rows.map(b => {
      const allocated = parseFloat(b.allocated)
      const spent = parseFloat(b.spent)
      const remaining = Math.max(0, allocated - spent)
      const daily_remaining = parseFloat((remaining / daysRemaining).toFixed(2))

      return {
        ...b,
        allocated,
        spent,
        remaining,
        daily_remaining,
      }
    })

    const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated, 0)
    const income = parseFloat(cycle.amount)

    res.json({
      budgets,
      summary: {
        income,
        allocated: parseFloat(totalAllocated.toFixed(2)),
        unallocated: parseFloat((income - totalAllocated).toFixed(2)),
        cycle_start: cycle.date,
        income_transaction_id: cycle.id,
      }
    })
  } catch (err) {
    console.error('getBudgets error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

/**
 * POST /api/budgets
 * Allocate amount to a category in the current income cycle.
 * Validates: total allocated cannot exceed income amount.
 */
export const upsertBudget = async (req, res) => {
  const { category_id, allocated } = req.body

  if (!category_id || !allocated)
    return res.status(400).json({ error: 'category_id and allocated are required' })

  if (parseFloat(allocated) <= 0)
    return res.status(400).json({ error: 'allocated must be greater than 0' })

  try {
    const cycle = await getCurrentCycle(req.userId)
    if (!cycle)
      return res.status(400).json({ error: 'No income found. Add income first.' })

    // Validate category belongs to user
    const catCheck = await pool.query(
      'SELECT id, name, color, icon FROM categories WHERE id = $1 AND user_id = $2',
      [category_id, req.userId]
    )
    if (catCheck.rows.length === 0)
      return res.status(404).json({ error: 'Category not found' })

    // Check total allocated won't exceed income
    const existingResult = await pool.query(
      `SELECT COALESCE(SUM(allocated), 0) AS total_allocated
       FROM budgets
       WHERE user_id = $1
         AND income_transaction_id = $2
         AND category_id != $3
         AND cycle_end IS NULL`,
      [req.userId, cycle.id, category_id]
    )

    const otherAllocated = parseFloat(existingResult.rows[0].total_allocated)
    const newTotal = otherAllocated + parseFloat(allocated)

    if (newTotal > parseFloat(cycle.amount)) {
      return res.status(400).json({
        error: `Total allocated (${newTotal.toFixed(2)} DT) would exceed your income (${parseFloat(cycle.amount).toFixed(2)} DT)`,
        unallocated: parseFloat((parseFloat(cycle.amount) - otherAllocated).toFixed(2))
      })
    }

    // Upsert budget for this cycle
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, allocated, income_transaction_id, cycle_start)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, category_id, income_transaction_id)
       DO UPDATE SET allocated = EXCLUDED.allocated, updated_at = NOW()
       RETURNING *`,
      [req.userId, category_id, allocated, cycle.id, cycle.date]
    )

    // Get current spent for this category in this cycle
    const spentResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS spent
       FROM transactions
       WHERE user_id = $1 AND category_id = $2 AND type = 'expense'
         AND (
           date > $3
           OR (date = $3 AND created_at > $4)
         )`,
      [req.userId, category_id, cycle.date, cycle.created_at]
    )

    const allocatedAmount = parseFloat(result.rows[0].allocated)
    const spent = parseFloat(spentResult.rows[0].spent)

    const budget = {
      ...result.rows[0],
      category_name: catCheck.rows[0].name,
      category_color: catCheck.rows[0].color,
      category_icon: catCheck.rows[0].icon,
      allocated: allocatedAmount,
      spent,
      remaining: Math.max(0, allocatedAmount - spent),
    }

    // Return updated summary too
    const summaryResult = await pool.query(
      `SELECT COALESCE(SUM(allocated), 0) AS total_allocated
       FROM budgets
       WHERE user_id = $1
         AND income_transaction_id = $2
         AND cycle_end IS NULL`,
      [req.userId, cycle.id]
    )

    const totalAllocated = parseFloat(summaryResult.rows[0].total_allocated)

    res.status(201).json({
      budget,
      summary: {
        income: parseFloat(cycle.amount),
        allocated: totalAllocated,
        unallocated: parseFloat((parseFloat(cycle.amount) - totalAllocated).toFixed(2)),
        cycle_start: cycle.date,
        income_transaction_id: cycle.id,
      }
    })
  } catch (err) {
    console.error('upsertBudget error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

/**
 * DELETE /api/budgets/:categoryId
 * Remove envelope from current cycle only.
 */
export const deleteBudget = async (req, res) => {
  const { categoryId } = req.params
  try {
    const cycle = await getCurrentCycle(req.userId)
    if (!cycle)
      return res.status(404).json({ error: 'No active cycle found' })

    const result = await pool.query(
      `DELETE FROM budgets
       WHERE category_id = $1 AND user_id = $2
         AND income_transaction_id = $3
         AND cycle_end IS NULL
       RETURNING id`,
      [categoryId, req.userId, cycle.id]
    )

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Budget not found' })

    // Return updated summary
    const summaryResult = await pool.query(
      `SELECT COALESCE(SUM(allocated), 0) AS total_allocated
       FROM budgets
       WHERE user_id = $1
         AND income_transaction_id = $2
         AND cycle_end IS NULL`,
      [req.userId, cycle.id]
    )

    const totalAllocated = parseFloat(summaryResult.rows[0].total_allocated)

    res.json({
      message: 'Budget deleted',
      category_id: categoryId,
      summary: {
        income: parseFloat(cycle.amount),
        allocated: totalAllocated,
        unallocated: parseFloat((parseFloat(cycle.amount) - totalAllocated).toFixed(2)),
        cycle_start: cycle.date,
        income_transaction_id: cycle.id,
      }
    })
  } catch (err) {
    console.error('deleteBudget error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

/**
 * Closes all active budgets for a user when new income arrives.
 * Called internally from transactionController when income is added.
 */
export const closePreviousCycle = async (userId, client) => {
  await client.query(
    `UPDATE budgets
     SET cycle_end = CURRENT_DATE, updated_at = NOW()
     WHERE user_id = $1 AND cycle_end IS NULL`,
    [userId]
  )
}
