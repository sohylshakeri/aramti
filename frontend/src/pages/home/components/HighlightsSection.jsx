
import { useEffect, useRef } from 'react'
import { highlights } from '../../../content/home.js'
import AboutIllustration from './highlights/AboutIllustration.jsx'
import ContactIllustration from './highlights/ContactIllustration.jsx'
import PortfolioIllustration from './highlights/PortfolioIllustration.jsx'
import ServicesIllustration from './highlights/ServicesIllustration.jsx'
import TeamIllustration from './highlights/TeamIllustration.jsx'
import HighlightCard from './HighlightCard.jsx'

const middleHighlightIndex = Math.floor(
  highlights.length / 2,
)

const illustrations = {
  portfolio: PortfolioIllustration,
  about: AboutIllustration,
  team: TeamIllustration,
  contact: ContactIllustration,
  services: ServicesIllustration,
}

function clampScroll(scrollElement, value) {
  const maximumScroll =
    scrollElement.scrollWidth -
    scrollElement.clientWidth

  return Math.min(
    Math.max(value, 0),
    Math.max(maximumScroll, 0),
  )
}

export default function HighlightsSection() {
  const highlightsScrollRef = useRef(null)
  const middleCardRef = useRef(null)

  const isPointerDownRef = useRef(false)
  const isDraggingRef = useRef(false)
  const didDragRef = useRef(false)

  const pointerStartXRef = useRef(0)
  const pointerStartScrollLeftRef = useRef(0)
  const lastPointerXRef = useRef(0)
  const lastPointerTimeRef = useRef(0)
  const velocityRef = useRef(0)

  const inertiaFrameRef = useRef(null)
  const wheelFrameRef = useRef(null)
  const wheelTargetRef = useRef(0)
  const dragResetTimerRef = useRef(null)

  const cancelInertia = () => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current)
      inertiaFrameRef.current = null
    }
  }

  const cancelWheelAnimation = () => {
    if (wheelFrameRef.current !== null) {
      cancelAnimationFrame(wheelFrameRef.current)
      wheelFrameRef.current = null
    }
  }

  useEffect(() => {
    const scrollElement = highlightsScrollRef.current
    const middleCard = middleCardRef.current

    if (!scrollElement || !middleCard) {
      return undefined
    }

    const frameId = requestAnimationFrame(() => {
      const targetScrollLeft =
        middleCard.offsetLeft +
        middleCard.offsetWidth / 2 -
        scrollElement.clientWidth / 2

      scrollElement.scrollLeft = clampScroll(
        scrollElement,
        targetScrollLeft,
      )

      wheelTargetRef.current = scrollElement.scrollLeft
    })

    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    const scrollElement = highlightsScrollRef.current

    if (!scrollElement) {
      return undefined
    }

    const animateWheelScroll = () => {
      const difference =
        wheelTargetRef.current -
        scrollElement.scrollLeft

      if (Math.abs(difference) < 0.3) {
        scrollElement.scrollLeft = wheelTargetRef.current
        wheelFrameRef.current = null
        return
      }

      scrollElement.scrollLeft += difference * 0.1
      wheelFrameRef.current =
        requestAnimationFrame(animateWheelScroll)
    }

    const handleWheel = (event) => {
      const hasHorizontalOverflow =
        scrollElement.scrollWidth >
        scrollElement.clientWidth

      if (!hasHorizontalOverflow) {
        return
      }

      /*
      * اسکرول معمولی بالا و پایین باید برای خود صفحه باقی بماند.
      * فقط حرکت افقی ترک‌پد یا Shift + Wheel کارت‌ها را جابه‌جا می‌کند.
      */
      const isHorizontalGesture =
        Math.abs(event.deltaX) >
        Math.abs(event.deltaY)

      const isShiftWheel =
        event.shiftKey &&
        Math.abs(event.deltaY) > 0

      if (!isHorizontalGesture && !isShiftWheel) {
        return
      }

      event.preventDefault()
      cancelInertia()

      const wheelAmount = isShiftWheel
        ? event.deltaY
        : event.deltaX

      if (wheelFrameRef.current === null) {
        wheelTargetRef.current =
          scrollElement.scrollLeft
      }

      wheelTargetRef.current = clampScroll(
        scrollElement,
        wheelTargetRef.current +
          wheelAmount * 1.15,
      )

      if (wheelFrameRef.current === null) {
        wheelFrameRef.current =
          requestAnimationFrame(
            animateWheelScroll,
          )
      }
    }

    scrollElement.addEventListener('wheel', handleWheel, {
      passive: false,
    })

    return () => {
      scrollElement.removeEventListener(
        'wheel',
        handleWheel,
      )
      cancelWheelAnimation()
    }
  }, [])

  const handlePointerDown = (event) => {
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    const scrollElement = highlightsScrollRef.current

    if (!scrollElement) {
      return
    }

    cancelInertia()
    cancelWheelAnimation()

    isPointerDownRef.current = true
    isDraggingRef.current = false
    didDragRef.current = false

    pointerStartXRef.current = event.clientX
    pointerStartScrollLeftRef.current =
      scrollElement.scrollLeft
    lastPointerXRef.current = event.clientX
    lastPointerTimeRef.current = performance.now()
    velocityRef.current = 0
  }

  const handlePointerMove = (event) => {
    const scrollElement = highlightsScrollRef.current

    if (!scrollElement || !isPointerDownRef.current) {
      return
    }

    const totalMovement =
      event.clientX - pointerStartXRef.current

    if (
      !isDraggingRef.current &&
      Math.abs(totalMovement) < 8
    ) {
      return
    }

    if (!isDraggingRef.current) {
      isDraggingRef.current = true
      didDragRef.current = true
      scrollElement.classList.add('is-dragging')
      scrollElement.setPointerCapture?.(event.pointerId)
    }

    event.preventDefault()

    const currentTime = performance.now()
    const pointerDifference =
      event.clientX - lastPointerXRef.current
    const elapsedTime = Math.max(
      currentTime - lastPointerTimeRef.current,
      1,
    )

    scrollElement.scrollLeft = clampScroll(
      scrollElement,
      pointerStartScrollLeftRef.current - totalMovement,
    )

    const instantVelocity =
      -pointerDifference / elapsedTime

    velocityRef.current =
      velocityRef.current * 0.72 +
      instantVelocity * 0.28

    lastPointerXRef.current = event.clientX
    lastPointerTimeRef.current = currentTime
  }

  const startInertia = () => {
    const scrollElement = highlightsScrollRef.current

    if (
      !scrollElement ||
      Math.abs(velocityRef.current) < 0.02
    ) {
      return
    }

    let previousFrameTime = performance.now()

    const animateInertia = (currentTime) => {
      const elapsedTime = Math.min(
        currentTime - previousFrameTime,
        32,
      )

      previousFrameTime = currentTime

      const currentScrollLeft = scrollElement.scrollLeft
      const nextScrollLeft = clampScroll(
        scrollElement,
        currentScrollLeft +
          velocityRef.current * elapsedTime,
      )

      scrollElement.scrollLeft = nextScrollLeft
      velocityRef.current *= Math.pow(
        0.94,
        elapsedTime / 16.67,
      )

      const reachedBoundary =
        nextScrollLeft === currentScrollLeft

      if (
        Math.abs(velocityRef.current) < 0.015 ||
        reachedBoundary
      ) {
        inertiaFrameRef.current = null
        wheelTargetRef.current = scrollElement.scrollLeft
        return
      }

      inertiaFrameRef.current =
        requestAnimationFrame(animateInertia)
    }

    inertiaFrameRef.current =
      requestAnimationFrame(animateInertia)
  }

  const finishDragging = (event) => {
    const scrollElement = highlightsScrollRef.current

    if (!isPointerDownRef.current) {
      return
    }

    const wasDragging = isDraggingRef.current

    isPointerDownRef.current = false
    isDraggingRef.current = false

    if (scrollElement) {
      scrollElement.classList.remove('is-dragging')

      if (
        scrollElement.hasPointerCapture?.(event.pointerId)
      ) {
        scrollElement.releasePointerCapture(
          event.pointerId,
        )
      }
    }

    if (wasDragging) {
      startInertia()
    } else {
      velocityRef.current = 0
    }

    if (dragResetTimerRef.current !== null) {
      clearTimeout(dragResetTimerRef.current)
    }

    dragResetTimerRef.current = setTimeout(() => {
      didDragRef.current = false
    }, 80)
  }

  const handleHighlightClick = (event) => {
    if (didDragRef.current) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    return () => {
      cancelInertia()
      cancelWheelAnimation()

      if (dragResetTimerRef.current !== null) {
        clearTimeout(dragResetTimerRef.current)
      }
    }
  }, [])

  return (
    <section className="section highlights-section">
      <div
        ref={highlightsScrollRef}
        className="highlights-scroll"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDragging}
        onPointerCancel={finishDragging}
      >
        <div className="highlights-track">
          {highlights.map((highlight, index) => {
            const Illustration = illustrations[highlight.id]

            return (
              <HighlightCard
                ref={
                  index === middleHighlightIndex
                    ? middleCardRef
                    : null
                }
                key={highlight.id}
                highlight={highlight}
                Illustration={Illustration}
                onClick={handleHighlightClick}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
