'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { ProcessMiningLayout } from '@/components/process-mining/process-mining-layout'
import { AiSuggestionDetailView } from '@/components/process-mining/ai-suggestion-detail-view'
import { Button } from '@/components/ui/button'
import { getSuggestionById } from '@/lib/process-mining-mock-data'

export default function SuggestionDetailPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0]
  const suggestion = id ? getSuggestionById(id) : undefined

  if (!suggestion) {
    return (
      <AppShell currentApp="process-mining">
        <ProcessMiningLayout>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-semibold">Suggestion not found</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              The suggestion may have been removed or the link is invalid.
            </p>
            <Button className="mt-5" asChild>
              <Link href="/process-mining/suggestions">Back to AI Suggestions</Link>
            </Button>
          </div>
        </ProcessMiningLayout>
      </AppShell>
    )
  }

  return (
    <AppShell currentApp="process-mining">
      <ProcessMiningLayout>
        <AiSuggestionDetailView suggestion={suggestion} />
      </ProcessMiningLayout>
    </AppShell>
  )
}
