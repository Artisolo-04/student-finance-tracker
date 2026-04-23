import { useEffect } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency, isBalanceLow } from '../../context/finance/financeHelpers.js'
import StatCard from './components/StatCard'
import RecentTransactions from './components/RecentTransactions'
import SavingsOverview from './components/SavingsOverview'

const Dashboard = () => {
  const { transactions, balance, savingsTotal, loading, fetchTransactions, fetchSavings, fetchCategories } = useFinance()

  useEffect(() => {
    fetchTransactions()
    fetchSavings()
    fetchCategories()
  }, [])

  const totalIncome    = transactions.filter(t => t.type === 'income') .reduce((acc, t) => acc + parseFloat(t.amount), 0)
  const totalExpenses  = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0)
  const recent         = transactions.slice(0, 5)
  const low            = isBalanceLow(balance)

  if (loading) return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="w-full min-h-full sm:px-6 lg:px-0 space-y-6 flex items-center justify-start flex-col">

      {low && (
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-xl text-sm w-full h-auto">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium">Balance is running low</p>
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">
              Your balance is {formatCurrency(balance)} — consider reducing expenses
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
        <StatCard label="Current balance"  value={formatCurrency(balance)}       sub="Available to spend"        color={low ? 'amber' : 'purple'} />
        <StatCard label="Total savings"    value={formatCurrency(savingsTotal)}  sub="Accumulated over time"     color="green" />
        <StatCard label="Total income"     value={formatCurrency(totalIncome)}   sub={`${transactions.filter(t => t.type === 'income').length} transactions`}  color="gray" />
        <StatCard label="Total expenses"   value={formatCurrency(totalExpenses)} sub={`${transactions.filter(t => t.type === 'expense').length} transactions`} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-1">
        <RecentTransactions transactions={recent} />
        <SavingsOverview savingsTotal={savingsTotal} totalIncome={totalIncome} totalExpenses={totalExpenses} />
      </div>

    </div>
  )
}

export default Dashboard
