'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { IdpConnectWizard } from '@/components/idp-connect-wizard'

export default function ConnectIdPPage() {
  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/system-admin/idps" className="hover:text-foreground transition-colors">
                Identity Providers
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">Connect IdP</span>
            </div>
            <PageHeader
              title="Connect Identity Provider"
              description="Set up a new SSO bridge in four steps. Supports SAP IAS, Azure AD, Okta, and AWS Cognito."
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <IdpConnectWizard />
        </div>
      </div>
    </AppShell>
  )
}
