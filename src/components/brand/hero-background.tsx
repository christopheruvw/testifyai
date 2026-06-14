export function HeroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden hero-bg">
      <div className="hero-bg-gradient" />
      <div className="hero-blob hero-blob-1 animate-blob" />
      <div className="hero-blob hero-blob-2 animate-blob-delayed" />
      <div className="hero-blob hero-blob-3 animate-blob-slow" />
      <div className="hero-bg-vignette" />
      <div className="hero-bg-noise" />
    </div>
  );
}
