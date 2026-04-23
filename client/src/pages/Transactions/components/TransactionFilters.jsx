import FilterDropdown from '../../../components/common/FilterDropdown.jsx'

const TYPE_FILTERS = ['all', 'income', 'expense']

const TransactionFilters = ({
  filter, onChange,
  search, onSearch,
  dateFilter, onDateFilter,
  categories, categoryFilter, onCategoryFilter
}) => {

  const categoryOptions = [
    { value: 'all', label: 'All categories' },
    ...categories.map(c => ({ value: c.id, label: c.name, color: c.color }))
  ]

  const hasActiveFilters = search || filter !== 'all' || dateFilter !== 'all' || categoryFilter !== 'all'

  return (
    <div className="flex flex-col gap-3">

      <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3.5 py-2.5 shadow-lg">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search by note or category..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none"
        />
        {search && (
          <button onClick={() => onSearch('')} className="text-gray-300 hover:text-gray-500 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">

        <div className="flex gap-1.5">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onChange(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border shadow-sm ${
                filter === f
                  ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300'
                  : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'income' ? '↑ Income' : '↓ Expense'}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />

        <div className="flex gap-1.5">
          {[
            { key: 'all', label: 'All time' },
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This week' },
            { key: 'month', label: 'This month' },
          ].map((d) => (
            <button
              key={d.key}
              onClick={() => onDateFilter(d.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border shadow-sm ${
                dateFilter === d.key
                  ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-300'
                  : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-100 dark:bg-gray-800" />

        <FilterDropdown
          value={categoryFilter}
          onChange={onCategoryFilter}
          options={categoryOptions}
          placeholder="All categories"
        />

        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearch('')
              onChange('all')
              onDateFilter('all')
              onCategoryFilter('all')
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-red-100 dark:border-red-900/50 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Clear all
          </button>
        )}

      </div>
    </div>
  )
}

export default TransactionFilters
