'use client'

import * as React from 'react'
import { ErrorState } from '@/components/error-state'
import './globals.css'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('[v0] Caught global error:', error)
  }, [error])

  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        <ErrorState variant="error" digest={error?.digest} onRetry={reset} />
      </body>
    </html>
  )
}
