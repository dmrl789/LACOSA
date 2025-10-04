import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import HomePage from "./pages/Home";
import MapPage from "./pages/Map";
import HousingPage from "./pages/Housing";
import EssentialsPage from "./pages/Essentials";
import ConciergePage from "./pages/Concierge";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="mx-auto max-w-md pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slate-500">Loading…</div>}>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/housing" element={<HousingPage />} />
          <Route path="/essentials" element={<EssentialsPage />} />
          <Route path="/concierge" element={<ConciergePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Suspense>
  );
}
