import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#E24B4A','#D4537E','#378ADD','#888780','#5DCAA5']

const CategoryBreakdown = ({ categoryData, totalExpenses }) => {
  const topCategory = categoryData[0] || null

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-lg">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Category breakdown</h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Sorted by spending</p>

      {categoryData.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-xs text-gray-400 dark:text-gray-500">No expenses yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {categoryData.map((cat, index) => {
              const pct = totalExpenses > 0 ? Math.round((cat.value / totalExpenses) * 100) : 0
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{pct}%</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatCurrency(cat.value)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {topCategory && (
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Biggest spend category is{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">{topCategory.name}</span>
                {' '}at{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(topCategory.value)}</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CategoryBreakdown
