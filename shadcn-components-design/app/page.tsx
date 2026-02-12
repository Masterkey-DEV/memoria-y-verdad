import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { TabNav } from "@/components/tab-nav";
import { CategoriesSection } from "@/components/categories-section";
import { InitiativesSection } from "@/components/initiatives-section";
import { SuccessStories } from "@/components/success-stories";
import { SupportSection } from "@/components/support-section";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-background mx-auto">
      <Header />
      <main>
        <HeroSection />
        <TabNav />
        <CategoriesSection />
        <InitiativesSection />
        <SuccessStories />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
}
