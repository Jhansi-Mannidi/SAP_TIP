'use client'

import { AppShell } from '@/components/app-shell'
import { CalmLayout } from '@/components/calm/calm-layout'
import { CalmSyncLogPanel } from '@/components/calm/calm-sync-log-panel'

export default function CalmSyncLogPage() {
  return (
    <AppShell currentApp="system-admin">
      <CalmLayout>
        <CalmSyncLogPanel />
      </CalmLayout>
    </AppShell>
  )
}
