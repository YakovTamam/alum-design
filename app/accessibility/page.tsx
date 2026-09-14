import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import StickyLeadButton from "../components/StickyLeadButton";
import AccessibilityWidget from "../components/AccessibilityWidget";
import CookieBanner from "../components/CookieBanner";
import { getSiteContentMap } from "@/lib/content";
import { getClientSession, getStaffSession } from "@/lib/auth";
import { getContactInfo } from "@/lib/contact-data";
import { getLogoSize, getFooterLogoSize } from "@/lib/logo-data";
import { getSiteTheme } from "@/lib/theme-data";
import { getSiteCopy } from "@/lib/site-copy-data";
import { getSiteName } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const siteCopy = await getSiteCopy();
  const siteName = getSiteName(siteCopy.siteIdentity);
  return {
    title: "הצהרת נגישות",
    description: `הצהרת הנגישות של ${siteName} — התאמות הנגישות באתר ופרטי קשר לפניות בנושא.`,
  };
}

export default async function AccessibilityStatementPage() {
  let images: Awaited<ReturnType<typeof getSiteContentMap>> = {};
  try {
    images = await getSiteContentMap();
  } catch (err) {
    console.error("Failed to load site content images", err);
  }

  const staffSession = await getStaffSession();
  const clientSession = await getClientSession();
  const { phone, email, social } = await getContactInfo();
  const logoSize = await getLogoSize();
  const footerLogoSize = await getFooterLogoSize();
  const theme = await getSiteTheme();
  const siteCopy = await getSiteCopy();
  const siteName = getSiteName(siteCopy.siteIdentity);

  return (
    <div className="flex flex-1 flex-col">
      <FloatingWhatsApp phone={phone} />
      <AccessibilityWidget />
      <StickyLeadButton />
      <CookieBanner />
      <SiteHeader
        logoUrl={images["site-logo"]}
        isStaff={Boolean(staffSession)}
        isClient={Boolean(clientSession)}
        logoSize={logoSize}
        headerBg={theme.headerBg}
        headerText={theme.headerText}
        navLinks={siteCopy.navLinks}
        siteIdentity={siteCopy.siteIdentity}
      />
      <main className="flex flex-1 flex-col bg-white">
        <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:px-0 lg:py-20">
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">הצהרת נגישות</h1>
          <p className="mt-2 text-sm text-zinc-500">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>

          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <strong>הערה:</strong> זוהי טיוטה כללית שיש להשלים לפני פרסום. יש למלא את פרטי{" "}
            <strong>רכז/ת הנגישות</strong> המסומנים למטה, ומומלץ לבצע בדיקת נגישות בפועל (ידנית
            ו/או בכלי אוטומטי) כדי לוודא שהרמה המוצהרת תואמת את מצב האתר בפועל.
          </div>

          <div className="mt-10 flex flex-col gap-8 text-sm leading-7 text-zinc-700">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">התחייבותנו לנגישות</h2>
              <p className="mt-2">
                <bdi>{siteName}</bdi>{" "}
                רואה חשיבות רבה במתן שירות שוויוני ונגיש לכלל הגולשים, לרבות אנשים
                עם מוגבלות. אנו פועלים להנגשת האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות,
                התשנ&quot;ח-1998, ולתקנות הנגישות מכוחו, וכן בהתאם לתקן הישראלי ת&quot;י 5568
                ברמה AA, המבוסס על הנחיות WCAG 2.0 הבינלאומיות.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">התאמות הנגישות באתר</h2>
              <p className="mt-2">באתר מוטמע ווידג&apos;ט נגישות (סמל האדם בפינת המסך) המאפשר, בין היתר:</p>
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li>הגדלה/הקטנה של גודל הטקסט</li>
                <li>מעבר לתצוגת ניגודיות גבוהה</li>
                <li>תצוגה בגווני אפור</li>
                <li>הדגשת קישורים באתר</li>
                <li>עצירת אנימציות ואפקטים נעים</li>
              </ul>
              <p className="mt-2">
                האתר נבנה בשאיפה לכלול טקסטים חלופיים לתמונות, ניווט מלא באמצעות מקלדת,
                ותאימות לטכנולוגיות מסייעות (כגון קוראי מסך). ייתכן שחלקים מסוימים באתר —
                בפרט תוכן המוזן דינמית — טרם עברו התאמה מלאה.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">מגבלות ידועות</h2>
              <p className="mt-2">
                [להשלמה: פרטו כאן רכיבים באתר שידוע כי טרם הונגשו במלואם, אם קיימים, כך
                שהמשתמשים יידעו למה לצפות ואיך לפנות בבקשת עזרה חלופית.]
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">פניות בנושא נגישות</h2>
              <p className="mt-2">
                נתקלתם בבעיית נגישות באתר, או זקוקים לסיוע בגישה לתוכן מסוים? נשמח לסייע —
                פנו אלינו ונדאג לטפל בפנייה בהקדם האפשרי:
              </p>
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li>
                  רכז/ת נגישות: <strong>[שם רכז/ת הנגישות]</strong>
                </li>
                <li>
                  טלפון: <span dir="ltr">{phone}</span>
                </li>
                <li>
                  דוא&quot;ל:{" "}
                  <a href={`mailto:${email}`} className="text-gold hover:underline" dir="ltr">
                    {email}
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter
        logoUrl={images["footer-logo"] ?? images["site-logo"]}
        phone={phone}
        email={email}
        logoSize={footerLogoSize}
        footerBg={theme.footerBg}
        footerText={theme.footerText}
        services={siteCopy.services}
        siteIdentity={siteCopy.siteIdentity}
        social={social}
      />
    </div>
  );
}
