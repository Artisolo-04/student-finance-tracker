import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { PiggyBank, Inbox } from 'lucide-react'

const SavingsRow = ({ s, index, total }) => (
  <div className="flex items-center justify-between px-5 py-4
    hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors
    border-b border-black/[0.05] dark:border-white/[0.04] last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20
        flex items-center justify-center shrink-0">
        <PiggyBank size={16} className="text-purple-500 dark:text-purple-400" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
          {s.note || `Auto-saved on ${new Date(s.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}`}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
          {new Date(s.created_at).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
    </div>
    <div className="text-right shrink-0 ml-4">
      <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
        +{formatCurrency(s.amount)}
      </p>
      <p className="text-[10px] text-zinc-400 dark:text-zinc-700">#{total - index}</p>
    </div>
  </div>
)

const SavingsHistory = ({ savings, loading, savingsTotal }) => (
  <div className="flex flex-col">
    <div className="px-5 py-4 border-b border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between">
      <div>
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Save history</h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">{savings.length} entries</p>
      </div>
      {savings.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(savingsTotal)} total
          </span>
        </div>
      )}
    </div>

    {loading ? (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : savings.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-black/[0.05] dark:border-white/[0.05]
          flex items-center justify-center mb-4">
          <Inbox size={24} className="text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-zinc-500 font-medium">No savings yet</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-700 mt-1 max-w-xs leading-relaxed">
          When you receive income while you still have a balance,
          the leftover is automatically saved here
        </p>
      </div>
    ) : (
      <div className="max-h-96 overflow-y-auto">
        {savings.map((s, i) => (
          <SavingsRow key={s.id} s={s} index={i} total={savings.length} />
        ))}
      </div>
    )}
  </div>
)

export default SavingsHistory
