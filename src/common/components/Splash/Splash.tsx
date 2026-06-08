import { useEffect, useState } from "react";
import ValorantVideo from "../../../assets/video/Valorant.mp4";

interface SplashScreenProps {
  onFinished: () => void;
}

export function SplashScreen({ onFinished }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 2500);

    const finishTimer = setTimeout(() => {
      onFinished();
    }, 3000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      <video
        src={ValorantVideo}
        autoPlay
        muted
        playsInline
        className={`absolute inset-0 h-full w-full object-cover object-[48%] transition-opacity duration-700 ease-in-out ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        src="/favicon.svg"
        alt="Logo"
        className={`relative h-32 w-32 mb-32 transition-transform duration-700 ease-in-out ${
          isAnimating
            ? "-translate-y-20 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      />
    </div>
  );
}
