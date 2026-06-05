'use client'

import { AppShell } from '@/components/app-shell'
import { CalmLayout } from '@/components/calm/calm-layout'
import { CalmOverviewPanel } from '@/components/calm/calm-overview-panel'

export default function CalmOverviewPage() {
  return (
    <AppShell currentApp="system-admin">
      <CalmLayout>
        <CalmOverviewPanel />
      </CalmLayout>
    </AppShell>
  )
}
