import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth/AuthContext.jsx'
import { FinanceProvider } from './context/finance/FinanceContext.jsx'
import { UIProvider } from './context/ui/UIContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <FinanceProvider>
            <App />
          </FinanceProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  </StrictMode>
)
