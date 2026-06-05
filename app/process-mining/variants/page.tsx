'use client'

import { AppShell } from '@/components/app-shell'
import { ProcessMiningLayout } from '@/components/process-mining/process-mining-layout'
import { ProcessVariantsPanel } from '@/components/process-mining/process-variants-panel'

export default function VariantsPage() {
  return (
    <AppShell currentApp="process-mining">
      <ProcessMiningLayout>
        <ProcessVariantsPanel />
      </ProcessMiningLayout>
    </AppShell>
  )
}
