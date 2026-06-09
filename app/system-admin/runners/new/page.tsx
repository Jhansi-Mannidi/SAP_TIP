'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { RunnerPoolRegisterWizard } from '@/components/system-admin/runner-pool-register-wizard'

export default function NewRunnerPoolPage() {
  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div className="page-breadcrumb">
              <Link href="/system-admin/runners" className="hover:text-foreground transition-colors">
                Runner Pools
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">New Pool</span>
            </div>
            <PageHeader
              title="Create Runner Pool"
              description="Provision a worker pool sized to your test throughput. Pools auto-scale within the bounds you define."
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <RunnerPoolRegisterWizard />
        </div>
      </div>
    </AppShell>
  )
}
