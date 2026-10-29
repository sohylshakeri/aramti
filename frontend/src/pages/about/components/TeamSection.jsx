import { useEffect, useState } from 'react'

import { useTranslation } from '../../../app/i18n.jsx'
import { getTeamMembers } from '../services/teamApi.js'
import TeamMembersSlider from './TeamMembersSlider.jsx'

export default function TeamSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'
  const [members, setMembers] = useState([])
  useEffect(() => {
  getTeamMembers()
    .then((data) => {
      setMembers(data)
    })
    .catch((error) => {
      console.error(error)
    })
}, [])

  return (
    <section className="section">
      <div className="container">
        <h2 className="section__title center">
          {isFarsi ? (
            <span className="rtl-inline-title">
              <span className="text-accent">
                {t('about.team.titleAccent')}
              </span>
              <span>{t('about.team.titlePrefix')}</span>
            </span>
          ) : (
            <>
              {t('about.team.titlePrefix')}{' '}
              <span className="text-accent">
                {t('about.team.titleAccent')}
              </span>
            </>
          )}
        </h2>

        <TeamMembersSlider members={members} />
      </div>
    </section>
  )
}
