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
import { getSiteContentMap } from "@/lib/content";
import { getHeroSlides } from "@/lib/hero-slides-data";
import { getSetting } from "@/lib/settings";
import { getScrollSection } from "@/lib/scroll-sections-data";

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

  return (
    <div className="flex flex-1 flex-col">
      <FloatingWhatsApp />
      <AccessibilityWidget />
      <StickyLeadButton />
      <CookieBanner />
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero slides={heroSlides} mobileHeight={heroMobileHeight} />
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
          <ContractorLeads />
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
          <ContactSection />
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
