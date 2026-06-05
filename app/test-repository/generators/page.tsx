'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/app-shell'
import { PageHeader, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { MOCK_DATA_GENERATORS, DataGenerator } from '@/lib/mock-data'
import { AnimatedTableRow, staggerContainer, staggerItem } from '@/lib/animations'
import {
  Plus,
  Search,
  MoreHorizontal,
  Database,
  Play,
  Copy,
  Pencil,
  Trash2,
  Shuffle,
  ArrowDownUp,
  Zap,
  RefreshCw,
  CheckCircle2,
  Table2,
  Link2,
  X,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const strategyConfig: Record<
  string,
  { label: string; icon: React.ElementType; description: string }
> = {
  random: { label: 'Random', icon: Shuffle, description: 'Random selection from results' },
  sequential: { label: 'Sequential', icon: ArrowDownUp, description: 'Sequential order from results' },
  weighted: { label: 'Weighted', icon: Zap, description: 'Weighted by frequency/usage' },
  round_robin: { label: 'Round Robin', icon: RefreshCw, description: 'Cycles through results evenly' },
}

const statePillClass: Record<string, string> = {
  Active: 'pill pill-success',
  Inactive: 'pill pill-neutral',
  Draft: 'pill pill-warning',
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-background hover:bg-muted/40 transition-colors">
      <span className="micro-label normal-case tracking-normal font-medium">{label}</span>
      <div className="flex items-center min-w-0 text-right">{children}</div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="micro-label pb-1">{children}</h4>
  )
}

export default function DataGeneratorsPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [stateFilter, setStateFilter] = React.useState<string>('all')
  const [strategyFilter, setStrategyFilter] = React.useState<string>('all')
  const [testRunGenerator, setTestRunGenerator] = React.useState<DataGenerator | null>(null)
  const [isTestRunning, setIsTestRunning] = React.useState(false)
  const [testResults, setTestResults] = React.useState<string[]>([])
  const [selectedGenerator, setSelectedGenerator] = React.useState<DataGenerator | null>(null)
  const [isNewGeneratorOpen, setIsNewGeneratorOpen] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredGenerators = React.useMemo(() => {
    return MOCK_DATA_GENERATORS.filter((gen) => {
      const matchesSearch =
        gen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gen.source_table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gen.where_clause.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesState = stateFilter === 'all' || gen.state === stateFilter
      const matchesStrategy =
        strategyFilter === 'all' || gen.randomization === strategyFilter

      return matchesSearch && matchesState && matchesStrategy
    })
  }, [searchQuery, stateFilter, strategyFilter])

  const hasFilters = searchQuery || stateFilter !== 'all' || strategyFilter !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setStateFilter('all')
    setStrategyFilter('all')
  }

  const handleTestRun = async (generator: DataGenerator) => {
    setTestRunGenerator(generator)
    setIsTestRunning(true)
    setTestResults([])

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setTestResults(
      generator.sample_values || [
        'SAMPLE001',
        'SAMPLE002',
        'SAMPLE003',
        'SAMPLE004',
        'SAMPLE005',
      ],
    )
    setIsTestRunning(false)
  }

  return (
    <AppShell currentApp="test-repository">
      {/* Full-bleed layout — counteracts AppShell padding */}
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        {/* Header */}
        <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-5">
            <PageHeader
              title="Data Generators"
              description="Define rules that produce on-demand test values from your SAP DDIC schema."
              actions={
                <Button
                  onClick={() => setIsNewGeneratorOpen(true)}
                  className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  <Plus className="h-4 w-4" />
                  New Generator
                </Button>
              }
            />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search generators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-background"
                />
              </div>

              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={strategyFilter} onValueChange={setStrategyFilter}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="weighted">Weighted</SelectItem>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 gap-1.5 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}

              <span className="ml-auto text-xs text-muted-foreground tabular-nums hidden sm:inline">
                {filteredGenerators.length} generator{filteredGenerators.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredGenerators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="section-card max-w-md w-full text-center">
                <Database className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No generators found</h3>
                <p className="page-description mt-1.5">
                  {hasFilters
                    ? 'Try adjusting your filters or search query.'
                    : 'Create your first data generator to produce test values.'}
                </p>
                {!hasFilters && (
                  <Button
                    className="mt-5 gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={() => setIsNewGeneratorOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    New Generator
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="section-card-flush">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
                      <TableHead className="min-w-[260px] pl-5 h-10 micro-label normal-case tracking-normal font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="h-10 micro-label normal-case tracking-normal font-semibold">
                        Source Table
                      </TableHead>
                      <TableHead className="min-w-[220px] h-10 micro-label normal-case tracking-normal font-semibold">
                        Where Clause
                      </TableHead>
                      <TableHead className="h-10 micro-label normal-case tracking-normal font-semibold">
                        Projection
                      </TableHead>
                      <TableHead className="h-10 micro-label normal-case tracking-normal font-semibold">
                        Strategy
                      </TableHead>
                      <TableHead className="h-10 micro-label normal-case tracking-normal font-semibold">
                        State
                      </TableHead>
                      <TableHead className="h-10 micro-label normal-case tracking-normal font-semibold">
                        Last Run
                      </TableHead>
                      <TableHead className="w-12 h-10 pr-5" />
                    </TableRow>
                  </TableHeader>
                  <motion.tbody
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredGenerators.map((generator, index) => {
                      const StrategyIcon =
                        strategyConfig[generator.randomization]?.icon || Shuffle
                      const isSelected = selectedGenerator?.id === generator.id

                      return (
                        <AnimatedTableRow
                          key={generator.id}
                          index={index}
                          className={cn(
                            'cursor-pointer border-b border-border/60 transition-colors',
                            isSelected
                              ? 'bg-brand-soft/50 hover:bg-brand-soft/60'
                              : 'hover:bg-muted/30',
                          )}
                          onClick={() => setSelectedGenerator(generator)}
                        >
                          <TableCell className="pl-5 py-3.5 align-top">
                            <p className="font-medium text-sm text-foreground line-clamp-1">
                              {generator.name}
                            </p>
                            <p className="caption-text line-clamp-1 mt-0.5">
                              {generator.description}
                            </p>
                          </TableCell>
                          <TableCell className="py-3.5 align-top">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge
                                variant="outline"
                                className="font-mono text-[11px] bg-muted/50"
                              >
                                {generator.source_table}
                              </Badge>
                              {generator.join_tables && generator.join_tables.length > 0 && (
                                <Badge variant="secondary" className="text-[11px] gap-1">
                                  <Link2 className="h-3 w-3" />
                                  +{generator.join_tables.length} join
                                  {generator.join_tables.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 align-top max-w-[240px]">
                            <code className="text-[11px] bg-muted/60 border border-border/60 px-2 py-1 rounded-md font-mono line-clamp-2 block text-foreground/90">
                              {generator.where_clause}
                            </code>
                          </TableCell>
                          <TableCell className="py-3.5 align-top">
                            <div className="flex gap-1 flex-wrap">
                              {generator.projection.slice(0, 2).map((field) => (
                                <Badge
                                  key={field}
                                  variant="outline"
                                  className="font-mono text-[11px]"
                                >
                                  {field}
                                </Badge>
                              ))}
                              {generator.projection.length > 2 && (
                                <Badge variant="outline" className="text-[11px]">
                                  +{generator.projection.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 align-top">
                            <div className="flex items-center gap-1.5 text-sm text-foreground/90">
                              <StrategyIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span>
                                {strategyConfig[generator.randomization]?.label ||
                                  generator.randomization}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 align-top">
                            <span className={statePillClass[generator.state]}>
                              {generator.state}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5 align-top">
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {generator.last_run
                                ? formatDistanceToNow(new Date(generator.last_run), {
                                    addSuffix: true,
                                  })
                                : 'Never'}
                            </span>
                          </TableCell>
                          <TableCell className="pr-5 py-3.5 align-top">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedGenerator(generator)
                                  }}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Open
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleTestRun(generator)
                                  }}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Test Run
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Clone
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </AnimatedTableRow>
                      )
                    })}
                  </motion.tbody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test Run Dialog */}
      <Dialog
        open={!!testRunGenerator}
        onOpenChange={(open) => !open && setTestRunGenerator(null)}
      >
        <DialogContent className="max-w-md section-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Play className="h-5 w-5 text-brand" />
              Test Run Results
            </DialogTitle>
            <DialogDescription>{testRunGenerator?.name}</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            {isTestRunning ? (
              <div className="flex flex-col items-center justify-center py-10">
                <RefreshCw className="h-8 w-8 text-brand animate-spin" />
                <p className="page-description mt-3">Running query…</p>
                <code className="text-xs bg-muted px-2.5 py-1 rounded-md mt-2 font-mono border border-border">
                  SELECT FROM {testRunGenerator?.source_table}
                </code>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Returned {testResults.length} sample values</span>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/50 px-3.5 py-2 micro-label normal-case tracking-normal">
                    Sample Values
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-border"
                  >
                    {testResults.map((value, idx) => (
                      <motion.div
                        key={value}
                        variants={staggerItem}
                        className="px-3.5 py-2.5 font-mono text-sm flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <span>{value}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setTestRunGenerator(null)}>
              Close
            </Button>
            {!isTestRunning && testRunGenerator && (
              <Button
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => handleTestRun(testRunGenerator)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Again
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generator Detail Sheet */}
      <Sheet
        open={!!selectedGenerator}
        onOpenChange={(open) => !open && setSelectedGenerator(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-[420px] p-0 flex flex-col gap-0 border-l border-border"
        >
          {selectedGenerator && (
            <motion.div
              className="flex flex-col h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Sticky header */}
              <SheetHeader className="px-5 sm:px-6 py-5 border-b border-border bg-gradient-to-br from-brand-soft/30 via-background to-background space-y-3 text-left shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={statePillClass[selectedGenerator.state]}>
                    {selectedGenerator.state}
                  </span>
                  <Badge variant="outline" className="font-mono text-[11px] gap-1">
                    <Table2 className="h-3 w-3" />
                    {selectedGenerator.source_table}
                  </Badge>
                  {(() => {
                    const StrategyIcon =
                      strategyConfig[selectedGenerator.randomization]?.icon || Shuffle
                    return (
                      <Badge variant="secondary" className="text-[11px] gap-1">
                        <StrategyIcon className="h-3 w-3" />
                        {strategyConfig[selectedGenerator.randomization]?.label}
                      </Badge>
                    )
                  })()}
                </div>
                <SheetTitle className="text-base sm:text-lg font-semibold text-foreground leading-snug text-balance pr-6">
                  {selectedGenerator.name}
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
                  {selectedGenerator.description}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
                {/* Source Tables */}
                <section className="space-y-2.5">
                  <SectionLabel>Source Tables</SectionLabel>
                  <div className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[11px]">
                        {selectedGenerator.source_table}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">Primary</span>
                    </div>
                    {selectedGenerator.join_tables?.map((join, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm pl-1 border-l-2 border-brand/30 ml-1"
                      >
                        <Link2 className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <Badge variant="outline" className="font-mono text-[11px]">
                            {join.table}
                          </Badge>
                          <p className="page-description text-[11px] mt-1 break-all">
                            ON {join.on}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Where Clause */}
                <section className="space-y-2.5">
                  <SectionLabel>Where Clause</SectionLabel>
                  <div className="rounded-lg border border-border bg-muted/40 p-3.5">
                    <code className="text-[13px] font-mono text-foreground whitespace-pre-wrap break-all leading-relaxed">
                      {selectedGenerator.where_clause}
                    </code>
                  </div>
                </section>

                {/* Projection */}
                <section className="space-y-2.5">
                  <SectionLabel>Projection Fields</SectionLabel>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedGenerator.projection.map((field) => (
                      <Badge key={field} variant="outline" className="font-mono text-[11px]">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </section>

                {/* Sample Values */}
                {selectedGenerator.sample_values &&
                  selectedGenerator.sample_values.length > 0 && (
                    <section className="space-y-2.5">
                      <SectionLabel>Last Sample Values</SectionLabel>
                      <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                        {selectedGenerator.sample_values.map((value, index) => (
                          <motion.div
                            key={value}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.25 }}
                            className="px-3.5 py-2.5 font-mono text-sm text-foreground hover:bg-muted/30 transition-colors"
                          >
                            {value}
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                {/* Metadata */}
                <section className="space-y-2">
                  <SectionLabel>Metadata</SectionLabel>
                  <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                    <DetailRow label="Created by">
                      <span className="text-xs text-foreground">{selectedGenerator.created_by}</span>
                    </DetailRow>
                    <DetailRow label="Created">
                      <span className="text-xs text-foreground tabular-nums">
                        {formatDistanceToNow(new Date(selectedGenerator.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </DetailRow>
                    {selectedGenerator.last_run && (
                      <DetailRow label="Last run">
                        <span className="text-xs text-foreground tabular-nums">
                          {formatDistanceToNow(new Date(selectedGenerator.last_run), {
                            addSuffix: true,
                          })}
                        </span>
                      </DetailRow>
                    )}
                  </div>
                </section>
              </div>

              {/* Sticky footer */}
              <div className="shrink-0 border-t border-border px-5 sm:px-6 py-4 bg-background space-y-2">
                <Button
                  className="w-full h-10 gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                  onClick={() => {
                    const gen = selectedGenerator
                    setSelectedGenerator(null)
                    handleTestRun(gen)
                  }}
                >
                  <Play className="h-4 w-4" />
                  Test Run
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-9 gap-1.5">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="outline" className="h-9 gap-1.5">
                    <Copy className="h-3.5 w-3.5" />
                    Clone
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Generator Sheet */}
      <Sheet open={isNewGeneratorOpen} onOpenChange={setIsNewGeneratorOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[420px] p-0 flex flex-col gap-0 border-l border-border"
        >
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <SheetHeader className="px-5 sm:px-6 py-5 border-b border-border bg-gradient-to-br from-brand-soft/30 via-background to-background space-y-1.5 text-left shrink-0">
              <SheetTitle className="text-base font-semibold">New Data Generator</SheetTitle>
              <SheetDescription className="text-sm">
                Define a rule to produce test values from your SAP DDIC schema.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
              <div className="space-y-2">
                <Label className="micro-label normal-case tracking-normal">Generator Name</Label>
                <Input placeholder="e.g., Valid Material Number for Plant 1000" className="h-10" />
              </div>

              <div className="space-y-2">
                <Label className="micro-label normal-case tracking-normal">Description</Label>
                <Textarea
                  placeholder="Describe what this generator produces…"
                  className="min-h-[80px] resize-none"
                />
              </div>

              <StaggerGrid columns="grid-cols-2" className="gap-4" fast>
                <div className="space-y-2">
                  <Label className="micro-label normal-case tracking-normal">Source Table</Label>
                  <Input placeholder="MARA" className="font-mono h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="micro-label normal-case tracking-normal">Randomization</Label>
                  <Select defaultValue="random">
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="sequential">Sequential</SelectItem>
                      <SelectItem value="weighted">Weighted</SelectItem>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </StaggerGrid>

              <div className="space-y-2">
                <Label className="micro-label normal-case tracking-normal">Where Clause</Label>
                <Textarea
                  placeholder="MTART = 'FERT' AND MARC~WERKS = '1000'"
                  className="font-mono text-sm min-h-[88px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="micro-label normal-case tracking-normal">
                  Projection Fields
                </Label>
                <Input placeholder="MATNR, MAKTX, MTART" className="font-mono h-10" />
              </div>
            </div>

            <div className="shrink-0 border-t border-border px-5 sm:px-6 py-4 flex gap-2 justify-end bg-background">
              <Button variant="outline" onClick={() => setIsNewGeneratorOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => setIsNewGeneratorOpen(false)}
              >
                Create Generator
              </Button>
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </AppShell>
  )
}
