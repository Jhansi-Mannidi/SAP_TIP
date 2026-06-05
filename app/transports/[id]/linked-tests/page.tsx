'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function TransportLinkedTestsRedirect() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/transports/${params.id}?tab=linked-tests`)
  }, [params.id, router])

  return null
}
