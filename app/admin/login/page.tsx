import { countUsers } from "@/lib/users";
import AdminLoginForm from "../../components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  let bootstrap = false;
  try {
    bootstrap = (await countUsers()) === 0;
  } catch {
    bootstrap = false;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel/70 p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-start leading-none">
          <span className="text-xl font-semibold tracking-[0.2em] text-white">ALUM</span>
          <span className="text-[10px] tracking-[0.4em] text-gold">DESIGN</span>
        </div>

        {bootstrap ? (
          <>
            <h1 className="mt-6 text-lg font-semibold text-white">הקמת חשבון סופר אדמין</h1>
            <p className="mt-1 text-sm text-zinc-400">
              לא נמצאו משתמשים במערכת. צרו את חשבון סופר האדמין הראשון.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-lg font-semibold text-white">כניסה לפאנל ניהול</h1>
            <p className="mt-1 text-sm text-zinc-400">הזינו אימייל וסיסמה כדי להיכנס</p>
          </>
        )}

        <AdminLoginForm bootstrap={bootstrap} />
      </div>
    </div>
  );
}
