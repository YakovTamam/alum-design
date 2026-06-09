import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import StatsSection from "./components/StatsSection";
import ProjectCategories from "./components/ProjectCategories";
import SolutionsSystem from "./components/SolutionsSystem";
import Configurator from "./components/Configurator";
import ProcessSteps from "./components/ProcessSteps";
import FinalCta from "./components/FinalCta";
import ContactSection from "./components/ContactSection";
import SiteFooter from "./components/SiteFooter";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ScrollRevealSetup from "./components/ScrollRevealSetup";
import { getSiteContentMap } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  let images: Awaited<ReturnType<typeof getSiteContentMap>> = {};
  try {
    images = await getSiteContentMap();
  } catch (err) {
    console.error("Failed to load site content images", err);
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScrollRevealSetup />
      <FloatingWhatsApp />
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero imageUrl={images.hero} />
        <TrustBar />
        <div data-reveal>
          <StatsSection />
        </div>
        <div data-reveal>
          <ProjectCategories images={images} />
        </div>
        <div data-reveal>
          <SolutionsSystem />
        </div>
        <div data-reveal>
          <Configurator />
        </div>
        <div data-reveal>
          <ProcessSteps />
        </div>
        <FinalCta imageUrl={images["final-cta"]} />
        <div data-reveal>
          <ContactSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
