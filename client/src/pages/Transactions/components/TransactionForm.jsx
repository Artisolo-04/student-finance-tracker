import { useEffect, useState } from 'react'
import useFinance from '../../../context/finance/useFinance.js'
import CategoryForm from './CategoryForm.jsx'
import CategoryDropdown from '../../../components/common/CategoryDropdown.jsx'
import useUI from '../../../context/ui/useUI.js'

const TransactionForm = ({ onClose }) => {
  const { categories, incomeCategories, expenseCategories, addTransaction, addCategory, fetchCategories } = useFinance()
  const { notify } = useUI()
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
    category_type: 'expense',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const currentCategories = form.type === 'income' ? incomeCategories : expenseCategories;

  const handleTypeChange = (type) => setForm({ ...form, type, category_id: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await addTransaction({ ...form, amount: parseFloat(form.amount) })
    setLoading(false)
    if (result.success) {
      if (result.alert) {
        notify.warning('Balance is low!', 'Your balance is below 20 DT')
      } else {
        notify.success(
          `${form.type === 'income' ? 'Income' : 'Expense'} added!`,
          `${form.amount} DT recorded successfully`
        )
      }
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
      notify.success(
        'Category created!',
        `"${catForm.name}" added to your ${catForm.category_type} categories`
      )
      setCatForm({ name: '', color: '#7F77DD', icon: 'other', category_type: 'expense' })
      fetchCategories()
      setTab('transaction')
    } else {
      notify.error('Failed to create category', result.error)
      setError(result.error)
    }
  }



  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
            {['transaction', 'category'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                  tab === t
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'transaction' ? 'Transaction' : 'New category'}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
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
                    onClick={() => handleTypeChange(t)}
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

              {[
                { label: 'Amount (DT)', type: 'number', key: 'amount', placeholder: '0.00', extra: { step: '0.01', min: '0.01' } },
                { label: form.type === 'income' ? 'Note (optionnel)' : 'Note', type: 'text', key: 'note', placeholder: form.type === 'income' ? 'Ex: argent semaine...' : 'What was this for?' },
                { label: 'Date', type: 'date', key: 'date' },
              ].map(({ label, type, key, placeholder, extra }) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    required={key === 'amount'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    {...extra}
                    className="w-full border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">
                  {form.type === 'income' ? 'Source' : 'Category'}
                </label>
                <CategoryDropdown
                  categories={currentCategories}
                  value={form.category_id}
                  onChange={(id) => setForm({ ...form, category_id: id })}
                  type={form.type}
                  onCreateNew={() => {
                    setCatForm({ ...catForm, category_type: form.type })
                    setTab('category')
                  }}
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
