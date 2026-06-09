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
import Reveal from "./components/Reveal";
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
      <FloatingWhatsApp />
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero imageUrl={images.hero} />
        <TrustBar />
        <Reveal>
          <StatsSection />
        </Reveal>
        <Reveal>
          <ProjectCategories images={images} />
        </Reveal>
        <Reveal>
          <SolutionsSystem />
        </Reveal>
        <Reveal>
          <ContractorLeads />
        </Reveal>
        <Reveal>
          <ProcessSteps />
        </Reveal>
        <FinalCta imageUrl={images["final-cta"]} />
        <Reveal>
          <ContactSection />
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
