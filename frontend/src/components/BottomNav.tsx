import { Building2, Home, Map, Menu, MessageCircle, Package } from "lucide-react";
import { NavLink } from "react-router-dom";
import OverflowMenu from "./OverflowMenu";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/map", icon: Map, label: "Map" },
  { to: "/housing", icon: Building2, label: "Housing" },
  { to: "/essentials", icon: Package, label: "Essentials" },
  { to: "/concierge", icon: MessageCircle, label: "Concierge" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-md items-center">
        <ul className="grid w-full grid-cols-5">
          {items.map(({ to, icon: Icon, label }) => (
            <li key={to} className="contents">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                    isActive ? "text-primary-600" : "text-slate-500",
                  ].join(" ")
                }
              >
                <Icon size={22} strokeWidth={1.6} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="pr-2">
          <OverflowMenu
            trigger={
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full text-slate-500"
                aria-label="More"
                type="button"
              >
                <Menu size={22} strokeWidth={1.6} />
              </button>
            }
          />
        </div>
      </div>
    </nav>
  );
}
