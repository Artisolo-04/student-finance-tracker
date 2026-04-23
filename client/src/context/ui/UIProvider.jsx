import { useReducer, useEffect } from 'react'
import { UIContext } from './UIContext.jsx'
import uiReducer, { initialState } from './UIReducer.js'
import {
  setTheme as setThemeAction,
  addToast, removeToast,
  addNotification, removeNotification,
  toggleSidebarAction
} from './UIActions.js'

const UIProvider = ({ children }) => {
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

  const setTheme = (theme) => dispatch(setThemeAction(theme))

  const toggleSidebar = () => dispatch(toggleSidebarAction())

  const removeToastById = (id) => dispatch(removeToast(id))

  const notify = {
    success: (title, message, duration = 4000) => {
      const id = Date.now() + Math.random()
      dispatch(addToast({ id, title, message, type: 'success', duration }))
    },
    error: (title, message, duration = 4000) => {
      const id = Date.now() + Math.random()
      dispatch(addToast({ id, title, message, type: 'error', duration }))
    },
    warning: (title, message, duration = 4000) => {
      const id = Date.now() + Math.random()
      dispatch(addToast({ id, title, message, type: 'warning', duration }))
    },
    info: (title, message, duration = 4000) => {
      const id = Date.now() + Math.random()
      dispatch(addToast({ id, title, message, type: 'info', duration }))
    },
  }

  return (
    <UIContext.Provider value={{
      ...state,
      setTheme,
      notify,
      removeToast: removeToastById,
      toggleSidebar,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export default UIProvider
