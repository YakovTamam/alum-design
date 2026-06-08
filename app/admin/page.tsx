import { getDb } from "@/lib/mongodb";
import { LEADS_COLLECTION, type Lead, type SerializedLead } from "@/lib/leads";
import LeadsTable from "../components/admin/LeadsTable";
import LogoutButton from "../components/admin/LogoutButton";

export const dynamic = "force-dynamic";

async function fetchLeads(): Promise<SerializedLead[]> {
  const db = await getDb();
  const leads = await db
    .collection<Lead>(LEADS_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return leads.map((lead) => ({
    ...lead,
    _id: lead._id?.toString() ?? "",
    createdAt: lead.createdAt.toISOString(),
  }));
}

export default async function AdminPage() {
  let leads: SerializedLead[] = [];
  let loadError: string | null = null;

  try {
    leads = await fetchLeads();
  } catch (err) {
    console.error("Failed to load leads", err);
    loadError = "טעינת הלידים נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  const newCount = leads.filter((lead) => lead.status === "new").length;

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start leading-none">
                <span className="text-lg font-semibold tracking-[0.2em] text-white">ALUM</span>
                <span className="text-[9px] tracking-[0.4em] text-gold">DESIGN</span>
              </div>
              <span className="h-6 w-px bg-white/10" />
              <h1 className="text-lg font-semibold text-white">פאנל ניהול לידים</h1>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              {leads.length} לידים בסך הכל
              {newCount > 0 && (
                <span className="text-gold"> · {newCount} חדשים</span>
              )}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-8">
          {loadError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
              {loadError}
            </div>
          ) : (
            <LeadsTable leads={leads} />
          )}
        </div>
      </div>
    </div>
  );
}
