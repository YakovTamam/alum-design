import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import StatsSection from "./components/StatsSection";
import ProjectCategories from "./components/ProjectCategories";
import SolutionsSystem from "./components/SolutionsSystem";
import ContractorLeads from "./components/ContractorLeads";
import ProcessSteps from "./components/ProcessSteps";
import FinalCta from "./components/FinalCta";
import ContactSection from "./components/ContactSection";
import SiteFooter from "./components/SiteFooter";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import StickyLeadButton from "./components/StickyLeadButton";
import AccessibilityWidget from "./components/AccessibilityWidget";
import CookieBanner from "./components/CookieBanner";
import Reveal from "./components/Reveal";
import ScrollVideoSection from "./components/ScrollVideoSection";
import TrackingScripts from "./components/TrackingScripts";
import Testimonials from "./components/Testimonials";
import { getSiteContentMap } from "@/lib/content";
import { getHeroSlides } from "@/lib/hero-slides-data";
import { getSetting } from "@/lib/settings";
import { getContactInfo } from "@/lib/contact-data";
import { getScrollSection } from "@/lib/scroll-sections-data";
import { getStaffSession } from "@/lib/auth";
import { getTestimonials } from "@/lib/testimonials-data";
import { getLogoSize } from "@/lib/logo-data";
import { getSiteTheme } from "@/lib/theme-data";

export const revalidate = 60;

export default async function Home() {
  let images: Awaited<ReturnType<typeof getSiteContentMap>> = {};
  try {
    images = await getSiteContentMap();
  } catch (err) {
    console.error("Failed to load site content images", err);
  }

  // getHeroSlides never throws — returns defaults if MongoDB is unavailable
  const heroSlides = await getHeroSlides();
  const heroMobileHeight = await getSetting("hero-mobile-height", "75vh");
  const scrollSection = await getScrollSection();
  const staffSession = await getStaffSession();
  const testimonials = await getTestimonials();
  const { phone, email } = await getContactInfo();
  const logoSize = await getLogoSize();
  const theme = await getSiteTheme();

  return (
    <div className="flex flex-1 flex-col">
      <TrackingScripts />
      <FloatingWhatsApp phone={phone} />
      <AccessibilityWidget />
      <StickyLeadButton phone={phone} />
      <CookieBanner />
      <SiteHeader
        logoUrl={images["site-logo"]}
        isStaff={Boolean(staffSession)}
        logoSize={logoSize}
        headerBg={theme.headerBg}
        headerText={theme.headerText}
      />
      <main className="flex flex-1 flex-col">
        <Hero slides={heroSlides} mobileHeight={heroMobileHeight} phone={phone} />
        <Reveal>
          <ProjectCategories images={images} />
        </Reveal>
        <Reveal>
          <ScrollVideoSection section={scrollSection} />
        </Reveal>
        <Reveal>
          <SolutionsSystem />
        </Reveal>
        <Reveal>
          <ContractorLeads phone={phone} />
        </Reveal>
        <TrustBar />
        <Reveal>
          <ProcessSteps />
        </Reveal>
        <FinalCta imageUrl={images["final-cta"]} />
        <Reveal>
          <StatsSection />
        </Reveal>
        <Reveal>
          <Testimonials testimonials={testimonials} />
        </Reveal>
        <Reveal>
          <ContactSection phone={phone} email={email} />
        </Reveal>
      </main>
      <SiteFooter
        logoUrl={images["site-logo"]}
        phone={phone}
        email={email}
        logoSize={logoSize}
        footerBg={theme.footerBg}
        footerText={theme.footerText}
      />
    </div>
  );
}
