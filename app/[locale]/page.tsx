import AboutSection from '@/components/landing/about-section';
import HeroSection from '@/components/landing/hero-section';
import ContactSection from '@/components/landing/contact-section';
import PricingSection from '@/components/landing/pricing-section';


export default function HomePage() {

  return (
    <div className="bg-gradient-to-b from-muted to-black" >
      <HeroSection />
      <AboutSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
}