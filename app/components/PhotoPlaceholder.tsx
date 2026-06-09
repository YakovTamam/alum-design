import Image from "next/image";

type PhotoPlaceholderProps = {
  label: string;
  className?: string;
  variant?: "warm" | "cool";
  imageUrl?: string;
};

export default function PhotoPlaceholder({
  label,
  className = "",
  variant = "warm",
  imageUrl,
}: PhotoPlaceholderProps) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt={label}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute bottom-4 right-4 text-xs tracking-wide text-white/70">
          {label}
        </span>
      </div>
    );
  }

  const isWarm = variant === "warm";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Layered gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: isWarm
            ? "radial-gradient(ellipse at 70% 30%, rgba(207,161,92,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(120,75,20,0.22) 0%, transparent 55%), linear-gradient(145deg, #1e1508 0%, #2a1c0c 40%, #0e0b07 100%)"
            : "radial-gradient(ellipse at 30% 25%, rgba(80,120,180,0.15) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(30,60,110,0.2) 0%, transparent 55%), linear-gradient(145deg, #0b0f1a 0%, #0f1825 40%, #080b12 100%)",
        }}
      />

      {/* Architectural line illustration */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 500 380"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {isWarm ? (
          /* Pergola / villa illustration */
          <>
            <rect x="60" y="160" width="180" height="180" stroke="#cfa15c" strokeWidth="1.5" />
            <rect x="85" y="195" width="50" height="65" stroke="#cfa15c" strokeWidth="1" />
            <rect x="165" y="195" width="50" height="65" stroke="#cfa15c" strokeWidth="1" />
            <rect x="105" y="270" width="30" height="70" stroke="#cfa15c" strokeWidth="1" />
            <line x1="60" y1="160" x2="150" y2="110" stroke="#cfa15c" strokeWidth="1.5" />
            <line x1="240" y1="160" x2="150" y2="110" stroke="#cfa15c" strokeWidth="1.5" />
            <line x1="60" y1="160" x2="240" y2="160" stroke="#cfa15c" strokeWidth="1" />
            <rect x="290" y="100" width="160" height="120" stroke="#cfa15c" strokeWidth="1.5" />
            <line x1="290" y1="140" x2="450" y2="140" stroke="#cfa15c" strokeWidth="0.8" />
            <line x1="290" y1="180" x2="450" y2="180" stroke="#cfa15c" strokeWidth="0.8" />
            <line x1="340" y1="100" x2="340" y2="220" stroke="#cfa15c" strokeWidth="0.8" />
            <line x1="400" y1="100" x2="400" y2="220" stroke="#cfa15c" strokeWidth="0.8" />
            <rect x="290" y="250" width="80" height="90" stroke="#cfa15c" strokeWidth="1.5" />
            <rect x="380" y="250" width="70" height="90" stroke="#cfa15c" strokeWidth="1.5" />
            <line x1="290" y1="295" x2="450" y2="295" stroke="#cfa15c" strokeWidth="0.8" />
            <line x1="330" y1="250" x2="330" y2="340" stroke="#cfa15c" strokeWidth="0.8" />
            <line x1="415" y1="250" x2="415" y2="340" stroke="#cfa15c" strokeWidth="0.8" />
          </>
        ) : (
          /* Modern building facade */
          <>
            <rect x="60" y="60" width="380" height="280" stroke="#7da4cf" strokeWidth="1.5" />
            <line x1="60" y1="110" x2="440" y2="110" stroke="#7da4cf" strokeWidth="0.8" />
            <line x1="60" y1="170" x2="440" y2="170" stroke="#7da4cf" strokeWidth="0.8" />
            <line x1="60" y1="230" x2="440" y2="230" stroke="#7da4cf" strokeWidth="0.8" />
            <line x1="60" y1="290" x2="440" y2="290" stroke="#7da4cf" strokeWidth="0.8" />
            <line x1="130" y1="60" x2="130" y2="340" stroke="#7da4cf" strokeWidth="0.8" />
            <line x1="200" y1="60" x2="200" y2="340" stroke="#7da4cf" strokeWidth="0.8" />
            <line x1="280" y1="60" x2="280" y2="340" stroke="#7da4cf" strokeWidth="0.8" />
            <line x1="360" y1="60" x2="360" y2="340" stroke="#7da4cf" strokeWidth="0.8" />
            <rect x="80" y="125" width="30" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="148" y="125" width="30" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="218" y="125" width="42" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="298" y="125" width="42" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="378" y="125" width="42" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="80" y="185" width="30" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="148" y="185" width="30" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="218" y="185" width="42" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="298" y="185" width="42" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
            <rect x="378" y="185" width="42" height="28" stroke="#cfa15c" strokeWidth="1" fill="rgba(207,161,92,0.06)" />
          </>
        )}
      </svg>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40" />

      <span className="absolute bottom-4 right-4 text-xs tracking-wide text-white/50">
        {label}
      </span>
    </div>
  );
}
