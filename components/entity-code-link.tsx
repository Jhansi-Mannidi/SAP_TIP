'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Truck, Bug, FlaskConical, AlertCircle, Code2, FileText, Package, Workflow, Tag } from 'lucide-react'

export type EntityKind =
  | 'TR'
  | 'Defect'
  | 'TestCase'
  | 'SIItem'
  | 'ABAPFinding'
  | 'Scenario'
  | 'Suite'
  | 'Process'
  | 'Evidence'

interface EntityCodeLinkProps {
  /** Canonical kind */
  kind?: EntityKind | string
  /** Alias for kind */
  type?: string
  /** Alias for kind */
  entityType?: string
  code: string
  /** Display name (renders in tooltip) */
  name?: string
  /** Alias for name */
  label?: string
  href?: string
  className?: string
  onClick?: () => void
}

const iconMap: Record<EntityKind, React.ElementType> = {
  TR: Truck,
  Defect: Bug,
  TestCase: FlaskConical,
  SIItem: AlertCircle,
  ABAPFinding: Code2,
  Scenario: FileText,
  Suite: Package,
  Process: Workflow,
  Evidence: Tag,
}

const kindLabels: Record<EntityKind, string> = {
  TR: 'Transport Request',
  Defect: 'Defect',
  TestCase: 'Test Case',
  SIItem: 'Simplification Item',
  ABAPFinding: 'ABAP Finding',
  Scenario: 'Test Scenario',
  Suite: 'Test Suite',
  Process: 'Process',
  Evidence: 'Evidence',
}

/** Normalize various incoming kind strings to the canonical EntityKind */
function normalizeKind(input?: string): EntityKind {
  if (!input) return 'TestCase'
  const v = String(input).toLowerCase().replace(/[\s_-]/g, '')
  switch (v) {
    case 'tr':
    case 'transport':
    case 'transportrequest':
      return 'TR'
    case 'defect':
    case 'bug':
      return 'Defect'
    case 'testcase':
    case 'test':
    case 'tc':
    case 'task':
      return 'TestCase'
    case 'siitem':
    case 'si':
    case 'simplification':
    case 'simplificationitem':
      return 'SIItem'
    case 'abapfinding':
    case 'abap':
    case 'finding':
      return 'ABAPFinding'
    case 'scenario':
    case 'testscenario':
      return 'Scenario'
    case 'suite':
    case 'testsuite':
      return 'Suite'
    case 'process':
    case 'pipeline':
    case 'workflow':
      return 'Process'
    case 'evidence':
    case 'tcode':
      return 'Evidence'
    default:
      return 'TestCase'
  }
}

export function EntityCodeLink({
  kind,
  type,
  entityType,
  code,
  name,
  label,
  href,
  className,
  onClick,
}: EntityCodeLinkProps) {
  const resolvedKind = normalizeKind(kind ?? type ?? entityType)
  const Icon = iconMap[resolvedKind] ?? FileText
  const kindLabel = kindLabels[resolvedKind] ?? 'Entity'
  const displayName = name ?? label

  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-sm',
        'text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer',
        'transition-colors duration-150',
        className
      )}
      onClick={onClick}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{code}</span>
    </span>
  )

  const wrapped = href ? (
    <a href={href} className="no-underline">
      {content}
    </a>
  ) : (
    content
  )

  if (displayName) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>{wrapped}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="caption-text">{kindLabel}</p>
              <p className="font-medium">{displayName}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return wrapped
}
