import AboutSection from '@/components/landing/AboutSection';
import HeroSection from '@/components/landing/HeroSection';
import ContactSection from '@/components/landing/ContactSection';
import PricingSection from '@/components/landing/PricingSection';


export default function LandingPage() {

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background global continuo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/5 to-black" />
      
      {/* Contenido de las secciones */}
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <PricingSection />
        <ContactSection />
      </div>
    </div>
  );
}