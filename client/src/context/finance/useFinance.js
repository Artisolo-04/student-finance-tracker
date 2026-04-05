import { useContext } from 'react'
import { FinanceContext } from './FinanceContext.jsx'

const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinance must be used within FinanceProvider')
  return context
}

export default useFinance
