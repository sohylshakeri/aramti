
import CustomerMapSection from './components/CustomerMapSection.jsx'
import HeroSection from './components/HeroSection.jsx'
import HighlightsSection from './components/HighlightsSection.jsx'
import HomeCtaSection from './components/HomeCtaSection.jsx'
import ServicesSection from './components/ServicesSection.jsx'
import WhyUsSection from './components/WhyUsSection.jsx'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HighlightsSection />
      <WhyUsSection />
      <CustomerMapSection />
      <HomeCtaSection />
    </>
  )
}
