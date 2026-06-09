'use client'

import { AppShell } from '@/components/app-shell'
import { ProcessMiningLayout } from '@/components/process-mining/process-mining-layout'
import { AiSuggestionsPanel } from '@/components/process-mining/ai-suggestions-panel'

export default function AISuggestionsPage() {
  return (
    <AppShell currentApp="process-mining">
      <ProcessMiningLayout>
        <AiSuggestionsPanel />
      </ProcessMiningLayout>
    </AppShell>
  )
}
