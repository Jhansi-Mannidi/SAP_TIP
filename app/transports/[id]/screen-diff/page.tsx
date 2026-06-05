'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function TransportScreenDiffRedirect() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/transports/${params.id}?tab=screen-diff`)
  }, [params.id, router])

  return null
}
