import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Housing from "./pages/Housing";
import Essentials from "./pages/Essentials";
import Concierge from "./pages/Concierge";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <div className="min-h-[100svh] pb-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/housing" element={<Housing />} />
        <Route path="/essentials" element={<Essentials />} />
        <Route path="/concierge" element={<Concierge />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
