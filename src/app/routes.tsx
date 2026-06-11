import { Routes, Route } from "react-router-dom";
import { LobbyPage } from "../features/lobby/LobbyPage";
import { RoomPage } from "../features/room/RoomPage";
import { NotFoundPage } from "./NotFoundPage";
import { SplashScreen } from "../common/components/Splash/Splash";
import { useEffect, useState } from "react";

function detectPWA(): boolean {
  try {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    if ((window.navigator as any).standalone) return true;
    if (document.referrer?.startsWith("android-app://")) return true;
    return false;
  } catch {
    return false;
  }
}

export function AppRoutes() {
  const [isPWA, setIsPWA] = useState<boolean>(() => detectPWA());
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");

    const handleChange = (e: MediaQueryListEvent) => {
      const nowPWA = e.matches || (window.navigator as any).standalone;
      if (nowPWA !== isPWA) {
        window.location.reload();
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [isPWA]);

  if (isPWA && showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/solo" element={<RoomPage mode="solo" />} />
      <Route path="/room/:roomId" element={<RoomPage mode="multiplayer" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
