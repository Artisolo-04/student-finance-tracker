import { useEffect } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency } from '../../context/finance/financeHelpers.js'

const Savings = () => {
  const { savings, savingsTotal, loading, fetchSavings } = useFinance()

  useEffect(() => { fetchSavings() }, [])

  const avgSaving = savings.length > 0
    ? savingsTotal / savings.length
    : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div>
        <h1 className="text-lg font-medium text-gray-900">Piggy Bank</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Automatically saved every time new income arrives
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-28 h-28 rounded-full bg-green-50 border-4 border-green-100 flex flex-col items-center justify-center mb-4">
            <span className="text-2xl">🐷</span>
            <span className="text-lg font-medium text-green-700 mt-1">
              {formatCurrency(savingsTotal).split('.')[0]}
            </span>
            <span className="text-xs text-green-500">DT</span>
          </div>
          <p className="text-sm font-medium text-gray-900">Total saved</p>
          <p className="text-2xl font-medium text-green-600 mt-1">
            {formatCurrency(savingsTotal)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            across {savings.length} auto-saves
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Total entries
            </p>
            <p className="text-2xl font-medium text-gray-900">{savings.length}</p>
            <p className="text-xs text-gray-400 mt-1">auto-save events</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Average saved
            </p>
            <p className="text-2xl font-medium text-gray-900">
              {formatCurrency(avgSaving)}
            </p>
            <p className="text-xs text-gray-400 mt-1">per income cycle</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Largest save
            </p>
            <p className="text-2xl font-medium text-green-600">
              {savings.length > 0
                ? formatCurrency(Math.max(...savings.map(s => parseFloat(s.amount))))
                : '0.00 DT'}
            </p>
            <p className="text-xs text-gray-400 mt-1">single auto-save</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Smallest save
            </p>
            <p className="text-2xl font-medium text-gray-900">
              {savings.length > 0
                ? formatCurrency(Math.min(...savings.map(s => parseFloat(s.amount))))
                : '0.00 DT'}
            </p>
            <p className="text-xs text-gray-400 mt-1">single auto-save</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-medium text-gray-900">Save history</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : savings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">🐷</span>
            <p className="text-sm text-gray-500">No savings yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              When you receive new income while you still have money left,
              the leftover is automatically saved here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {savings.map((s, index) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-sm">
                    🐷
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      {s.note || 'Auto-saved'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(s.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      +{formatCurrency(s.amount)}
                    </p>
                    <p className="text-xs text-gray-400">
                      #{savings.length - index}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {savings.length > 0 && (
          <div className="px-5 py-3 bg-green-50 border-t border-green-100 flex justify-between items-center">
            <span className="text-xs text-green-600 font-medium">Total accumulated</span>
            <span className="text-sm font-medium text-green-700">
              {formatCurrency(savingsTotal)}
            </span>
          </div>
        )}
      </div>

    </div>
  )
}

export default Savings
