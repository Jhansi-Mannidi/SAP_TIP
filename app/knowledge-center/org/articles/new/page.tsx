'use client'

import Link from 'next/link'
import { ChevronRight, FileText } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { OrgArticleRegisterWizard } from '@/components/knowledge-center/org-article-register-wizard'

export default function NewOrgArticlePage() {
  return (
    <AppShell currentApp="knowledge-center">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/[0.06] via-transparent to-transparent"
              aria-hidden
            />
            <nav className="page-breadcrumb relative" aria-label="Breadcrumb">
              <ol className="page-breadcrumb-list">
                <li className="page-breadcrumb-item">
                  <Link href="/knowledge-center/org" className="page-breadcrumb-link">
                    Org KB
                  </Link>
                </li>
                <ChevronRight className="page-breadcrumb-sep" aria-hidden />
                <li className="page-breadcrumb-item">
                  <span className="page-breadcrumb-current">New Article</span>
                </li>
              </ol>
            </nav>
            <PageHeader
              title="Create Organization Article"
              description="Document customer-specific procedures, policies, and runbooks. Content stays private to your organization."
              badge={
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
                  <FileText className="h-3 w-3" />
                  Org KB
                </span>
              }
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <OrgArticleRegisterWizard />
        </div>
      </div>
    </AppShell>
  )
}
