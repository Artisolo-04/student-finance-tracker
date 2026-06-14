import { useMemo } from 'react'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import {
  AlertTriangle, Award, TrendingUp, TrendingDown,
  Zap, Target, Calendar, ArrowUpRight
} from 'lucide-react'

const InsightCard = ({ icon: Icon, title, description, value, color, bg, border }) => (
  <div className={`
    rounded-2xl p-4 border flex flex-col gap-3
    ${bg} ${border}
    animate-fadeUp
  `}>
    <div className="flex items-start justify-between">
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${color} ${border}`}
        style={{ background: 'transparent' }}>
        <Icon size={16} strokeWidth={1.8} />
      </div>
      {value && (
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${bg} ${color} border ${border}`}>
          {value}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">{title}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 leading-relaxed">{description}</p>
    </div>
  </div>
)

const Insights = ({
  transactions, categoryData, monthlyData,
  totalIncome, totalExpenses, savingsTotal, savingsRate
}) => {

  const insights = useMemo(() => {
    const list = []

    if (categoryData.length > 0) {
      const top = categoryData[0]
      const pct = totalExpenses > 0 ? Math.round((top.value / totalExpenses) * 100) : 0
      list.push({
        icon: Award,
        title: `${top.name} is your biggest expense`,
        description: `You spent ${formatCurrency(top.value)} on ${top.name}, which is ${pct}% of your total expenses.`,
        value: `${pct}%`,
        color: 'text-amber-400',
        bg: 'bg-amber-500/[0.07]',
        border: 'border-amber-500/20',
      })
    }

    if (savingsRate >= 20) {
      list.push({
        icon: Target,
        title: 'Great savings rate!',
        description: `You're saving ${savingsRate}% of your income. Financial experts recommend at least 20% — you're on track.`,
        value: `${savingsRate}%`,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/[0.07]',
        border: 'border-emerald-500/20',
      })
    } else if (savingsRate > 0) {
      list.push({
        icon: Target,
        title: 'Savings rate can improve',
        description: `You're saving ${savingsRate}% of your income. Try to reach 20% by cutting your top expense category.`,
        value: `${savingsRate}%`,
        color: 'text-amber-400',
        bg: 'bg-amber-500/[0.07]',
        border: 'border-amber-500/20',
      })
    }

    const ratio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0
    if (ratio > 90) {
      list.push({
        icon: AlertTriangle,
        title: 'Spending almost all income',
        description: `You're spending ${Math.round(ratio)}% of your income. Very little room for savings — consider reducing expenses.`,
        value: `${Math.round(ratio)}%`,
        color: 'text-red-400',
        bg: 'bg-red-500/[0.07]',
        border: 'border-red-500/20',
      })
    } else if (ratio <= 70) {
      list.push({
        icon: Zap,
        title: 'Healthy spending ratio',
        description: `You're spending ${Math.round(ratio)}% of your income. You have good control over your budget.`,
        value: `${Math.round(ratio)}%`,
        color: 'text-purple-400',
        bg: 'bg-purple-500/[0.07]',
        border: 'border-purple-500/20',
      })
    }

    if (monthlyData.length >= 2) {
      const last  = monthlyData[monthlyData.length - 1]
      const prev  = monthlyData[monthlyData.length - 2]
      const diff  = last.expenses - prev.expenses
      const pct   = prev.expenses > 0 ? Math.abs(Math.round((diff / prev.expenses) * 100)) : 0
      if (diff > 0) {
        list.push({
          icon: TrendingUp,
          title: `Spending increased in ${last.month}`,
          description: `Your expenses went up by ${formatCurrency(diff)} (${pct}%) compared to ${prev.month}.`,
          value: `+${pct}%`,
          color: 'text-red-400',
          bg: 'bg-red-500/[0.07]',
          border: 'border-red-500/20',
        })
      } else {
        list.push({
          icon: TrendingDown,
          title: `Spending decreased in ${last.month}`,
          description: `Great job! Your expenses dropped by ${formatCurrency(Math.abs(diff))} (${pct}%) compared to ${prev.month}.`,
          value: `-${pct}%`,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/[0.07]',
          border: 'border-emerald-500/20',
        })
      }
    }

    if (monthlyData.length > 0) {
      const busiest = monthlyData.reduce((max, m) =>
        (m.income + m.expenses) > ((max?.income ?? 0) + (max?.expenses ?? 0)) ? m : max
      , null)
      if (busiest) {
        list.push({
          icon: Calendar,
          title: `${busiest.month} was your busiest month`,
          description: `Total activity of ${formatCurrency(busiest.income + busiest.expenses)} — ${formatCurrency(busiest.income)} income and ${formatCurrency(busiest.expenses)} expenses.`,
          value: null,
          color: 'text-blue-400',
          bg: 'bg-blue-500/[0.07]',
          border: 'border-blue-500/20',
        })
      }
    }

    const biggestExpense = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))[0]
    if (biggestExpense) {
      list.push({
        icon: ArrowUpRight,
        title: 'Largest single expense',
        description: `"${biggestExpense.note || biggestExpense.category_name || 'Unnamed'}" on ${new Date(biggestExpense.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        value: formatCurrency(biggestExpense.amount),
        color: 'text-red-400',
        bg: 'bg-red-500/[0.07]',
        border: 'border-red-500/20',
      })
    }

    return list
  }, [transactions, categoryData, monthlyData, totalIncome, totalExpenses, savingsTotal, savingsRate])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">{insights.length} insights based on your data</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={i} {...insight} />
        ))}
      </div>
    </div>
  )
}

export default Insights
