import Navbar from "@/components/Navbar";
import CMSLoader from "@/components/CMSLoader";
import Hero from "@/components/Hero";
import LeadMagnet from "@/components/LeadMagnet";
import About from "@/components/About";
import WhyEMF from "@/components/WhyEMF";
import Transformations from "@/components/Transformations";
import Services from "@/components/Services";
import BMICalculator from "@/components/BMICalculator";
import VideoSection from "@/components/VideoSection";
import BookSession from "@/components/BookSession";
import Reviews from "@/components/Reviews";
import UrgencySection from "@/components/UrgencySection";
import Contact from "@/components/Contact";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <>
      <CMSLoader />
      <Navbar />
      <main>
        <Hero />
        <LeadMagnet />
        <About />
        <WhyEMF />
        <Transformations />
        <Services />
        <BMICalculator />
        <VideoSection />
        <UrgencySection />
        <BookSession />
        <Reviews />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyMobileCTA />
    </>
  );
}
