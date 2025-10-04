import { NavLink, Route, Routes } from "react-router-dom";
import Concierge from "./pages/Concierge";
import Map from "./pages/Map";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 text-center text-sm py-2 ${
          isActive ? "text-blue-600 font-semibold" : "text-gray-500"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/concierge" element={<Concierge />} />
        </Routes>
      </div>
      <nav className="sticky bottom-0 border-t bg-white flex">
        <NavItem to="/" label="Map" />
        <NavItem to="/concierge" label="Concierge" />
      </nav>
    </div>
  );
}
