import { Sun, Moon, Monitor } from 'lucide-react'

const themes = [
  { value: 'light',  icon: Sun,     label: 'Light'  },
  { value: 'dark',   icon: Moon,    label: 'Dark'   },
  { value: 'system', icon: Monitor, label: 'System' },
]

const ThemeSwitcher = ({ theme, setTheme }) => (
  <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 gap-0.5">
    {themes.map(({ value, icon: Icon, label }) => (
      <button
        key={value}
        onClick={() => setTheme(value)}
        title={label}
        className={`relative w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ${
          theme === value
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Icon size={13} strokeWidth={2} />
      </button>
    ))}
  </div>
)

export default ThemeSwitcher
