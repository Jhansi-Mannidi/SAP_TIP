'use client'

import * as React from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { IntegrationItem } from '@/lib/integrations-mock-data'

interface IntegrationSyncDialogProps {
  integration: IntegrationItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SYNC_STEPS = [
  'Authenticating with external system',
  'Fetching pending outbound records',
  'Applying field mappings',
  'Writing sync results',
]

export function IntegrationSyncDialog({
  integration,
  open,
  onOpenChange,
}: IntegrationSyncDialogProps) {
  const [progress, setProgress] = React.useState(0)
  const [stepIndex, setStepIndex] = React.useState(0)
  const [done, setDone] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    if (!open || !integration) {
      setProgress(0)
      setStepIndex(0)
      setDone(false)
      setFailed(false)
      return
    }

    let current = 0
    const interval = setInterval(() => {
      current += 8
      setProgress(Math.min(current, 100))
      setStepIndex(Math.min(Math.floor(current / 25), SYNC_STEPS.length - 1))
      if (current >= 100) {
        clearInterval(interval)
        setDone(true)
        if (integration.status === 'warning' && integration.slug === 'github-actions') {
          setFailed(true)
        }
      }
    }, 120)

    return () => clearInterval(interval)
  }, [open, integration])

  if (!integration) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sync {integration.name}</DialogTitle>
          <DialogDescription>
            {done
              ? failed
                ? 'Sync completed with warnings. Check logs for details.'
                : 'Sync completed successfully.'
              : 'Synchronizing data with the external system…'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!done ? (
            <>
              <Progress value={progress} className="h-2" />
              <div className="page-breadcrumb">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                {SYNC_STEPS[stepIndex]}
              </div>
            </>
          ) : (
            <div
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm',
                failed
                  ? 'border-amber-500/30 bg-amber-500/[0.06] text-amber-900 dark:text-amber-200'
                  : 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-900 dark:text-emerald-200',
              )}
            >
              {failed ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              {failed
                ? '2 records synced, 1 warning (webhook secret expiry)'
                : `${integration.stats ? Object.values(integration.stats)[0] : 12} records processed`}
            </div>
          )}
        </div>

        <DialogFooter>
          {done ? (
            <>
              <Button variant="outline" asChild>
                <Link href={`/system-admin/integrations/${integration.id}/logs`}>View Logs</Link>
              </Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
