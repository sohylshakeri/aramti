export default function TimelineRail() {
  return (
    <svg
      width="17"
      height="786"
      viewBox="0 0 17 786"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 9.41602L8 783"
        stroke="url(#timeline-rail-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <g filter="url(#timeline-dot-blur-1)">
        <circle
          cx="7.80113"
          cy="7.30113"
          r="5.30113"
          fill="#F8FAFC"
        />
      </g>

      <g filter="url(#timeline-dot-blur-2)">
        <circle
          cx="7.80113"
          cy="325.301"
          r="5.30113"
          fill="#F8FAFC"
        />
      </g>

      <g filter="url(#timeline-dot-blur-3)">
        <circle
          cx="7.80113"
          cy="628.301"
          r="5.30113"
          fill="#F8FAFC"
        />
      </g>

      <defs>
        <filter
          id="timeline-dot-blur-1"
          x="0"
          y="0"
          width="14.6022"
          height="14.6021"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1" />
        </filter>

        <filter
          id="timeline-dot-blur-2"
          x="1"
          y="318"
          width="14.6022"
          height="14.6021"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1" />
        </filter>

        <filter
          id="timeline-dot-blur-3"
          x="2"
          y="621"
          width="14.6022"
          height="14.6021"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1" />
        </filter>

        <linearGradient
          id="timeline-rail-gradient"
          x1="7.5"
          y1="9.41602"
          x2="7.5"
          y2="783"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stopColor="#292929"
            stopOpacity="0.5"
          />
          <stop
            offset="0.5"
            stopColor="#646466"
          />
          <stop
            offset="1"
            stopColor="#292929"
            stopOpacity="0.5"
          />
        </linearGradient>
      </defs>
    </svg>
  )
}