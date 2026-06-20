import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const DayCell = ({ day, isToday, dayData, onClick }) => {
  const hasData = !!dayData
  const net = dayData?.net ?? 0
  const isPositive = net > 0
  const isNegative = net < 0

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!hasData}
      className={`
        relative flex flex-col items-start p-2 rounded-xl border text-left
        transition-all duration-150 min-h-[64px]
        ${hasData ? 'cursor-pointer hover:scale-[1.03] hover:shadow-md' : 'cursor-default'}
        ${isToday
          ? 'border-purple-500/50 ring-2 ring-purple-500/20'
          : 'border-black/[0.05] dark:border-white/[0.05]'
        }
        ${hasData
          ? isPositive
            ? 'bg-emerald-500/[0.06] hover:bg-emerald-500/[0.1]'
            : isNegative
              ? 'bg-red-500/[0.06] hover:bg-red-500/[0.1]'
              : 'bg-zinc-50 dark:bg-white/[0.02]'
          : 'bg-zinc-50/50 dark:bg-white/[0.01]'
        }
      `}
    >
      <span className={`text-[11px] font-semibold ${
        isToday
          ? 'text-purple-600 dark:text-purple-400'
          : hasData
            ? 'text-zinc-700 dark:text-zinc-300'
            : 'text-zinc-300 dark:text-zinc-700'
      }`}>
        {day}
      </span>

      {hasData && (
        <span className={`text-[11px] font-bold mt-auto tabular-nums ${
          isPositive
            ? 'text-emerald-600 dark:text-emerald-400'
            : isNegative
              ? 'text-red-600 dark:text-red-400'
              : 'text-zinc-400'
        }`}>
          {isPositive ? '+' : ''}{formatCurrency(net)}
        </span>
      )}

      {hasData && dayData.transactions.length > 1 && (
        <span className="absolute top-1.5 right-1.5 text-[9px] font-medium
          text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800
          rounded-full w-4 h-4 flex items-center justify-center">
          {dayData.transactions.length}
        </span>
      )}
    </button>
  )
}

export default DayCell
