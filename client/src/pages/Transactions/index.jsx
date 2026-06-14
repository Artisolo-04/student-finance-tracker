import { useEffect, useState, useMemo } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import useUI from '../../context/ui/useUI.js'
import { formatCurrency } from '../../context/finance/financeHelpers.js'
import TransactionForm from './components/TransactionForm.jsx'
import TransactionFilters from './components/TransactionFilters.jsx'
import TransactionList from './components/TransactionList.jsx'
import { Plus } from 'lucide-react'

const isInPeriod = (dateStr, period) => {
  const date = new Date(dateStr)
  const now  = new Date()
  if (period === 'today') return date.toDateString() === now.toDateString()
  if (period === 'week') {
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0,0,0,0)
    return date >= start
  }
  if (period === 'month')
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  return true
}

const Transactions = () => {
  const { transactions, balance, loading, fetchTransactions, fetchCategories, deleteTransaction } = useFinance()
  const { notify } = useUI()

  const [showForm,       setShowForm]       = useState(false)
  const [deleting,       setDeleting]       = useState(null)
  const [search,         setSearch]         = useState('')
  const [filter,         setFilter]         = useState('all')
  const [dateFilter,     setDateFilter]     = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => { fetchTransactions(); fetchCategories() }, [])

  const filtered = useMemo(() => transactions.filter(t => {
    const matchType     = filter === 'all' || t.type === filter
    const matchDate     = isInPeriod(t.date, dateFilter)
    const matchCategory = categoryFilter === 'all' || t.category_id === categoryFilter
    const matchSearch   = !search ||
      t.note?.toLowerCase().includes(search.toLowerCase()) ||
      t.category_name?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchDate && matchCategory && matchSearch
  }), [transactions, filter, dateFilter, categoryFilter, search])

  const handleDelete = async (id) => {
    setDeleting(id)
    const result = await deleteTransaction(id)
    setDeleting(null)
    if (result.success) notify.success('Transaction deleted', 'Removed successfully')
    else notify.error('Failed to delete', result.error)
  }

  const allCategories = useMemo(() => [
    ...new Map(transactions
      .filter(t => t.category_id)
      .map(t => [t.category_id, { id: t.category_id, name: t.category_name }]))
      .values()
  ], [transactions])

  return (
    <>
      {/* Modal — rendered outside the layout flow */}
      {showForm && (
        <TransactionForm onClose={() => { setShowForm(false); fetchTransactions() }} />
      )}

      {/*
        Desktop: h-full flex-col — nothing overflows the shell
        Mobile: natural flow, AppShell main scrolls
      */}
      <div className="w-full sm:h-full flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between shrink-0 animate-fadeUp">
          <div>
            <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
              Transactions
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {filtered.length} of {transactions.length} · Balance: {formatCurrency(balance)}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700
              text-white text-sm px-4 py-2.5 rounded-xl font-medium transition-all
              shadow-lg shadow-purple-500/20 active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Filters */}
        <div className="shrink-0 animate-fadeUp stagger-1 relative z-20">
          <TransactionFilters
            filter={filter}         onChange={setFilter}
            search={search}         onSearch={setSearch}
            dateFilter={dateFilter} onDateFilter={setDateFilter}
            categories={allCategories}
            categoryFilter={categoryFilter} onCategoryFilter={setCategoryFilter}
          />
        </div>

        {/*
          Desktop: flex-1 min-h-0 so the list fills remaining height and scrolls internally
          Mobile: min-h-[60vh] so it has enough natural height before AppShell scroll kicks in
        */}
        <div className="
          relative z-10
          bg-white dark:bg-[#0f0f1c]
          border border-black/[0.07] dark:border-white/[0.07]
          rounded-2xl flex flex-col
          sm:flex-1 sm:min-h-0
          min-h-[60vh]
          animate-fadeUp stagger-2
        ">
          <div className="sm:overflow-y-auto flex-1 p-2">
            <TransactionList
              transactions={filtered}
              loading={loading}
              onDelete={handleDelete}
              deleting={deleting}
              filter={filter}
            />
          </div>
        </div>

      </div>
    </>
  )
}

export default Transactions
