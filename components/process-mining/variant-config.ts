import type { ProcessVariantStatus, VariantStepCoverage } from '@/lib/process-mining-mock-data'

export const VARIANT_STATUS_CONFIG: Record<
  ProcessVariantStatus,
  { label: string; pill: string }
> = {
  covered: { label: 'Covered', pill: 'pill pill-success' },
  partial: { label: 'Partial', pill: 'pill pill-warning' },
  gap: { label: 'Gap', pill: 'pill pill-danger' },
  untested: { label: 'Untested', pill: 'pill pill-neutral' },
}

export const STEP_COVERAGE_CONFIG: Record<
  VariantStepCoverage,
  { label: string; pill: string; node: string }
> = {
  covered: {
    label: 'Covered',
    pill: 'pill pill-success',
    node: 'border-emerald-500/40 bg-emerald-500/[0.06] ring-emerald-500/20',
  },
  partial: {
    label: 'Partial',
    pill: 'pill pill-warning',
    node: 'border-amber-500/40 bg-amber-500/[0.06] ring-amber-500/20',
  },
  gap: {
    label: 'Gap',
    pill: 'pill pill-danger',
    node: 'border-red-500/40 bg-red-500/[0.06] ring-red-500/20',
  },
  untested: {
    label: 'Untested',
    pill: 'pill pill-neutral',
    node: 'border-border bg-muted/30 ring-border/60',
  },
}

export const TEST_STATE_CONFIG = {
  passing: { label: 'Passing', pill: 'pill pill-success' },
  failing: { label: 'Failing', pill: 'pill pill-danger' },
  healing: { label: 'Healing', pill: 'pill pill-warning' },
} as const
