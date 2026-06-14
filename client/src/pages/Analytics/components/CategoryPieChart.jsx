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

const CategoryPieChart = ({ categoryData }) => (
  <div className="bg-[#0f0f1c] border border-white/[0.07] rounded-2xl p-5">
    <div className="mb-4">
      <h2 className="text-sm font-semibold text-zinc-200">Expenses by category</h2>
      <p className="text-xs text-zinc-600 mt-0.5">Where your money goes</p>
    </div>

    {categoryData.length === 0 ? (
      <div className="flex items-center justify-center py-16">
        <p className="text-xs text-zinc-600">No expenses yet</p>
      </div>
    ) : (
      <>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%" cy="50%"
              innerRadius={55} outerRadius={85}
              paddingAngle={3} dataKey="value"
              strokeWidth={0}
            >
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {categoryData.slice(0, 5).map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-zinc-400 truncate max-w-[120px]">{item.name}</span>
              </div>
              <span className="text-xs font-medium text-zinc-300">{formatCurrency(item.value)}</span>
            </div>
          ))}
          {categoryData.length > 5 && (
            <p className="text-[10px] text-zinc-700 text-center pt-1">
              +{categoryData.length - 5} more categories
            </p>
          )}
        </div>
      </>
    )}
  </div>
)

export default CategoryPieChart
