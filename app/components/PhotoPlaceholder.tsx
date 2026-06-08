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
  const tint =
    variant === "warm"
      ? "from-[#3a2f22] via-[#1c1a1d] to-[#0b0b0d]"
      : "from-[#22262f] via-[#1a1c20] to-[#0b0b0d]";

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute bottom-4 right-4 text-xs tracking-wide text-white/70">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${tint} ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-25"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <rect x="40" y="120" width="120" height="140" stroke="#cfa15c" strokeWidth="1.5" />
        <rect x="60" y="150" width="30" height="40" stroke="#cfa15c" strokeWidth="1" />
        <rect x="110" y="150" width="30" height="40" stroke="#cfa15c" strokeWidth="1" />
        <line x1="40" y1="120" x2="100" y2="80" stroke="#cfa15c" strokeWidth="1.5" />
        <line x1="160" y1="120" x2="100" y2="80" stroke="#cfa15c" strokeWidth="1.5" />
        <rect x="190" y="90" width="170" height="170" stroke="#cfa15c" strokeWidth="1.5" />
        <line x1="190" y1="140" x2="360" y2="140" stroke="#cfa15c" strokeWidth="1" />
        <line x1="190" y1="190" x2="360" y2="190" stroke="#cfa15c" strokeWidth="1" />
        <line x1="240" y1="90" x2="240" y2="260" stroke="#cfa15c" strokeWidth="1" />
        <line x1="290" y1="90" x2="290" y2="260" stroke="#cfa15c" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute bottom-4 right-4 text-xs tracking-wide text-white/50">
        {label}
      </span>
    </div>
  );
}
