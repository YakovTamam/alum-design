import { getPasswordResetByToken, isPasswordResetValid } from "@/lib/password-reset";
import ResetPasswordForm from "../../../components/admin/ResetPasswordForm";
import { getSiteCopy } from "@/lib/site-copy-data";

export const dynamic = "force-dynamic";

export default async function AdminResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let reset;
  try {
    reset = await getPasswordResetByToken(token);
  } catch {
    reset = null;
  }

  const valid = !!reset && isPasswordResetValid(reset);
  const { siteIdentity } = await getSiteCopy();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel/70 p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-start leading-none">
          <span className="text-xl font-semibold tracking-[0.2em] text-white">{siteIdentity.namePrimary}</span>
          <span className="text-[10px] tracking-[0.4em] text-gold">{siteIdentity.nameSecondary}</span>
        </div>

        {valid && reset ? (
          <>
            <h1 className="mt-6 text-lg font-semibold text-white">איפוס סיסמה</h1>
            <p className="mt-1 text-sm text-zinc-400">
              בחרו סיסמה חדשה עבור{" "}
              <span dir="ltr" className="text-zinc-300">
                {reset.email}
              </span>
              .
            </p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <>
            <h1 className="mt-6 text-lg font-semibold text-white">הקישור אינו תקף</h1>
            <p className="mt-1 text-sm text-zinc-400">
              ייתכן שהקישור כבר נוצל או שפג תוקפו. ניתן לבקש קישור חדש מעמוד ההתחברות.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
