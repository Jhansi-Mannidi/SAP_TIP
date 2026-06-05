'use client'

import { AppShell } from '@/components/app-shell'
import { CalmLayout } from '@/components/calm/calm-layout'
import { CalmOutboxPanel } from '@/components/calm/calm-outbox-panel'

export default function CalmOutboxPage() {
  return (
    <AppShell currentApp="system-admin">
      <CalmLayout>
        <CalmOutboxPanel />
      </CalmLayout>
    </AppShell>
  )
}
