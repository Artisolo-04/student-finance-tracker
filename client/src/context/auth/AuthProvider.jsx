import { useReducer } from 'react'
import { AuthContext } from './AuthContext.jsx'
import authReducer, { initialState } from './authReducer.js'
import { login, logout, setLoading, updateUser } from './authActions.js'
import api from '../../api/index.js'

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const loginUser = async (email, password) => {
    dispatch(setLoading(true))
    try {
      const res = await api.post('/auth/login', { email, password })
      dispatch(login(res.data.user, res.data.token))
      return { success: true }
    } catch (err) {
      dispatch(setLoading(false))
      return { success: false, error: err.response?.data?.error || 'Login failed' }
    }
  }

  const registerUser = async (full_name, email, password) => {
    dispatch(setLoading(true))
    try {
      const res = await api.post('/auth/register', { full_name, email, password })
      dispatch(login(res.data.user, res.data.token))
      return { success: true }
    } catch (err) {
      dispatch(setLoading(false))
      return { success: false, error: err.response?.data?.error || 'Register failed' }
    }
  }

  const logoutUser = () => dispatch(logout())
  const updateUserData = (user) => dispatch(updateUser(user))

  return (
    <AuthContext.Provider value={{
      ...state,
      loginUser,
      registerUser,
      logoutUser,
      updateUserData,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
