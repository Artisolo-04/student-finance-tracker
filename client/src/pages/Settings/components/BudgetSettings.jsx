import { useState } from 'react'
import useFinance from '../../../context/finance/useFinance.js'
import useUI from '../../../context/ui/useUI.js'

const BudgetSettings = () => {
  const { expenseCategories, budgets, saveBudget, deleteBudget } = useFinance()
  const { notify } = useUI()
  const [categoryId, setCategoryId] = useState('')
  const [limit, setLimit] = useState('')

  const availableCategories = expenseCategories.filter(
    c => !budgets.some(b => b.category_id === c.id)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryId || !limit) return

    const result = await saveBudget(categoryId, parseFloat(limit))
    if (result.success) {
      notify.success('Budget saved', 'Your budget goal has been set.')
      setCategoryId('')
      setLimit('')
    } else {
      notify.error('Failed to save', result.error)
    }
  }

  const handleDelete = async (categoryId, categoryName) => {
    const result = await deleteBudget(categoryId)
    if (result.success) {
      notify.success('Budget removed', `${categoryName} budget goal removed.`)
    } else {
      notify.error('Failed to remove', result.error)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Budget Goals</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Set optional monthly spending limits per category. You'll get a heads-up as you approach your limit.
        </p>
      </div>

      {availableCategories.length > 0 && (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            {availableCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Monthly limit (DT)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm w-36"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Set Budget
          </button>
        </form>
      )}

      {budgets.length > 0 && (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {budgets.map(b => (
            <li key={b.category_id} className="flex justify-between items-center py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {b.category_name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {b.monthly_limit.toFixed(2)} DT / month
                </span>
              </div>
              <button
                onClick={() => handleDelete(b.category_id, b.category_name)}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {budgets.length === 0 && availableCategories.length === 0 && (
        <p className="text-sm text-gray-400 italic">No expense categories available to budget.</p>
      )}
    </div>
  )
}

export default BudgetSettings
