import { useLocation } from "react-router-dom";
import useFinance from "../../context/finance/useFinance.js";
import useUI from "../../context/ui/useUI.js";
import useAuth from "../../context/auth/useAuth.js";
import { isBalanceLow, formatCurrency } from "../../context/finance/financeHelpers.js";
import ThemeSwitcher from "../common/ThemeSwitcher.jsx";
import { PanelLeftClose, PanelLeftOpen, AlertTriangle, Wallet } from "lucide-react";

const pageTitles = {
  "/":             "Dashboard",
  "/transactions": "Transactions",
  "/savings":      "Savings",
  "/analytics":    "Analytics",
  "/settings":     "Settings",
};

/**
 * Navbar
 * @prop {boolean} mobile — when true, renders the mobile top bar variant
 *   (no sidebar toggle, no greeting, compact balance)
 */
const Navbar = ({ mobile = false }) => {
  const { pathname } = useLocation();
  const { balance } = useFinance();
  const { user } = useAuth();
  const { theme, setTheme, sidebarExpanded, toggleSidebar } = useUI();
  const low = isBalanceLow(balance);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || "";
  const title = pageTitles[pathname] || "FinTrack";
  const isDashboard = pathname === "/";

  /* ── Mobile top bar ──────────────────────────────────────────────── */
  if (mobile) {
    return (
      <header
        className="
          h-14 shrink-0 w-full flex items-center px-4 gap-3
          dark:bg-[#0c0c16] bg-white
          border-b dark:border-white/[0.06] border-black/[0.07]
        "
      >
        {/* Page title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold dark:text-zinc-100 text-zinc-800 leading-none">
            {title}
          </p>
          {isDashboard && firstName && (
            <p className="text-[11px] dark:text-zinc-500 text-zinc-400 mt-0.5">
              {greeting}, {firstName}
            </p>
          )}
        </div>

        {/* Balance pill */}
        <BalancePill balance={balance} low={low} />

        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </header>
    );
  }

  /* ── Desktop Navbar ──────────────────────────────────────────────── */
  return (
    <header
      className="
        h-14 w-full shrink-0 flex items-center px-4 gap-3
        dark:bg-[#0c0c16] bg-white
        border-b dark:border-white/[0.06] border-black/[0.07]
      "
    >
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="
          w-8 h-8 flex items-center justify-center rounded-lg
          dark:text-zinc-500 text-zinc-400
          dark:hover:bg-white/[0.05] hover:bg-black/[0.05]
          dark:hover:text-zinc-300 hover:text-zinc-600
          transition-all duration-150
        "
      >
        {sidebarExpanded
          ? <PanelLeftClose size={17} strokeWidth={1.5} />
          : <PanelLeftOpen  size={17} strokeWidth={1.5} />
        }
      </button>

      {/* Page title + greeting */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold dark:text-zinc-100 text-zinc-800 leading-none">
          {title}
        </p>
        {isDashboard && firstName && (
          <p className="text-[11px] dark:text-zinc-500 text-zinc-400 mt-0.5 animate-fadeIn">
            {greeting}, {firstName}
          </p>
        )}
      </div>

      {/* Low balance warning — desktop only */}
      {low && (
        <div
          className="
            hidden sm:flex items-center gap-1.5 shrink-0
            bg-amber-500/[0.08] border border-amber-500/20
            text-amber-600 dark:text-amber-400
            text-xs font-medium px-3 py-1.5 rounded-full
            animate-fadeIn
          "
        >
          <AlertTriangle size={11} strokeWidth={2.5} />
          <span>Balance low — {formatCurrency(balance)}</span>
        </div>
      )}

      {/* Balance pill */}
      <BalancePill balance={balance} low={low} />

      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </header>
  );
};

/* ── Balance pill — shared between mobile and desktop ────────────────── */
const BalancePill = ({ balance, low }) => (
  <div
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0
      border transition-colors duration-300
      ${
        low
          ? "bg-amber-500/[0.08] border-amber-500/20"
          : "dark:bg-white/[0.04] bg-black/[0.04] dark:border-white/[0.08] border-black/[0.08]"
      }
    `}
  >
    <Wallet
      size={12}
      strokeWidth={1.5}
      className={low ? "text-amber-500 dark:text-amber-400" : "dark:text-zinc-500 text-zinc-400"}
    />
    <span
      className={`text-xs font-semibold tabular-nums ${
        low ? "text-amber-600 dark:text-amber-400" : "dark:text-zinc-300 text-zinc-700"
      }`}
    >
      {formatCurrency(balance)}
    </span>
  </div>
);

export default Navbar;
