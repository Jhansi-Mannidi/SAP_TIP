'use client'

import { AppShell } from '@/components/app-shell'
import { CalmLayout } from '@/components/calm/calm-layout'
import { CalmFieldMappingPanel } from '@/components/calm/calm-field-mapping-panel'

export default function CalmFieldMappingPage() {
  return (
    <AppShell currentApp="system-admin">
      <CalmLayout>
        <CalmFieldMappingPanel />
      </CalmLayout>
    </AppShell>
  )
}
