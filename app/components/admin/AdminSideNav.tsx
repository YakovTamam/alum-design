"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/user-roles";

type NavGroup = { title: string | null; items: { href: string; label: string }[] };

function getNavGroups(role: UserRole): NavGroup[] {
  const groups: NavGroup[] = [{ title: null, items: [{ href: "/admin", label: "לידים" }] }];

  if (role === "super-admin") {
    groups.push({
      title: "תוכן אתר",
      items: [
        { href: "/admin/content", label: "ניהול תצוגות" },
        { href: "/admin/media", label: "ספריית התמונות" },
        { href: "/admin/marketing", label: "שיווק ומעקב" },
      ],
    });
  }

  groups.push({
    title: "ניהול",
    items: [
      { href: "/admin/projects", label: "פרויקטים" },
      { href: "/admin/users", label: "משתמשים" },
    ],
  });

  return groups;
}

export default function AdminSideNav({ role, mobile = false }: { role: UserRole; mobile?: boolean }) {
  const pathname = usePathname();
  const groups = getNavGroups(role);
  const allItems = groups.flatMap((g) => g.items);

  if (mobile) {
    return (
      <nav className="flex gap-1 py-2">
        {allItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                active
                  ? "bg-gold/15 text-gold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-6 text-sm">
      {groups.map((group, i) => (
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
