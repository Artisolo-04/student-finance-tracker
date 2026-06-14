import { Link } from 'react-router-dom'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { ArrowUpRight, ArrowDownRight, ArrowRight, Receipt } from 'lucide-react'

const TransactionRow = ({ t, index }) => (
  <div
    className={`
      flex items-center justify-between py-2.5 px-3 rounded-xl
      hover:bg-black/[0.03] dark:hover:bg-white/[0.03]
      transition-colors animate-fadeUp
    `}
    style={{ animationDelay: `${index * 0.05}s` }}
  >
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
        <div className="flex items-center gap-2 mt-0.5">
          {t.category_name && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium border"
              style={{
                background:   (t.category_color || '#7F77DD') + '18',
                color:         t.category_color || '#7F77DD',
                borderColor:  (t.category_color || '#7F77DD') + '35',
              }}
            >
              {t.category_name}
            </span>
          )}
          <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
            {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
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

const RecentTransactions = ({ transactions }) => (
  <div className="
    h-full flex flex-col rounded-2xl p-4
    bg-white dark:bg-[#0f0f1c]
    border border-black/[0.07] dark:border-white/[0.07]
  ">
    <div className="flex items-center justify-between mb-3 shrink-0">
      <div>
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Recent transactions
        </h2>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">
          Last 10 activities
        </p>
      </div>
      <Link
        to="/transactions"
        className="flex items-center gap-1 text-xs font-medium
          text-purple-600 dark:text-purple-400
          hover:text-purple-700 dark:hover:text-purple-300
          transition-colors"
      >
        View all <ArrowRight size={11} />
      </Link>
    </div>

    {transactions.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
        <div className="w-11 h-11 rounded-2xl
          bg-zinc-100 dark:bg-zinc-800/60
          border border-black/[0.05] dark:border-white/[0.05]
          flex items-center justify-center">
          <Receipt size={18} className="text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">No transactions yet</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-700">Add your first income or expense</p>
      </div>
    ) : (
      <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5 px-2">
        {transactions.map((t, i) => (
          <TransactionRow key={t.id} t={t} index={i} />
        ))}
      </div>
    )}
  </div>
)

export default RecentTransactions
