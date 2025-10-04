import { NavLink } from "react-router-dom";
import {
  Home as HomeIcon,
  Map as MapIcon,
  Building2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/housing", label: "Housing", icon: Building2 },
  { to: "/essentials", label: "Essentials", icon: ShoppingBag },
  { to: "/concierge", label: "Concierge", icon: Sparkles },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <ul className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-blue-500"
                }`
              }
              end={to === "/"}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
