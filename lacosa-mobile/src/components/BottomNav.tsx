import { NavLink } from "react-router-dom";
import {
  Home,
  Map as MapIcon,
  Building2,
  Package,
  MessageCircle,
} from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/map", icon: MapIcon, label: "Map" },
  { to: "/housing", icon: Building2, label: "Housing" },
  { to: "/essentials", icon: Package, label: "Essentials" },
  { to: "/concierge", icon: MessageCircle, label: "Chat" },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t"
      style={{ paddingBottom: "max(0px, var(--safe-bottom))" }}
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-xs ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`
              }
            >
              <Icon size={22} />
              <span className="mt-0.5">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
