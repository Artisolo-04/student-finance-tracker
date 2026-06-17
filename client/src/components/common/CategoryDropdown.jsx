import { useState, useRef, useEffect } from 'react'

const CategoryDropdown = ({ categories, value, onChange, type, onCreateNew, hideCreateNew = false }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropUp, setDropUp] = useState(false)
  const ref = useRef(null)
  const listRef = useRef(null)

  const selected = categories.find(c => c.id === value)
  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const defaults = filtered.filter(c => c.is_default)
  const customs = filtered.filter(c => !c.is_default)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleOpen = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setDropUp(spaceBelow < 280)
    }
    setOpen(!open)
    setSearch('')
  }

  const handleSelect = (id) => {
    onChange(id)
    setOpen(false)
    setSearch('')
  }

  const ColorDot = ({ color }) => (
    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
  )

  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-purple-500">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div ref={ref} className="relative">

      <button
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between gap-2 border rounded-xl px-3.5 py-2.5 text-sm transition-all ${
          open
            ? 'border-purple-400 bg-white dark:bg-gray-800 ring-2 ring-purple-100 dark:ring-purple-900/30'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selected ? (
            <>
              <ColorDot color={selected.color} />
              <span className="text-gray-800 dark:text-gray-100 truncate text-sm">
                {selected.name}
              </span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">
              {type === 'income' ? 'Select source' : 'Select category'}
            </span>
          )}
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          className={`absolute z-[999] w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden ${
            dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          <div className="p-2">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg px-3 py-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder={`Search ${type === 'income' ? 'sources' : 'categories'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none w-full"
                autoFocus
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="max-h-44 overflow-y-auto px-1.5 pb-1.5">

            {value && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-full border border-dashed border-gray-300 flex-shrink-0"/>
                No {type === 'income' ? 'source' : 'category'}
              </button>
            )}

            {defaults.length > 0 && (
              <div className="mb-1">
                <div className="px-3 py-1.5 flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                    {type === 'income' ? 'Default sources' : 'Default'}
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700"/>
                </div>
                {defaults.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect(c.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      value === c.id
                        ? 'bg-purple-50 dark:bg-purple-900/25'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'
                    }`}
                  >
                    <ColorDot color={c.color} />
                    <span className={`flex-1 text-left text-sm truncate ${
                      value === c.id
                        ? 'text-purple-700 dark:text-purple-300 font-medium'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {c.name}
                    </span>
                    {value === c.id && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}

            {customs.length > 0 && (
              <div className="mb-1">
                <div className="px-3 py-1.5 flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                    {type === 'income' ? 'My sources' : 'Custom'}
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700"/>
                </div>
                {customs.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect(c.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      value === c.id
                        ? 'bg-purple-50 dark:bg-purple-900/25'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'
                    }`}
                  >
                    <ColorDot color={c.color} />
                    <span className={`flex-1 text-left text-sm truncate ${
                      value === c.id
                        ? 'text-purple-700 dark:text-purple-300 font-medium'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}>
                      {c.name}
                    </span>
                    {value === c.id && <CheckIcon />}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs text-gray-400">No results for "{search}"</p>
              </div>
            )}

          </div>

          {!hideCreateNew && (
            <div className="px-2 py-2 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setSearch('')
                  onCreateNew?.()
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors font-medium"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Create new {type === 'income' ? 'source' : 'category'}
              </button>
            </div>
          )}
          
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown
