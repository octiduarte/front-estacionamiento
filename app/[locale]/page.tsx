import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AboutSection from '@/components/landing/about-section';
import HeroSection from '@/components/landing/hero-section';

import dynamic from 'next/dynamic';

const DynamicPriceSection = dynamic(() => import('@/components/landing/pricing-section'), {
  loading: () => <p>Loading pricing...</p>, 
});

const DynamicContactSection = dynamic(() => import('@/components/landing/contact-section'), {
  loading: () => <p>Loading contact information...</p>,
  // ssr: false, // Consider if map causes SSR issues or is purely client-side beneficial
});

export default function HomePage() {

  return (
    <div >
      <HeroSection />
      <AboutSection />
      <DynamicPriceSection />
      <DynamicContactSection />
    </div>
  );
}