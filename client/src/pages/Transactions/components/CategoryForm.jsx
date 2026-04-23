const COLORS = ['#7F77DD','#1D9E75','#EF9F27','#E24B4A','#D4537E','#378ADD','#888780','#5DCAA5']

const CategoryForm = ({ catForm, setCatForm, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="flex gap-2">
      {['expense', 'income'].map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setCatForm({ ...catForm, category_type: t })}
          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
            catForm.category_type === t
              ? t === 'income'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-purple-50 border-purple-200 text-purple-700'
              : 'border-gray-100 text-gray-400 hover:border-gray-200'
          }`}
        >
          {t === 'income' ? '↑ Income source' : '↓ Expense category'}
        </button>
      ))}
    </div>

    <div>
      <label className="text-xs text-gray-400 mb-1.5 block">
        {catForm.category_type === 'income' ? 'Source name' : 'Category name'}
      </label>
      <input
        type="text"
        placeholder={catForm.category_type === 'income' ? 'Ex: Stage, Vente...' : 'Ex: Gym, Books...'}
        required
        value={catForm.name}
        onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
        className="w-full border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:bg-white transition-all"
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
      {loading ? 'Creating...' : `Create ${catForm.category_type === 'income' ? 'source' : 'category'}`}
    </button>
  </form>
)

export default CategoryForm
