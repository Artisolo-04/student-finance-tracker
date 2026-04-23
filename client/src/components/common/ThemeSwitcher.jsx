const themes = [
  {
    value: 'light',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="currentColor"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    value: 'dark',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="currentColor" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    value: 'system',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2"
          stroke="currentColor" strokeWidth="2"/>
        <path d="M8 21h8M12 17v4"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
]

const ThemeSwitcher = ({ theme, setTheme }) => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          title={t.value.charAt(0).toUpperCase() + t.value.slice(1)}
          className={`relative w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ${
            theme === t.value
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}

export default ThemeSwitcher
