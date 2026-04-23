export const Section = ({ title, description, children }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg">
    <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
)

export const Message = ({ msg }) => msg?.text ? (
  <div className={`text-xs px-3 py-2 rounded-lg mt-3 ${
    msg.type === 'success'
      ? 'bg-green-50 border border-green-100 text-green-600'
      : 'bg-red-50 border border-red-100 text-red-600'
  }`}>
    {msg.text}
  </div>
) : null
