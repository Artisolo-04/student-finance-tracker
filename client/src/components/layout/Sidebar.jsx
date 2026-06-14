import { NavLink } from "react-router-dom";
import useAuth from "../../context/auth/useAuth.js";
import useUI from "../../context/ui/useUI.js";
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank,
  BarChart3, Settings, LogOut, TrendingUp,
} from "lucide-react";

const navItems = [
  { path: "/",             label: "Dashboard",    icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight  },
  { path: "/savings",      label: "Savings",      icon: PiggyBank       },
  { path: "/analytics",    label: "Analytics",    icon: BarChart3       },
  { path: "/settings",     label: "Settings",     icon: Settings        },
];

/* ── Tooltip (shown when sidebar is collapsed) ───────────────────────── */
const Tooltip = ({ label }) => (
  <div
    className="
      absolute left-full top-1/2 -translate-y-1/2 ml-3
      px-2.5 py-1.5 rounded-lg z-50 pointer-events-none
      dark:bg-zinc-800 bg-white
      border dark:border-zinc-700 border-black/[0.08]
      dark:text-zinc-200 text-zinc-700
      text-xs font-medium whitespace-nowrap shadow-xl
      opacity-0 -translate-x-1
      group-hover:opacity-100 group-hover:translate-x-0
      transition-all duration-200
    "
  >
    {label}
    {/* Arrow */}
    <span
      className="
        absolute right-full top-1/2 -translate-y-1/2
        border-4 border-transparent dark:border-r-zinc-800 border-r-white
      "
    />
  </div>
);

/* ── Single nav link ─────────────────────────────────────────────────── */
const NavItem = ({ path, label, icon: Icon, expanded }) => (
  <div className="relative group">
    <NavLink
      to={path}
      end={path === "/"}
      className={({ isActive }) =>
        `relative flex items-center text-sm rounded-xl
         transition-all duration-150 overflow-hidden
         ${expanded ? "gap-3 px-3 py-2.5" : "py-2.5 w-full justify-center"}
         ${
           isActive
             ? "bg-purple-600/[0.12] dark:bg-purple-500/[0.12] text-purple-600 dark:text-purple-400 font-medium"
             : "text-zinc-500 dark:text-zinc-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-zinc-700 dark:hover:text-zinc-300"
         }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Left accent bar on active */}
          {isActive && (
            <span
              className="
                absolute left-0 top-1/2 -translate-y-1/2
                w-0.5 h-5 rounded-full bg-purple-500 dark:bg-purple-400
              "
            />
          )}

          <Icon
            size={17}
            className="shrink-0"
            strokeWidth={isActive ? 2 : 1.5}
          />

          <span
            className={`
              whitespace-nowrap transition-all duration-300 overflow-hidden
              ${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}
            `}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>

    {/* Tooltip when collapsed */}
    {!expanded && <Tooltip label={label} />}
  </div>
);

/* ── Sidebar ─────────────────────────────────────────────────────────── */
const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const { sidebarExpanded } = useUI();

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside
      className={`
        ${sidebarExpanded ? "w-56" : "w-[60px]"}
        transition-[width] duration-300 ease-in-out
        h-full flex flex-col py-5 px-2 overflow-visible
        dark:bg-[#0c0c16] bg-white
        border-r dark:border-white/[0.06] border-black/[0.07]
      `}
    >
      {/* ── Logo ───────────────────────────────────────────────── */}
      <div
        className={`
          mb-8 px-1.5 h-9 flex items-center overflow-hidden
          ${sidebarExpanded ? "gap-2.5" : "justify-center"}
        `}
      >
        {/* Icon with subtle glow */}
        <div
          className="
            w-7 h-7 rounded-lg flex items-center justify-center shrink-0
            bg-gradient-to-br from-purple-500 to-violet-600
            shadow-lg shadow-purple-500/25
          "
        >
          <TrendingUp size={13} className="text-white" strokeWidth={2.5} />
        </div>

        <span
          className={`
            text-sm font-bold tracking-tight
            dark:text-white text-zinc-800
            whitespace-nowrap transition-all duration-300
            ${sidebarExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0 overflow-hidden"}
          `}
        >
          Fin<span className="text-purple-500">Track</span>
        </span>
      </div>

      {/* ── Nav items ──────────────────────────────────────────── */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} expanded={sidebarExpanded} />
        ))}
      </nav>

      {/* ── Footer: user + logout ──────────────────────────────── */}
      <div
        className="
          border-t dark:border-white/[0.06] border-black/[0.07]
          pt-3 mt-3 flex flex-col gap-1
        "
      >
        {/* User info — only when expanded */}
        <div
          className={`
            flex items-center gap-2.5 px-2 py-2 rounded-xl overflow-hidden
            transition-all duration-300
            ${sidebarExpanded ? "opacity-100 max-h-16" : "opacity-0 max-h-0 py-0"}
          `}
        >
          {/* Avatar */}
          <div
            className="
              w-7 h-7 rounded-lg shrink-0 flex items-center justify-center
              bg-gradient-to-br from-purple-500/20 to-violet-500/20
              border dark:border-purple-700/30 border-purple-200
            "
          >
            <span className="text-purple-600 dark:text-purple-300 text-[10px] font-bold">
              {initials}
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold dark:text-zinc-200 text-zinc-800 truncate leading-tight">
              {user?.full_name}
            </p>
            <p className="text-[10px] dark:text-zinc-500 text-zinc-400 truncate mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <div className="relative group">
          <button
            onClick={logoutUser}
            className={`
              w-full py-2.5 text-sm rounded-xl
              text-zinc-500 dark:text-zinc-500
              hover:bg-red-500/[0.08] hover:text-red-500 dark:hover:text-red-400
              transition-all flex items-center gap-3
              ${sidebarExpanded ? "px-3" : "justify-center"}
            `}
          >
            <LogOut size={16} className="shrink-0" strokeWidth={1.5} />
            <span
              className={`
                whitespace-nowrap transition-all duration-300
                ${sidebarExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0 overflow-hidden"}
              `}
            >
              Sign out
            </span>
          </button>

          {!sidebarExpanded && <Tooltip label="Sign out" />}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
