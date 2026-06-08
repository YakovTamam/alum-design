import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import ProjectCategories from "./components/ProjectCategories";
import SolutionsSystem from "./components/SolutionsSystem";
import Configurator from "./components/Configurator";
import ProcessSteps from "./components/ProcessSteps";
import FinalCta from "./components/FinalCta";
import ContactSection from "./components/ContactSection";
import SiteFooter from "./components/SiteFooter";
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
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero imageUrl={images.hero} />
        <TrustBar />
        <ProjectCategories images={images} />
        <SolutionsSystem />
        <Configurator />
        <ProcessSteps />
        <FinalCta imageUrl={images["final-cta"]} />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
