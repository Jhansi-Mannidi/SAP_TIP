'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Lock,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { OrgArticle } from '@/lib/kb-mock-data'

type ArticleType = OrgArticle['type']
type ArticleVisibility = OrgArticle['visibility']

const ARTICLE_TYPES: {
  id: ArticleType
  label: string
  description: string
  icon: React.ElementType
  color: string
  ring: string
}[] = [
  {
    id: 'runbook',
    label: 'Runbook',
    description: 'Step-by-step operational procedures for SAP transactions.',
    icon: Sparkles,
    color: 'bg-brand/10 text-brand',
    ring: 'ring-brand/25',
  },
  {
    id: 'sop',
    label: 'SOP',
    description: 'Standard operating procedures for recurring business activities.',
    icon: FileText,
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    ring: 'ring-blue-500/25',
  },
  {
    id: 'guideline',
    label: 'Guideline',
    description: 'Configuration and best-practice guidance for your landscape.',
    icon: Tag,
    color: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    ring: 'ring-violet-500/25',
  },
  {
    id: 'policy',
    label: 'Policy',
    description: 'Governance rules, approvals, and compliance documentation.',
    icon: Lock,
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    ring: 'ring-amber-500/25',
  },
]

const SAP_MODULES = ['SD', 'MM', 'FI', 'CO', 'PP', 'QM', 'PM', 'HR', 'Cross-Module'] as const

const VISIBILITY_OPTIONS: {
  id: ArticleVisibility
  label: string
  description: string
  icon: React.ElementType
}[] = [
  {
    id: 'org',
    label: 'Organization Only',
    description: 'Visible to all users in Star Cement. Cannot be distributed globally.',
    icon: Building2,
  },
  {
    id: 'team',
    label: 'Workspace Only',
    description: 'Limited to your QA workspace members and assigned roles.',
    icon: Users,
  },
  {
    id: 'private',
    label: 'Private Draft',
    description: 'Only you can view until published to a wider audience.',
    icon: Lock,
  },
]

const STEPS = [
  { id: 'basics', label: 'Article details', icon: FileText },
  { id: 'content', label: 'Content', icon: Sparkles },
  { id: 'publish', label: 'Visibility & publish', icon: Lock },
] as const

type StepId = (typeof STEPS)[number]['id']

export interface OrgArticleFormData {
  title: string
  type: ArticleType
  module: string
  description: string
  content: string
  tags: string[]
  visibility: ArticleVisibility
}

const INITIAL_FORM: OrgArticleFormData = {
  title: '',
  type: 'runbook',
  module: 'SD',
  description: '',
  content: '',
  tags: [],
  visibility: 'org',
}

export function OrgArticleRegisterWizard() {
  const router = useRouter()
  const [step, setStep] = React.useState<StepId>('basics')
  const [form, setForm] = React.useState<OrgArticleFormData>(INITIAL_FORM)
  const [tagInput, setTagInput] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  const update = <K extends keyof OrgArticleFormData>(key: K, value: OrgArticleFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag || form.tags.includes(tag)) return
    update('tags', [...form.tags, tag])
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    update(
      'tags',
      form.tags.filter((t) => t !== tag),
    )
  }

  const canProceedBasics = form.title.trim().length >= 3 && form.module.length > 0
  const canProceedContent = form.description.trim().length >= 10 && form.content.trim().length >= 20

  const goNext = () => {
    if (step === 'basics' && canProceedBasics) setStep('content')
    else if (step === 'content' && canProceedContent) setStep('publish')
  }

  const goBack = () => {
    if (step === 'content') setStep('basics')
    else if (step === 'publish') setStep('content')
  }

  const handlePublish = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    const { toast } = await import('sonner')
    toast.success('Article published', {
      description: `"${form.title}" is now available in Organization KB.`,
    })
    setIsSubmitting(false)
    router.push('/knowledge-center/org')
  }

  const handleSaveDraft = async () => {
    const { toast } = await import('sonner')
    toast.message('Draft saved', { description: 'You can continue editing later.' })
  }

  const selectedType = ARTICLE_TYPES.find((t) => t.id === form.type)!
  const selectedVisibility = VISIBILITY_OPTIONS.find((v) => v.id === form.visibility)!

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = s.id === step
            const isDone = i < stepIndex
            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (i < stepIndex) setStep(s.id)
                  }}
                  className={cn(
                    'flex items-center gap-2 min-w-0',
                    i <= stepIndex ? 'cursor-pointer' : 'cursor-default',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                      isDone && 'border-brand bg-brand text-brand-foreground',
                      isActive && !isDone && 'border-brand bg-brand/10 text-brand',
                      !isActive && !isDone && 'border-border bg-muted/40 text-muted-foreground',
                    )}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      'hidden sm:block text-xs font-medium truncate',
                      isActive ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 rounded-full min-w-[1rem]',
                      i < stepIndex ? 'bg-brand' : 'bg-border',
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
          className="rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-sm)] overflow-hidden"
        >
          {step === 'basics' && (
            <div className="p-5 sm:p-7 space-y-6">
              <div>
                <h2 className="section-title">Article details</h2>
                <p className="section-description mt-1">
                  Name your article and choose the SAP module it applies to.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Sales Order Creation Runbook"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label>Article type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ARTICLE_TYPES.map((type) => {
                    const Icon = type.icon
                    const selected = form.type === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => update('type', type.id)}
                        className={cn(
                          'flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all',
                          selected
                            ? 'border-brand/50 bg-brand/[0.06] ring-1 ring-brand/25'
                            : 'border-border/60 hover:border-border hover:bg-muted/20',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset',
                            type.color,
                            type.ring,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{type.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="module">SAP module</Label>
                <Select value={form.module} onValueChange={(v) => update('module', v)}>
                  <SelectTrigger id="module" className="h-10">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAP_MODULES.map((mod) => (
                      <SelectItem key={mod} value={mod}>
                        {mod}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 'content' && (
            <div className="p-5 sm:p-7 space-y-6">
              <div>
                <h2 className="section-title">Content</h2>
                <p className="section-description mt-1">
                  Write a summary and the full article body. Use clear steps for runbooks.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Summary</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description shown in the article list..."
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-[11px] text-muted-foreground">{form.description.length} characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Article body</Label>
                <Textarea
                  id="content"
                  placeholder="## Overview&#10;&#10;1. Log in to SAP GUI...&#10;2. Execute transaction VA01..."
                  value={form.content}
                  onChange={(e) => update('content', e.target.value)}
                  rows={12}
                  className="resize-y min-h-[200px] font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    className="h-9"
                  />
                  <Button type="button" variant="outline" size="sm" className="h-9 shrink-0" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <span className="text-muted-foreground ml-0.5">×</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'publish' && (
            <div className="p-5 sm:p-7 space-y-6">
              <div>
                <h2 className="section-title">Visibility &amp; publish</h2>
                <p className="section-description mt-1">
                  Control who can access this article within your organization.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="space-y-2">
                  {VISIBILITY_OPTIONS.map((opt) => {
                    const Icon = opt.icon
                    const selected = form.visibility === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => update('visibility', opt.id)}
                        className={cn(
                          'w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                          selected
                            ? 'border-brand/50 bg-brand/[0.06] ring-1 ring-brand/25'
                            : 'border-border/60 hover:border-border hover:bg-muted/20',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            selected ? 'bg-brand/12 text-brand' : 'bg-muted text-muted-foreground',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-3">
                <p className="micro-label">Review</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Title</span>
                    <span className="font-medium text-right">{form.title || '—'}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{selectedType.label}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Module</span>
                    <Badge variant="outline" className="font-mono h-6">
                      {form.module}
                    </Badge>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Visibility</span>
                    <span className="font-medium">{selectedVisibility.label}</span>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end pt-1">
                      {form.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/10 px-5 sm:px-7 py-4">
            <div>
              {step !== 'basics' ? (
                <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={goBack}>
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button type="button" variant="ghost" size="sm" asChild>
                  <Link href="/knowledge-center/org">Cancel</Link>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleSaveDraft}>
                Save draft
              </Button>
              {step !== 'publish' ? (
                <Button
                  type="button"
                  size="sm"
                  className="gap-1"
                  disabled={step === 'basics' ? !canProceedBasics : !canProceedContent}
                  onClick={goNext}
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="gap-2 min-w-[7rem]"
                  disabled={isSubmitting}
                  onClick={handlePublish}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Publish article
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
