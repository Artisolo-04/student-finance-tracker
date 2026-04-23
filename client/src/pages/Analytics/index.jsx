import { useEffect, useMemo } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency, groupByCategory, groupByMonth } from '../../context/finance/financeHelpers.js'
import AnalyticsStats from './components/AnalyticsStats.jsx'
import MonthlyChart from './components/MonthlyChart.jsx'
import CategoryPieChart from './components/CategoryPieChart.jsx'
import CategoryBreakdown from './components/CategoryBreakdown.jsx'

const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#E24B4A','#D4537E','#378ADD','#888780','#5DCAA5']

const Analytics = () => {
  const { transactions, savingsTotal, fetchTransactions, fetchSavings } = useFinance()

  useEffect(() => { fetchTransactions(); fetchSavings() }, [])

  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0)
  , [transactions])

  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0)
  , [transactions])

  const monthlyData = useMemo(() =>
    Object.entries(groupByMonth(transactions)).map(([month, data]) => ({
      month,
      income:   parseFloat(data.income.toFixed(2)),
      expenses: parseFloat(data.expenses.toFixed(2)),
    }))
  , [transactions])

  const categoryData = useMemo(() =>
    Object.entries(groupByCategory(transactions))
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
  , [transactions])

  const savingsRate = totalIncome > 0 ? Math.round((savingsTotal / totalIncome) * 100) : 0

  if (transactions.length === 0) return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24 text-center">
      <span className="text-4xl mb-3">📊</span>
      <p className="text-sm text-gray-500 dark:text-gray-400">No data to analyze yet</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add some transactions to see your analytics</p>
    </div>
  )

  return (
    <div className="w-full h-auto mx-auto space-y-6">

      <div>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Overview of your financial activity</p>
      </div>

      <AnalyticsStats
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        savingsTotal={savingsTotal}
        savingsRate={savingsRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart categoryData={categoryData} />
        <CategoryBreakdown categoryData={categoryData} totalExpenses={totalExpenses} />
      </div>

      <MonthlyChart monthlyData={monthlyData} />

    </div>
  )
}

export default Analytics
