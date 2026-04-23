export const UI_ACTIONS = {
  SET_THEME: 'SET_THEME',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
}

export const setTheme = (theme) => ({
  type: UI_ACTIONS.SET_THEME,
  payload: theme,
})

export const addToast = (toast) => ({
  type: UI_ACTIONS.ADD_TOAST,
  payload: toast,
})

export const removeToast = (id) => ({
  type: UI_ACTIONS.REMOVE_TOAST,
  payload: id,
})

export const addNotification = (message, type = 'info') => ({
  type: UI_ACTIONS.ADD_NOTIFICATION,
  payload: { message, type },
})

export const removeNotification = (id) => ({
  type: UI_ACTIONS.REMOVE_NOTIFICATION,
  payload: id,
})

export const toggleSidebarAction = () => ({
  type: UI_ACTIONS.TOGGLE_SIDEBAR,
})
