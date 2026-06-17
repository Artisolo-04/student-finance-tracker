export const Section = ({ title, description, children }) => (
  <div className="bg-white dark:bg-[#0f0f1c] border border-gray-200 dark:border-white/[0.07] rounded-2xl">
    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{title}</h2>
      {description && (
        <p className="text-xs text-gray-500 dark:text-zinc-600 mt-0.5">{description}</p>
      )}
    </div>
    <div className="px-5 py-5">{children}</div>
  </div>
)

export const Message = ({ msg }) => msg?.text ? (
  <div className={`text-xs px-3 py-2.5 rounded-xl mt-3 border ${
    msg.type === 'success'
      ? 'bg-green-500/10 border-green-500/20 text-green-400'
      : 'bg-red-500/10  border-red-500/20  text-red-400'
  }`}>
    {msg.text}
  </div>
) : null
