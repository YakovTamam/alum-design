import { getLeadAnalytics, type LeadAnalytics } from "@/lib/leads-analytics";
import AnalyticsDashboard from "../../../components/admin/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  let data: LeadAnalytics | null = null;
  let loadError: string | null = null;

  try {
    data = await getLeadAnalytics();
  } catch (err) {
    console.error("Failed to load lead analytics", err);
    loadError = "טעינת הנתונים נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">אנליטיקס לידים</h1>
        <p className="mt-1 text-sm text-zinc-400">
          מבט כולל על נפח הלידים, מקורות התנועה ואחוזי ההמרה לאורך זמן.
        </p>
      </div>

      <div className="mt-8">
        {loadError || !data ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : (
          <AnalyticsDashboard data={data} />
        )}
      </div>
    </div>
  );
}
