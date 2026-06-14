import SignupRequestForm from "../components/SignupRequestForm";
import { getSiteCopy } from "@/lib/site-copy-data";

export default async function SignupPage() {
  const { siteIdentity } = await getSiteCopy();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel/70 p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-start leading-none">
          <span className="text-xl font-semibold tracking-[0.2em] text-white">{siteIdentity.namePrimary}</span>
          <span className="text-[10px] tracking-[0.4em] text-gold">{siteIdentity.nameSecondary}</span>
        </div>

        <h1 className="mt-6 text-lg font-semibold text-white">יצירת משתמש</h1>
        <p className="mt-1 text-sm text-zinc-400">
          השאירו פרטים ונחזור אליכם. הגישה למערכת תופעל לאחר אישור מנהל המערכת.
        </p>

        <SignupRequestForm />

        <a href="/login" className="mt-6 inline-block text-sm text-zinc-400 hover:text-zinc-200 hover:underline">
          חזרה להתחברות
        </a>
      </div>
    </div>
  );
}
