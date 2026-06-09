import {
  AlertTriangle,
  Clock,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type {
  SuggestionPriority,
  SuggestionStatus,
  SuggestionType,
} from '@/lib/process-mining-mock-data'

export const SUGGESTION_TYPE_CONFIG: Record<
  SuggestionType,
  { icon: LucideIcon; color: string; bg: string; label: string }
> = {
  coverage_gap: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 ring-amber-500/20',
    label: 'Coverage Gap',
  },
  optimization: {
    icon: TrendingUp,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 ring-blue-500/20',
    label: 'Optimization',
  },
  risk: {
    icon: AlertTriangle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/10 ring-red-500/20',
    label: 'Risk',
  },
  performance: {
    icon: Clock,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10 ring-violet-500/20',
    label: 'Performance',
  },
}

export const SUGGESTION_STATUS_CONFIG: Record<
  SuggestionStatus,
  { pill: string; label: string }
> = {
  pending: {
    pill: 'pill pill-warning',
    label: 'Pending',
  },
  accepted: {
    pill: 'pill pill-success',
    label: 'Accepted',
  },
  rejected: {
    pill: 'pill pill-neutral',
    label: 'Rejected',
  },
}

export const SUGGESTION_PRIORITY_CONFIG: Record<SuggestionPriority, string> = {
  high: 'pill pill-danger',
  medium: 'pill pill-warning',
  low: 'pill pill-neutral',
}
