import { formatCurrency, parseLocalDate  } from '../../../context/finance/financeHelpers.js'
import { ArrowUpRight, ArrowDownRight, X, Receipt } from 'lucide-react'

const TransactionRow = ({ t, onDelete, deleting }) => (
  <div className="flex items-center justify-between px-4 py-3.5
    hover:bg-white/[0.03] transition-colors group rounded-xl">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0
        ${t.type === 'income'
          ? 'bg-green-500/10 border-green-500/20 text-green-400'
          : 'bg-red-500/10  border-red-500/20  text-red-400'}`}>
        {t.type === 'income'
          ? <ArrowUpRight   size={16} strokeWidth={2} />
          : <ArrowDownRight size={16} strokeWidth={2} />
        }
      </div>
      <div className="min-w-0">
        <p className="text-sm text-zinc-200 font-medium truncate">
          {t.note || t.category_name || 'No description'}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {t.category_name && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
              style={{
                background:  (t.category_color || '#7F77DD') + '15',
                color:        t.category_color || '#7F77DD',
                borderColor: (t.category_color || '#7F77DD') + '30',
              }}>
              {t.category_name}
            </span>
          )}
          <span className="text-[11px] text-zinc-600">
            {parseLocalDate(t.date).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3 shrink-0 ml-2">
      <span className={`text-sm font-semibold
        ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
      </span>
      <button
        onClick={() => onDelete(t.id)}
        disabled={deleting === t.id}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center
          rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10
          transition-all border border-transparent hover:border-red-500/20"
      >
        {deleting === t.id
          ? <span className="w-3 h-3 border border-zinc-500 border-t-transparent rounded-full animate-spin" />
          : <X size={13} strokeWidth={2.5} />
        }
      </button>
    </div>
  </div>
)

const TransactionList = ({ transactions, loading, onDelete, deleting, filter }) => {
  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (transactions.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800/60 border border-white/[0.05]
        flex items-center justify-center mb-4">
        <Receipt size={24} className="text-zinc-600" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-zinc-500 font-medium">No transactions found</p>
      <p className="text-xs text-zinc-700 mt-1">
        {filter !== 'all' ? 'Try a different filter' : 'Add your first transaction'}
      </p>
    </div>
  )

  return (
    <div className="divide-y divide-white/[0.04] gap-2 flex flex-col">
      {transactions.map(t => (
        <TransactionRow key={t.id} t={t} onDelete={onDelete} deleting={deleting} />
      ))}
    </div>
  )
}

export default TransactionList
