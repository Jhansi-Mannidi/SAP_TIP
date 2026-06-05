'use client'

import * as React from 'react'
import {
  Search,
  Package,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Layers,
  FileText,
  Beaker,
  Database,
  Download,
  Loader2,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { MOCK_TEST_PACKS, type TestPack } from '@/lib/mock-data'

interface ImportTestPackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported?: (pack: TestPack, options: ImportOptions) => void
}

interface ImportOptions {
  includeFixtures: boolean
  includeDataGenerators: boolean
  overwriteExisting: boolean
}

function SignatureBadge({ state }: { state: TestPack['signature_state'] }) {
  if (state === 'verified') {
    return (
      <Badge
        variant="outline"
        className="h-5 gap-1 px-1.5 text-[10px] font-semibold border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      >
        <ShieldCheck className="h-3 w-3" />
        Signed
      </Badge>
    )
  }
  if (state === 'invalid') {
    return (
      <Badge
        variant="outline"
        className="h-5 gap-1 px-1.5 text-[10px] font-semibold border-destructive/30 bg-destructive/10 text-destructive"
      >
        <ShieldAlert className="h-3 w-3" />
        Invalid
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="h-5 gap-1 px-1.5 text-[10px] font-semibold border-border bg-muted text-muted-foreground"
    >
      <ShieldOff className="h-3 w-3" />
      Unsigned
    </Badge>
  )
}

function StatChip({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
      <span className="text-xs font-semibold tabular-nums text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground truncate">{label}</span>
    </div>
  )
}

export function ImportTestPackDialog({
  open,
  onOpenChange,
  onImported,
}: ImportTestPackDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [includeFixtures, setIncludeFixtures] = React.useState(true)
  const [includeDataGenerators, setIncludeDataGenerators] = React.useState(true)
  const [overwriteExisting, setOverwriteExisting] = React.useState(false)
  const [isImporting, setIsImporting] = React.useState(false)

  // Reset state whenever the dialog is closed
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSearchQuery('')
        setSelectedId(null)
        setIncludeFixtures(true)
        setIncludeDataGenerators(true)
        setOverwriteExisting(false)
        setIsImporting(false)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [open])

  const filteredPacks = React.useMemo(() => {
    if (!searchQuery.trim()) return MOCK_TEST_PACKS
    const q = searchQuery.toLowerCase()
    return MOCK_TEST_PACKS.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)),
    )
  }, [searchQuery])

  const selectedPack = React.useMemo(
    () => MOCK_TEST_PACKS.find(p => p.id === selectedId) ?? null,
    [selectedId],
  )

  const handleImport = async () => {
    if (!selectedPack) return
    setIsImporting(true)
    // Simulate import work
    await new Promise(r => setTimeout(r, 900))
    setIsImporting(false)
    onImported?.(selectedPack, {
      includeFixtures,
      includeDataGenerators,
      overwriteExisting,
    })
    toast.success('Test Pack imported', {
      description: `${selectedPack.contents.suites} suite${selectedPack.contents.suites === 1 ? '' : 's'} and ${selectedPack.contents.scenarios} scenarios added from ${selectedPack.name}.`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border space-y-1.5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shrink-0">
              <Package className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold tracking-tight">
                Import from Test Pack
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Browse published Test Packs and import their suites into your repository.
              </DialogDescription>
            </div>
          </div>

          {/* Search */}
          <div className="relative pt-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search packs by name, description, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </DialogHeader>

        {/* Pack List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-5 sm:px-6 py-4 space-y-2">
            {filteredPacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                  <Search className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-foreground">No test packs found</p>
                <p className="caption-text mt-1">
                  Try a different search term or clear the filter.
                </p>
              </div>
            ) : (
              filteredPacks.map(pack => {
                const isSelected = pack.id === selectedId
                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedId(pack.id)}
                    className={cn(
                      'group w-full text-left rounded-lg border bg-card p-3.5 transition-all',
                      'hover:border-brand/50 hover:shadow-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
                      isSelected
                        ? 'border-brand bg-brand-soft/30 shadow-sm'
                        : 'border-border',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Radio indicator */}
                      <div
                        className={cn(
                          'mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 shrink-0 transition-colors',
                          isSelected
                            ? 'border-brand bg-brand'
                            : 'border-border group-hover:border-brand/50',
                        )}
                        aria-hidden
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-3 w-3 text-brand-foreground" strokeWidth={3} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {pack.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="h-4 px-1.5 text-[10px] font-mono font-semibold border-border bg-muted text-muted-foreground"
                          >
                            {pack.version}
                          </Badge>
                          <SignatureBadge state={pack.signature_state} />
                        </div>
                        <p className="caption-text line-clamp-2">
                          {pack.description}
                        </p>

                        {/* Stats grid */}
                        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1.5">
                          <StatChip icon={Layers} value={pack.contents.suites} label="suites" />
                          <StatChip icon={FileText} value={pack.contents.scenarios} label="scenarios" />
                          <StatChip icon={Beaker} value={pack.contents.cases} label="cases" />
                          <StatChip icon={Database} value={pack.contents.fixtures} label="fixtures" />
                        </div>

                        {/* Tags + meta */}
                        {(pack.tags.length > 0 || pack.published_at) && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            {pack.tags.slice(0, 3).map(tag => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="h-4 px-1.5 text-[10px] font-medium border-border text-muted-foreground"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {pack.published_at && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(pack.published_at).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>

        {/* Import options (only when something is selected) */}
        {selectedPack && (
          <div className="border-t border-border bg-muted/30 px-5 sm:px-6 py-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <p className="page-description text-[11px]">
                Import Options
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={includeFixtures}
                  onCheckedChange={v => setIncludeFixtures(v === true)}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground leading-tight">
                    Include data fixtures
                  </p>
                  <p className="section-description text-[10px] mt-0.5">
                    {selectedPack.contents.fixtures} fixtures
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={includeDataGenerators}
                  onCheckedChange={v => setIncludeDataGenerators(v === true)}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground leading-tight">
                    Include data generators
                  </p>
                  <p className="section-description text-[10px] mt-0.5">Reusable test data</p>
                </div>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={overwriteExisting}
                  onCheckedChange={v => setOverwriteExisting(v === true)}
                  className="mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground leading-tight">
                    Overwrite existing
                  </p>
                  <p className="section-description text-[10px] mt-0.5">
                    Replace matching codes
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="px-5 sm:px-6 py-3.5 border-t border-border bg-card gap-2 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={!selectedPack || isImporting}
            className="h-8 text-xs min-w-32"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Import {selectedPack ? `(${selectedPack.contents.suites})` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
