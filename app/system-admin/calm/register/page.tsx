'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { CalmRegisterTenantWizard } from '@/components/calm/calm-register-tenant-wizard'

export default function RegisterCalmTenantPage() {
  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div className="page-breadcrumb">
              <Link href="/system-admin/calm" className="hover:text-foreground transition-colors">
                Cloud ALM
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">Register Tenant</span>
            </div>
            <PageHeader
              title="Register CALM Tenant"
              description="Connect a SAP Cloud ALM tenant with Phase 1 inbound test automation and optional Phase 2 outbound enrichment."
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <CalmRegisterTenantWizard />
        </div>
      </div>
    </AppShell>
  )
}
