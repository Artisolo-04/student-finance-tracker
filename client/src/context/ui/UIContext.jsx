import { createContext, useReducer, useEffect } from 'react'

export const UIContext = createContext(null)

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const initialState = {
  theme: getInitialTheme(),
  notifications: [],
}

const uiReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload)
      return { ...state, theme: action.payload }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [{ id: Date.now(), ...action.payload }, ...state.notifications],
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

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (state.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(isDark ? 'dark' : 'light')
    } else {
      root.classList.add(state.theme)
    }
  }, [state.theme])

  const setTheme = (theme) => dispatch({ type: 'SET_THEME', payload: theme })

  const notify = (message, type = 'info') => {
    const id = Date.now()
    dispatch({ type: 'ADD_NOTIFICATION', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }), 4000)
  }

  return (
    <UIContext.Provider value={{ ...state, setTheme, notify }}>
      {children}
    </UIContext.Provider>
  )
}
