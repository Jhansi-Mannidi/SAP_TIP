// SAP Test Assurance - Custom Components Vocabulary
// Export all reusable components for the SAP Test Assurance Solution

// Design System — layout, motion, and surface primitives
export {
  PageLayout,
  PageHeader,
  PageSection,
  StaggerGrid,
  StaggerItem,
  SectionCard,
  MetricTile,
  MotionCard,
  KpiStatCard,
  type KpiStatCardProps,
  type KpiStatTone,
} from '@/components/design-system'

// Section 1.1 - Test State Badge (using status-badge.tsx)
export { StatusBadge as TestStateBadge } from '@/components/status-badge'

// Section 1.2 - Severity Badge
export { SeverityBadge } from '@/components/status-badge'

// Section 1.3 - Entity Code Link
export { EntityCodeLink, type EntityKind } from '@/components/entity-code-link'

// Section 1.4 - Agent Task Indicator
export { AgentTaskIndicator, type AgentKind } from '@/components/agent-task-indicator'

// Section 1.5 - Productive Guard Banner
export { ProductiveGuardBanner } from '@/components/productive-guard-banner'

// Section 1.6 - Evidence Thumbnail
export { EvidenceThumbnail, type EvidenceKind } from '@/components/evidence-thumbnail'

// Section 1.7 - Screen Diff Viewer
export { 
  ScreenDiffViewer, 
  type ScreenModel, 
  type ScreenField 
} from '@/components/screen-diff-viewer'

// Section 1.8 - Replay Surface
export { 
  ReplaySurface, 
  type CaseExecution,
  type TestStep 
} from '@/components/replay-surface'

// Section 1.9 - IR Step Inspector
export { 
  IRStepInspector, 
  type IRStep, 
  type StepType, 
  type StepParameter, 
  type HealingHint 
} from '@/components/ir-step-inspector'

// Section 1.10 - Task Timeline Gantt
export { 
  TaskTimelineGantt, 
  type TestCaseExecution, 
  type Runner 
} from '@/components/task-timeline-gantt'

// Section 1.11 - Pipeline Walkthrough
export { 
  PipelineWalkthrough, 
  type PipelineStage, 
  type PipelineStageState 
} from '@/components/pipeline-walkthrough'

// Section 1.12 - Migration Scorecard Card
export { 
  MigrationScorecardCard, 
  type MigrationScorecard, 
  type MigrationPhase 
} from '@/components/migration-scorecard-card'

// Section 1.13 - War Room Grid
export { 
  WarRoomGrid, 
  type WarRoomData, 
  type CutoverWindow, 
  type CutoverKind,
  type SuiteExecution,
  type Participant,
  type DecisionLogEntry,
  type EventFeedItem,
  type CutoverPlan
} from '@/components/war-room-grid'

// Section 1.14 - Decision Log Composer
export { 
  DecisionLogComposer, 
  type DecisionKind, 
  type DecisionLogData, 
  type EvidenceItem 
} from '@/components/decision-log-composer'

// Section 1.15 - BP Coverage Matrix
export { 
  BPCoverageMatrix, 
  type BPScope, 
  type ScopeItem, 
  type CoverageState 
} from '@/components/bp-coverage-matrix'

// Section 1.16 - Runner Pool Status Panel
export { 
  RunnerPoolStatusPanel, 
  type RunnerPool, 
  type Runner as PoolRunner, 
  type RunnerHealth, 
  type LeaseState 
} from '@/components/runner-pool-status-panel'

// Section 1.17 - Approval Signature Chain
export { 
  ApprovalSignatureChain, 
  type Approval, 
  type Cosigner, 
  type SignatureState 
} from '@/components/approval-signature-chain'

// Section 1.18 - KB Article Card
export { 
  KBArticleCard, 
  type KBArticle, 
  type KBSource 
} from '@/components/kb-article-card'

// Section 1.19 - Task Definition Graph
export { 
  TaskDefinitionGraph, 
  type ScenarioGraph, 
  type TaskNode 
} from '@/components/task-definition-graph'

// Section 1.20 - Evidence Bundle Card
export { 
  EvidenceBundleCard, 
  type EvidenceBundle, 
  type EvidenceItemKind 
} from '@/components/evidence-bundle-card'

// Section 1.21 - Healing Promotion Diff
export { 
  HealingPromotionDiff, 
  type HealingPromotion, 
  type HealingEvent, 
  type IRStepSnapshot 
} from '@/components/healing-promotion-diff'

// Section 1.22 - Sign Off Panel
export { 
  SignOffPanel, 
  type SignOffEntity, 
  type SignOffRole 
} from '@/components/sign-off-panel'

// Section 1.23 - KPI Strip
export { KPIStrip, type KPI } from '@/components/kpi-strip'

// Section 1.24 - Burndown Chart
export { BurndownChart, type BurndownDataPoint } from '@/components/burndown-chart'

// Section 1.25 - Audit Trail Table
export { AuditTrailTable, type AuditEvent } from '@/components/audit-trail-table'

// Section 1.26 - Productive Execution Approval Dialog
export { 
  ProductiveExecutionApprovalDialog, 
  type RequiredCosigner 
} from '@/components/productive-execution-approval-dialog'

// Section 1.27 - Z-Object Inventory Row
export { 
  ZObjectInventoryRow, 
  type ZObject, 
  type ZObjectKind 
} from '@/components/zobject-inventory-row'

// Section 1.28 - System Health Badge
export { 
  SystemHealthBadge, 
  type SystemHealthStatus 
} from '@/components/system-health-badge'

// Additional shared components
export { StatusBadge, PriorityBadge } from '@/components/status-badge'
