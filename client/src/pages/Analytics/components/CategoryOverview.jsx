import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#E24B4A','#D4537E','#378ADD','#5DCAA5','#F59E0B']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{payload[0].name}</p>
      <p className="text-sm font-semibold text-zinc-100">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

const CategoryOverview = ({ categoryData, totalExpenses }) => {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="h-full w-full bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 flex flex-col animate-fadeUp justify-between ">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Expenses by category</h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Where your money goes</p>
      </div>

      {categoryData.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-xs text-zinc-500">No expenses yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 flex items-end justify-between h-full overflow-hidden">

          <div className="flex flex-col items-center justify-between h-full">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={100}
                  paddingAngle={2} dataKey="value"
                  strokeWidth={0}
                  onMouseEnter={(_, i) => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {categoryData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      opacity={hovered === null || hovered === i ? 1 : 0.35}
                      style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 -mt-1">
              {categoryData.length} categories
            </p>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-40 pr-2 ">
            {categoryData.map((cat, i) => {
              const pct = totalExpenses > 0 ? Math.round((cat.value / totalExpenses) * 100) : 0
              return (
                <div
                  key={cat.name}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`transition-opacity duration-200 ${
                    hovered === null || hovered === i ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[100px]">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{pct}%</span>
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}
    </div>
  )
}

export default CategoryOverview
