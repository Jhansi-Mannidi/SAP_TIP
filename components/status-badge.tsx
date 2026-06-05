'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { HeartPulse } from 'lucide-react'
import type { TaskState, SuiteState, DefectState, TransportState, Severity, Priority } from '@/lib/types'

// Status badge component for consistent status rendering across the app
type StatusType = TaskState | SuiteState | DefectState | TransportState | Severity | Priority | string

interface StatusBadgeProps {
  status: StatusType
  className?: string
  showIcon?: boolean
}

// Tone classes — each tone has paired light + dark variants so badges work in both themes.
const TONE = {
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  healed: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  critical: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  published: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
  archived: 'bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300',
} as const

// Color mappings based on the design system
const statusColors: Record<string, { tone: string; animation?: string }> = {
  // Pass / Success states - emerald
  'Pass': { tone: TONE.success },
  'Closed': { tone: TONE.success },
  'Released_PROD': { tone: TONE.success },
  'Signed_Off': { tone: TONE.success },
  'Completed_Passed': { tone: TONE.success },
  'Test_Passed': { tone: TONE.success },
  'Released_QAS': { tone: TONE.success },
  'safe': { tone: TONE.success },

  // Healed states - amber with heart icon
  'Healed': { tone: TONE.healed },
  'Completed_Passed_With_Healing': { tone: TONE.healed },
  'needs_healing': { tone: TONE.healed },

  // In Progress states - blue with pulse animation
  'InProgress': { tone: TONE.info, animation: 'animate-pulse-subtle' },
  'Triaged': { tone: TONE.info },
  'Assigned': { tone: TONE.info },
  'In_Fix': { tone: TONE.info, animation: 'animate-pulse-subtle' },
  'Retest_Pending': { tone: TONE.info },
  'Retest_In_Progress': { tone: TONE.info, animation: 'animate-pulse-subtle' },
  'In_Test': { tone: TONE.info, animation: 'animate-pulse-subtle' },
  'Analyzed': { tone: TONE.info },
  'Test_Plan_Ready': { tone: TONE.info },

  // Fail / Error states - red
  'Fail': { tone: TONE.danger },
  'Defected': { tone: TONE.danger },
  'Re_Opened': { tone: TONE.danger },
  'Completed_Failed': { tone: TONE.danger },
  'Completed_Partial': { tone: TONE.danger },
  'Test_Failed': { tone: TONE.danger },
  'broken': { tone: TONE.danger },
  'regenerate': { tone: TONE.danger },

  // Critical severity - rose
  'critical': { tone: TONE.critical },

  // Published state - indigo
  'Published': { tone: TONE.published },
  'Archived': { tone: TONE.archived },

  // Pending / ToDo states - slate
  'ToDo': { tone: TONE.neutral },
  'Open': { tone: TONE.neutral },
  'Draft': { tone: TONE.neutral },
  'Detected': { tone: TONE.neutral },
  'Identified': { tone: TONE.neutral },
  'Captured': { tone: TONE.neutral },
  'Classified': { tone: TONE.neutral },
  'Pending': { tone: TONE.neutral },
  'Scheduled': { tone: TONE.neutral },

  // Terminal but not clean states - violet
  'Deferred': { tone: TONE.violet },
  'Cannot_Reproduce': { tone: TONE.violet },
  'Duplicate': { tone: TONE.violet },
  'Withdrawn': { tone: TONE.violet },
  'Accepted_Deviation': { tone: TONE.violet },

  // Severity levels
  'high': { tone: TONE.orange },
  'medium': { tone: TONE.yellow },
  'low': { tone: TONE.green },
  'informational': { tone: TONE.neutral },

  // Priority levels
  'p1': { tone: TONE.danger },
  'p2': { tone: TONE.orange },
  'p3': { tone: TONE.yellow },
  'p4': { tone: TONE.neutral },
}

// Format status for display (convert snake_case to Title Case)
function formatStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const colors = statusColors[status] || { tone: TONE.neutral }
  const isHealed = status === 'Healed' || status === 'Completed_Passed_With_Healing' || status === 'needs_healing'
  
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-medium text-xs border-0',
        colors.tone,
        colors.animation,
        className
      )}
    >
      {isHealed && showIcon && <HeartPulse className="mr-1 h-3 w-3" />}
      {formatStatus(status)}
    </Badge>
  )
}

// Test State badge specifically for Test Execution states
export function TestStateBadge({ state, className }: { state: TaskState; className?: string }) {
  return <StatusBadge status={state} className={className} showIcon={true} />
}

// Severity badge specifically
export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return <StatusBadge status={severity} className={className} showIcon={false} />
}

// Priority badge specifically  
export function PriorityBadge({ priority, className }: { priority: Priority | string; className?: string }) {
  const normalizedPriority = priority.toLowerCase()
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-mono text-xs uppercase',
        normalizedPriority === 'p1' && 'border-red-300 text-red-700 dark:border-red-500/40 dark:text-red-300',
        normalizedPriority === 'p2' && 'border-orange-300 text-orange-700 dark:border-orange-500/40 dark:text-orange-300',
        normalizedPriority === 'p3' && 'border-yellow-300 text-yellow-700 dark:border-yellow-500/40 dark:text-yellow-300',
        normalizedPriority === 'p4' && 'border-slate-300 text-slate-600 dark:border-slate-500/40 dark:text-slate-300',
        className
      )}
    >
      {priority.toUpperCase()}
    </Badge>
  )
}
