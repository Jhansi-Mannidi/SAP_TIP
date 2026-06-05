'use client'

import { AppShell } from '@/components/app-shell'
import { CalmLayout } from '@/components/calm/calm-layout'
import { CalmBindingsPanel } from '@/components/calm/calm-bindings-panel'

export default function CalmBindingsPage() {
  return (
    <AppShell currentApp="system-admin">
      <CalmLayout>
        <CalmBindingsPanel />
      </CalmLayout>
    </AppShell>
  )
}
