import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../../app/i18n.jsx'
import { getServices } from '../services/servicesApi.js'
import ServiceCard from './ServiceCard.jsx'

export default function ServicesSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'
  const location = useLocation()
  const previousHashRef = useRef('')
  const [services, setServices] = useState([])

  useEffect(() => {
  getServices()
    .then((data) => {
      setServices(data)
    })
    .catch((error) => {
      console.error(error)
    })
}, [])

  useEffect(() => {
    const previousHash = previousHashRef.current

    const frameId = requestAnimationFrame(() => {
      if (location.hash === '#services') {
        const servicesSection =
          document.getElementById('services')

        if (servicesSection) {
          const headerOffset = 90

          const targetPosition =
            servicesSection.getBoundingClientRect().top +
            window.scrollY -
            headerOffset

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          })
        }
      } else if (previousHash === '#services') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }

      previousHashRef.current = location.hash
    })

    return () => cancelAnimationFrame(frameId)
  }, [location.hash])

  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">
            {isFarsi ? (
              <span className="rtl-inline-title">
                <span className="text-accent">
                  {t('home.services.titleAccent')}
                </span>
                <span>{t('home.services.titlePrefix')}</span>
              </span>
            ) : (
              <>
                {t('home.services.titlePrefix')}{' '}
                <span className="text-accent">
                  {t('home.services.titleAccent')}
                </span>
              </>
            )}
          </h2>

          <p className="section__subtitle">
            {t('home.services.subtitle')}
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>
      </div>
    </section>
  )
}