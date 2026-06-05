"use client"

import * as React from 'react'
import { Trash2, AlertTriangle, Loader2, Layers } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface DeleteTestCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testCase: {
    id: string
    code: string
    name: string
    used_in_scenarios?: string[]
  } | null
}

export function DeleteTestCaseDialog({
  open,
  onOpenChange,
  testCase,
}: DeleteTestCaseDialogProps) {
  const [confirmText, setConfirmText] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setConfirmText('')
      setIsDeleting(false)
    }
  }, [open])

  if (!testCase) return null

  const inUseCount = testCase.used_in_scenarios?.length ?? 0
  const isInUse = inUseCount > 0
  const requiredText = testCase.code
  const canDelete = confirmText.trim() === requiredText

  const handleDelete = () => {
    if (!canDelete) return
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      toast.success('Test case deleted', {
        description: `${testCase.code} has been removed.`,
      })
      onOpenChange(false)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive shrink-0">
              <Trash2 className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold leading-tight">
                Delete Test Case
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                This action cannot be undone. The test case and its history will be
                permanently removed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 sm:px-6 pb-5 space-y-4">
          {/* Test case summary card */}
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5">
            <p className="page-description text-[10px] mb-1">
              Test case
            </p>
            <p className="text-sm font-semibold leading-tight">{testCase.name}</p>
            <p className="section-description text-[11px] mt-0.5">
              {testCase.code}
            </p>
          </div>

          {/* Usage warning */}
          {isInUse && (
            <div className="flex items-start gap-2.5 rounded-md border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  In use by {inUseCount} {inUseCount === 1 ? 'scenario' : 'scenarios'}
                </p>
                <p className="text-[11px] text-foreground/80 leading-relaxed mt-0.5">
                  Deleting this case will break those scenarios until they are
                  updated. Consider archiving instead.
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
                  <Layers className="h-3 w-3" />
                  <span className="font-mono">
                    {testCase.used_in_scenarios?.slice(0, 3).join(', ')}
                    {inUseCount > 3 && ` +${inUseCount - 3} more`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation input */}
          <div className="space-y-1.5">
            <Label htmlFor="delete-confirm" className="text-[11px] font-medium">
              Type{' '}
              <code className="font-mono text-foreground bg-muted px-1 py-0.5 rounded text-[10px]">
                {requiredText}
              </code>{' '}
              to confirm
            </Label>
            <Input
              id="delete-confirm"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder={requiredText}
              className={cn(
                'h-9 text-sm font-mono',
                confirmText && !canDelete && 'border-destructive',
              )}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <DialogFooter className="border-t border-border px-5 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-muted/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="h-9"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={!canDelete || isDeleting}
            onClick={handleDelete}
            className="h-9 gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                Delete Test Case
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
