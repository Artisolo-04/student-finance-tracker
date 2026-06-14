import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  PiggyBank,
  Settings,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import useUI from "../../context/ui/useUI.js";
import Toast from "../common/Toast.jsx";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const navItems = [
  { path: "/",             label: "Dashboard",    icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight  },
  { path: "/savings",      label: "Savings",      icon: PiggyBank       },
  { path: "/analytics",    label: "Analytics",    icon: BarChart3       },
  { path: "/settings",     label: "Settings",     icon: Settings        },
];

const AppShell = () => {
  const { toasts, removeToast } = useUI();

  return (
    /*
     * ROOT — full viewport, no overflow.
     * On mobile (< sm): flex-col so Navbar sits on top, main scrolls below,
     *   bottom nav is fixed over everything.
     * On desktop (≥ sm): flex-row — Sidebar | (Navbar + main in a column).
     *   Nothing here scrolls; only the inner <main> div scrolls when needed.
     */
    <div className="flex h-[100dvh] dark:bg-[#080810] bg-[#f0f0f5] overflow-hidden">

      {/* ── Sidebar — desktop only ───────────────────────────── */}
      <div className="hidden sm:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* ── Right column: Navbar + main ──────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

        {/* Top Navbar — desktop only */}
        <div className="hidden sm:flex shrink-0">
          <Navbar />
        </div>

        {/* Mobile top bar — shows page title + theme toggle */}
        <div className="sm:hidden shrink-0">
          <Navbar mobile />
        </div>

        {/*
         * MAIN CONTENT AREA
         * Desktop: flex-1, overflow-hidden — each page manages its own scroll.
         * Mobile:  overflow-y-auto — the whole page scrolls naturally,
         *          with padding-bottom so content clears the fixed bottom nav.
         */}
        <main
          className="
            flex-1 min-h-0
            sm:overflow-hidden
            overflow-y-auto
            w-full
          "
        >
          {/*
           * Inner wrapper — gives pages a consistent padding canvas.
           * On desktop it is h-full so pages can stretch to fill.
           * On mobile it just flows with content (no fixed height).
           */}
          <div
            className="
              sm:h-full
              w-full
              p-4 sm:p-6
              pb-24 sm:pb-6
              max-w-7xl mx-auto
            "
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Bottom nav — mobile only, fixed ──────────────────── */}
      <nav
        className="
          sm:hidden fixed bottom-0 left-0 right-0 z-40
          dark:bg-[#0c0c16]/95 bg-white/95 backdrop-blur-md
          border-t dark:border-white/[0.06] border-black/[0.07]
          flex items-center justify-around px-2 py-2
          safe-area-inset-bottom
        "
      >
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl
               transition-all duration-200
               ${isActive
                 ? "text-purple-500 dark:text-purple-400"
                 : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active pill indicator */}
                {isActive && (
                  <span
                    className="
                      absolute -top-0.5 left-1/2 -translate-x-1/2
                      w-4 h-0.5 rounded-full bg-purple-500 dark:bg-purple-400
                    "
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium tracking-wide">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default AppShell;
