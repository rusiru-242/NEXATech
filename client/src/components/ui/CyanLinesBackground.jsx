export default function CyanLinesBackground({
  opacity = "opacity-40",
  overlay = true,
  className = "",
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={`h-full w-full object-cover ${opacity}`}
      >
        <source src="/animations/back-video/cyan_lines.webm" type="video/webm" />
      </video>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/40 to-[#050505]/80 pointer-events-none" />
      )}
    </div>
  );
}
