const colorMap = {
  purple: {
    value:   'text-purple-600 dark:text-purple-400',
    bg:      'bg-purple-500/[0.07] dark:bg-purple-500/[0.08]',
    border:  'border-purple-500/20',
    dot:     'bg-purple-500',
  },
  green: {
    value:   'text-emerald-600 dark:text-emerald-400',
    bg:      'bg-emerald-500/[0.07] dark:bg-emerald-500/[0.08]',
    border:  'border-emerald-500/20',
    dot:     'bg-emerald-500',
  },
  red: {
    value:   'text-red-600 dark:text-red-400',
    bg:      'bg-red-500/[0.07] dark:bg-red-500/[0.08]',
    border:  'border-red-500/20',
    dot:     'bg-red-500',
  },
  amber: {
    value:   'text-amber-600 dark:text-amber-400',
    bg:      'bg-amber-500/[0.07] dark:bg-amber-500/[0.08]',
    border:  'border-amber-500/20',
    dot:     'bg-amber-500',
  },
  blue: {
    value:   'text-blue-600 dark:text-blue-400',
    bg:      'bg-blue-500/[0.07] dark:bg-blue-500/[0.08]',
    border:  'border-blue-500/20',
    dot:     'bg-blue-500',
  },
}

const StatCard = ({ label, value, sub, color = 'purple', className = '' }) => {
  const c = colorMap[color] || colorMap.purple

  return (
    <div className={`
      relative rounded-2xl p-4 border
      ${c.bg} ${c.border}
      dark:bg-[#0f0f1c]/60
      hover:scale-[1.01] transition-transform duration-200
      animate-fadeUp ${className}
    `}>
      {/* Dot indicator */}
      <span className={`absolute top-4 right-4 w-1.5 h-1.5 rounded-full ${c.dot}`} />

      <p className="text-[11px] font-medium uppercase tracking-wider
        text-zinc-500 dark:text-zinc-500 mb-2">
        {label}
      </p>

      <p className={`text-xl font-bold tabular-nums tracking-tight mb-1 ${c.value}`}>
        {value}
      </p>

      {sub && (
        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 truncate">
          {sub}
        </p>
      )}
    </div>
  )
}

export default StatCard
