import { AUTH_ACTIONS } from './authActions.js'

export const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      }
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case AUTH_ACTIONS.UPDATE_USER:
      localStorage.setItem('user', JSON.stringify(action.payload))
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export default authReducer
