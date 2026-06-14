import { useEffect, useState } from 'react'
import useFinance from '../../../context/finance/useFinance.js'
import useUI from '../../../context/ui/useUI.js'
import CategoryForm from './CategoryForm.jsx'
import CategoryDropdown from '../../../components/common/CategoryDropdown.jsx'
import { X, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'

const TransactionForm = ({ onClose }) => {
  const { incomeCategories, expenseCategories, addTransaction, addCategory, fetchCategories } = useFinance()
  const { notify } = useUI()

  const [tab,     setTab]     = useState('transaction')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    type: 'expense', amount: '', category_id: '',
    note: '', date: new Date().toISOString().split('T')[0],
  })

  const [catForm, setCatForm] = useState({
    name: '', color: '#7F77DD', icon: 'other', category_type: 'expense',
  })

  useEffect(() => { fetchCategories() }, [])

  const currentCategories = form.type === 'income' ? incomeCategories : expenseCategories

  const handleTypeChange = (type) => setForm({ ...form, type, category_id: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await addTransaction({ ...form, amount: parseFloat(form.amount) })
    setLoading(false)
    if (result.success) {
      if (result.alert) notify.warning('Balance is low!', 'Your balance is below 20 DT')
      else notify.success(
        `${form.type === 'income' ? 'Income' : 'Expense'} added!`,
        `${form.amount} DT recorded successfully`
      )
      onClose()
    } else {
      notify.error('Failed to add transaction', result.error)
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
      notify.success('Category created!', `"${catForm.name}" added`)
      setCatForm({ name: '', color: '#7F77DD', icon: 'other', category_type: 'expense' })
      fetchCategories()
      setTab('transaction')
    } else {
      notify.error('Failed to create category', result.error)
      setError(result.error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0f0f1c] border border-white/[0.08] rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">

        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
          <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1">
            {['transaction', 'category'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-all font-medium ${
                  tab === t
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}>
                {t === 'transaction' ? 'Transaction' : 'New category'}
              </button>
            ))}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl
              text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300 transition-all">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 py-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400
              text-xs px-3 py-2.5 rounded-xl mb-4">
              {error}
            </div>
          )}

          {tab === 'transaction' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                {['expense', 'income'].map(t => (
                  <button key={t} type="button" onClick={() => handleTypeChange(t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                      text-sm font-medium border transition-all ${
                      form.type === t
                        ? t === 'income'
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-red-500/10  border-red-500/30  text-red-400'
                        : 'border-white/[0.07] text-zinc-600 hover:border-white/10 hover:text-zinc-400'
                    }`}>
                    {t === 'income'
                      ? <ArrowUpRight   size={15} strokeWidth={2} />
                      : <ArrowDownRight size={15} strokeWidth={2} />
                    }
                    {t === 'income' ? 'Income' : 'Expense'}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block font-medium tracking-wide">
                  Amount (DT)
                </label>
                <input
                  type="number" placeholder="0.00" step="0.01" min="0.01" required
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                    px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50
                    transition-colors placeholder:text-zinc-700"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block font-medium tracking-wide">
                  Note
                </label>
                <input
                  type="text"
                  placeholder={form.type === 'income' ? 'Ex: weekly allowance...' : 'What was this for?'}
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                    px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50
                    transition-colors placeholder:text-zinc-700"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block font-medium tracking-wide">
                  Date
                </label>
                <input
                  type="date" required
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                    px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50
                    transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block font-medium tracking-wide">
                  {form.type === 'income' ? 'Source' : 'Category'}
                </label>
                <CategoryDropdown
                  categories={currentCategories}
                  value={form.category_id}
                  onChange={id => setForm({ ...form, category_id: id })}
                  type={form.type}
                  onCreateNew={() => {
                    setCatForm({ ...catForm, category_type: form.type })
                    setTab('category')
                  }}
                />
              </div>

              <button type="submit" disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl
                  text-sm font-semibold transition-all shadow-lg disabled:opacity-50 ${
                  form.type === 'income'
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 text-white'
                }`}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Plus size={16} strokeWidth={2.5} /> Add {form.type}</>
                }
              </button>
            </form>
          ) : (
            <CategoryForm
              catForm={catForm}
              setCatForm={setCatForm}
              onSubmit={handleAddCategory}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionForm
