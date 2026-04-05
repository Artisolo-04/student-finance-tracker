import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './context/auth/useAuth.js'
import useUI from './context/ui/useUI.js'
import AppShell from './components/layout/AppShell.jsx'
import Dashboard from './pages/Dashboard/index.jsx'
import Transactions from './pages/Transactions/index.jsx'
import Savings from './pages/Savings/index.jsx'
import Analytics from './pages/Analytics/index.jsx'
import Settings from './pages/Settings/index.jsx'
import Login from './pages/Login/index.jsx'
import Register from './pages/Register/index.jsx'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const App = () => {
  const { theme } = useUI()

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="savings" element={<Savings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
