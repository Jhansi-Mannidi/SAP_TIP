'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { SapSystemRegisterWizard } from '@/components/system-admin/sap-system-register-wizard'

export default function NewSapSystemPage() {
  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div className="page-breadcrumb">
              <Link href="/system-admin" className="hover:text-foreground transition-colors">
                SAP Systems
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">New System</span>
            </div>
            <PageHeader
              title="Register SAP System"
              description="Add a new SAP system to your tenant landscape. iHub connectors, RFC destinations, and runner capacity bind here after registration."
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <SapSystemRegisterWizard />
        </div>
      </div>
    </AppShell>
  )
}
