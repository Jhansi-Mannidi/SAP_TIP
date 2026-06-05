'use client'

import * as React from 'react'
import { ErrorState } from '@/components/error-state'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Surface the error in the console so it's still inspectable in dev.
    console.error('[v0] Caught route error:', error)
  }, [error])

  return (
    <ErrorState
      variant="error"
      digest={error?.digest}
      onRetry={reset}
    />
  )
}
