import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { PiggyBank, ArrowRight } from 'lucide-react'

const SavingsOverview = ({ savingsTotal, totalIncome, totalExpenses }) => {
  const rate = totalIncome > 0 ? Math.round((savingsTotal / totalIncome) * 100) : 0
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const offset = animated
    ? circumference - (Math.min(rate, 100) / 100) * circumference
    : circumference

  const stats = [
    { label: 'Income',   value: formatCurrency(totalIncome),   color: 'text-zinc-700 dark:text-zinc-300' },
    { label: 'Expenses', value: formatCurrency(totalExpenses), color: 'text-zinc-700 dark:text-zinc-300' },
    { label: 'Rate',     value: `${rate}%`,                    color: 'text-purple-600 dark:text-purple-400 font-bold' },
  ]

  return (
    <div className="
      h-full flex flex-col rounded-2xl p-4
      bg-white dark:bg-[#0f0f1c]
      border border-black/[0.07] dark:border-white/[0.07]
      animate-fadeUp
    ">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Savings overview
          </h2>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">
            Rate based on total income
          </p>
        </div>
        <Link
          to="/savings"
          className="flex items-center gap-1 text-xs font-medium
            text-purple-600 dark:text-purple-400
            hover:text-purple-700 dark:hover:text-purple-300
            transition-colors shrink-0"
        >
          View all <ArrowRight size={11} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-2">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <defs>
              <filter id="ring-glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx="50" cy="50" r={radius} fill="none"
              className="stroke-zinc-100 dark:stroke-zinc-800/80"
              strokeWidth="7"
            />

            <circle cx="50" cy="50" r={radius} fill="none"
              stroke="#8b5cf6"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              filter="url(#ring-glow)"
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <PiggyBank size={18} className="text-purple-500 dark:text-purple-400" strokeWidth={1.5} />
            <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 leading-none tabular-nums">
              {rate}%
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600">saved</span>
          </div>
        </div>

        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          {formatCurrency(savingsTotal)}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600">Total accumulated</p>
      </div>

      <div className="
        border-t border-black/[0.05] dark:border-white/[0.05]
        pt-3 mt-auto space-y-2 shrink-0
      ">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 dark:text-zinc-600">{label}</span>
            <span className={`text-xs ${color}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavingsOverview
