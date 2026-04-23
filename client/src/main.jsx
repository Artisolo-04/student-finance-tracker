import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthProvider from "./context/auth/AuthProvider.jsx";
import FinanceProvider from "./context/finance/FinanceProvider.jsx";
import UIProvider from "./context/ui/UIProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
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
  </StrictMode>,
);
