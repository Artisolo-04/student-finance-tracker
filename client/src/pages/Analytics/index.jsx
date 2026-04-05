import { useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency, groupByCategory, groupByMonth } from '../../context/finance/financeHelpers.js'

const COLORS = [
  '#7F77DD', '#1D9E75', '#EF9F27', '#E24B4A',
  '#D4537E', '#378ADD', '#888780', '#5DCAA5'
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const Analytics = () => {
  const { transactions, savingsTotal, fetchTransactions, fetchSavings } = useFinance()

  useEffect(() => {
    fetchTransactions()
    fetchSavings()
  }, [])

  const totalIncome = useMemo(() =>
    transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0),
    [transactions]
  )

  const totalExpenses = useMemo(() =>
    transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + parseFloat(t.amount), 0),
    [transactions]
  )

  const monthlyData = useMemo(() => {
    const grouped = groupByMonth(transactions)
    return Object.entries(grouped).map(([month, data]) => ({
      month,
      income: parseFloat(data.income.toFixed(2)),
      expenses: parseFloat(data.expenses.toFixed(2)),
    }))
  }, [transactions])

  const categoryData = useMemo(() => {
    const grouped = groupByCategory(transactions)
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const savingsRate = totalIncome > 0
    ? Math.round((savingsTotal / totalIncome) * 100)
    : 0

  const topCategory = categoryData[0] || null

  if (transactions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-4xl mb-3">📊</span>
          <p className="text-sm text-gray-500">No data to analyze yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Add some transactions to see your analytics
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <div>
        <h1 className="text-lg font-medium text-gray-900">Analytics</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Overview of your financial activity
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total income</p>
          <p className="text-xl font-medium text-gray-900">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total expenses</p>
          <p className="text-xl font-medium text-red-500">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Total saved</p>
          <p className="text-xl font-medium text-green-600">{formatCurrency(savingsTotal)}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Savings rate</p>
          <p className="text-xl font-medium text-purple-600">{savingsRate}%</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-1">Income vs expenses</h2>
        <p className="text-xs text-gray-400 mb-5">Monthly breakdown</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} barGap={4} barSize={20}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v} DT`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#CECBF6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#F5C4B3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-purple-200" />
            <span className="text-xs text-gray-400">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-200" />
            <span className="text-xs text-gray-400">Expenses</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-1">Expenses by category</h2>
          <p className="text-xs text-gray-400 mb-4">Where your money goes</p>

          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-xs text-gray-400">No expenses yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #f3f4f6',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-1">Category breakdown</h2>
          <p className="text-xs text-gray-400 mb-4">Sorted by spending</p>

          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-xs text-gray-400">No expenses yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoryData.map((cat, index) => {
                const pct = totalExpenses > 0
                  ? Math.round((cat.value / totalExpenses) * 100)
                  : 0
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs text-gray-600">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{pct}%</span>
                        <span className="text-xs font-medium text-gray-700">
                          {formatCurrency(cat.value)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-50 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {topCategory && (
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Biggest spend category is{' '}
                <span className="font-medium text-gray-700">{topCategory.name}</span>
                {' '}at{' '}
                <span className="font-medium text-gray-700">
                  {formatCurrency(topCategory.value)}
                </span>
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Analytics
