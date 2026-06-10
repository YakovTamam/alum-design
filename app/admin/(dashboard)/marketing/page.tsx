import { getSetting } from "@/lib/settings";
import { TRACKING_PIXELS } from "@/lib/tracking-pixels";
import TrackingPixelsManager from "../../../components/admin/TrackingPixelsManager";

export const dynamic = "force-dynamic";

export default async function AdminMarketingPage() {
  const entries = await Promise.all(
    TRACKING_PIXELS.map(async ({ key }) => [key, await getSetting(key, "")] as const),
  );
  const initialValues = Object.fromEntries(entries);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold text-white">שיווק ומעקב</h1>
        <p className="mt-1 text-sm text-zinc-400">
          חיבור פיקסלים וכלי אנליטיקה לאתר. הדביקו את המזהה (ID) של כל כלי ושמרו —
          הקוד יוטמע אוטומטית בדף הבית.
        </p>
      </div>

      <TrackingPixelsManager initialValues={initialValues} />
    </div>
  );
}
