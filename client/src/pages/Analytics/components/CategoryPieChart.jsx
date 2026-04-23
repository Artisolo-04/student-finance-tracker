import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#E24B4A','#D4537E','#378ADD','#888780','#5DCAA5']

const CategoryPieChart = ({ categoryData }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-lg">
    <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Expenses by category</h2>
    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Where your money goes</p>

    {categoryData.length === 0 ? (
      <div className="flex items-center justify-center py-12">
        <p className="text-xs text-gray-400 dark:text-gray-500">No expenses yet</p>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {categoryData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '12px' }}
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
)

export default CategoryPieChart
