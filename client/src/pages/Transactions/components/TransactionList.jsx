import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const TransactionRow = ({ t, onDelete, deleting }) => (
  <div className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group rounded-lg">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
        t.type === 'income'
          ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
          : 'bg-red-50 dark:bg-red-900/20 text-red-500'
      }`}>
        {t.type === 'income' ? '↑' : '↓'}
      </div>
      <div>
        <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
          {t.note || t.category_name || 'No description'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {t.category_name && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: t.category_color + '20', color: t.category_color }}
            >
              {t.category_name}
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(t.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${
        t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
      }`}>
        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
      </span>
      <button
        onClick={() => onDelete(t.id)}
        disabled={deleting === t.id}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-xs"
      >
        {deleting === t.id ? '...' : '✕'}
      </button>
    </div>
  </div>
)

const TransactionList = ({ transactions, loading, onDelete, deleting, filter }) => {
  if (loading) return (
    <div className="flex items-center justify-center py-16 w-full h-full">
      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (transactions.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-center w-full h-full">
      <span className="text-4xl mb-3">💸</span>
      <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {filter !== 'all' ? 'Try a different filter' : 'Add your first transaction'}
      </p>
    </div>
  )

  return (
    <div className="divide-y divide-gray-50 dark:divide-gray-800">
      {transactions.map((t) => (
        <TransactionRow key={t.id} t={t} onDelete={onDelete} deleting={deleting} />
      ))}
    </div>
  )
}

export default TransactionList
