'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Database,
  FileText,
  Layers,
  Loader2,
  Package,
  Settings2,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { TestPack } from '@/lib/mock-data'

const STEPS = [
  { id: 'source', label: 'Source Pack', icon: Package },
  { id: 'identity', label: 'New Identity', icon: Copy },
  { id: 'contents', label: 'Contents', icon: Database },
  { id: 'review', label: 'Review & Clone', icon: Sparkles },
] as const

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="w-full">
      <div className="relative mb-4 hidden sm:block">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
        <motion.div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand to-[#d4a04a]"
          animate={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isComplete = index < currentIndex
            const isCurrent = index === currentIndex
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center ring-2 ring-background shrink-0',
                    isComplete && 'bg-brand text-brand-foreground ring-brand/30',
                    isCurrent &&
                      'bg-brand text-brand-foreground ring-brand/50 shadow-[0_0_0_3px_rgba(184,134,46,0.15)]',
                    !isComplete && !isCurrent && 'bg-muted text-muted-foreground ring-transparent',
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    'text-[10px] text-center leading-tight truncate w-full px-0.5',
                    isCurrent && 'font-semibold text-brand',
                  )}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <p className="sm:hidden text-sm text-muted-foreground">
        Step {currentIndex + 1} of {STEPS.length}:{' '}
        <span className="font-medium text-foreground">{STEPS[currentIndex].label}</span>
      </p>
    </div>
  )
}

function bumpVersion(version: string): string {
  const match = version.match(/v?(\d+)\.(\d+)/)
  if (!match) return 'v1.0'
  return `v${match[1]}.${Number(match[2]) + 1}`
}

interface TestPackCloneWizardProps {
  pack: TestPack
}

export function TestPackCloneWizard({ pack }: TestPackCloneWizardProps) {
  const router = useRouter()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [cloning, setCloning] = React.useState(false)

  const [name, setName] = React.useState(`${pack.name} (Copy)`)
  const [version, setVersion] = React.useState(bumpVersion(pack.version))
  const [description, setDescription] = React.useState(pack.description)
  const [includeSuites, setIncludeSuites] = React.useState(true)
  const [includeScenarios, setIncludeScenarios] = React.useState(true)
  const [includeCases, setIncludeCases] = React.useState(true)
  const [includeFixtures, setIncludeFixtures] = React.useState(true)
  const [resetSignatures, setResetSignatures] = React.useState(true)
  const [startAsDraft, setStartAsDraft] = React.useState(true)

  const currentStep = STEPS[stepIndex].id

  const canNext = () => {
    if (currentStep === 'identity') {
      return name.trim().length >= 3 && version.trim().length >= 2 && description.trim().length >= 10
    }
    if (currentStep === 'contents') {
      return includeSuites || includeScenarios || includeCases || includeFixtures
    }
    return true
  }

  const handleClone = async () => {
    setCloning(true)
    await new Promise((r) => setTimeout(r, 1200))
    setCloning(false)
    toast.success('Test pack cloned', {
      description: `${name} created as a new ${startAsDraft ? 'draft' : 'published'} pack.`,
    })
    router.push('/test-repository/packs')
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <StepIndicator currentIndex={stepIndex} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28 }}
          className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-5 sm:p-6"
        >
          {currentStep === 'source' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Source Pack</h2>
                <p className="section-description mt-1">
                  You are cloning an existing test pack. All selected content will be copied to a new pack.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{pack.name}</p>
                    <p className="caption-text mt-0.5">{pack.description}</p>
                  </div>
                  <Badge variant="outline" className="font-mono shrink-0">
                    {pack.version}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Layers, label: 'Suites', value: pack.contents.suites },
                    { icon: FileText, label: 'Scenarios', value: pack.contents.scenarios },
                    { icon: Settings2, label: 'Cases', value: pack.contents.cases },
                    { icon: Database, label: 'Fixtures', value: pack.contents.fixtures },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border/50 bg-card px-2 py-2 text-center"
                    >
                      <stat.icon className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm font-semibold tabular-nums">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'identity' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">New Pack Identity</h2>
                <p className="section-description mt-1">
                  Set the name and version for the cloned pack.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="clone-name">Pack Name</Label>
                  <Input id="clone-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clone-version">Version</Label>
                  <Input
                    id="clone-version"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source Version</Label>
                  <Input value={pack.version} disabled className="font-mono text-sm bg-muted/30" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="clone-desc">Description</Label>
                  <Textarea
                    id="clone-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] resize-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'contents' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Contents to Clone</h2>
                <p className="section-description mt-1">
                  Choose which artifact types to include in the clone.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 divide-y">
                {[
                  { key: 'suites', label: 'Test Suites', count: pack.contents.suites, checked: includeSuites, set: setIncludeSuites },
                  { key: 'scenarios', label: 'Test Scenarios', count: pack.contents.scenarios, checked: includeScenarios, set: setIncludeScenarios },
                  { key: 'cases', label: 'Test Cases', count: pack.contents.cases, checked: includeCases, set: setIncludeCases },
                  { key: 'fixtures', label: 'Data Fixtures', count: pack.contents.fixtures, checked: includeFixtures, set: setIncludeFixtures },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between gap-4 p-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={(v) => item.set(v === true)}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="caption-text">{item.count} items from source pack</p>
                      </div>
                    </div>
                  </label>
                ))}
                <label className="flex items-center justify-between gap-4 p-4 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Reset signatures & recipients</p>
                    <p className="caption-text">Clone starts unsigned with no distribution history</p>
                  </div>
                  <Switch checked={resetSignatures} onCheckedChange={setResetSignatures} />
                </label>
                <label className="flex items-center justify-between gap-4 p-4 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">Start as Draft</p>
                    <p className="caption-text">Otherwise clone inherits Published status</p>
                  </div>
                  <Switch checked={startAsDraft} onCheckedChange={setStartAsDraft} />
                </label>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-5">
              <div>
                <h2 className="section-title">Review & Clone</h2>
                <p className="section-description mt-1">Confirm before creating the cloned pack.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm space-y-2">
                <div className="flex justify-between gap-4 py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium text-right">{pack.name}</span>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-border/50">
                  <span className="text-muted-foreground">New Name</span>
                  <span className="font-medium text-right">{name}</span>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-xs font-medium">{version}</span>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <span className="text-muted-foreground">Initial Status</span>
                  <span className="font-medium">{startAsDraft ? 'Draft' : 'Published'}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => {
            if (stepIndex > 0) setStepIndex((i) => i - 1)
            else router.push(`/test-repository/packs/${pack.id}`)
          }}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href={`/test-repository/packs/${pack.id}`}>Cancel</Link>
          </Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button
              onClick={() => setStepIndex((i) => i + 1)}
              disabled={!canNext()}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleClone}
              disabled={cloning}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {cloning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
              Clone Pack
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
