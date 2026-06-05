'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  AlertTriangle, 
  Code2, 
  CheckCircle2, 
  HeartPulse, 
  Bug, 
  Calendar,
  Gauge
} from 'lucide-react'

export type MigrationPhase = 'Initiation' | 'Design' | 'Realization' | 'Test_Prep' | 'Cutover' | 'Hypercare' | 'Closed'

export interface MigrationScorecard {
  id: string
  name: string
  currentPhase: MigrationPhase
  bpCoveragePercent: number
  siBurndownRemaining: number
  siBurndownTotal: number
  abapBurndownRemaining: number
  abapBurndownTotal: number
  regressionPassRate: number
  healingRate: number
  openCriticalDefects: number
  daysToCutover: number
  cutoverReadinessScore: number
}

interface MigrationScorecardCardProps {
  scorecard: MigrationScorecard
  className?: string
  compact?: boolean
}

const phaseOrder: MigrationPhase[] = ['Initiation', 'Design', 'Realization', 'Test_Prep', 'Cutover', 'Hypercare', 'Closed']

export function MigrationScorecardCard({ scorecard, className, compact = false }: MigrationScorecardCardProps) {
  const currentPhaseIndex = phaseOrder.indexOf(scorecard.currentPhase)
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className={cn(compact ? 'pb-2' : 'pb-4')}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={cn(compact ? 'text-base' : 'text-lg')}>
              {scorecard.name}
            </CardTitle>
            <Badge variant="secondary" className="mt-1">
              {scorecard.currentPhase.replace('_', ' ')}
            </Badge>
          </div>
          <CutoverReadinessGauge score={scorecard.cutoverReadinessScore} compact={compact} />
        </div>
      </CardHeader>
      
      <CardContent className={cn(compact ? 'pt-0 space-y-3' : 'pt-0 space-y-4')}>
        {/* Phase progression strip */}
        <PhaseProgressionStrip currentPhase={scorecard.currentPhase} />
        
        {/* KPI Grid */}
        <div className={cn(
          'grid gap-3',
          compact ? 'grid-cols-2' : 'grid-cols-4'
        )}>
          {/* BP Coverage */}
          <KPIItem
            icon={Target}
            label="BP Coverage"
            value={`${scorecard.bpCoveragePercent}%`}
            status={scorecard.bpCoveragePercent >= 80 ? 'good' : scorecard.bpCoveragePercent >= 60 ? 'warning' : 'critical'}
            compact={compact}
          />
          
          {/* SI Burndown */}
          <KPIItem
            icon={AlertTriangle}
            label="SI Burndown"
            value={`${scorecard.siBurndownRemaining}/${scorecard.siBurndownTotal}`}
            subValue={`${Math.round((1 - scorecard.siBurndownRemaining / scorecard.siBurndownTotal) * 100)}% done`}
            status={scorecard.siBurndownRemaining === 0 ? 'good' : scorecard.siBurndownRemaining <= 10 ? 'warning' : 'critical'}
            compact={compact}
          />
          
          {/* ABAP Burndown */}
          <KPIItem
            icon={Code2}
            label="ABAP Burndown"
            value={`${scorecard.abapBurndownRemaining}/${scorecard.abapBurndownTotal}`}
            subValue={`${Math.round((1 - scorecard.abapBurndownRemaining / scorecard.abapBurndownTotal) * 100)}% done`}
            status={scorecard.abapBurndownRemaining === 0 ? 'good' : scorecard.abapBurndownRemaining <= 20 ? 'warning' : 'critical'}
            compact={compact}
          />
          
          {/* Regression Pass Rate */}
          <KPIItem
            icon={CheckCircle2}
            label="Regression Pass"
            value={`${scorecard.regressionPassRate}%`}
            status={scorecard.regressionPassRate >= 95 ? 'good' : scorecard.regressionPassRate >= 80 ? 'warning' : 'critical'}
            compact={compact}
          />
          
          {/* Healing Rate */}
          <KPIItem
            icon={HeartPulse}
            label="Healing Rate"
            value={`${scorecard.healingRate}%`}
            status={scorecard.healingRate >= 70 ? 'good' : scorecard.healingRate >= 50 ? 'warning' : 'critical'}
            compact={compact}
          />
          
          {/* Open Critical Defects */}
          <KPIItem
            icon={Bug}
            label="Critical Defects"
            value={String(scorecard.openCriticalDefects)}
            status={scorecard.openCriticalDefects === 0 ? 'good' : scorecard.openCriticalDefects <= 3 ? 'warning' : 'critical'}
            compact={compact}
          />
          
          {/* Days to Cutover */}
          <KPIItem
            icon={Calendar}
            label="Days to Cutover"
            value={`${scorecard.daysToCutover}d`}
            status={scorecard.daysToCutover >= 30 ? 'good' : scorecard.daysToCutover >= 14 ? 'warning' : 'critical'}
            compact={compact}
          />
          
          {/* Cutover Readiness */}
          <KPIItem
            icon={Gauge}
            label="Readiness"
            value={`${scorecard.cutoverReadinessScore}%`}
            status={scorecard.cutoverReadinessScore >= 80 ? 'good' : scorecard.cutoverReadinessScore >= 60 ? 'warning' : 'critical'}
            compact={compact}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function PhaseProgressionStrip({ currentPhase }: { currentPhase: MigrationPhase }) {
  const currentIndex = phaseOrder.indexOf(currentPhase)
  
  return (
    <div className="flex items-center gap-1">
      {phaseOrder.map((phase, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        
        return (
          <div
            key={phase}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors',
              isCompleted && 'bg-emerald-500',
              isCurrent && 'bg-indigo-500',
              !isCompleted && !isCurrent && 'bg-slate-200'
            )}
            title={phase.replace('_', ' ')}
          />
        )
      })}
    </div>
  )
}

function CutoverReadinessGauge({ score, compact }: { score: number; compact?: boolean }) {
  const size = compact ? 48 : 64
  const strokeWidth = compact ? 4 : 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference
  
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          'font-bold',
          compact ? 'text-xs' : 'text-sm'
        )}>
          {score}%
        </span>
      </div>
    </div>
  )
}

function KPIItem({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  status,
  compact
}: { 
  icon: React.ElementType
  label: string
  value: string
  subValue?: string
  status: 'good' | 'warning' | 'critical'
  compact?: boolean
}) {
  const statusColors = {
    good: 'text-emerald-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
  }
  
  return (
    <div className={cn(
      'p-2 rounded-lg bg-muted/50',
      compact && 'p-1.5'
    )}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={cn('h-3.5 w-3.5 text-muted-foreground')} />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className={cn(
        'font-semibold',
        statusColors[status],
        compact ? 'text-sm' : 'text-lg'
      )}>
        {value}
      </div>
      {subValue && (
        <div className="text-[10px] text-muted-foreground">{subValue}</div>
      )}
    </div>
  )
}
