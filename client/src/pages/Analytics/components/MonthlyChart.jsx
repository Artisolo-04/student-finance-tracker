import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-zinc-500 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-zinc-400">{p.name}:</span>
          <span className="font-semibold text-zinc-200">{formatCurrency(p.value)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Net:</span>
          <span className={`font-semibold ${
            payload[0].value - payload[1].value >= 0
              ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {formatCurrency(payload[0].value - payload[1].value)}
          </span>
        </div>
      )}
    </div>
  )
}

const MonthlyChart = ({ monthlyData, totalIncome, totalExpenses }) => {
  const bestMonth = monthlyData.length > 0
    ? monthlyData.reduce((best, m) =>
        (m.income - m.expenses) > (best.income - best.expenses) ? m : best
      )
    : null

  const worstMonth = monthlyData.length > 0
    ? monthlyData.reduce((worst, m) =>
        (m.income - m.expenses) < (worst.income - worst.expenses) ? m : worst
      )
    : null

  const avgNet = monthlyData.length > 0
    ? monthlyData.reduce((acc, m) => acc + (m.income - m.expenses), 0) / monthlyData.length
    : 0

  const trend = monthlyData.length >= 2
    ? monthlyData[monthlyData.length - 1].expenses - monthlyData[monthlyData.length - 2].expenses
    : 0

  return (
    <div className="sm:h-full flex flex-col gap-4">

      {/* Summary mini cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
        {[
          {
            label: 'Best month',
            value: bestMonth?.month ?? '—',
            sub: bestMonth ? `+${formatCurrency(bestMonth.income - bestMonth.expenses)} net` : '',
            icon: TrendingUp,
            color: 'text-emerald-400',
            iconStyle: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          },
          {
            label: 'Worst month',
            value: worstMonth?.month ?? '—',
            sub: worstMonth ? `${formatCurrency(worstMonth.income - worstMonth.expenses)} net` : '',
            icon: TrendingDown,
            color: 'text-red-400',
            iconStyle: 'bg-red-500/10 border-red-500/20 text-red-400',
          },
          {
            label: 'Avg net/month',
            value: formatCurrency(Math.abs(avgNet)),
            sub: avgNet >= 0 ? 'surplus avg' : 'deficit avg',
            icon: Minus,
            color: avgNet >= 0 ? 'text-purple-400' : 'text-amber-400',
            iconStyle: avgNet >= 0
              ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          },
        ].map(({ label, value, sub, icon: Icon, color, iconStyle }, index) => (
          <div key={label} className={`bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-4 ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{label}</p>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${iconStyle}`}>
                <Icon size={13} strokeWidth={2} />
              </div>
            </div>
            <p className={`text-base font-bold tracking-tight ${color}`}>{value}</p>
            {sub && <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="sm:flex-1 sm:min-h-0 min-h-[320px] bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 flex flex-col">
        <div className="flex items-start justify-between mb-5 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Income vs Expenses</h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Monthly breakdown</p>
          </div>
          {/* Trend badge */}
          {monthlyData.length >= 2 && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
              ${trend <= 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
              {trend <= 0
                ? <TrendingDown size={12} strokeWidth={2} />
                : <TrendingUp size={12} strokeWidth={2} />
              }
              {trend <= 0 ? 'Spending down' : 'Spending up'}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col min-h-0 items-center justify-end">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={monthlyData} barGap={4} barSize={45}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="month"
                tick={{ fontSize: 11, fill: '#52525b' }}
                axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#52525b' }}
                axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
              <Bar dataKey="income"   name="Income"   fill="#7F77DD" radius={[6,6,0,0]} opacity={0.85} />
              <Bar dataKey="expenses" name="Expenses" fill="#E24B4A" radius={[6,6,0,0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>


        <div className="flex gap-5 mt-3 justify-center shrink-0">
          {[{ color: '#7F77DD', label: 'Income' }, { color: '#E24B4A', label: 'Expenses' }].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <span className="text-xs text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default MonthlyChart
