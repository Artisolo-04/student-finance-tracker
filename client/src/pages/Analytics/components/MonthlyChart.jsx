import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

const MonthlyChart = ({ monthlyData }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-lg">
    <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Income vs expenses</h2>
    <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Monthly breakdown</p>

    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={monthlyData} barGap={4} barSize={20}>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} DT`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="income"   name="Income"   fill="#CECBF6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#F5C4B3" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>

    <div className="flex gap-4 mt-2 justify-center">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-purple-200" />
        <span className="text-xs text-gray-400 dark:text-gray-500">Income</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-orange-200" />
        <span className="text-xs text-gray-400 dark:text-gray-500">Expenses</span>
      </div>
    </div>
  </div>
)

export default MonthlyChart
