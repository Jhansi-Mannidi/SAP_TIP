'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function TransportAbapRedirect() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/transports/${params.id}?tab=abap`)
  }, [params.id, router])

  return null
}
