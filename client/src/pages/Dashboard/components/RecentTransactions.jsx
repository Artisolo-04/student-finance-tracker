import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const TransactionRow = ({ t }) => (
  <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
        ${t.type === 'income'
          ? 'bg-green-50 dark:bg-green-900/20'
          : 'bg-red-50 dark:bg-red-900/20'}`}>
        {t.type === 'income' ? '↑' : '↓'}
      </div>
      <div>
        <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">
          {t.note || t.category_name || 'No description'}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {t.category_name || 'Uncategorized'} ·{' '}
          {new Date(t.date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </p>
      </div>
    </div>
    <span className={`text-sm font-medium ${
      t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
    }`}>
      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
    </span>
  </div>
)

const RecentTransactions = ({ transactions }) => (
  <div className="lg:col-span-2 h-auto bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Recent transactions
      </h2>
      <a href="/transactions" className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
        View all
      </a>
    </div>

    {transactions.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <span className="text-2xl">💸</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Add your first income or expense
        </p>
      </div>
    ) : (
      <div className="space-y-1">
        {transactions.map((t) => (
          <TransactionRow key={t.id} t={t} />
        ))}
      </div>
    )}
  </div>
)

export default RecentTransactions
