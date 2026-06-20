import { useReducer, useCallback } from 'react'
import { FinanceContext } from './FinanceContext.jsx'
import financeReducer, { initialState } from './financeReducer.js'
import { FINANCE_ACTIONS } from './financeActions.js'
import api from '../../api/index.js'

const FinanceProvider = ({ children }) => {
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

  const fetchCategories = useCallback(async (type = null) => {
    try {
      if (type) {
        const res = await api.get(`/categories?type=${type}`)
        dispatch({
          type: FINANCE_ACTIONS.SET_CATEGORIES,
          payload: {
            [type]: res.data.categories,
          }
        })
      } else {
        const [expRes, incRes] = await Promise.all([
          api.get('/categories?type=expense'),
          api.get('/categories?type=income'),
        ])
        dispatch({
          type: FINANCE_ACTIONS.SET_CATEGORIES,
          payload: {
            expense: expRes.data.categories,
            income: incRes.data.categories,
            all: [...expRes.data.categories, ...incRes.data.categories],
          }
        })
      }
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

      if (res.data.needsAllocation) {
        dispatch({ type: FINANCE_ACTIONS.SET_NEEDS_ALLOCATION, payload: true })
      }
      return { success: true, alert: res.data.alert, needsAllocation: res.data.needsAllocation }

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

  const fetchCalendarData = useCallback(async (month, year) => {
    try {
      const res = await api.get(`/transactions/calendar?month=${month}&year=${year}`)
      return res.data.days
    } catch (err) {
      dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: err.message })
      return {}
    }
  }, [])

  const fetchBudgets = useCallback(async () => {
    try {
      const res = await api.get('/budgets')
      dispatch({
        type: FINANCE_ACTIONS.SET_BUDGETS,
        payload: { budgets: res.data.budgets, summary: res.data.summary },
      })
      return res.data.budgets
    } catch (err) {
      dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: err.message })
      return []
    }
  }, [])

  const saveBudget = async (category_id, allocated) => {
    try {
      const res = await api.post('/budgets', { category_id, allocated })
      dispatch({
        type: FINANCE_ACTIONS.UPSERT_BUDGET,
        payload: { budget: res.data.budget, summary: res.data.summary },
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to save budget' }
    }
  }

  const deleteBudget = async (categoryId) => {
    try {
      const res = await api.delete(`/budgets/${categoryId}`)
      dispatch({
        type: FINANCE_ACTIONS.REMOVE_BUDGET,
        payload: { category_id: res.data.category_id, summary: res.data.summary },
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete budget' }
    }
  }

  return (
    <FinanceContext.Provider value={{
      ...state,
      fetchTransactions,
      fetchSavings,
      fetchCategories,
      fetchBudgets,
      fetchCalendarData,
      addTransaction,
      deleteTransaction,
      addCategory,
      saveBudget,
      deleteBudget,
      clearNeedsAllocation: () => dispatch({ type: FINANCE_ACTIONS.SET_NEEDS_ALLOCATION, payload: false }),
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export default FinanceProvider
