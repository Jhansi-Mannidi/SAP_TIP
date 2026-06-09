'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { GitBranch } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { ProcessMiningLayout } from '@/components/process-mining/process-mining-layout'
import { ProcessVariantDetailView } from '@/components/process-mining/process-variant-detail-view'
import { Button } from '@/components/ui/button'
import { getVariantDetail } from '@/lib/process-mining-mock-data'

export default function VariantDetailPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0]
  const variant = id ? getVariantDetail(id) : undefined

  if (!variant) {
    return (
      <AppShell currentApp="process-mining">
        <ProcessMiningLayout>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <GitBranch className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-semibold">Variant not found</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              The variant may have been removed or the link is invalid.
            </p>
            <Button className="mt-5" asChild>
              <Link href="/process-mining/variants">Back to Process Variants</Link>
            </Button>
          </div>
        </ProcessMiningLayout>
      </AppShell>
    )
  }

  return (
    <AppShell currentApp="process-mining">
      <ProcessMiningLayout>
        <ProcessVariantDetailView variant={variant} />
      </ProcessMiningLayout>
    </AppShell>
  )
}
