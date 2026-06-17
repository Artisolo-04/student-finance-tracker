import { useState } from 'react'
import { Target, Trash2 } from 'lucide-react'
import useFinance from '../../../context/finance/useFinance.js'
import useUI from '../../../context/ui/useUI.js'
import { getBudgetStatus, formatCurrency } from '../../../context/finance/financeHelpers.js'
import { Section } from './Shared.jsx'
import CategoryDropdown from '../../../components/common/CategoryDropdown.jsx'

const BudgetSettings = () => {
  const { expenseCategories, budgets, saveBudget, deleteBudget } = useFinance()
  const { notify } = useUI()
  const [categoryId, setCategoryId] = useState('')
  const [limit, setLimit] = useState('')
  const [loading, setLoading] = useState(false)

  const availableCategories = expenseCategories.filter(
    c => !budgets.some(b => b.category_id === c.id)
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryId || !limit) return
    setLoading(true)
    const result = await saveBudget(categoryId, parseFloat(limit))
    setLoading(false)
    if (result.success) {
      notify.success('Budget saved', 'Your budget goal has been set.')
      setCategoryId('')
      setLimit('')
    } else {
      notify.error('Failed to save', result.error)
    }
  }

  const handleDelete = async (catId, categoryName) => {
    const result = await deleteBudget(catId)
    if (result.success) {
      notify.success('Budget removed', `${categoryName} budget goal removed.`)
    } else {
      notify.error('Failed to remove', result.error)
    }
  }

  return (
    <Section
      title="Budget Goals"
      description="Set optional monthly spending limits per category"
    >
      {availableCategories.length > 0 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-5">
          <CategoryDropdown
            categories={availableCategories}
            value={categoryId}
            onChange={setCategoryId}
            type="expense"
            hideCreateNew
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Monthly limit (DT)"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="flex-1 bg-transparent border border-gray-200 dark:border-white/[0.08]
                text-zinc-700 dark:text-zinc-300 text-sm rounded-xl px-3.5 py-2.5
                focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-100
                dark:focus:ring-purple-900/30 transition-all
                placeholder:text-gray-400 dark:placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={loading || !categoryId || !limit}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
                bg-purple-600 hover:bg-purple-700 text-white transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-purple-500/20"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Target size={14} /> Set Budget</>
              }
            </button>
          </div>
        </form>
      )}

      {budgets.length > 0 ? (
        <div className="space-y-4 max-h-90 overflow-y-auto pr-2">
          {budgets.map(b => {
            const { percent, level } = getBudgetStatus(b.spent, b.monthly_limit)
            const width = Math.min(percent, 100)
            const barColor = level === 'danger' ? '#E24B4A'
              : level === 'warning' ? '#EF9F27'
              : '#1D9E75'

            return (
              <div
                key={b.category_id}
                className="border border-gray-100 dark:border-white/[0.06] rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: barColor }} />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {b.category_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {formatCurrency(b.spent)} / {formatCurrency(b.monthly_limit)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(b.category_id, b.category_name)}
                      className="text-zinc-300 dark:text-zinc-600 hover:text-red-400 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${width}%`, background: barColor }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                    {Math.round(width)}% used
                  </span>
                  {level === 'danger' && (
                    <span className="text-[10px] text-red-400">
                      Over by {formatCurrency(b.spent - b.monthly_limit)}
                    </span>
                  )}
                  {level === 'warning' && (
                    <span className="text-[10px] text-amber-400">Approaching limit</span>
                  )}
                  {level === 'ok' && (
                    <span className="text-[10px] text-emerald-400">On track</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Target size={28} className="text-zinc-300 dark:text-zinc-700" />
          <p className="text-xs text-zinc-400 dark:text-zinc-600">No budget goals set yet</p>
        </div>
      )}
    </Section>
  )
}

export default BudgetSettings
