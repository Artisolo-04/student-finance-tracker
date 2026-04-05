import { useEffect } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency, isBalanceLow } from '../../context/finance/financeHelpers.js'

const StatCard = ({ label, value, sub, color = 'gray' }) => {
  const colors = {
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
    gray: 'bg-gray-50 text-gray-700',
  }
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-medium ${colors[color].split(' ')[1]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

const Dashboard = () => {
  const {
    transactions,
    balance,
    savingsTotal,
    loading,
    fetchTransactions,
    fetchSavings,
    fetchCategories,
  } = useFinance()

  useEffect(() => {
    fetchTransactions()
    fetchSavings()
    fetchCategories()
  }, [])

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0)

  const recent = transactions.slice(0, 5)
  const low = isBalanceLow(balance)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {low && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium">Balance is running low</p>
            <p className="text-amber-600 text-xs mt-0.5">
              Your balance is {formatCurrency(balance)} — consider reducing expenses
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current balance"
          value={formatCurrency(balance)}
          sub="Available to spend"
          color={low ? 'amber' : 'purple'}
        />
        <StatCard
          label="Total savings"
          value={formatCurrency(savingsTotal)}
          sub="Accumulated over time"
          color="green"
        />
        <StatCard
          label="Total income"
          value={formatCurrency(totalIncome)}
          sub={`${transactions.filter(t => t.type === 'income').length} transactions`}
          color="gray"
        />
        <StatCard
          label="Total expenses"
          value={formatCurrency(totalExpenses)}
          sub={`${transactions.filter(t => t.type === 'expense').length} transactions`}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Recent transactions</h2>
            <a href="/transactions" className="text-xs text-purple-600 hover:underline">
              View all
            </a>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">💸</span>
              </div>
              <p className="text-sm text-gray-500">No transactions yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Add your first income or expense
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${t.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                      {t.type === 'income' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 font-medium">
                        {t.note || t.category_name || 'No description'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t.category_name || 'Uncategorized'} ·{' '}
                        {new Date(t.date).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    t.type === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Savings overview</h2>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-100 flex flex-col items-center justify-center mb-4">
              <span className="text-lg font-medium text-green-700">
                {formatCurrency(savingsTotal).split('.')[0]}
              </span>
              <span className="text-xs text-green-500">DT saved</span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Savings accumulate automatically every time new income arrives
            </p>
          </div>

          <div className="border-t border-gray-50 pt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Income this period</span>
              <span className="text-gray-700 font-medium">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Expenses this period</span>
              <span className="text-gray-700 font-medium">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-gray-50 pt-2">
              <span className="text-gray-400">Savings rate</span>
              <span className="text-green-600 font-medium">
                {totalIncome > 0
                  ? `${Math.round((savingsTotal / totalIncome) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
