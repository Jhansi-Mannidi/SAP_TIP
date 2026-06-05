'use client'

import * as React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Thin top progress bar that appears the instant a user clicks an in-app
 * link and disappears once the new route has mounted.
 *
 * It is purely a perception-of-speed feature: the bar's progress is animated
 * via a single `requestAnimationFrame` loop that asymptotically approaches
 * 90%. When the real pathname/search-params change, it snaps to 100% and
 * fades out over 200ms.
 *
 * The component is mounted once at the root of the layout, so a single
 * instance handles every route transition in the entire app.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [progress, setProgress] = React.useState(0)
  const [visible, setVisible] = React.useState(false)

  // Refs for the rAF loop so we don't re-create the loop on every render.
  const rafRef = React.useRef<number | null>(null)
  const isLoadingRef = React.useRef(false)

  const stopLoop = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startLoop = React.useCallback(() => {
    stopLoop()
    isLoadingRef.current = true
    setVisible(true)
    setProgress(0.08)

    const tick = () => {
      setProgress(prev => {
        // Asymptote at 0.9 so the bar always feels alive but never finishes
        // until the navigation actually completes.
        if (!isLoadingRef.current) return prev
        const remaining = 0.9 - prev
        if (remaining <= 0.001) return prev
        // Smaller increments as we approach the asymptote.
        const step = Math.max(0.005, remaining * 0.04)
        return prev + step
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [stopLoop])

  const finish = React.useCallback(() => {
    isLoadingRef.current = false
    stopLoop()
    setProgress(1)
    // Hold the full bar visible for one frame, then fade.
    const fade = setTimeout(() => {
      setVisible(false)
      // Reset for the next cycle once the fade-out animation is done.
      setTimeout(() => setProgress(0), 220)
    }, 60)
    return () => clearTimeout(fade)
  }, [stopLoop])

  // Listen for clicks on in-app anchors.
  React.useEffect(() => {
    function isModifiedEvent(e: MouseEvent) {
      return (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        e.defaultPrevented
      )
    }

    function onClick(e: MouseEvent) {
      if (isModifiedEvent(e)) return
      let el = e.target as HTMLElement | null
      while (el && el.tagName !== 'A') el = el.parentElement
      if (!el) return
      const anchor = el as HTMLAnchorElement
      const href = anchor.getAttribute('href')
      if (!href) return
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return
      }
      try {
        const url = new URL(anchor.href, window.location.href)
        if (url.origin !== window.location.origin) return
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return
        }
      } catch {
        return
      }
      startLoop()
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      stopLoop()
    }
  }, [startLoop, stopLoop])

  // When the route actually changes, finish the bar.
  React.useEffect(() => {
    if (isLoadingRef.current) finish()
    // Failsafe: if the loop has been running for too long (e.g. a click
    // that never actually triggered a route change), force-finish.
    if (isLoadingRef.current) {
      const failsafe = setTimeout(finish, 6000)
      return () => clearTimeout(failsafe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()])

  if (!visible && progress === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
    >
      <div
        className="h-full bg-brand"
        style={{
          width: `${Math.min(progress, 1) * 100}%`,
          opacity: visible ? 1 : 0,
          transition:
            'width 180ms cubic-bezier(0.1, 0.5, 0.1, 1), opacity 200ms ease-out',
          boxShadow:
            'var(--brand) 0 0 8px, var(--brand) 0 0 4px',
        }}
      />
    </div>
  )
}
