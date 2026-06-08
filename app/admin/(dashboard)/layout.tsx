import type { ReactNode } from "react";
import LogoutButton from "../../components/admin/LogoutButton";
import AdminSideNav from "../../components/admin/AdminSideNav";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-zinc-100 lg:flex lg:flex-row-reverse">
      <div className="border-b border-white/5 lg:hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg font-semibold tracking-[0.2em] text-white">ALUM</span>
              <span className="text-[9px] tracking-[0.4em] text-gold">DESIGN</span>
            </div>
            <span className="h-6 w-px bg-white/10" />
            <span className="text-sm font-semibold text-white">פאנל ניהול</span>
          </div>
          <LogoutButton />
        </div>
      </div>

      <aside className="hidden w-64 shrink-0 border-s border-white/5 px-5 py-8 lg:flex lg:flex-col lg:gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="flex flex-col items-start leading-none">
            <span className="text-lg font-semibold tracking-[0.2em] text-white">ALUM</span>
            <span className="text-[9px] tracking-[0.4em] text-gold">DESIGN</span>
          </div>
          <span className="h-6 w-px bg-white/10" />
          <span className="text-sm font-semibold text-white">פאנל ניהול</span>
        </div>

        <AdminSideNav />

        <div className="mt-auto px-2">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
