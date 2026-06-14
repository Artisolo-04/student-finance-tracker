import { useEffect } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import SavingsSummary from './components/SavingsSummary.jsx'
import SavingsStats from './components/SavingsStats.jsx'
import SavingsHistory from './components/SavingsHistory.jsx'

const Savings = () => {
  const { savings, savingsTotal, loading, fetchSavings } = useFinance()
  useEffect(() => { fetchSavings() }, [])
  const avgSaving = savings.length > 0 ? savingsTotal / savings.length : 0

  return (
    <div className="w-full sm:h-full flex flex-col gap-5">

      <div className="shrink-0 animate-fadeUp">
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
          Piggy Bank
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Automatically saved every time new income arrives
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0 animate-fadeUp stagger-1">
        <SavingsSummary savingsTotal={savingsTotal} count={savings.length} />
        <SavingsStats savings={savings} savingsTotal={savingsTotal} avgSaving={avgSaving} />
      </div>

      <div className="
        sm:flex-1 sm:min-h-0
        min-h-[50vh]
        flex flex-col
        bg-white dark:bg-[#0f0f1c]
        border border-black/[0.07] dark:border-white/[0.07]
        rounded-2xl overflow-hidden
        animate-fadeUp stagger-2
      ">
        <div className="sm:overflow-y-auto flex-1">
          <SavingsHistory savings={savings} loading={loading} savingsTotal={savingsTotal} />
        </div>
      </div>

    </div>
  )
}

export default Savings
