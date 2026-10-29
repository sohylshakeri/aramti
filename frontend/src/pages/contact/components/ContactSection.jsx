
import { useTranslation } from '../../../app/i18n.jsx'
import PageHero from '../../../components/ui/PageHero.jsx'
import ContactForm from './ContactForm.jsx'
import ContactInfo from './ContactInfo.jsx'

export default function ContactSection() {
  const { t } = useTranslation()

  return (
    <PageHero word={t('contact.hero.backgroundWord')}>
      <div className="contact-grid">
        <ContactInfo />
        <ContactForm />
      </div>
    </PageHero>
  )
}
