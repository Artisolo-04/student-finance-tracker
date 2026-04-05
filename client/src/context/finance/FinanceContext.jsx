import { createContext, useReducer, useCallback } from 'react'
import financeReducer, { initialState } from './financeReducer.js'
import { FINANCE_ACTIONS } from './financeActions.js'
import api from '../../api/index.js'

export const FinanceContext = createContext(null)

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState)

  const fetchTransactions = useCallback(async () => {
    dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true })
    try {
      const res = await api.get('/transactions')
      dispatch({
        type: FINANCE_ACTIONS.SET_TRANSACTIONS,
        payload: { transactions: res.data.transactions, balance: res.data.balance },
      })
    } catch (err) {
      dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: err.message })
    }
  }, [])

  const fetchSavings = useCallback(async () => {
    try {
      const res = await api.get('/savings')
      dispatch({
        type: FINANCE_ACTIONS.SET_SAVINGS,
        payload: { savings: res.data.savings, total: res.data.total },
      })
    } catch (err) {
      dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: err.message })
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories')
      dispatch({ type: FINANCE_ACTIONS.SET_CATEGORIES, payload: res.data.categories })
    } catch (err) {
      dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: err.message })
    }
  }, [])

  const addTransaction = async (data) => {
    try {
      const res = await api.post('/transactions', data)
      const savingsRes = await api.get('/savings')
      const newSaving = res.data.transaction.type === 'income'
        ? savingsRes.data.savings[0]
        : null
      dispatch({
        type: FINANCE_ACTIONS.ADD_TRANSACTION,
        payload: {
          transaction: res.data.transaction,
          balance: res.data.balance,
          newSaving,
        },
      })
      return { success: true, alert: res.data.alert }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to add transaction' }
    }
  }

  const deleteTransaction = async (id) => {
    try {
      const res = await api.delete(`/transactions/${id}`)
      dispatch({
        type: FINANCE_ACTIONS.DELETE_TRANSACTION,
        payload: { id, balance: res.data.balance },
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete' }
    }
  }

  const addCategory = async (data) => {
    try {
      const res = await api.post('/categories', data)
      dispatch({ type: FINANCE_ACTIONS.ADD_CATEGORY, payload: res.data.category })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to add category' }
    }
  }

  return (
    <FinanceContext.Provider value={{
      ...state,
      fetchTransactions,
      fetchSavings,
      fetchCategories,
      addTransaction,
      deleteTransaction,
      addCategory,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}
