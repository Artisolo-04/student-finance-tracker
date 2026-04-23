const COLORS = {
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  green:  'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  red:    'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  amber:  'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  gray:   'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

const StatCard = ({ label, value, sub, color = 'gray' }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-lg">
    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">
      {label}
    </p>
    <p className={`text-2xl font-medium ${COLORS[color].split(' ')[1]}`}>
      {value}
    </p>
    {sub && (
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
    )}
  </div>
)

export default StatCard
