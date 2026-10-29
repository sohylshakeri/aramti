import { useEffect, useRef } from 'react'

import { defaultTeamMembers } from '../../../content/about.js'
import TeamMemberCard from './TeamMemberCard.jsx'

export default function TeamMembersSlider({
  members = defaultTeamMembers,
}) {
  const sliderRef = useRef(null)

  const isPointerDownRef = useRef(false)
  const isDraggingRef = useRef(false)

  const pointerStartXRef = useRef(0)
  const pointerStartScrollLeftRef = useRef(0)

  const lastPointerXRef = useRef(0)
  const lastPointerTimeRef = useRef(0)
  const velocityRef = useRef(0)

  const inertiaFrameRef = useRef(null)
  const wheelFrameRef = useRef(null)
  const wheelTargetRef = useRef(0)

  const clampScroll = (element, value) => {
    const maximumScroll =
      element.scrollWidth - element.clientWidth

    return Math.min(
      Math.max(value, 0),
      Math.max(maximumScroll, 0),
    )
  }

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
    const slider = sliderRef.current

    if (!slider) {
      return undefined
    }

    wheelTargetRef.current = slider.scrollLeft

    const animateWheelScroll = () => {
      const difference =
        wheelTargetRef.current - slider.scrollLeft

      if (Math.abs(difference) < 0.3) {
        slider.scrollLeft = wheelTargetRef.current
        wheelFrameRef.current = null
        return
      }

      slider.scrollLeft += difference * 0.1

      wheelFrameRef.current =
        requestAnimationFrame(animateWheelScroll)
    }

    const handleWheel = (event) => {
      const hasHorizontalOverflow =
        slider.scrollWidth > slider.clientWidth

      if (!hasHorizontalOverflow) {
        return
      }

      event.preventDefault()
      cancelInertia()

      const wheelAmount =
        Math.abs(event.deltaX) >
        Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY

      if (wheelFrameRef.current === null) {
        wheelTargetRef.current = slider.scrollLeft
      }

      wheelTargetRef.current = clampScroll(
        slider,
        wheelTargetRef.current +
          wheelAmount * 1.15,
      )

      if (wheelFrameRef.current === null) {
        wheelFrameRef.current =
          requestAnimationFrame(animateWheelScroll)
      }
    }

    slider.addEventListener('wheel', handleWheel, {
      passive: false,
    })

    return () => {
      slider.removeEventListener(
        'wheel',
        handleWheel,
      )

      cancelWheelAnimation()
      cancelInertia()
    }
  }, [])

  const handlePointerDown = (event) => {
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    const slider = sliderRef.current

    if (!slider) {
      return
    }

    cancelInertia()
    cancelWheelAnimation()

    isPointerDownRef.current = true
    isDraggingRef.current = false

    pointerStartXRef.current = event.clientX
    pointerStartScrollLeftRef.current =
      slider.scrollLeft

    lastPointerXRef.current = event.clientX
    lastPointerTimeRef.current = performance.now()

    velocityRef.current = 0
  }

  const handlePointerMove = (event) => {
    const slider = sliderRef.current

    if (
      !slider ||
      !isPointerDownRef.current
    ) {
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

      slider.classList.add('is-dragging')

      slider.setPointerCapture?.(
        event.pointerId,
      )
    }

    event.preventDefault()

    const currentTime = performance.now()

    const pointerDifference =
      event.clientX - lastPointerXRef.current

    const elapsedTime = Math.max(
      currentTime - lastPointerTimeRef.current,
      1,
    )

    slider.scrollLeft = clampScroll(
      slider,
      pointerStartScrollLeftRef.current -
        totalMovement,
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
    const slider = sliderRef.current

    if (!slider) {
      return
    }

    if (Math.abs(velocityRef.current) < 0.02) {
      return
    }

    let previousFrameTime = performance.now()

    const animateInertia = (currentTime) => {
      const elapsedTime = Math.min(
        currentTime - previousFrameTime,
        32,
      )

      previousFrameTime = currentTime

      const currentScrollLeft =
        slider.scrollLeft

      const nextScrollLeft = clampScroll(
        slider,
        currentScrollLeft +
          velocityRef.current * elapsedTime,
      )

      slider.scrollLeft = nextScrollLeft

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
        wheelTargetRef.current =
          slider.scrollLeft
        return
      }

      inertiaFrameRef.current =
        requestAnimationFrame(animateInertia)
    }

    inertiaFrameRef.current =
      requestAnimationFrame(animateInertia)
  }

  const finishDragging = (event) => {
    const slider = sliderRef.current

    if (!isPointerDownRef.current) {
      return
    }

    const wasDragging =
      isDraggingRef.current

    isPointerDownRef.current = false
    isDraggingRef.current = false

    if (slider) {
      slider.classList.remove('is-dragging')

      if (
        slider.hasPointerCapture?.(
          event.pointerId,
        )
      ) {
        slider.releasePointerCapture(
          event.pointerId,
        )
      }
    }

    if (wasDragging) {
      startInertia()
    } else {
      velocityRef.current = 0
    }
  }

  return (
    <div
      ref={sliderRef}
      className="team-slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={finishDragging}
    >
      <div className="team-slider__track">
        {members.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
          />
        ))}
      </div>
    </div>
  )
}