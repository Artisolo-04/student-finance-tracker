import { useEffect } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency, isBalanceLow } from '../../context/finance/financeHelpers.js'
import StatCard from './components/StatCard'
import RecentTransactions from './components/RecentTransactions'
import SavingsOverview from './components/SavingsOverview'
import { AlertTriangle, PiggyBank } from 'lucide-react'
import BudgetAlerts from './components/BudgetAlerts.jsx'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const {
    transactions, balance, savingsTotal, loading,
    fetchTransactions, fetchSavings, fetchCategories,
    fetchBudgets, budgetSummary, budgets, needsAllocation, clearNeedsAllocation,
  } = useFinance()

  useEffect(() => {
    fetchTransactions()
    fetchSavings()
    fetchCategories()
    fetchBudgets()
  }, [])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0)

  const recent = transactions.slice(0, 10)
  const low = isBalanceLow(balance)
  const hasUnallocated = budgetSummary.unallocated > 0 && budgetSummary.income_transaction_id !== null
  const savingsRate = totalIncome > 0
    ? ((savingsTotal / totalIncome) * 100).toFixed(1)
    : 0

  if (loading) return <DashboardSkeleton />

  return (
    <div className="w-full h-full flex flex-col gap-6">

      {low && (
        <div className="flex items-center gap-2.5 rounded-xl
          border border-amber-500/20 bg-amber-500/[0.07]
          px-4 py-3 animate-fadeIn shrink-0">
          <AlertTriangle size={15} className="text-amber-500 shrink-0" strokeWidth={2} />
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Your balance is low — consider adding income or reducing expenses.
          </p>
        </div>
      )}

      {hasUnallocated && (
        <div className="flex items-center justify-between gap-2.5 rounded-xl
          border border-purple-500/20 bg-purple-500/[0.07]
          px-4 py-3 animate-fadeIn shrink-0">
          <div className="flex items-center gap-2.5">
            <PiggyBank size={15} className="text-purple-400 shrink-0" strokeWidth={2} />
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
              You have <span className="font-bold">{formatCurrency(budgetSummary.unallocated)}</span> unallocated — plan where your money goes.
            </p>
          </div>
          <Link
            to="/settings?tab=Budgets"
            onClick={clearNeedsAllocation}
            className="shrink-0 text-xs font-semibold text-purple-500 hover:text-purple-400
              border border-purple-500/30 hover:border-purple-400/50
              px-3 py-1.5 rounded-lg transition-all"
          >
            Plan budget →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 shrink-0">
        <StatCard
          label="Balance"
          value={formatCurrency(balance)}
          sub="Available to spend"
          color={low ? 'amber' : 'purple'}
          className="stagger-1"
        />
        <StatCard
          label="Total savings"
          value={formatCurrency(savingsTotal)}
          sub={`${savingsRate}% of income`}
          color="green"
          className="stagger-2"
        />
        <StatCard
          label="Income"
          value={formatCurrency(totalIncome)}
          sub={`${transactions.filter(t => t.type === 'income').length} transactions`}
          color="blue"
          className="stagger-3"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(totalExpenses)}
          sub={`${transactions.filter(t => t.type === 'expense').length} transactions`}
          color="red"
          className="stagger-4"
        />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-h-0">
          <RecentTransactions transactions={recent} />
        </div>
        <div className="min-h-0 flex flex-col gap-4">
          <BudgetAlerts budgets={budgets} />
          <div className="flex-1 min-h-0">
            <SavingsOverview
              savingsTotal={savingsTotal}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

const DashboardSkeleton = () => (
  <div className="w-full h-full flex flex-col gap-4 animate-pulse">
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 shrink-0">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 rounded-2xl skeleton" />
      ))}
    </div>
    <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-3 gap-3">
      <div className="xl:col-span-2 rounded-2xl skeleton" />
      <div className="rounded-2xl skeleton" />
    </div>
  </div>
)

export default Dashboard
