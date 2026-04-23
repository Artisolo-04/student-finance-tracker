import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const SavingsRow = ({ s, index, total }) => (
  <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-sm">
        🐷
      </div>
      <div>
        <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
          {s.note || 'Auto-saved'}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {new Date(s.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium text-green-600 dark:text-green-400">
        +{formatCurrency(s.amount)}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">#{total - index}</p>
    </div>
  </div>
)

const SavingsHistory = ({ savings, loading, savingsTotal }) => (
  <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-4">
    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 shrink-0">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Save history</h2>
    </div>

    {loading ? (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : savings.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">🐷</span>
        <p className="text-sm text-gray-500 dark:text-gray-400">No savings yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
          When you receive new income while you still have money left,
          the leftover is automatically saved here
        </p>
      </div>
    ) : (
      <>
        <div className="divide-y divide-gray-50 dark:divide-gray-800 overflow-y-auto flex-1">
          {savings.map((s, index) => (
            <SavingsRow key={s.id} s={s} index={index} total={savings.length} />
          ))}
        </div>
        <div className="px-5 py-3 bg-green-50 dark:bg-green-900/10 border-t border-green-100 dark:border-green-900/30 flex justify-between items-center shrink-0 rounded-xl">
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Total accumulated</span>
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {formatCurrency(savingsTotal)}
          </span>
        </div>
      </>
    )}
  </div>
)

export default SavingsHistory
