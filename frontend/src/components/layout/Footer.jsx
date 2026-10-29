import { Link } from 'react-router-dom'
import { useTranslation } from '../../app/i18n.jsx'
import {
  footerLinks,
  siteContact,
} from '../../content/common.js'
import Logo from '../ui/Logo.jsx'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="container footer__top">
        <Logo />
        <nav className="footer__nav">
          {footerLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              {t(`common.nav.${l.key}`)}
            </Link>
          ))}
        </nav>
        <div className="footer__socials">
          <a href="#" aria-label={t('common.footer.social.twitter')}>
            <svg width="38.4" height="38.4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-6.6L4.7 22H1.6l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
          >
            <svg
              viewBox="0 0 29 29"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M25.6 0C26.4487 0 27.2626 0.337142 27.8627 0.937258C28.4629 1.53737 28.8 2.35131 28.8 3.2V25.6C28.8 26.4487 28.4629 27.2626 27.8627 27.8627C27.2626 28.4629 26.4487 28.8 25.6 28.8H3.2C2.35131 28.8 1.53737 28.4629 0.937258 27.8627C0.337142 27.2626 0 26.4487 0 25.6V3.2C0 2.35131 0.337142 1.53737 0.937258 0.937258C1.53737 0.337142 2.35131 0 3.2 0H25.6ZM24.8 24.8V16.32C24.8 14.9366 24.2505 13.6099 23.2723 12.6317C22.2941 11.6535 20.9674 11.104 19.584 11.104C18.224 11.104 16.64 11.936 15.872 13.184V11.408H11.408V24.8H15.872V16.912C15.872 15.68 16.864 14.672 18.096 14.672C18.6901 14.672 19.2598 14.908 19.6799 15.3281C20.1 15.7482 20.336 16.3179 20.336 16.912V24.8H24.8ZM6.208 8.896C6.9209 8.896 7.60461 8.6128 8.1087 8.1087C8.6128 7.60461 8.896 6.9209 8.896 6.208C8.896 4.72 7.696 3.504 6.208 3.504C5.49085 3.504 4.80308 3.78888 4.29598 4.29598C3.78888 4.80308 3.504 5.49085 3.504 6.208C3.504 7.696 4.72 8.896 6.208 8.896ZM8.432 24.8V11.408H4V24.8H8.432Z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/aramti.company?igsh=MTlxZGtjaXZpZndrbg=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9.28 0H22.72C27.84 0 32 4.16 32 9.28V22.72C32 25.1812 31.0223 27.5416 29.282 29.282C27.5416 31.0223 25.1812 32 22.72 32H9.28C4.16 32 0 27.84 0 22.72V9.28C0 6.81879 0.977712 4.45839 2.71805 2.71805C4.45839 0.977712 6.81879 0 9.28 0ZM8.96 3.2C7.43235 3.2 5.96728 3.80686 4.88707 4.88707C3.80686 5.96728 3.2 7.43235 3.2 8.96V23.04C3.2 26.224 5.776 28.8 8.96 28.8H23.04C24.5676 28.8 26.0327 28.1931 27.1129 27.1129C28.1931 26.0327 28.8 24.5676 28.8 23.04V8.96C28.8 5.776 26.224 3.2 23.04 3.2H8.96ZM24.4 5.6C24.9304 5.6 25.4391 5.81071 25.8142 6.18579C26.1893 6.56086 26.4 7.06957 26.4 7.6C26.4 8.13043 26.1893 8.63914 25.8142 9.01421C25.4391 9.38929 24.9304 9.6 24.4 9.6C23.8696 9.6 23.3609 9.38929 22.9858 9.01421C22.6107 8.63914 22.4 8.13043 22.4 7.6C22.4 7.06957 22.6107 6.56086 22.9858 6.18579C23.3609 5.81071 23.8696 5.6 24.4 5.6ZM16 8C18.1217 8 20.1566 8.84286 21.6569 10.3431C23.1571 11.8434 24 13.8783 24 16C24 18.1217 23.1571 20.1566 21.6569 21.6569C20.1566 23.1571 18.1217 24 16 24C13.8783 24 11.8434 23.1571 10.3431 21.6569C8.84286 20.1566 8 18.1217 8 16C8 13.8783 8.84286 11.8434 10.3431 10.3431C11.8434 8.84286 13.8783 8 16 8ZM16 11.2C14.727 11.2 13.5061 11.7057 12.6059 12.6059C11.7057 13.5061 11.2 14.727 11.2 16C11.2 17.273 11.7057 18.4939 12.6059 19.3941C13.5061 20.2943 14.727 20.8 16 20.8C17.273 20.8 18.4939 20.2943 19.3941 19.3941C20.2943 18.4939 20.8 17.273 20.8 16C20.8 14.727 20.2943 13.5061 19.3941 12.6059C18.4939 11.7057 17.273 11.2 16 11.2Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer__meta">
        <div className="footer__contact-list">
          {/* Email */}
          <a
            className="footer__contact-item"
            href={siteContact.email.href}
          >
            <span
              className="footer__contact-icon"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M1.5 8.6691V17.25C1.5 18.9069 2.84315 20.25 4.5 20.25H19.5C21.1569 20.25 22.5 18.9069 22.5 17.25V8.6691L13.5723 14.1631C12.6081 14.7564 11.3919 14.7564 10.4277 14.1631L1.5 8.6691Z"
                  fill="currentColor"
                />

                <path
                  d="M22.5 6.90783V6.75C22.5 5.09315 21.1569 3.75 19.5 3.75H4.5C2.84315 3.75 1.5 5.09315 1.5 6.75V6.90783L11.2139 12.8856C11.696 13.1823 12.304 13.1823 12.7861 12.8856L22.5 6.90783Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <span>{t('common.footer.email')}</span>
          </a>

          {/* Phone */}
          <a
            className="footer__contact-item"
            href={siteContact.phone.href}
          >
            <span
              className="footer__contact-icon"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.5 4.5C1.5 2.84315 2.84315 1.5 4.5 1.5H5.87163C6.732 1.5 7.48197 2.08556 7.69064 2.92025L8.79644 7.34343C8.97941 8.0753 8.70594 8.84555 8.10242 9.29818L6.8088 10.2684C6.67447 10.3691 6.64527 10.5167 6.683 10.6197C7.81851 13.7195 10.2805 16.1815 13.3803 17.317C13.4833 17.3547 13.6309 17.3255 13.7316 17.1912L14.7018 15.8976C15.1545 15.2941 15.9247 15.0206 16.6566 15.2036L21.0798 16.3094C21.9144 16.518 22.5 17.268 22.5 18.1284V19.5C22.5 21.1569 21.1569 22.5 19.5 22.5H17.25C8.55151 22.5 1.5 15.4485 1.5 6.75V4.5Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <span className="footer__phone-number">
              {t('common.footer.phone')}
            </span>
          </a>

          {/* Location */}
          <a
            className="footer__contact-item"
            href={siteContact.location.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('common.footer.location')}
          >
            <span
              className="footer__contact-icon"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5397 22.351C11.57 22.3685 11.5937 22.3821 11.6105 22.3915L11.6384 22.4071C11.8613 22.5294 12.1378 22.5285 12.3608 22.4075L12.3895 22.3915C12.4063 22.3821 12.43 22.3685 12.4603 22.351C12.5207 22.316 12.607 22.265 12.7155 22.1982C12.9325 22.0646 13.2388 21.8676 13.6046 21.6091C14.3351 21.0931 15.3097 20.3274 16.2865 19.3273C18.2307 17.3368 20.25 14.3462 20.25 10.5C20.25 5.94365 16.5563 2.25 12 2.25C7.44365 2.25 3.75 5.94365 3.75 10.5C3.75 14.3462 5.76932 17.3368 7.71346 19.3273C8.69025 20.3274 9.66491 21.0931 10.3954 21.6091C10.7612 21.8676 11.0675 22.0646 11.2845 22.1982C11.393 22.265 11.4793 22.316 11.5397 22.351ZM12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <span>{t('common.footer.location')}</span>
          </a>
        </div>

        <nav
          className="footer__legal"
          aria-label={t('common.footer.legal')}
        >
          <Link to="/privacy-policy">
            {t('common.footer.privacyPolicy')}
          </Link>

          <Link to="/terms-of-service">
            {t('common.footer.termsOfService')}
          </Link>
        </nav>
      </div>
      <div className="footer__meta">
        {/* ایمیل، تلفن، لوکیشن و لینک‌های قوانین */}
      </div>

      <p className="footer__copy">
        {t('common.footer.copyright')}
      </p>
    </footer>
  )
}
