import { useState, useRef, useEffect } from 'react'

const FilterDropdown = ({ value, onChange, options, placeholder = 'All' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isActive = value !== 'all' && value !== ''

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border shadow-sm ${
          isActive
            ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300'
            : 'border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        {selected && isActive && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: selected.color || '#888' }}
          />
        )}
        <span>{selected && isActive ? selected.label : placeholder}</span>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden min-w-[160px]">
          <div className="p-1.5 min-h-auto overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  value === opt.value
                    ? 'bg-purple-50 dark:bg-purple-900/25 text-purple-700 dark:text-purple-300 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                }`}
              >
                {opt.color && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: opt.color }}
                  />
                )}
                <span className="flex-1 text-left truncate">{opt.label}</span>
                {value === opt.value && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    className="flex-shrink-0 text-purple-500">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
