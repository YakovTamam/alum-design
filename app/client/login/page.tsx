import ClientLoginForm from "../../components/client/ClientLoginForm";

export default function ClientLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d] px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-panel/70 p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-start leading-none">
          <span className="text-xl font-semibold tracking-[0.2em] text-white">ALUM</span>
          <span className="text-[10px] tracking-[0.4em] text-gold">DESIGN</span>
        </div>

        <h1 className="mt-6 text-lg font-semibold text-white">אזור לקוחות</h1>
        <p className="mt-1 text-sm text-zinc-400">הזינו אימייל וסיסמה כדי לצפות בפרויקטים שלכם</p>

        <ClientLoginForm />
      </div>
    </div>
  );
}
