'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function TransportObjectsRedirect() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/transports/${params.id}?tab=objects`)
  }, [params.id, router])

  return null
}
