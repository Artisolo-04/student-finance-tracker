import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import useFinance from '../../context/finance/useFinance.js'
import { formatCurrency } from '../../context/finance/financeHelpers.js'
import DayCell from './components/DayCell.jsx'
import DayDrawer from './components/DayDrawer.jsx'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getMonthGrid = (year, month) => {
  // month is 1-12
  const firstOfMonth = new Date(year, month - 1, 1)
  const startWeekday = firstOfMonth.getDay() // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

const toDateKey = (year, month, day) => {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

const CalendarPage = () => {
  const { fetchCalendarData } = useFinance()
  const today = new Date()

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [days, setDays] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)

  const loadMonth = useCallback(async () => {
    setLoading(true)
    const data = await fetchCalendarData(viewMonth, viewYear)
    setDays(data)
    setLoading(false)
  }, [viewMonth, viewYear, fetchCalendarData])

  useEffect(() => { loadMonth() }, [loadMonth])

  const goPrevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const goNextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const goToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth() + 1)
  }

  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleString('default', {
    month: 'long', year: 'numeric',
  })

  const cells = getMonthGrid(viewYear, viewMonth)

  const todayKey = toDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate())

  // Monthly totals for the header summary
  const monthIncome = Object.values(days).reduce((acc, d) => acc + d.income, 0)
  const monthExpense = Object.values(days).reduce((acc, d) => acc + d.expense, 0)

  return (
    <div className="w-full sm:h-full flex flex-col gap-4">

      <div className="shrink-0 animate-fadeUp flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">Calendar</h1>
          <p className="text-xs text-zinc-500 mt-0.5">See exactly where your money went, day by day</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-500 dark:text-zinc-400">Income {formatCurrency(monthIncome)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-zinc-500 dark:text-zinc-400">Spent {formatCurrency(monthExpense)}</span>
          </div>
        </div>
      </div>

      {/* Month navigation */}
      <div className="shrink-0 flex items-center justify-between
        bg-white dark:bg-[#0f0f1c]
        border border-black/[0.07] dark:border-white/[0.07]
        rounded-xl p-1.5 animate-fadeUp stagger-1"
      >
        <button
          onClick={goPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-zinc-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-zinc-700 dark:hover:text-zinc-300
            transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 min-w-[140px] text-center">
            {monthLabel}
          </span>
          <button
            onClick={goToday}
            className="text-xs font-medium text-purple-600 dark:text-purple-400
              hover:text-purple-700 dark:hover:text-purple-300
              border border-purple-500/20 hover:border-purple-500/40
              rounded-lg px-2.5 py-1 transition-colors"
          >
            Today
          </button>
        </div>

        <button
          onClick={goNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-zinc-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-zinc-700 dark:hover:text-zinc-300
            transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#0f0f1c]
        border border-black/[0.07] dark:border-white/[0.07]
        rounded-2xl p-4 flex flex-col animate-fadeUp stagger-2"
      >
        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
          {WEEKDAYS.map(w => (
            <div key={w} className="text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-600 py-1">
              {w}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex-1 grid grid-cols-7 gap-2 animate-pulse">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="rounded-xl skeleton" />
            ))}
          </div>
        ) : cells.every(c => c === null) ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
            <CalendarIcon size={28} className="text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm text-zinc-400 dark:text-zinc-600">No data for this month</p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-7 gap-2 auto-rows-fr">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />
              const dateKey = toDateKey(viewYear, viewMonth, day)
              const dayData = days[dateKey]
              const isToday = dateKey === todayKey

              return (
                <DayCell
                  key={dateKey}
                  day={day}
                  isToday={isToday}
                  dayData={dayData}
                  onClick={() => dayData && setSelectedDay({ dateKey, dayData })}
                />
              )
            })}
          </div>
        )}
      </div>

      <DayDrawer
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        dateKey={selectedDay?.dateKey}
        dayData={selectedDay?.dayData}
      />
    </div>
  )
}

export default CalendarPage
