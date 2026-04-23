import useUI from '../../../context/ui/useUI.js'
import { Section } from './shared.jsx'

const THEMES = [
  { value: 'light',  label: 'Light',  icon: '☀️' },
  { value: 'dark',   label: 'Dark',   icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
]

const ThemeButton = ({ value, label, icon, current, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-lg border text-xs font-medium transition-all ${
      current === value
        ? 'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300'
        : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600 dark:border-gray-700 dark:hover:border-gray-600'
    }`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </button>
)

const AppearanceSection = () => {
  const { theme, setTheme } = useUI()

  return (
    <Section title="Appearance" description="Choose your preferred theme">
      <div className="flex gap-3">
        {THEMES.map((t) => (
          <ThemeButton key={t.value} {...t} current={theme} onClick={setTheme} />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Currently using <span className="font-medium text-gray-600 dark:text-gray-300">{theme}</span> mode
      </p>
    </Section>
  )
}

export default AppearanceSection
