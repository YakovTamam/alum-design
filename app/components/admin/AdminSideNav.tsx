"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS = [
  {
    title: null,
    items: [{ href: "/admin", label: "לידים" }],
  },
  {
    title: "תוכן אתר",
    items: [
      { href: "/admin/content", label: "ניהול תצוגות" },
      { href: "/admin/media", label: "ספריית התמונות" },
    ],
  },
];

export default function AdminSideNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 text-sm">
      {NAV_GROUPS.map((group, i) => (
        <div key={i} className="flex flex-col gap-2">
          {group.title && (
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {group.title}
            </p>
          )}
          {group.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2.5 transition-colors ${
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
