import { useEffect, useState, useMemo } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import useUI from '../../context/ui/useUI.js'
import { formatCurrency } from '../../context/finance/financeHelpers.js'
import TransactionForm from './components/TransactionForm.jsx'
import TransactionFilters from './components/TransactionFilters.jsx'
import TransactionList from './components/TransactionList.jsx'

const isInPeriod = (dateStr, period) => {
  const date = new Date(dateStr)
  const now = new Date()
  if (period === 'today') {
    return date.toDateString() === now.toDateString()
  }
  if (period === 'week') {
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    return date >= startOfWeek
  }
  if (period === 'month') {
    return date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
  }
  return true
}

const Transactions = () => {
  const { transactions, categories, balance, loading, fetchTransactions, fetchCategories, deleteTransaction } = useFinance()
  const { notify } = useUI()

  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [])

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = filter === 'all' || t.type === filter
      const matchDate = isInPeriod(t.date, dateFilter)
      const matchCategory = categoryFilter === 'all' || t.category_id === categoryFilter
      const matchSearch = !search ||
        t.note?.toLowerCase().includes(search.toLowerCase()) ||
        t.category_name?.toLowerCase().includes(search.toLowerCase())
      return matchType && matchDate && matchCategory && matchSearch
    })
  }, [transactions, filter, dateFilter, categoryFilter, search])

  const handleDelete = async (id) => {
    setDeleting(id)
    const result = await deleteTransaction(id)
    setDeleting(null)
    if (result.success) {
      notify.success('Transaction deleted', 'Removed successfully')
    } else {
      notify.error('Failed to delete', result.error)
    }
  }

  const allCategories = useMemo(() => {
    return [...new Map(transactions
      .filter(t => t.category_id)
      .map(t => [t.category_id, { id: t.category_id, name: t.category_name }]))
      .values()]
  }, [transactions])

  return (
    <div className="flex flex-col gap-5 h-full">
      {showForm && (
        <TransactionForm onClose={() => { setShowForm(false); fetchTransactions() }} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Transactions</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {filtered.length} of {transactions.length} · Balance: {formatCurrency(balance)}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
        >
          + Add transaction
        </button>
      </div>

      <TransactionFilters
        filter={filter}
        onChange={setFilter}
        search={search}
        onSearch={setSearch}
        dateFilter={dateFilter}
        onDateFilter={setDateFilter}
        categories={allCategories}
        categoryFilter={categoryFilter}
        onCategoryFilter={setCategoryFilter}
      />

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col flex-1 min-h-0 p-2 shadow-lg">
        <div className="overflow-y-scroll flex-1 pr-2">
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
  )
}

export default Transactions
