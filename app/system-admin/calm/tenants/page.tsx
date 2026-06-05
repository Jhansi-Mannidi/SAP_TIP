'use client'

import { AppShell } from '@/components/app-shell'
import { CalmLayout } from '@/components/calm/calm-layout'
import { CalmTenantsPanel } from '@/components/calm/calm-tenants-panel'

export default function CalmTenantsPage() {
  return (
    <AppShell currentApp="system-admin">
      <CalmLayout>
        <CalmTenantsPanel />
      </CalmLayout>
    </AppShell>
  )
}
