import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main/index";
import { useEffect, useState } from "react";
import SplashScreen from "../components/Splash/Splash";

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
      <Route path="*" element={<Main />} />
    </Routes>
  );
}
