import { useEffect, useMemo, useState } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import { groupByCategory, groupByMonth } from '../../context/finance/financeHelpers.js'
import AnalyticsStats from './components/AnalyticsStats.jsx'
import MonthlyChart from './components/MonthlyChart.jsx'
import CategoryOverview from './components/CategoryOverview.jsx'
import Insights from './components/Insights.jsx'

const TABS = ['Overview', 'Monthly', 'Insights']

const Analytics = () => {
  const { transactions, savingsTotal, fetchTransactions, fetchSavings } = useFinance()
  const [activeTab, setActiveTab] = useState('Overview')

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
    <div className="w-full sm:h-full flex flex-col items-center justify-center text-center gap-2">
      <span className="text-4xl">📊</span>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">No data to analyze yet</p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">Add some transactions to see your analytics</p>
    </div>
  )

  return (
    <div className="w-full sm:h-full flex flex-col gap-4">

      <div className="shrink-0 animate-fadeUp">
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Analytics</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Overview of your financial activity</p>
      </div>

      <div className="shrink-0 flex items-center gap-1
        bg-white dark:bg-[#0f0f1c]
        border border-black/[0.07] dark:border-white/[0.07]
        rounded-xl p-1 w-fit animate-fadeUp stagger-1"
      >
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="sm:flex-1 sm:min-h-0 sm:overflow-y-auto animate-fadeUp stagger-2">

        {activeTab === 'Overview' && (
          <div className="sm:h-full flex flex-col gap-4">
            <div className="shrink-0">
              <AnalyticsStats
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                savingsTotal={savingsTotal}
                savingsRate={savingsRate}
              />
            </div>
            <div className="sm:flex-1 sm:min-h-0">
              <CategoryOverview
                categoryData={categoryData}
                totalExpenses={totalExpenses}
              />
            </div>
          </div>
        )}

        {activeTab === 'Monthly' && (
          <div className="sm:h-full sm:overflow-y-auto">
            <MonthlyChart
              monthlyData={monthlyData}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
          </div>
        )}

        {activeTab === 'Insights' && (
          <Insights
            transactions={transactions}
            categoryData={categoryData}
            monthlyData={monthlyData}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            savingsTotal={savingsTotal}
            savingsRate={savingsRate}
          />
        )}

      </div>
    </div>
  )
}

export default Analytics
