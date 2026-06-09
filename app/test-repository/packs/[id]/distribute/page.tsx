'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Package } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { PageBreadcrumb } from '@/components/page-breadcrumb'
import { TestPackDistributeForm } from '@/components/test-repository/test-pack-distribute-form'
import { Button } from '@/components/ui/button'
import { getTestPackById } from '@/lib/mock-data'

export default function DistributePackPage() {
  const params = useParams()
  const packId = params.id as string
  const pack = getTestPackById(packId)

  return (
    <AppShell currentApp="test-repository">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <PageBreadcrumb
              items={[
                { label: 'Test Packs', href: '/test-repository/packs' },
                ...(pack
                  ? [{ label: pack.name, href: `/test-repository/packs/${pack.id}` }]
                  : []),
                { label: 'Distribute' },
              ]}
            />

            {pack ? (
              <PageHeader
                title={pack.name}
                description="Configure distribution settings, sign with your key, and export the pack."
              />
            ) : (
              <PageHeader title="Pack Not Found" description="The requested test pack could not be found." />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {pack ? (
            <TestPackDistributeForm pack={pack} />
          ) : (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="section-title">Test pack not found</p>
              <Button asChild className="mt-4">
                <Link href="/test-repository/packs">Back to Test Packs</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
