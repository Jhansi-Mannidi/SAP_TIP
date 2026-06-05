'use client'

import { AppShell } from '@/components/app-shell'
import { ProcessMiningLayout } from '@/components/process-mining/process-mining-layout'
import { CoverageAnalysisPanel } from '@/components/process-mining/coverage-analysis-panel'

export default function CoverageAnalysisPage() {
  return (
    <AppShell currentApp="process-mining">
      <ProcessMiningLayout>
        <CoverageAnalysisPanel />
      </ProcessMiningLayout>
    </AppShell>
  )
}
