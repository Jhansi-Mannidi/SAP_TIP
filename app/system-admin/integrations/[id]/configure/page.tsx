'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { IntegrationConfigForm } from '@/components/integrations/integration-config-form'
import { getIntegrationById } from '@/lib/integrations-mock-data'
import { Button } from '@/components/ui/button'

export default function ConfigureIntegrationPage() {
  const params = useParams()
  const id = params.id as string
  const integration = getIntegrationById(id)

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
              <span className="font-medium text-foreground">
                {integration?.name ?? 'Configure'}
              </span>
            </div>
            <PageHeader
              title={integration ? `Configure ${integration.name}` : 'Integration Not Found'}
              description="Connection settings, field mappings, and sync schedule."
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {integration ? (
            <div className="max-w-3xl mx-auto">
              <IntegrationConfigForm integration={integration} />
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="section-title">Integration not found</p>
              <Button asChild className="mt-4">
                <Link href="/system-admin/integrations">Back to Hub</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
