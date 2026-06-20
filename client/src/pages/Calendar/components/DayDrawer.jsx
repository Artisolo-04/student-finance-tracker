import { X, ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react'
import { formatCurrency, parseLocalDate } from '../../../context/finance/financeHelpers.js'

const DrawerTransactionRow = ({ t }) => (
  <div className="flex items-center justify-between py-2.5 px-3 rounded-xl
    hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`
        w-8 h-8 rounded-xl flex items-center justify-center border shrink-0
        ${t.type === 'income'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400'
          : 'bg-red-500/10 border-red-500/20 text-red-500 dark:text-red-400'
        }
      `}>
        {t.type === 'income'
          ? <ArrowUpRight size={15} strokeWidth={2.5} />
          : <ArrowDownRight size={15} strokeWidth={2.5} />
        }
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate leading-tight">
          {t.note || t.category_name || 'No description'}
        </p>
        {t.category_name && (
          <span
            className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium border"
            style={{
              background:   (t.category_color || '#7F77DD') + '18',
              color:         t.category_color || '#7F77DD',
              borderColor:  (t.category_color || '#7F77DD') + '35',
            }}
          >
            {t.category_name}
          </span>
        )}
      </div>
    </div>

    <span className={`
      text-sm font-bold tabular-nums shrink-0 ml-3
      ${t.type === 'income'
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-red-600 dark:text-red-400'
      }
    `}>
      {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
    </span>
  </div>
)

const DayDrawer = ({ open, onClose, dateKey, dayData }) => {
  if (!open) return null

  const dateLabel = dateKey
    ? parseLocalDate(dateKey).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  const income = dayData?.income ?? 0
  const expense = dayData?.expense ?? 0
  const net = dayData?.net ?? 0
  const transactions = dayData?.transactions ?? []

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="
        h-full w-full max-w-md
        bg-[#0f0f1c] border-l border-white/[0.08]
        shadow-2xl flex flex-col
        animate-slideInRight
      ">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/[0.06] shrink-0">
          <div>
            <p className="text-xs text-zinc-500">{dateLabel}</p>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${
              net > 0 ? 'text-emerald-400' : net < 0 ? 'text-red-400' : 'text-zinc-300'
            }`}>
              {net > 0 ? '+' : ''}{formatCurrency(net)}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl
              text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300 transition-all">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 gap-3 px-5 py-4 shrink-0">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-3">
            <p className="text-[11px] text-zinc-500 mb-1">Income</p>
            <p className="text-sm font-bold text-emerald-400 tabular-nums">{formatCurrency(income)}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-3">
            <p className="text-[11px] text-zinc-500 mb-1">Expenses</p>
            <p className="text-sm font-bold text-red-400 tabular-nums">{formatCurrency(expense)}</p>
          </div>
        </div>

        {/* Transaction list */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-5">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12">
              <Receipt size={20} className="text-zinc-600" />
              <p className="text-xs text-zinc-500">No transactions this day</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {transactions.map(t => (
                <DrawerTransactionRow key={t.id} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayDrawer
