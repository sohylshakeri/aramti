import { useEffect, useState } from 'react'

import { useTranslation } from '../../../app/i18n.jsx'
import { getCustomerMapData } from '../services/homeApi.js'

import CustomerMapMarker from './CustomerMapMarker.jsx'
import CustomerReviewCard from './CustomerReviewCard.jsx'
import WorldMap from './WorldMap.jsx'

const visibleReviewCount = 2
const reviewRotationInterval = 10_000

function getRandomReviewIds(reviews, previousIds = []) {
  const reviewIds = reviews.map(
    (review) => `review-${review.id}`,
  )

  const reviewCount = Math.min(
    visibleReviewCount,
    reviewIds.length,
  )

  if (reviewCount === 0) {
    return []
  }

  if (reviewCount === reviewIds.length) {
    return reviewIds
  }

  let randomIds = []
  let attemptCount = 0

  do {
    const shuffledIds = [...reviewIds]

    for (
      let index = shuffledIds.length - 1;
      index > 0;
      index -= 1
    ) {
      const randomIndex = Math.floor(
        Math.random() * (index + 1),
      )

      ;[
        shuffledIds[index],
        shuffledIds[randomIndex],
      ] = [
        shuffledIds[randomIndex],
        shuffledIds[index],
      ]
    }

    randomIds = shuffledIds.slice(0, reviewCount)
    attemptCount += 1
  } while (
    attemptCount < 10 &&
    randomIds.every((id) => previousIds.includes(id))
  )

  return randomIds
}

function getReviewRole(client) {
  return [
    client.company,
    [client.city, client.country]
      .filter(Boolean)
      .join(', '),
  ]
    .filter(Boolean)
    .join(' · ')
}

export default function CustomerMapSection() {
  const { t, i18n } = useTranslation()
  const isFarsi = i18n.language === 'fa'

  const [mapFilter, setMapFilter] = useState('all')

  const [clients, setClients] = useState([])
  const [testimonials, setTestimonials] = useState([])

  const [selectedReviewId, setSelectedReviewId] =
    useState(null)

  const [automaticReviewIds, setAutomaticReviewIds] =
    useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // دریافت اطلاعات واقعی مشتریان و نظرات از Django
  useEffect(() => {
    let isMounted = true

    async function loadCustomerMap() {
      try {
        const data = await getCustomerMapData()

        if (!isMounted) {
          return
        }

        const nextClients = data.clients.filter(
          (client) =>
            client.map_x !== null &&
            client.map_x !== undefined &&
            client.map_y !== null &&
            client.map_y !== undefined,
        )

        const nextTestimonials = data.testimonials.filter(
          (testimonial) =>
            testimonial.client &&
            testimonial.client.map_x !== null &&
            testimonial.client.map_x !== undefined &&
            testimonial.client.map_y !== null &&
            testimonial.client.map_y !== undefined,
        )

        setClients(nextClients)
        setTestimonials(nextTestimonials)

        setAutomaticReviewIds(
          getRandomReviewIds(nextTestimonials),
        )

        setHasError(false)
      } catch (error) {
        console.error(
          '[Customer Map] Failed to load data:',
          error,
        )

        if (isMounted) {
          setHasError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCustomerMap()

    return () => {
      isMounted = false
    }
  }, [])

  // تبدیل مشتریان بک‌اند به نشانگرهای نقشه
  const customerMarkers = clients.map((client) => ({
    id: `customer-${client.id}`,
    clientId: client.id,
    type: 'customer',
    x: Number(client.map_x),
    y: Number(client.map_y),
  }))

  // تبدیل نظرات بک‌اند به نشانگرهای قابل کلیک
  const reviewMarkers = testimonials.map((review) => ({
    id: `review-${review.id}`,
    testimonialId: review.id,
    type: 'review',
    x: Number(review.client.map_x),
    y: Number(review.client.map_y),
  }))

  /*
   * اگر مشتری هم نظر داشته باشد، در حالت نمایش همه،
   * نشانگر نظر نماینده همان موقعیت خواهد بود.
   * این کار مانع قرارگرفتن دو نشانگر دقیقاً روی یکدیگر می‌شود.
   */
  const clientsWithReviews = new Set(
    testimonials.map((review) => review.client.id),
  )

  const visibleMapMarkers =
    mapFilter === 'customer'
      ? customerMarkers
      : mapFilter === 'review'
        ? reviewMarkers
        : [
            ...customerMarkers.filter(
              (marker) =>
                !clientsWithReviews.has(marker.clientId),
            ),
            ...reviewMarkers,
          ]

  // نظر انتخاب‌شده با کلیک روی نشانگر
  const selectedReview = testimonials.find(
    (review) => `review-${review.id}` === selectedReviewId,
  )

  // نظراتی که به‌طور خودکار در کارت‌ها نمایش داده می‌شوند
  const automaticReviews = automaticReviewIds
    .map((reviewId) =>
      testimonials.find(
        (review) => `review-${review.id}` === reviewId,
      ),
    )
    .filter(Boolean)

  const visibleReviews =
    mapFilter === 'customer'
      ? []
      : selectedReview
        ? [selectedReview]
        : automaticReviews

  // تعیین موقعیت کارت هر نظر روی نقشه
  const visibleReviewCards = visibleReviews.map(
    (review) => ({
      review,
      style: {
        left: `${Number(review.client.map_x)}%`,
        top: `${Number(review.client.map_y)}%`,
      },
    }),
  )

  // چرخش خودکار کارت‌ها، مشابه رفتار قبلی
  useEffect(() => {
    const canRotateReviews =
      selectedReviewId === null &&
      mapFilter !== 'customer' &&
      testimonials.length > visibleReviewCount

    if (!canRotateReviews) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setAutomaticReviewIds((currentIds) =>
        getRandomReviewIds(
          testimonials,
          currentIds,
        ),
      )
    }, reviewRotationInterval)

    return () => window.clearInterval(intervalId)
  }, [mapFilter, selectedReviewId, testimonials])

  const resetAutomaticReviews = () => {
    setSelectedReviewId(null)

    setAutomaticReviewIds((currentIds) =>
      getRandomReviewIds(
        testimonials,
        currentIds,
      ),
    )
  }

  const toggleMapFilter = (filter) => {
    resetAutomaticReviews()

    setMapFilter((currentFilter) =>
      currentFilter === filter ? 'all' : filter,
    )
  }

  const handleReviewMarkerClick = (markerId) => {
    setSelectedReviewId((currentId) =>
      currentId === markerId ? null : markerId,
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">
            {isFarsi ? (
              <span className="rtl-inline-title">
                <span className="text-accent">
                  {t('home.customers.titleAccent')}
                </span>

                <span>
                  {t('home.customers.titlePrefix')}
                </span>
              </span>
            ) : (
              <>
                {t('home.customers.titlePrefix')}{' '}

                <span className="text-accent">
                  {t('home.customers.titleAccent')}
                </span>
              </>
            )}
          </h2>

          <p className="section__subtitle">
            {t('home.customers.subtitle')}
          </p>
        </div>

        <div
          className="customer-map-filters"
          aria-busy={isLoading}
        >
          <button
            type="button"
            className="customer-map-filter customer-map-filter--customers"
            aria-pressed={mapFilter === 'customer'}
            onClick={() => toggleMapFilter('customer')}
          >
            {t('home.customerMap.filters.satisfiedCustomers')}
          </button>

          <button
            type="button"
            className="customer-map-filter customer-map-filter--reviews"
            aria-pressed={mapFilter === 'review'}
            onClick={() => toggleMapFilter('review')}
          >
            {t('home.customerMap.filters.customerReviews')}
          </button>
        </div>

        <div
          className="customer-map"
          aria-busy={isLoading}
        >
          <WorldMap className="customer-map__world" />

          {visibleMapMarkers.map((marker) => (
            <CustomerMapMarker
              key={marker.id}
              type={marker.type}
              x={marker.x}
              y={marker.y}
              label={t('home.customerMap.openReview')}
              isActive={selectedReviewId === marker.id}
              onClick={
                marker.type === 'review'
                  ? () =>
                      handleReviewMarkerClick(marker.id)
                  : undefined
              }
            />
          ))}

          {visibleReviewCards.map(({ review, style }) => (
            <CustomerReviewCard
              key={review.id}
              className="customer-review-card--map"
              style={style}
              quote={review.text}
              name={review.client.display_name}
              role={getReviewRole(review.client)}
              avatar={
                review.client.avatar ||
                '/customer-avatar.jpg'
              }
            />
          ))}
        </div>

        {hasError && (
          <p className="why-us__error" role="alert">
            {isFarsi
              ? 'دریافت اطلاعات مشتریان با مشکل مواجه شد.'
              : 'Unable to load customer information.'}
          </p>
        )}
      </div>
    </section>
  )
}