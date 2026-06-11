import { getInvitationByToken, isInvitationValid } from "@/lib/invitations";
import { ROLE_LABELS } from "@/lib/users";
import AcceptInviteForm from "../../components/AcceptInviteForm";
import { SITE_NAME_PRIMARY, SITE_NAME_SECONDARY } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let invitation;
  try {
    invitation = await getInvitationByToken(token);
  } catch {
    invitation = null;
  }

  const valid = !!invitation && isInvitationValid(invitation);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel/70 p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-start leading-none">
          <span className="text-xl font-semibold tracking-[0.2em] text-white">{SITE_NAME_PRIMARY}</span>
          <span className="text-[10px] tracking-[0.4em] text-gold">{SITE_NAME_SECONDARY}</span>
        </div>

        {valid && invitation ? (
          <>
            <h1 className="mt-6 text-lg font-semibold text-white">השלמת הרשמה</h1>
            <p className="mt-1 text-sm text-zinc-400">
              נוצר עבורכם חשבון {ROLE_LABELS[invitation.role]} עבור{" "}
              <span dir="ltr" className="text-zinc-300">
                {invitation.email}
              </span>
              . הזינו שם וסיסמה כדי לסיים.
            </p>
            <AcceptInviteForm token={token} />
          </>
        ) : (
          <>
            <h1 className="mt-6 text-lg font-semibold text-white">ההזמנה אינה תקפה</h1>
            <p className="mt-1 text-sm text-zinc-400">
              ייתכן שההזמנה כבר נוצלה או שפג תוקפה. פנו למנהל המערכת לקבלת הזמנה חדשה.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
