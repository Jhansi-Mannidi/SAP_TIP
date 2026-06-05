'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Archive,
  AlertTriangle,
  Loader2,
  Database,
} from 'lucide-react'
import type { DataFixture } from '@/lib/mock-data'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fixture: DataFixture | null
}

const REASONS = [
  { value: 'replaced', label: 'Replaced by newer fixture' },
  { value: 'stale', label: 'Underlying data is stale' },
  { value: 'pii', label: 'PII concerns / compliance' },
  { value: 'unused', label: 'No longer used' },
  { value: 'other', label: 'Other' },
]

export function MarkDeprecatedDialog({ open, onOpenChange, fixture }: Props) {
  const [reason, setReason] = React.useState<string>('replaced')
  const [notes, setNotes] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setReason('replaced')
    setNotes('')
    setSubmitting(false)
  }, [open])

  const handleConfirm = () => {
    if (!fixture) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      toast.success('Fixture marked deprecated', {
        description: `${fixture.code} · scenarios will surface a warning on next run`,
      })
      onOpenChange(false)
    }, 700)
  }

  const usedCount = fixture?.used_in_scenarios.length ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 sm:px-6 py-4 border-b border-border space-y-1.5 text-left">
          <DialogTitle className="flex items-center gap-2.5 text-base font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20 shrink-0">
              <Archive className="h-4 w-4" />
            </span>
            Mark Fixture Deprecated
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Deprecated fixtures stay available but scenarios depending on them will display a
            warning. This action is reversible.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-5 sm:px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Fixture card */}
          {fixture && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="inline-flex items-center rounded-md bg-muted border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  {fixture.code}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  v{fixture.version}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {fixture.name}
              </p>
              <p className="page-description text-[11px] mt-1">
                {fixture.description}
              </p>
            </div>
          )}

          {/* Impact warning */}
          {usedCount > 0 && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="text-[11px] text-foreground/80 leading-relaxed">
                <p className="font-semibold text-foreground">
                  Used in {usedCount} scenario{usedCount === 1 ? '' : 's'}
                </p>
                <p className="mt-0.5">
                  The next time these scenarios run, they will surface a deprecation warning.
                  Replace the fixture before the expiry date to avoid disruption.
                </p>
                {fixture && fixture.used_in_scenarios.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {fixture.used_in_scenarios.slice(0, 6).map(id => (
                      <span
                        key={id}
                        className="inline-flex items-center rounded-md bg-background border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                      >
                        {id}
                      </span>
                    ))}
                    {fixture.used_in_scenarios.length > 6 && (
                      <span className="inline-flex items-center rounded-md bg-background border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{fixture.used_in_scenarios.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label className="text-[11px] font-medium text-foreground">Reason</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {REASONS.map(r => {
                const selected = reason === r.value
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={cn(
                      'flex items-center gap-2 rounded-md border px-2.5 py-2 text-left transition-colors',
                      selected
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-border bg-background hover:bg-muted/30',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border shrink-0',
                        selected
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-muted-foreground/40 bg-background',
                      )}
                    >
                      {selected ? (
                        <span className="h-1 w-1 rounded-full bg-white" />
                      ) : null}
                    </span>
                    <span className="text-xs font-medium text-foreground">{r.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-foreground">
              Notes <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add context for teammates who consume this fixture…"
              className="min-h-[72px] resize-none text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-amber-600 hover:bg-amber-600/90 text-white"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating…
              </>
            ) : (
              <>
                <Archive className="h-3.5 w-3.5" />
                Mark Deprecated
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

void Database
