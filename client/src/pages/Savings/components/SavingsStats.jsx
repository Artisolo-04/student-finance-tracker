import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { Hash, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatCard = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-4 min-w-0">
    <div className="flex items-start justify-between mb-3 gap-2">
      <p className="text-[11px] text-zinc-500 dark:text-zinc-600 uppercase tracking-wider font-medium leading-tight">{label}</p>
      {Icon && (
        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${color}`}>
          <Icon size={13} strokeWidth={2} />
        </div>
      )}
    </div>
    <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1 truncate">{value}</p>
    <p className="text-[11px] text-zinc-400 dark:text-zinc-600 truncate">{sub}</p>
  </div>
)

const SavingsStats = ({ savings, savingsTotal, avgSaving }) => (
  <div className="lg:col-span-2 grid grid-cols-2 xl:grid-cols-2 gap-4">
    <StatCard
      label="Total entries"
      value={savings.length}
      sub="auto-save events"
      icon={Hash}
      color="bg-purple-500/10 border-purple-500/20 text-purple-500 dark:text-purple-400"
    />
    <StatCard
      label="Average saved"
      value={formatCurrency(avgSaving)}
      sub="per income cycle"
      icon={Minus}
      color="bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400"
    />
    <StatCard
      label="Largest save"
      value={savings.length > 0
        ? formatCurrency(Math.max(...savings.map(s => parseFloat(s.amount))))
        : '0.00 DT'}
      sub="single auto-save"
      icon={TrendingUp}
      color="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400"
    />
    <StatCard
      label="Smallest save"
      value={savings.length > 0
        ? formatCurrency(Math.min(...savings.map(s => parseFloat(s.amount))))
        : '0.00 DT'}
      sub="single auto-save"
      icon={TrendingDown}
      color="bg-zinc-200 dark:bg-zinc-700/40 border-zinc-300 dark:border-zinc-600/30 text-zinc-500 dark:text-zinc-400"
    />
  </div>
)

export default SavingsStats
