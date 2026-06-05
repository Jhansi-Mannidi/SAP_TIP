'use client'

import { AppShell } from '@/components/app-shell'
import { CalmLayout } from '@/components/calm/calm-layout'
import { CalmProjectionsPanel } from '@/components/calm/calm-projections-panel'

export default function CalmProjectionsPage() {
  return (
    <AppShell currentApp="system-admin">
      <CalmLayout>
        <CalmProjectionsPanel />
      </CalmLayout>
    </AppShell>
  )
}
