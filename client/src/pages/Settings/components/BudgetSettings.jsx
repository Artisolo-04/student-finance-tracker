import { useState } from 'react'
import { Target, Trash2, Wallet, TrendingUp } from 'lucide-react'
import useFinance from '../../../context/finance/useFinance.js'
import useUI from '../../../context/ui/useUI.js'
import { getBudgetStatus, formatCurrency } from '../../../context/finance/financeHelpers.js'
import { Section } from './Shared.jsx'
import CategoryDropdown from '../../../components/common/CategoryDropdown.jsx'

const BudgetSettings = () => {
  const {
    expenseCategories, budgets, budgetSummary,
    saveBudget, deleteBudget
  } = useFinance()
  const { notify } = useUI()
  const [categoryId, setCategoryId] = useState('')
  const [allocated, setAllocated] = useState('')
  const [loading, setLoading] = useState(false)

  const availableCategories = expenseCategories.filter(
    c => !budgets.some(b => b.category_id === c.id)
  )

  const unallocated = budgetSummary.unallocated
  const hasIncome = budgetSummary.income_transaction_id !== null
  const allocationPercent = budgetSummary.income > 0
    ? Math.round((budgetSummary.allocated / budgetSummary.income) * 100)
    : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryId || !allocated) return

    const amount = parseFloat(allocated)
    if (amount > unallocated) {
      notify.error(
        'Exceeds available amount',
        `You only have ${formatCurrency(unallocated)} left to allocate`
      )
      return
    }

    setLoading(true)
    const result = await saveBudget(categoryId, amount)
    setLoading(false)

    if (result.success) {
      notify.success('Envelope set', `Budget allocated successfully`)
      setCategoryId('')
      setAllocated('')
    } else {
      notify.error('Failed to save', result.error)
    }
  }

  const handleDelete = async (catId, categoryName) => {
    const result = await deleteBudget(catId)
    if (result.success) {
      notify.success('Envelope removed', `${categoryName} budget removed`)
    } else {
      notify.error('Failed to remove', result.error)
    }
  }

  if (!hasIncome) {
    return (
      <Section title="Budget Goals" description="Allocate your income across spending categories">
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Wallet size={32} className="text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No income yet</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
            Add your first income transaction to start planning your budget
          </p>
        </div>
      </Section>
    )
  }

  return (
    <Section title="Budget Goals" description="Allocate your income across spending categories">

      {/* Cycle summary */}
      <div className="bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.06] rounded-xl p-4 mb-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">Current cycle income</p>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mt-0.5">
              {formatCurrency(budgetSummary.income)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">Unallocated</p>
            <p className={`text-lg font-bold mt-0.5 ${
              unallocated === 0
                ? 'text-emerald-500'
                : 'text-purple-500'
            }`}>
              {formatCurrency(unallocated)}
            </p>
          </div>
        </div>

        {/* Allocation progress bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full h-1.5 mb-2">
          <div
            className="h-1.5 rounded-full transition-all duration-500 bg-purple-500"
            style={{ width: `${Math.min(allocationPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
            {allocationPercent}% allocated
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
            {formatCurrency(budgetSummary.allocated)} / {formatCurrency(budgetSummary.income)}
          </p>
        </div>
      </div>

      {/* Add envelope form */}
      {availableCategories.length > 0 && unallocated > 0 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-5">
          <CategoryDropdown
            categories={availableCategories}
            value={categoryId}
            onChange={setCategoryId}
            type="expense"
            hideCreateNew
          />
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                min="0.01"
                step="0.01"
                max={unallocated}
                placeholder={`Max ${formatCurrency(unallocated)}`}
                value={allocated}
                onChange={(e) => setAllocated(e.target.value)}
                className="w-full bg-transparent border border-gray-200 dark:border-white/[0.08]
                  text-zinc-700 dark:text-zinc-300 text-sm rounded-xl px-3.5 py-2.5
                  focus:outline-none focus:border-purple-500/50 focus:ring-2
                  focus:ring-purple-100 dark:focus:ring-purple-900/30 transition-all
                  placeholder:text-gray-400 dark:placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !categoryId || !allocated}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
                bg-purple-600 hover:bg-purple-700 text-white transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-purple-500/20"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Target size={14} /> Allocate</>
              }
            </button>
          </div>
        </form>
      )}

      {unallocated === 0 && budgets.length > 0 && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl
          bg-emerald-500/[0.07] border border-emerald-500/20">
          <TrendingUp size={14} className="text-emerald-500 shrink-0" />
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            All income allocated — great planning!
          </p>
        </div>
      )}

      {/* Envelopes list */}
      {budgets.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {budgets.map(b => {
            const { percent, level } = getBudgetStatus(b.spent, b.allocated)
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
                      {formatCurrency(b.spent)} / {formatCurrency(b.allocated)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(b.category_id, b.category_name)}
                      className="text-zinc-300 dark:text-zinc-600 hover:text-red-400 transition-colors"
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
                  <div className="flex items-center gap-3">
                    {b.daily_remaining !== undefined && (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                        ~{formatCurrency(b.daily_remaining)}/day left
                      </span>
                    )}
                    {level === 'danger' && (
                      <span className="text-[10px] text-red-400">
                        Over by {formatCurrency(b.spent - b.allocated)}
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
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Target size={28} className="text-zinc-300 dark:text-zinc-700" />
          <p className="text-xs text-zinc-400 dark:text-zinc-600">No envelopes set yet</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Allocate your {formatCurrency(budgetSummary.income)} across categories above
          </p>
        </div>
      )}
    </Section>
  )
}

export default BudgetSettings
