import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AboutSection from '@/components/landing/about-section';
import HeroSection from '@/components/landing/hero-section';
import PriceSection from '@/components/landing/pricing-section';
import ContactSection from '@/components/landing/contact-section';
export default function HomePage() {

  return (
    <div >
      <HeroSection />
      <AboutSection />
      <PriceSection />
      <ContactSection />
    </div>
  );
}