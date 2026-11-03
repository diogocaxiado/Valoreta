interface BackgroundProps {
  type: "image" | "video";
  src: string;
  overlay?: boolean;
}

export function Background({
  type,
  src,
  overlay = false,
}: BackgroundProps) {
  return (
    <section className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {type === "image" ? (
        <img
          src={src}
          alt="Background"
          className="w-full h-full object-cover"
        />
      ) : (
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src={src} type="video/mp4" />
        </video>
      )}

      {overlay && <div className="absolute inset-0 bg-black/50" />}
    </section>
  );
}
