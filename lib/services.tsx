export type ServiceIcon = "pergola" | "window" | "gate" | "glass" | "facade" | "shade";

export const SERVICE_ICONS: ServiceIcon[] = ["pergola", "window", "gate", "glass", "facade", "shade"];

export function ServiceIconSvg({ kind }: { kind: ServiceIcon }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 };
  switch (kind) {
    case "pergola":
      return (
        <svg {...common}>
          <path d="M3 8 12 4l9 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 8v11M20 8v11M8 8v11M16 8v11M12 8v11" strokeLinecap="round" />
          <path d="M3 8h18" strokeLinecap="round" />
        </svg>
      );
    case "window":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M12 4v16M4 12h16" />
        </svg>
      );
    case "gate":
      return (
        <svg {...common}>
          <path d="M4 21V8l8-4 8 4v13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 21h16M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "glass":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M9 3v18M15 3v18" />
        </svg>
      );
    case "facade":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M4 8h16M4 12h16M4 16h16" />
        </svg>
      );
  }
}
