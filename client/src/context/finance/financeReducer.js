import { FINANCE_ACTIONS } from './financeActions.js'

export const initialState = {
  transactions: [],
  savings: [],
  savingsTotal: 0,
  categories: [],
  incomeCategories: [],
  expenseCategories: [],
  balance: 0,
  budgets: [],
  loading: false,
  error: null,
}

const financeReducer = (state, action) => {
  switch (action.type) {
    case FINANCE_ACTIONS.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload.transactions,
        balance: action.payload.balance,
        loading: false,
      }
    case FINANCE_ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload.transaction, ...state.transactions],
        balance: action.payload.balance,
        savings: action.payload.newSaving
          ? [action.payload.newSaving, ...state.savings]
          : state.savings,
        savingsTotal: action.payload.newSaving
          ? state.savingsTotal + parseFloat(action.payload.newSaving.amount)
          : state.savingsTotal,
      }
    case FINANCE_ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload.id),
        balance: action.payload.balance,
      }
    case FINANCE_ACTIONS.SET_SAVINGS:
      return {
        ...state,
        savings: action.payload.savings,
        savingsTotal: action.payload.total,
      }
    case FINANCE_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload.all || state.categories,
        incomeCategories: action.payload.income || state.incomeCategories,
        expenseCategories: action.payload.expense || state.expenseCategories,
      }
    case FINANCE_ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        incomeCategories: action.payload.category_type === 'income'
          ? [...state.incomeCategories, action.payload]
          : state.incomeCategories,
        expenseCategories: action.payload.category_type === 'expense'
          ? [...state.expenseCategories, action.payload]
          : state.expenseCategories,
      }
    case FINANCE_ACTIONS.SET_BALANCE:
      return { ...state, balance: action.payload }
    case FINANCE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case FINANCE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }

    case FINANCE_ACTIONS.SET_BUDGETS:
          return { ...state, budgets: action.payload.budgets }

    case FINANCE_ACTIONS.UPSERT_BUDGET: {
      const exists = state.budgets.some(b => b.category_id === action.payload.category_id)
      return {
        ...state,
        budgets: exists
          ? state.budgets.map(b =>
              b.category_id === action.payload.category_id ? action.payload : b
            )
          : [...state.budgets, action.payload],
      }
    }

    case FINANCE_ACTIONS.REMOVE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter(b => b.category_id !== action.payload.category_id),
      }


    default:
      return state
  }
}

export default financeReducer
