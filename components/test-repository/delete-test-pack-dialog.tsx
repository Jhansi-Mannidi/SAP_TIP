'use client'

import * as React from 'react'
import { Trash2, AlertTriangle, Loader2, Package } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import type { TestPack } from '@/lib/mock-data'

interface DeleteTestPackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pack: TestPack | null
  onDeleted?: (packId: string) => void
}

export function DeleteTestPackDialog({
  open,
  onOpenChange,
  pack,
  onDeleted,
}: DeleteTestPackDialogProps) {
  const [confirmText, setConfirmText] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setConfirmText('')
      setIsDeleting(false)
    }
  }, [open])

  if (!pack) return null

  const hasRecipients = pack.recipients.length > 0
  const isDistributed = pack.distribution_status === 'Distributed'
  const requiredText = pack.name
  const canDelete = confirmText.trim() === requiredText

  const handleDelete = () => {
    if (!canDelete) return
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      toast.success('Test pack deleted', {
        description: `${pack.name} has been permanently removed.`,
      })
      onDeleted?.(pack.id)
      onOpenChange(false)
    }, 700)
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
                Delete Test Pack
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                This permanently removes the pack, its signature, and distribution history.
                Imported copies at recipient tenants are not affected.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 sm:px-6 pb-4 space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-3">
            <Package className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{pack.name}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge variant="outline" className="font-mono text-[10px] h-5">
                  {pack.version}
                </Badge>
                <Badge variant="secondary" className="text-[10px] h-5">
                  {pack.distribution_status}
                </Badge>
              </div>
            </div>
          </div>

          {(hasRecipients || isDistributed) && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                {isDistributed
                  ? `This pack has been distributed to ${pack.recipients.length} recipient(s) and ${pack.download_count} downloads.`
                  : `This pack has ${pack.recipients.length} configured recipient(s).`}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirm-delete-pack" className="text-xs">
              Type <span className="font-semibold">{pack.name}</span> to confirm
            </Label>
            <Input
              id="confirm-delete-pack"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={pack.name}
              className="text-sm"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter className="px-5 sm:px-6 py-4 border-t bg-muted/20 gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete Pack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
