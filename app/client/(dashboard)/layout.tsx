import type { ReactNode } from "react";
import LogoutButton from "../../components/admin/LogoutButton";
import { getSiteCopy } from "@/lib/site-copy-data";

export default async function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const { siteIdentity } = await getSiteCopy();

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-zinc-100">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start leading-none">
            <span className="text-base font-semibold tracking-[0.2em] text-white">{siteIdentity.namePrimary}</span>
            <span className="text-[9px] tracking-[0.4em] text-gold">{siteIdentity.nameSecondary}</span>
          </div>
          <span className="h-5 w-px bg-white/10" />
          <span className="text-sm font-semibold text-white">אזור לקוחות</span>
        </div>
        <LogoutButton logoutUrl="/api/client/logout" redirectUrl="/client/login" />
      </div>

      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-10">{children}</main>
    </div>
  );
}
