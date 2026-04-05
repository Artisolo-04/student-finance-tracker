export const AUTH_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
}

export const login = (user, token) => ({
  type: AUTH_ACTIONS.LOGIN,
  payload: { user, token },
})

export const logout = () => ({
  type: AUTH_ACTIONS.LOGOUT,
})

export const setLoading = (loading) => ({
  type: AUTH_ACTIONS.SET_LOADING,
  payload: loading,
})
