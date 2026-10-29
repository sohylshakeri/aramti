import { useId } from 'react'

export default function PageHero({ word, children }) {
  const id = useId().replace(/:/g, '')

  const glowFilterId = `page-hero-glow-filter-${id}`
  const wordFilterId = `page-hero-word-filter-${id}`
  const glowGradientId = `page-hero-glow-gradient-${id}`
  const wordGradientId = `page-hero-word-gradient-${id}`

  return (
    <section className="page-hero">
      <div className="page-hero__visual" aria-hidden="true">
        <svg
          viewBox="0 0 1411 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <g filter={`url(#${glowFilterId})`}>
            <rect
              x="200"
              y="102"
              width="1030"
              height="218"
              fill={`url(#${glowGradientId})`}
              fillOpacity="0.3"
            />
          </g>

          <g filter={`url(#${wordFilterId})`}>
            <text
              x="705.5"
              y="283"
              textAnchor="middle"
              className="page-hero__word"
              fill={`url(#${wordGradientId})`}
              fillOpacity="0.8"
            >
              {word}
            </text>
          </g>

          <defs>
            <filter
              id={glowFilterId}
              x="0"
              y="-98"
              width="1430"
              height="618"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="100"
                result="effect1_foregroundBlur"
              />
            </filter>

            <filter
              id={wordFilterId}
              x="0"
              y="130"
              width="1411"
              height="170"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="1"
                result="effect1_foregroundBlur"
              />
            </filter>

            <linearGradient
              id={glowGradientId}
              x1="200"
              y1="211"
              x2="1230"
              y2="211"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4F7CFF" stopOpacity="0" />
              <stop offset="0.5" stopColor="#3F63CC" />
              <stop offset="1" stopColor="#2F4A99" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id={wordGradientId}
              x1="696.5"
              y1="386"
              x2="696.5"
              y2="74"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#000000" />
              <stop offset="0.5" stopColor="#1C2B57" />
              <stop offset="1" stopColor="#4F7CFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container page-hero__content">
        {children}
      </div>
    </section>
  )
}