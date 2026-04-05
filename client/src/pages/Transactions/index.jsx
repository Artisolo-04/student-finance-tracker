import { useEffect, useState } from 'react'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency } from '../../context/finance/financeHelpers.js'

const COLORS = [
  '#7F77DD', '#1D9E75', '#EF9F27', '#E24B4A',
  '#D4537E', '#378ADD', '#888780', '#5DCAA5'
]

const TransactionForm = ({ onClose }) => {
  const { categories, addTransaction, addCategory, fetchCategories } = useFinance()
  const [tab, setTab] = useState('transaction')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [catForm, setCatForm] = useState({
    name: '',
    color: '#7F77DD',
    icon: 'other',
  })

  useEffect(() => { fetchCategories() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await addTransaction({
      ...form,
      amount: parseFloat(form.amount),
    })
    setLoading(false)
    if (result.success) {
      if (result.alert) setSuccess('⚠️ Balance is now below 20 DT!')
      else setSuccess('Transaction added successfully!')
      setTimeout(() => { setSuccess(''); onClose() }, 1500)
    } else {
      setError(result.error)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await addCategory(catForm)
    setLoading(false)
    if (result.success) {
      setSuccess('Category created!')
      setCatForm({ name: '', color: '#7F77DD', icon: 'other' })
      setTimeout(() => { setSuccess(''); setTab('transaction') }, 1000)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => setTab('transaction')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                tab === 'transaction'
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Transaction
            </button>
            <button
              onClick={() => setTab('category')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                tab === 'category'
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              New category
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-600 text-xs px-3 py-2 rounded-lg mb-4">
              {success}
            </div>
          )}

          {tab === 'transaction' ? (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="flex gap-2">
                {['expense', 'income'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                      form.type === t
                        ? t === 'income'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-600'
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {t === 'income' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Amount (DT)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Note</label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  form.type === 'income'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } disabled:opacity-50`}
              >
                {loading ? 'Adding...' : `Add ${form.type}`}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Category name</label>
                <input
                  type="text"
                  placeholder="e.g. Gym, Books..."
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCatForm({ ...catForm, color: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        catForm.color === c ? 'border-gray-400 scale-110' : 'border-transparent'
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating...' : 'Create category'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const Transactions = () => {
  const { transactions, balance, loading, fetchTransactions, deleteTransaction } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchTransactions() }, [])

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const handleDelete = async (id) => {
    setDeleting(id)
    await deleteTransaction(id)
    setDeleting(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {showForm && <TransactionForm onClose={() => { setShowForm(false); fetchTransactions() }} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Transactions</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {transactions.length} total · Balance: {formatCurrency(balance)}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
        >
          + Add transaction
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'income', 'expense'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filter === f
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">💸</span>
            <p className="text-sm text-gray-500">No transactions found</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter !== 'all' ? 'Try a different filter' : 'Add your first transaction'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
                    t.type === 'income'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {t.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      {t.note || t.category_name || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {t.category_name && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: t.category_color + '20',
                            color: t.category_color,
                          }}
                        >
                          {t.category_name}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(t.date).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    t.type === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deleting === t.id}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all text-xs"
                  >
                    {deleting === t.id ? '...' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions
