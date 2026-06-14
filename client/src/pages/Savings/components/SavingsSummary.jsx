import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { PiggyBank, TrendingUp } from 'lucide-react'

const SavingsSummary = ({ savingsTotal, count }) => (
  <div className="lg:col-span-1 bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6
    flex flex-col items-center justify-center text-center">
    <div className="relative mb-4">
      <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/20
        flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-800/20 border border-purple-300 dark:border-purple-600/30
          flex items-center justify-center">
          <PiggyBank size={30} className="text-purple-500 dark:text-purple-300" strokeWidth={1.5} />
        </div>
      </div>
    </div>
    <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Total saved</p>
    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
      {formatCurrency(savingsTotal)}
    </p>
    <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">across {count} auto-saves</p>
    {count > 0 && (
      <div className="flex items-center gap-1.5 mt-4 bg-emerald-500/10 border border-emerald-500/20
        px-3 py-1.5 rounded-full">
        <TrendingUp size={11} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Growing automatically</span>
      </div>
    )}
  </div>
)

export default SavingsSummary
