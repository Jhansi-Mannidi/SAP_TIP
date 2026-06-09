'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { PageBreadcrumb } from '@/components/page-breadcrumb'
import { SnapshotCreateFixtureWizard } from '@/components/test-repository/snapshot-create-fixture-wizard'
import { Button } from '@/components/ui/button'
import { getSnapshotById } from '@/lib/mock-data'

export default function CreateFixtureFromSnapshotPage() {
  const params = useParams()
  const id = params.id as string
  const snapshot = getSnapshotById(id)

  return (
    <AppShell currentApp="test-repository">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <PageBreadcrumb
              items={[
                { label: 'Master Data Snapshots', href: '/test-repository/snapshots' },
                { label: 'Create Fixture' },
              ]}
            />
            <PageHeader
              title={snapshot ? `Create Fixture from Snapshot` : 'Snapshot Not Found'}
              description={
                snapshot
                  ? `Restore ${snapshot.name} as a reusable data fixture in the Test Repository.`
                  : 'The requested snapshot could not be found.'
              }
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {snapshot ? (
            <SnapshotCreateFixtureWizard snapshot={snapshot} />
          ) : (
            <div className="text-center py-16">
              <p className="section-title">Snapshot not found</p>
              <Button asChild className="mt-4">
                <Link href="/test-repository/snapshots">Back to Snapshots</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
