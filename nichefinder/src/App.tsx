import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { SettingsProvider } from "@/context/SettingsContext";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/Card";
import { LandingPage } from "@/pages/LandingPage";
import { CreateProfilePage } from "@/pages/CreateProfilePage";
import { QuestionnairePage } from "@/pages/QuestionnairePage";
import { ResultsPage } from "@/pages/ResultsPage";
import { ReportPage } from "@/pages/ReportPage";
import { AdminPage } from "@/pages/AdminPage";
import { stopSpeaking } from "@/lib/audio";

/**
 * Scrolls to top and stops any read-aloud on every route change, so each new
 * screen starts calm and from the top.
 */
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    stopSpeaking();
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <Card className="p-8 text-center">
      <div aria-hidden="true" className="text-4xl">🧭</div>
      <h1 className="mt-2 text-2xl font-bold text-ink">Page not found</h1>
      <Link to="/" className="mt-4 inline-block font-semibold text-brand">← Back home</Link>
    </Card>
  );
}

/**
 * Root component.
 *
 * HashRouter is used so the built app works when opened from any static host or
 * even the local filesystem, with no server-side route config needed — a good
 * fit for an offline-friendly, MVP tool.
 */
export function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <RouteEffects />
        <AppShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<CreateProfilePage />} />
            <Route path="/assessment/:sessionId" element={<QuestionnairePage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
            <Route path="/report/:sessionId" element={<ReportPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </HashRouter>
    </SettingsProvider>
  );
}
