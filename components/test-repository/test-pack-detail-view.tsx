'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package,
  CheckCircle2,
  FileQuestion,
  Send,
  Shield,
  Building2,
  Handshake,
  Download,
  Copy,
  Trash2,
  Layers,
  FileText,
  ClipboardCheck,
  Database,
  MoreHorizontal,
  Calendar,
  Tag,
  User,
  KeyRound,
  Globe,
} from 'lucide-react'

import { PageBreadcrumb } from '@/components/page-breadcrumb'
import { KpiStatCard, StaggerGrid } from '@/components/design-system'
import { DeleteTestPackDialog } from '@/components/test-repository/delete-test-pack-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { cn } from '@/lib/utils'
import {
  getTestPackContents,
  type DistributionStatus,
  type TestPack,
} from '@/lib/mock-data'

const statusStyles: Record<
  DistributionStatus,
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  Draft: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-500/20',
    icon: FileQuestion,
  },
  Published: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-500/25',
    icon: CheckCircle2,
  },
  Distributed: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/25',
    icon: Send,
  },
}

const signatureStyles = {
  verified: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-500/25',
    label: 'Verified',
  },
  pending: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-500/25',
    label: 'Pending',
  },
  unsigned: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    label: 'Unsigned',
  },
}

const typeIcons = {
  suite: Layers,
  scenario: FileText,
  case: ClipboardCheck,
  fixture: Database,
}

const typeTones = {
  suite: 'bg-brand/10 text-brand',
  scenario: 'bg-blue-500/10 text-blue-600',
  case: 'bg-amber-500/10 text-amber-600',
  fixture: 'bg-emerald-500/10 text-emerald-600',
}

function SectionCardHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <div>
        <h3 className="section-title text-base">{title}</h3>
        {description && <p className="section-description mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

function MetaRow({
  label,
  value,
  icon: Icon,
  mono,
}: {
  label: string
  value: string
  icon?: React.ElementType
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      <span className={cn('text-sm font-medium text-right', mono && 'font-mono text-xs')}>
        {value}
      </span>
    </div>
  )
}

interface TestPackDetailViewProps {
  pack: TestPack
  onDeleted: () => void
}

export function TestPackDetailView({ pack, onDeleted }: TestPackDetailViewProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const statusStyle = statusStyles[pack.distribution_status]
  const StatusIcon = statusStyle.icon
  const sigStyle = signatureStyles[pack.signature_state]
  const contents = getTestPackContents(pack)

  const canDistribute =
    pack.distribution_status === 'Published' || pack.distribution_status === 'Distributed'

  return (
    <>
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        {/* Sticky header */}
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-brand/[0.06] via-transparent to-transparent pointer-events-none"
              aria-hidden
            />
            <div className="relative px-4 sm:px-6 lg:px-8 py-4 space-y-4">
              <PageBreadcrumb
                items={[
                  { label: 'Test Packs', href: '/test-repository/packs' },
                  { label: pack.name },
                ]}
              />

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-brand/10 ring-1 ring-inset ring-brand/25 flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(184,134,46,0.12)]">
                    <Package className="h-6 w-6 text-brand" />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="page-title">{pack.name}</h1>
                      <Badge
                        variant="outline"
                        className={cn(
                          'gap-1 h-6 text-[11px] font-medium border',
                          statusStyle.bg,
                          statusStyle.text,
                          statusStyle.border,
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {pack.distribution_status}
                      </Badge>
                    </div>
                    <p className="page-description max-w-2xl">{pack.description}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <Badge variant="outline" className="font-mono text-[10px] h-5 px-1.5">
                        {pack.version}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          'gap-1 text-[10px] h-5 border',
                          sigStyle.bg,
                          sigStyle.text,
                          sigStyle.border,
                        )}
                      >
                        <Shield className="h-2.5 w-2.5" />
                        {sigStyle.label}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {pack.created_by}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 lg:pt-1">
                  {canDistribute && (
                    <Button
                      asChild
                      className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90 shadow-[0_2px_8px_rgba(184,134,46,0.2)]"
                    >
                      <Link href={`/test-repository/packs/${pack.id}/distribute`}>
                        <Send className="h-4 w-4" />
                        Distribute
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild className="gap-2 hidden sm:inline-flex">
                    <Link href={`/test-repository/packs/${pack.id}/clone`}>
                      <Copy className="h-4 w-4" />
                      Clone
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild className="sm:hidden">
                        <Link href={`/test-repository/packs/${pack.id}/clone`}>
                          <Copy className="h-4 w-4 mr-2" />
                          Clone Pack
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="sm:hidden" />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-muted/20">
          <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <StaggerGrid columns="grid-cols-2 lg:grid-cols-4" className="gap-3 md:gap-4" fast>
              <KpiStatCard label="Suites" value={pack.contents.suites} icon={Layers} tone="brand" />
              <KpiStatCard
                label="Scenarios"
                value={pack.contents.scenarios}
                icon={FileText}
                tone="info"
              />
              <KpiStatCard
                label="Cases"
                value={pack.contents.cases}
                icon={ClipboardCheck}
                tone="warning"
                format="locale"
              />
              <KpiStatCard
                label="Fixtures"
                value={pack.contents.fixtures}
                icon={Database}
                tone="success"
              />
            </StaggerGrid>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-card border border-border/60 p-1 h-auto shadow-[var(--shadow-xs)]">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand data-[state=active]:shadow-none text-xs sm:text-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="contents"
                  className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand data-[state=active]:shadow-none text-xs sm:text-sm"
                >
                  Contents
                  <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px] tabular-nums">
                    {contents.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="distribution"
                  className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand data-[state=active]:shadow-none text-xs sm:text-sm"
                >
                  Distribution
                  {pack.recipients.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px] tabular-nums">
                      {pack.recipients.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="border-border/60 shadow-[var(--shadow-xs)] overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                      <SectionCardHeader icon={Calendar} title="Pack Metadata" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <MetaRow label="Created by" value={pack.created_by} icon={User} />
                      <MetaRow
                        label="Created"
                        value={new Date(pack.created_at).toLocaleDateString()}
                        icon={Calendar}
                      />
                      <MetaRow
                        label="Published"
                        value={
                          pack.published_at
                            ? new Date(pack.published_at).toLocaleDateString()
                            : 'Not published'
                        }
                      />
                      <MetaRow
                        label="Downloads"
                        value={pack.download_count.toLocaleString()}
                        icon={Download}
                      />
                      <MetaRow label="Version" value={pack.version} mono />
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 shadow-[var(--shadow-xs)] overflow-hidden">
                    <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                      <SectionCardHeader
                        icon={Shield}
                        title="Signature & Provenance"
                        description="Cryptographic identity and content tags"
                      />
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div
                        className={cn(
                          'rounded-xl border px-4 py-3 flex items-start gap-3',
                          sigStyle.bg,
                          sigStyle.border,
                        )}
                      >
                        <div
                          className={cn(
                            'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-background/60',
                            sigStyle.text,
                          )}
                        >
                          <KeyRound className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={cn('text-sm font-semibold', sigStyle.text)}>
                            {sigStyle.label} signature
                          </p>
                          {pack.signature_did ? (
                            <p className="text-[11px] font-mono text-muted-foreground mt-1 break-all leading-relaxed">
                              {pack.signature_did}
                            </p>
                          ) : (
                            <p className="caption-text mt-0.5">
                              Pack has not been signed yet
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="micro-label mb-2">Content tags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {pack.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-[10px] h-5 gap-0.5 bg-card"
                            >
                              <Tag className="h-2.5 w-2.5 text-brand" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="contents" className="mt-4">
                <Card className="border-border/60 shadow-[var(--shadow-xs)] overflow-hidden">
                  <CardHeader className="border-b border-border/50 bg-muted/20">
                    <SectionCardHeader
                      icon={Layers}
                      title="Pack Contents"
                      description={`${contents.length} artifacts included in this distributable pack`}
                    />
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="text-xs">Type</TableHead>
                          <TableHead className="text-xs">Code</TableHead>
                          <TableHead className="text-xs">Name</TableHead>
                          <TableHead className="text-xs hidden sm:table-cell">Module</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contents.map((item, index) => {
                          const Icon = typeIcons[item.type]
                          return (
                            <TableRow
                              key={item.id}
                              className={cn(index % 2 === 1 && 'bg-muted/15')}
                            >
                              <TableCell>
                                <span
                                  className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium capitalize border border-transparent',
                                    typeTones[item.type],
                                  )}
                                >
                                  <Icon className="h-3 w-3" />
                                  {item.type}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {item.code}
                              </TableCell>
                              <TableCell className="text-sm font-medium">{item.name}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {item.module ? (
                                  <Badge variant="outline" className="text-[10px] h-5 font-mono">
                                    {item.module}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="distribution" className="mt-4">
                {pack.recipients.length === 0 ? (
                  <Card className="border-border/60 shadow-[var(--shadow-xs)]">
                    <CardContent className="py-14 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-7 w-7 text-muted-foreground/50" />
                      </div>
                      <p className="section-title text-base">No recipients yet</p>
                      <p className="caption-text mt-1 max-w-sm mx-auto">
                        Distribute this pack to customer tenants or SI partners with
                        signature-verified provenance.
                      </p>
                      {canDistribute && (
                        <Button
                          asChild
                          className="mt-5 gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                        >
                          <Link href={`/test-repository/packs/${pack.id}/distribute`}>
                            <Send className="h-4 w-4" />
                            Distribute Pack
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="section-title text-base">Recipients</h3>
                        <p className="section-description">
                          {pack.recipients.length} tenant
                          {pack.recipients.length !== 1 ? 's' : ''} with access to this pack
                        </p>
                      </div>
                      {canDistribute && (
                        <Button variant="outline" size="sm" asChild className="gap-1.5 shrink-0">
                          <Link href={`/test-repository/packs/${pack.id}/distribute`}>
                            <Send className="h-3.5 w-3.5" />
                            Add recipient
                          </Link>
                        </Button>
                      )}
                    </div>
                    <StaggerGrid columns="grid-cols-1 sm:grid-cols-2" className="gap-3" fast>
                      {pack.recipients.map((recipient) => (
                        <motion.div
                          key={recipient.id}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="border-border/60 shadow-[var(--shadow-xs)] hover:border-brand/30 transition-colors">
                            <CardContent className="pt-4 flex items-center gap-3">
                              <div
                                className={cn(
                                  'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-inset',
                                  recipient.type === 'customer'
                                    ? 'bg-brand/10 text-brand ring-brand/20'
                                    : 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
                                )}
                              >
                                {recipient.type === 'customer' ? (
                                  <Building2 className="h-4 w-4" />
                                ) : (
                                  <Handshake className="h-4 w-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{recipient.name}</p>
                                <p className="caption-text capitalize">{recipient.type}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className="ml-auto shrink-0 text-[10px] h-5 capitalize"
                              >
                                Active
                              </Badge>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </StaggerGrid>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <DeleteTestPackDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        pack={pack}
        onDeleted={onDeleted}
      />
    </>
  )
}
