export const calculateBalance = (transactions) => {
  return transactions.reduce((acc, t) => {
    return t.type === 'income'
      ? acc + parseFloat(t.amount)
      : acc - parseFloat(t.amount)
  }, 0)
}

export const isBalanceLow = (balance) => balance >= 0 && balance <= 20

export const formatCurrency = (amount) =>
  `${parseFloat(amount).toFixed(2)} DT`

export const groupByCategory = (transactions) => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const key = t.category_name || 'Other'
      acc[key] = (acc[key] || 0) + parseFloat(t.amount)
      return acc
    }, {})
}

export const groupByMonth = (transactions) => {
  return transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    })
    if (!acc[month]) acc[month] = { income: 0, expenses: 0 }
    if (t.type === 'income') acc[month].income += parseFloat(t.amount)
    else acc[month].expenses += parseFloat(t.amount)
    return acc
  }, {})
}


export const getBudgetStatus = (spent, limit) => {
  const percent = limit > 0 ? (spent / limit) * 100 : 0
  if (percent >= 100) return { percent: Math.min(percent, 999), level: 'danger' }
  if (percent >= 80) return { percent, level: 'warning' }
  return { percent, level: 'ok' }
}
