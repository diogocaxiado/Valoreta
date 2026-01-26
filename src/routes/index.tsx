import { Routes, Route } from "react-router-dom";
import Lobby from "../pages/Lobby";
import Main from "../pages/Main/index";
import NotFound from "../pages/NotFound";
import SplashScreen from "../components/Splash/Splash";

import { useEffect, useState } from "react";

function detectPWA(): boolean {
	try {
		if (window.matchMedia('(display-mode: standalone)').matches) return true
		if ((window.navigator as any).standalone) return true
		if (document.referrer?.startsWith('android-app://')) return true
		return false
	} catch {
		return false
	}
}

export default function AppRoutes() {
  const [isPWA, setIsPWA] = useState<boolean>(() => detectPWA())
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
		const media = window.matchMedia('(display-mode: standalone)')

		const handleChange = (e: MediaQueryListEvent) => {
			const nowPWA = e.matches || (window.navigator as any).standalone
			if (nowPWA !== isPWA) {
				window.location.reload()
			}
		}
		

		media.addEventListener('change', handleChange)
		return () => media.removeEventListener('change', handleChange)
	}, [isPWA])

  if (isPWA && showSplash) {
		return <SplashScreen onFinished={() => setShowSplash(false)} />
	}

  return (
    <Routes>
			<Route path="/room" element={<Main />} />
      <Route path="/room/:roomId" element={<Main />} />

      <Route path="/" element={<Lobby />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}