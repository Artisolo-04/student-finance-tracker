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
    <div className="max-w-4xl mx-auto flex flex-col gap-6 sm:h-full">

      <div>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Piggy Bank</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Automatically saved every time new income arrives
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SavingsSummary savingsTotal={savingsTotal} count={savings.length} />
        <SavingsStats savings={savings} savingsTotal={savingsTotal} avgSaving={avgSaving} />
      </div>

      {/* this takes all remaining space and scrolls inside */}
      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg p-2">
        <SavingsHistory savings={savings} loading={loading} savingsTotal={savingsTotal} />
      </div>

    </div>
  )
}

export default Savings
