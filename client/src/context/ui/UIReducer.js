import { UI_ACTIONS } from './UIActions.js'

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export const initialState = {
  theme: getInitialTheme(),
  toasts: [],
  notifications: [],
  sidebarExpanded: true,
}

const uiReducer = (state, action) => {
  switch (action.type) {
    case UI_ACTIONS.SET_THEME:
      localStorage.setItem('theme', action.payload)
      return { ...state, theme: action.payload }
    case UI_ACTIONS.ADD_TOAST:
      return { ...state, toasts: [...state.toasts, action.payload] }
    case UI_ACTIONS.REMOVE_TOAST:
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) }
    case UI_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [{ id: Date.now(), ...action.payload }, ...state.notifications],
      }
    case UI_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      }
    case UI_ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarExpanded: !state.sidebarExpanded }
    default:
      return state
  }
}

export default uiReducer
