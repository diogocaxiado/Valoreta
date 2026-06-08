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
    <section className="absolute top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {type === "image" ? (
        <img
          src={src}
          alt="Background"
          className="w-full h-full object-cover"
        />
      ) : (
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src={src} type="video/mp4" />
        </video>
      )}

      {overlay && <div className="absolute inset-0 bg-black/50" />}
    </section>
  );
}
