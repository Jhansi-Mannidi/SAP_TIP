'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Package } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { TestPackDetailView } from '@/components/test-repository/test-pack-detail-view'
import { Button } from '@/components/ui/button'
import { getTestPackById } from '@/lib/mock-data'

export default function TestPackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const packId = params.id as string
  const pack = getTestPackById(packId)

  if (!pack) {
    return (
      <AppShell currentApp="test-repository">
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h2 className="section-title">Test pack not found</h2>
          <Button asChild className="mt-4">
            <Link href="/test-repository/packs">Back to Test Packs</Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentApp="test-repository">
      <TestPackDetailView pack={pack} onDeleted={() => router.push('/test-repository/packs')} />
    </AppShell>
  )
}
