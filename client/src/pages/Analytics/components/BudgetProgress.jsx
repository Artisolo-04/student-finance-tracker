import useFinance from '../../../context/finance/useFinance.js'
import { getBudgetStatus } from '../../../context/finance/financeHelpers.js'

const barColor = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

const BudgetProgress = () => {
  const { budgets } = useFinance()

  if (!budgets.length) return null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 w-full">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Budget Goals</h3>

      <div className="space-y-3">
        {budgets.map(b => {
          const { percent, level } = getBudgetStatus(b.spent, b.monthly_limit)
          const width = Math.min(percent, 100)

          return (
            <div key={b.category_id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-300">{b.category_name}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {b.spent.toFixed(2)} / {b.monthly_limit.toFixed(2)} DT
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${barColor[level]}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetProgress
