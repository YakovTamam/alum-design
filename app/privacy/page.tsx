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
    title: "מדיניות פרטיות",
    description: `מדיניות הפרטיות של ${siteName} — אילו פרטים נאספים באתר, כיצד הם נשמרים ומשמשים, ואילו זכויות עומדות לכם.`,
  };
}

export default async function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">מדיניות פרטיות</h1>
          <p className="mt-2 text-sm text-zinc-500">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>

          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <strong>הערה:</strong> זוהי טיוטה כללית שנועדה לשמש נקודת פתיחה, ואינה ייעוץ משפטי.
            מומלץ להעביר אותה לבדיקת עורך/ת דין לפני הסתמכות עליה, ולעדכן את הפרטים המסומנים
            בסוגריים מרובעים כך שישקפו נכונה את אופן הפעילות שלכם.
          </div>

          <div className="prose-content mt-10 flex flex-col gap-8 text-sm leading-7 text-zinc-700">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">1. כללי</h2>
              <p className="mt-2">
                מדיניות פרטיות זו חלה על השימוש באתר{" "}
                <bdi>{siteName}</bdi>{" "}
                (&quot;האתר&quot;), ומסבירה אילו פרטים אנו אוספים מהמשתמשים בו, כיצד אנו
                משתמשים בהם, עם מי הם עשויים להיות משותפים ואילו זכויות עומדות לכם ביחס
                אליהם.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">2. אילו פרטים נאספים</h2>
              <p className="mt-2">כאשר אתם משתמשים בטפסי יצירת הקשר או בקשת הצעת מחיר באתר, אנו אוספים:</p>
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li>שם מלא</li>
                <li>מספר טלפון</li>
                <li>עיר מגורים</li>
                <li>כתובת אימייל (כאשר מולאה)</li>
                <li>תוכן הפנייה שהזנתם (כאשר רלוונטי)</li>
              </ul>
              <p className="mt-2">
                למשתמשי פאנל הניהול או אזור הלקוחות, אנו שומרים גם כתובת אימייל וסיסמה
                מוצפנת (הסיסמה עצמה אינה נשמרת בטקסט גלוי).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">3. עוגיות וכלי ניתוח/פרסום</h2>
              <p className="mt-2">
                האתר עשוי להשתמש בעוגיות (Cookies) ובכלי צד שלישי לצורך ניתוח שימוש
                ושיפור חוויית הגלישה, ובהם Google Analytics, Meta Pixel (פייסבוק/אינסטגרם),
                TikTok Pixel ו-Microsoft Clarity. כלים אלה עשויים לאסוף מידע על אופן
                השימוש שלכם באתר (עמודים שנצפו, זמן שהייה, מקור ההגעה) לצורך התאמת
                פרסומות והבנת התנהגות משתמשים. לא כל הכלים בהכרח פעילים בכל עת.
              </p>
              <p className="mt-2">ניתן לחסום עוגיות בהגדרות הדפדפן, אם כי הדבר עלול לפגוע בתפקוד חלק מהאתר.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">4. כיצד נעשה שימוש במידע</h2>
              <ul className="mt-2 list-disc space-y-1 pr-5">
                <li>יצירת קשר איתכם בנוגע לפנייתכם ומתן הצעת מחיר</li>
                <li>שליחת עדכונים או אישורים הנוגעים לחשבון (למשתמשי פאנל ניהול/אזור לקוחות)</li>
                <li>שיפור האתר וניתוח דפוסי שימוש</li>
                <li>עמידה בדרישות חוק, ככל שיידרש</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">5. שיתוף מידע עם צדדים שלישיים</h2>
              <p className="mt-2">
                אנו משתמשים בספקי שירות חיצוניים לצורך תפעול האתר, ובהם: אחסון בסיס
                הנתונים (MongoDB), שליחת מיילים (Resend) ואחסון תמונות (Cloudinary).
                ספקים אלה מעבדים מידע בשמנו בלבד, בהתאם למדיניותם. אנו איננו מוכרים
                מידע אישי לצדדים שלישיים.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">6. שמירת מידע</h2>
              <p className="mt-2">
                אנו שומרים את פרטי הפניות למשך הזמן הנדרש למטרות שלשמן נאספו, או
                כנדרש על פי דין. ניתן לפנות אלינו בכל עת בבקשה למחיקת המידע (ראו סעיף
                &quot;יצירת קשר&quot; למטה).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">7. זכויותיכם</h2>
              <p className="mt-2">
                בהתאם לחוק הגנת הפרטיות, תשמ&quot;א-1981, זכותכם לעיין במידע שנאסף אודותיכם,
                לבקש את תיקונו או מחיקתו, וכן להסיר את עצמכם מרשימות תפוצה. לצורך מימוש
                זכויות אלה, ניתן לפנות אלינו בפרטי הקשר המופיעים למטה.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">8. יצירת קשר</h2>
              <p className="mt-2">
                לשאלות או בקשות בנוגע למדיניות פרטיות זו, ניתן לפנות אלינו בטלפון{" "}
                <span dir="ltr">{phone}</span> או בדוא&quot;ל{" "}
                <a href={`mailto:${email}`} className="text-gold hover:underline" dir="ltr">
                  {email}
                </a>
                .
              </p>
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
