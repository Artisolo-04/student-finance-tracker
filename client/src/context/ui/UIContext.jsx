import { createContext, useReducer } from 'react'

export const UIContext = createContext(null)

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  notifications: [],
}

const uiReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      return { ...state, theme: newTheme }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          { id: Date.now(), ...action.payload },
          ...state.notifications,
        ],
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      }
    default:
      return state
  }
}

export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState)

  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' })

  const notify = (message, type = 'info') => {
    const id = Date.now()
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }), 4000)
  }

  return (
    <UIContext.Provider value={{ ...state, toggleTheme, notify }}>
      {children}
    </UIContext.Provider>
  )
}
