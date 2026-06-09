'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { IntegrationConnectWizard } from '@/components/integrations/integration-connect-wizard'
import { getCatalogEntry } from '@/lib/integrations-mock-data'

export default function SetupIntegrationPage() {
  const params = useParams()
  const slug = params.slug as string
  const catalog = getCatalogEntry(slug)

  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div className="page-breadcrumb">
              <Link href="/system-admin/integrations" className="hover:text-foreground transition-colors">
                Integrations Hub
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <Link href="/system-admin/integrations/add" className="hover:text-foreground transition-colors">
                Add Integration
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">{catalog?.name ?? 'Set up'}</span>
            </div>
            <PageHeader
              title={catalog ? `Set up ${catalog.name}` : 'Set up Integration'}
              description="Authorize and configure the connection to your external system."
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <IntegrationConnectWizard
            templateSlug={slug}
            cancelHref="/system-admin/integrations/add"
            successHref="/system-admin/integrations"
          />
        </div>
      </div>
    </AppShell>
  )
}
