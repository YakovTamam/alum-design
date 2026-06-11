import type { ReactNode } from "react";
import { getStaffSession } from "@/lib/auth";
import LogoutButton from "../../components/admin/LogoutButton";
import AdminSideNav from "../../components/admin/AdminSideNav";
import { SITE_NAME_PRIMARY, SITE_NAME_SECONDARY } from "@/lib/site";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getStaffSession();
  const role = session?.role ?? "admin";

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-zinc-100 lg:flex lg:flex-row-reverse">

      {/* Mobile top bar */}
      <div className="border-b border-white/5 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-start leading-none">
              <span className="text-base font-semibold tracking-[0.2em] text-white">{SITE_NAME_PRIMARY}</span>
              <span className="text-[9px] tracking-[0.4em] text-gold">{SITE_NAME_SECONDARY}</span>
            </div>
            <span className="h-5 w-px bg-white/10" />
            <span className="text-sm font-semibold text-white">פאנל ניהול</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/35"
            >
              צפייה באתר
            </a>
            <LogoutButton />
          </div>
        </div>
        {/* Mobile nav tabs */}
        <div className="flex overflow-x-auto border-t border-white/5 px-5 scrollbar-hide">
          <AdminSideNav role={role} mobile />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-s border-white/5 px-5 py-8 lg:flex lg:flex-col lg:gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="flex flex-col items-start leading-none">
            <span className="text-lg font-semibold tracking-[0.2em] text-white">{SITE_NAME_PRIMARY}</span>
            <span className="text-[9px] tracking-[0.4em] text-gold">{SITE_NAME_SECONDARY}</span>
          </div>
          <span className="h-6 w-px bg-white/10" />
          <span className="text-sm font-semibold text-white">פאנל ניהול</span>
        </div>

        <AdminSideNav role={role} />

        <div className="mt-auto flex flex-col gap-2 px-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-4 py-2 text-center text-sm text-zinc-300 transition-colors hover:border-white/35"
          >
            צפייה באתר
          </a>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 pb-6">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
