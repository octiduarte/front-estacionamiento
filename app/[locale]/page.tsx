import AboutSection from '@/components/landing/AboutSection';
import HeroSection from '@/components/landing/HeroSection';
import ContactSection from '@/components/landing/ContactSection';
import PricingSection from '@/components/landing/PricingSection';


export default function LandingPage() {

  return (
    <div className="bg-gradient-to-b from-black to-black/90" >
      <HeroSection />
      <AboutSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
}