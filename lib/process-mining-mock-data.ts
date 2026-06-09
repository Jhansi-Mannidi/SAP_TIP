import type { BPScope } from '@/components/bp-coverage-matrix'

export const PROCESS_MINING_KPIS = [
  { id: 'processes', label: 'Processes Discovered', value: 47 },
  { id: 'variants', label: 'Process Variants', value: 156 },
  {
    id: 'conformance',
    label: 'Avg Conformance',
    value: '84%',
    trend: 'up' as const,
    trendValue: '+3%',
  },
  { id: 'coverage', label: 'Test Coverage', value: '72%', trend: 'neutral' as const },
  {
    id: 'suggested',
    label: 'Suggested Tests',
    value: 3,
    trend: 'up' as const,
    sparklineData: [1, 2, 2, 3, 3],
  },
]

export const BP_SCOPE: BPScope = {
  id: 'bp-s4hana-2023',
  name: 'S/4HANA Best Practice Scope',
  items: [
    {
      id: 'si-1',
      code: 'BD1',
      name: 'Sell from Stock',
      module: 'SD',
      coverageState: 'covered_passing',
      scenarioCount: 12,
      scenarios: [
        { id: 'SC-001', name: 'Standard sales order', state: 'passing' },
        { id: 'SC-002', name: 'Delivery & billing', state: 'passing' },
      ],
    },
    {
      id: 'si-2',
      code: 'BD2',
      name: 'Sell from Stock with Credit',
      module: 'SD',
      coverageState: 'covered_healing',
      scenarioCount: 8,
      scenarios: [
        { id: 'SC-010', name: 'Credit block override', state: 'healing' },
      ],
    },
    {
      id: 'si-3',
      code: 'BK1',
      name: 'Purchase Order Processing',
      module: 'MM',
      coverageState: 'covered_passing',
      scenarioCount: 15,
    },
    {
      id: 'si-4',
      code: 'BK2',
      name: 'Goods Receipt',
      module: 'MM',
      coverageState: 'covered_failing',
      scenarioCount: 5,
    },
    {
      id: 'si-5',
      code: 'J91',
      name: 'Period End Close',
      module: 'FI',
      coverageState: 'not_covered',
      scenarioCount: 0,
    },
    {
      id: 'si-6',
      code: 'J77',
      name: 'Cost Center Accounting',
      module: 'CO',
      coverageState: 'covered_passing',
      scenarioCount: 7,
    },
  ],
}

export type ProcessVariantStatus = 'covered' | 'partial' | 'gap' | 'untested'

export interface ProcessVariant {
  id: string
  name: string
  process: string
  processId: string
  frequency: number
  avgDuration: string
  conformance: number
  testCoverage: number
  steps: number
  status: ProcessVariantStatus
}

export const PROCESS_VARIANTS: ProcessVariant[] = [
  {
    id: 'VAR-001',
    name: 'Standard Sales Order',
    process: 'Order to Cash',
    processId: 'otc',
    frequency: 4521,
    avgDuration: '4.2 days',
    conformance: 94,
    testCoverage: 100,
    steps: 8,
    status: 'covered',
  },
  {
    id: 'VAR-002',
    name: 'Rush Order Processing',
    process: 'Order to Cash',
    processId: 'otc',
    frequency: 892,
    avgDuration: '3.1 days',
    conformance: 88,
    testCoverage: 85,
    steps: 7,
    status: 'partial',
  },
  {
    id: 'VAR-003',
    name: 'Credit Block Override',
    process: 'Order to Cash',
    processId: 'otc',
    frequency: 456,
    avgDuration: '7.8 days',
    conformance: 72,
    testCoverage: 0,
    steps: 12,
    status: 'gap',
  },
  {
    id: 'VAR-004',
    name: 'Return with Credit Memo',
    process: 'Order to Cash',
    processId: 'otc',
    frequency: 234,
    avgDuration: '6.1 days',
    conformance: 81,
    testCoverage: 45,
    steps: 14,
    status: 'partial',
  },
  {
    id: 'VAR-005',
    name: 'Standard PO Creation',
    process: 'Procure to Pay',
    processId: 'ptp',
    frequency: 3245,
    avgDuration: '5.5 days',
    conformance: 91,
    testCoverage: 100,
    steps: 10,
    status: 'covered',
  },
  {
    id: 'VAR-006',
    name: 'Framework Order Release',
    process: 'Procure to Pay',
    processId: 'ptp',
    frequency: 567,
    avgDuration: '2.1 days',
    conformance: 78,
    testCoverage: 75,
    steps: 5,
    status: 'partial',
  },
  {
    id: 'VAR-007',
    name: 'Direct Material Receipt',
    process: 'Procure to Pay',
    processId: 'ptp',
    frequency: 890,
    avgDuration: '1.8 days',
    conformance: 85,
    testCoverage: 90,
    steps: 6,
    status: 'covered',
  },
  {
    id: 'VAR-008',
    name: 'Non-PO Invoice',
    process: 'Procure to Pay',
    processId: 'ptp',
    frequency: 312,
    avgDuration: '3.4 days',
    conformance: 68,
    testCoverage: 0,
    steps: 9,
    status: 'gap',
  },
  {
    id: 'VAR-009',
    name: 'Journal Entry Posting',
    process: 'Record to Report',
    processId: 'rtr',
    frequency: 2100,
    avgDuration: '1.2 days',
    conformance: 96,
    testCoverage: 100,
    steps: 4,
    status: 'covered',
  },
  {
    id: 'VAR-010',
    name: 'Accrual Reversal',
    process: 'Record to Report',
    processId: 'rtr',
    frequency: 445,
    avgDuration: '0.8 days',
    conformance: 74,
    testCoverage: 0,
    steps: 3,
    status: 'untested',
  },
  {
    id: 'VAR-011',
    name: 'Intercompany Transfer',
    process: 'Record to Report',
    processId: 'rtr',
    frequency: 678,
    avgDuration: '5.2 days',
    conformance: 82,
    testCoverage: 60,
    steps: 15,
    status: 'partial',
  },
  {
    id: 'VAR-012',
    name: 'Production Order Release',
    process: 'Plan to Produce',
    processId: 'ptpr',
    frequency: 1120,
    avgDuration: '2.8 days',
    conformance: 89,
    testCoverage: 95,
    steps: 9,
    status: 'covered',
  },
  {
    id: 'VAR-013',
    name: 'Rush Delivery Processing',
    process: 'Order to Cash',
    processId: 'otc',
    frequency: 678,
    avgDuration: '2.4 days',
    conformance: 86,
    testCoverage: 72,
    steps: 9,
    status: 'partial',
  },
  {
    id: 'VAR-014',
    name: 'Consignment Settlement',
    process: 'Order to Cash',
    processId: 'otc',
    frequency: 234,
    avgDuration: '5.6 days',
    conformance: 79,
    testCoverage: 55,
    steps: 11,
    status: 'partial',
  },
  {
    id: 'VAR-015',
    name: 'Subcontracting PO',
    process: 'Procure to Pay',
    processId: 'ptp',
    frequency: 445,
    avgDuration: '4.1 days',
    conformance: 83,
    testCoverage: 80,
    steps: 13,
    status: 'covered',
  },
  {
    id: 'VAR-016',
    name: 'Service Entry Sheet',
    process: 'Procure to Pay',
    processId: 'ptp',
    frequency: 312,
    avgDuration: '3.8 days',
    conformance: 77,
    testCoverage: 40,
    steps: 8,
    status: 'gap',
  },
  {
    id: 'VAR-017',
    name: 'Bank Reconciliation',
    process: 'Record to Report',
    processId: 'rtr',
    frequency: 890,
    avgDuration: '1.5 days',
    conformance: 92,
    testCoverage: 88,
    steps: 6,
    status: 'covered',
  },
  {
    id: 'VAR-018',
    name: 'Fixed Asset Retirement',
    process: 'Record to Report',
    processId: 'rtr',
    frequency: 156,
    avgDuration: '2.2 days',
    conformance: 71,
    testCoverage: 0,
    steps: 7,
    status: 'untested',
  },
  {
    id: 'VAR-019',
    name: 'MRP Run Processing',
    process: 'Plan to Produce',
    processId: 'ptpr',
    frequency: 520,
    avgDuration: '3.5 days',
    conformance: 88,
    testCoverage: 82,
    steps: 10,
    status: 'partial',
  },
  {
    id: 'VAR-020',
    name: 'Capacity Leveling',
    process: 'Plan to Produce',
    processId: 'ptpr',
    frequency: 198,
    avgDuration: '4.0 days',
    conformance: 75,
    testCoverage: 65,
    steps: 8,
    status: 'partial',
  },
]

export const PROCESS_GROUPS = [
  { id: 'otc', name: 'Order to Cash', module: 'SD' },
  { id: 'ptp', name: 'Procure to Pay', module: 'MM' },
  { id: 'rtr', name: 'Record to Report', module: 'FI' },
  { id: 'ptpr', name: 'Plan to Produce', module: 'PP' },
] as const

export type VariantStepCoverage = 'covered' | 'partial' | 'gap' | 'untested'

export interface VariantProcessStep {
  id: string
  order: number
  name: string
  tcode: string
  avgDuration: string
  coverageState: VariantStepCoverage
  linkedTest?: string
}

export interface VariantLinkedTest {
  id: string
  name: string
  state: 'passing' | 'failing' | 'healing'
  lastRun?: string
}

export interface VariantRecommendation {
  title: string
  detail: string
  priority: 'high' | 'medium' | 'low'
  suggestionId?: string
}

export interface VariantDetail extends ProcessVariant {
  module: string
  description: string
  lastObserved: string
  bottleneck?: string
  processSteps: VariantProcessStep[]
  linkedTests: VariantLinkedTest[]
  recommendations: VariantRecommendation[]
}

const PROCESS_STEP_TEMPLATES: Record<
  string,
  { name: string; tcode: string; avgDuration: string }[]
> = {
  otc: [
    { name: 'Create Sales Order', tcode: 'VA01', avgDuration: '2.1h' },
    { name: 'Credit Check', tcode: 'VKM1', avgDuration: '0.4h' },
    { name: 'Availability Check', tcode: 'CO09', avgDuration: '0.3h' },
    { name: 'Create Delivery', tcode: 'VL01N', avgDuration: '1.2h' },
    { name: 'Pick & Pack', tcode: 'LT03', avgDuration: '0.8h' },
    { name: 'Post Goods Issue', tcode: 'VL02N', avgDuration: '0.5h' },
    { name: 'Create Invoice', tcode: 'VF01', avgDuration: '0.6h' },
    { name: 'Payment Receipt', tcode: 'F-28', avgDuration: '0.4h' },
    { name: 'Credit Memo', tcode: 'VF04', avgDuration: '0.5h' },
    { name: 'Return Order', tcode: 'VA01', avgDuration: '1.0h' },
    { name: 'Return Delivery', tcode: 'VL01N', avgDuration: '0.7h' },
    { name: 'Consignment Issue', tcode: 'MB1C', avgDuration: '0.4h' },
  ],
  ptp: [
    { name: 'Create Purchase Requisition', tcode: 'ME51N', avgDuration: '0.5h' },
    { name: 'Create Purchase Order', tcode: 'ME21N', avgDuration: '1.1h' },
    { name: 'PO Release', tcode: 'ME28', avgDuration: '0.3h' },
    { name: 'Goods Receipt', tcode: 'MIGO', avgDuration: '0.6h' },
    { name: 'Invoice Verification', tcode: 'MIRO', avgDuration: '0.8h' },
    { name: 'Payment Run', tcode: 'F110', avgDuration: '0.4h' },
    { name: 'Service Entry', tcode: 'ML81N', avgDuration: '0.7h' },
    { name: 'Subcontracting', tcode: 'ME21N', avgDuration: '1.0h' },
    { name: 'Framework Release', tcode: 'ME29N', avgDuration: '0.5h' },
    { name: 'Vendor Block Check', tcode: 'XK03', avgDuration: '0.2h' },
    { name: 'Non-PO Invoice', tcode: 'FB60', avgDuration: '0.9h' },
    { name: 'GR/IR Clearing', tcode: 'F.13', avgDuration: '0.6h' },
    { name: 'SES Approval', tcode: 'ML85', avgDuration: '0.4h' },
  ],
  rtr: [
    { name: 'Journal Entry', tcode: 'FB50', avgDuration: '0.3h' },
    { name: 'Document Posting', tcode: 'F-02', avgDuration: '0.2h' },
    { name: 'Accrual Posting', tcode: 'FBS1', avgDuration: '0.4h' },
    { name: 'Accrual Reversal', tcode: 'F.81', avgDuration: '0.3h' },
    { name: 'IC Reconciliation', tcode: 'F.05', avgDuration: '1.2h' },
    { name: 'Bank Reconciliation', tcode: 'FF67', avgDuration: '0.8h' },
    { name: 'Asset Retirement', tcode: 'ABAVN', avgDuration: '0.6h' },
    { name: 'Period Close', tcode: 'F.16', avgDuration: '1.5h' },
    { name: 'Cost Allocation', tcode: 'KSU5', avgDuration: '0.5h' },
    { name: 'Tax Reporting', tcode: 'S_ALR_87012357', avgDuration: '0.7h' },
    { name: 'GR/IR Analysis', tcode: 'F.19', avgDuration: '0.4h' },
    { name: 'Balance Confirm', tcode: 'F.17', avgDuration: '0.5h' },
    { name: 'Dunning Run', tcode: 'F150', avgDuration: '0.3h' },
    { name: 'Payment Proposal', tcode: 'F110', avgDuration: '0.4h' },
    { name: 'Clearing Account', tcode: 'F.13', avgDuration: '0.3h' },
  ],
  ptpr: [
    { name: 'MRP Run', tcode: 'MD01', avgDuration: '1.5h' },
    { name: 'Planned Order', tcode: 'MD04', avgDuration: '0.4h' },
    { name: 'Production Order', tcode: 'CO01', avgDuration: '0.8h' },
    { name: 'Order Release', tcode: 'CO02', avgDuration: '0.3h' },
    { name: 'Material Staging', tcode: 'MF60', avgDuration: '0.6h' },
    { name: 'Confirmation', tcode: 'CO11N', avgDuration: '0.5h' },
    { name: 'Capacity Leveling', tcode: 'CM21', avgDuration: '1.0h' },
    { name: 'Goods Receipt Prod', tcode: 'MIGO', avgDuration: '0.4h' },
    { name: 'Order Settlement', tcode: 'KO88', avgDuration: '0.5h' },
    { name: 'BOM Explosion', tcode: 'CS11', avgDuration: '0.3h' },
  ],
}

const VARIANT_DESCRIPTIONS: Record<string, string> = {
  'VAR-001': 'Standard end-to-end sales order flow from order entry through billing.',
  'VAR-003': 'High-frequency path where credit blocks are overridden for rush or key-account orders.',
  'VAR-008': 'Invoice posting without reference PO — common in utilities and services spend.',
  'VAR-010': 'Month-end accrual reversal cycle with manual journal adjustments.',
}

const VARIANT_BOTTLENECKS: Partial<Record<string, string>> = {
  'VAR-003': 'Credit block override (VKM1) — avg 2.4 day wait',
  'VAR-004': 'Return delivery creation — 18% conformance deviation',
  'VAR-008': 'Invoice verification without PO — 31% error rate',
  'VAR-010': 'Accrual reversal timing — off-cycle postings',
  'VAR-016': 'Service entry approval — 3 approver handoffs',
  'VAR-018': 'Asset retirement posting — untested depreciation run',
}

function stepCoverageStates(count: number, coveragePercent: number): VariantStepCoverage[] {
  if (coveragePercent >= 100) return Array(count).fill('covered')
  if (coveragePercent === 0) return Array(count).fill('gap')

  const covered = Math.floor((count * coveragePercent) / 100)
  return Array.from({ length: count }, (_, i) => {
    if (i < covered) return 'covered'
    if (i === covered) return 'partial'
    return 'gap'
  })
}

function buildProcessSteps(variant: ProcessVariant): VariantProcessStep[] {
  const template = PROCESS_STEP_TEMPLATES[variant.processId] ?? PROCESS_STEP_TEMPLATES.otc
  const states = stepCoverageStates(variant.steps, variant.testCoverage)

  return Array.from({ length: variant.steps }, (_, i) => {
    const tpl = template[i % template.length]
    const state = states[i]
    return {
      id: `${variant.id}-S${i + 1}`,
      order: i + 1,
      name: tpl.name,
      tcode: tpl.tcode,
      avgDuration: tpl.avgDuration,
      coverageState: state,
      linkedTest:
        state === 'covered'
          ? `TC_${variant.processId.toUpperCase()}_${String(i + 1).padStart(2, '0')}`
          : undefined,
    }
  })
}

function buildLinkedTests(variant: ProcessVariant): VariantLinkedTest[] {
  if (variant.testCoverage === 0) return []

  const tests: VariantLinkedTest[] = [
    {
      id: `TC_${variant.id}_REG`,
      name: `${variant.name} — Regression`,
      state: variant.status === 'partial' ? 'healing' : 'passing',
      lastRun: '2026-05-05T08:00:00Z',
    },
  ]

  if (variant.testCoverage >= 75) {
    tests.push({
      id: `TC_${variant.id}_SMOKE`,
      name: `${variant.name} — Smoke`,
      state: 'passing',
      lastRun: '2026-05-06T06:30:00Z',
    })
  }

  if (variant.status === 'partial' || variant.status === 'gap') {
    tests.push({
      id: `TC_${variant.id}_NEG`,
      name: `${variant.name} — Negative path`,
      state: 'failing',
      lastRun: '2026-05-04T14:00:00Z',
    })
  }

  return tests
}

function buildRecommendations(variant: ProcessVariant): VariantRecommendation[] {
  const recs: VariantRecommendation[] = []

  if (variant.testCoverage < 100) {
    const gapSteps = buildProcessSteps(variant).filter((s) => s.coverageState === 'gap')
    recs.push({
      title: `Add tests for ${gapSteps.length} uncovered step${gapSteps.length !== 1 ? 's' : ''}`,
      detail: `Focus on ${gapSteps.slice(0, 2).map((s) => s.tcode).join(', ')} to close the coverage gap.`,
      priority: variant.testCoverage === 0 ? 'high' : 'medium',
      suggestionId: variant.id === 'VAR-003' ? 'SUG-001' : undefined,
    })
  }

  if (variant.conformance < 85) {
    recs.push({
      title: 'Investigate conformance deviation',
      detail: `Conformance at ${variant.conformance}% is below the 85% target. Review production logs for skipped or reordered steps.`,
      priority: variant.conformance < 75 ? 'high' : 'medium',
    })
  }

  if (variant.frequency > 500 && variant.testCoverage < 80) {
    recs.push({
      title: 'Prioritize high-frequency path',
      detail: `${variant.frequency.toLocaleString()} monthly occurrences warrant P1 regression placement.`,
      priority: 'high',
    })
  }

  if (recs.length === 0) {
    recs.push({
      title: 'Maintain regression coverage',
      detail: 'Coverage is complete. Keep tests in the active regression suite and monitor for process drift.',
      priority: 'low',
    })
  }

  return recs
}

export function getVariantById(id: string): ProcessVariant | undefined {
  return PROCESS_VARIANTS.find((v) => v.id === id)
}

export function getVariantDetail(id: string): VariantDetail | undefined {
  const variant = getVariantById(id)
  if (!variant) return undefined

  const group = PROCESS_GROUPS.find((g) => g.id === variant.processId)

  return {
    ...variant,
    module: group?.module ?? '—',
    description:
      VARIANT_DESCRIPTIONS[variant.id] ??
      `Discovered ${variant.name.toLowerCase()} path within ${variant.process}, mined from production event logs.`,
    lastObserved: '2026-05-06T04:00:00Z',
    bottleneck: VARIANT_BOTTLENECKS[variant.id],
    processSteps: buildProcessSteps(variant),
    linkedTests: buildLinkedTests(variant),
    recommendations: buildRecommendations(variant),
  }
}

// ============================================================================
// AI SUGGESTIONS
// ============================================================================

export type SuggestionType = 'coverage_gap' | 'optimization' | 'risk' | 'performance'
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected'
export type SuggestionPriority = 'high' | 'medium' | 'low'

export interface AISuggestion {
  id: string
  title: string
  process: string
  processId: string
  type: SuggestionType
  priority: SuggestionPriority
  confidence: number
  status: SuggestionStatus
  impact: string
  createdAt: string
  summary: string
  rationale: string
  agent: string
  estimatedEffort: string
  relatedTcCodes: string[]
  affectedVariants: {
    id: string
    name: string
    frequency: number
    conformance: number
    testCoverage: number
  }[]
  recommendedActions: { step: number; title: string; detail: string }[]
  evidenceSignals: { label: string; value: string }[]
}

export const AI_SUGGESTIONS: AISuggestion[] = [
  {
    id: 'SUG-001',
    title: 'Add test for credit check bypass scenario',
    process: 'Order to Cash',
    processId: 'otc',
    type: 'coverage_gap',
    priority: 'high',
    confidence: 92,
    status: 'pending',
    impact: 'Would cover 3 additional variants',
    createdAt: '2026-05-06T10:30:00Z',
    summary:
      'Process mining detected a high-frequency credit block override path with no linked automated test coverage.',
    rationale:
      'Variant VAR-003 (Credit Block Override) occurs 456 times per month with 72% conformance but 0% test coverage. Production users frequently bypass credit checks for rush orders — this path is not exercised by any scenario in SUITE_OTC_REGRESSION.',
    agent: 'Process Mining Agent',
    estimatedEffort: '2–3 hours',
    relatedTcCodes: ['VA01', 'VKM1', 'VKM3', 'FD32'],
    affectedVariants: [
      { id: 'VAR-003', name: 'Credit Block Override', frequency: 456, conformance: 72, testCoverage: 0 },
      { id: 'VAR-002', name: 'Rush Order Processing', frequency: 892, conformance: 88, testCoverage: 85 },
      { id: 'VAR-004', name: 'Return with Credit Memo', frequency: 234, conformance: 81, testCoverage: 45 },
    ],
    recommendedActions: [
      {
        step: 1,
        title: 'Create test scenario',
        detail: 'Add SC_OTC_CREDIT_BYPASS covering VA01 order entry with VKM1 credit block and override authorization.',
      },
      {
        step: 2,
        title: 'Link to scope item',
        detail: 'Map to BP scope BD2 — Sell from Stock with Credit for coverage matrix tracking.',
      },
      {
        step: 3,
        title: 'Schedule in regression',
        detail: 'Add to SUITE_OTC_REGRESSION with priority P1 for QAS gate before next transport.',
      },
    ],
    evidenceSignals: [
      { label: 'Monthly occurrences', value: '456' },
      { label: 'Conformance gap', value: '28% below target' },
      { label: 'Untested steps', value: '4 of 12' },
      { label: 'Last production incident', value: '2026-03-14' },
    ],
  },
  {
    id: 'SUG-002',
    title: 'Consolidate duplicate PO approval tests',
    process: 'Procure to Pay',
    processId: 'ptp',
    type: 'optimization',
    priority: 'medium',
    confidence: 87,
    status: 'accepted',
    impact: 'Reduce test suite by 15%',
    createdAt: '2026-05-05T14:20:00Z',
    summary:
      'Three test cases exercise the same ME28 release workflow with minor data variations — safe to merge into a parameterized scenario.',
    rationale:
      'TC_PTP_PO_APPROVE_A, TC_PTP_PO_APPROVE_B, and TC_PTP_PO_APPROVE_LIMIT share 94% identical IR steps. Consolidation reduces runner time without reducing coverage depth.',
    agent: 'Test Optimization Agent',
    estimatedEffort: '1 hour',
    relatedTcCodes: ['ME21N', 'ME28', 'ME29N'],
    affectedVariants: [
      { id: 'VAR-005', name: 'Standard PO Creation', frequency: 3245, conformance: 91, testCoverage: 100 },
      { id: 'VAR-006', name: 'Framework Order Release', frequency: 567, conformance: 78, testCoverage: 75 },
    ],
    recommendedActions: [
      {
        step: 1,
        title: 'Merge test IRs',
        detail: 'Combine three approval tests into TC_PTP_PO_APPROVE_PARAM with data-driven release strategy variants.',
      },
      {
        step: 2,
        title: 'Retire duplicates',
        detail: 'Archive TC_PTP_PO_APPROVE_A/B after one successful regression pass on merged case.',
      },
    ],
    evidenceSignals: [
      { label: 'Duplicate step overlap', value: '94%' },
      { label: 'Suite time saved', value: '~18 min/run' },
      { label: 'Cases to merge', value: '3' },
    ],
  },
  {
    id: 'SUG-003',
    title: 'Missing error handling for vendor block',
    process: 'Procure to Pay',
    processId: 'ptp',
    type: 'risk',
    priority: 'high',
    confidence: 95,
    status: 'pending',
    impact: 'Critical path not tested',
    createdAt: '2026-05-06T09:15:00Z',
    summary:
      'Vendor master block (payment block) path is exercised in production but has no negative test for PO creation failure.',
    rationale:
      'When LFA1-SPERR is set, ME21N should reject PO creation. Mining logs show 89 blocked-vendor attempts/month; no test asserts the expected error message or audit trail.',
    agent: 'Risk Analysis Agent',
    estimatedEffort: '1–2 hours',
    relatedTcCodes: ['ME21N', 'XK03', 'FK03'],
    affectedVariants: [
      { id: 'VAR-007', name: 'Direct Material Receipt', frequency: 890, conformance: 85, testCoverage: 90 },
    ],
    recommendedActions: [
      {
        step: 1,
        title: 'Add negative test case',
        detail: 'Create TC_PTP_VENDOR_BLOCK_NEG asserting ME21N error EMMK on blocked vendor.',
      },
      {
        step: 2,
        title: 'Verify audit log',
        detail: 'Assert change document entry in CDHDR for blocked PO attempt.',
      },
    ],
    evidenceSignals: [
      { label: 'Blocked vendor attempts/mo', value: '89' },
      { label: 'Risk severity', value: 'Critical' },
      { label: 'Regulatory mapping', value: 'SOX PTP-04' },
    ],
  },
  {
    id: 'SUG-004',
    title: 'Add negative test for invalid GL account',
    process: 'Record to Report',
    processId: 'rtr',
    type: 'coverage_gap',
    priority: 'low',
    confidence: 78,
    status: 'rejected',
    impact: 'Edge case coverage',
    createdAt: '2026-05-04T11:00:00Z',
    summary:
      'Low-frequency invalid GL posting path identified — rejected by QA lead as out of current sprint scope.',
    rationale:
      'FB50 with deleted GL account occurs ~12 times/month. Coverage gap exists but business deemed low priority for Star Cement cutover window.',
    agent: 'Process Mining Agent',
    estimatedEffort: '45 min',
    relatedTcCodes: ['FB50', 'FS00'],
    affectedVariants: [
      { id: 'VAR-018', name: 'Fixed Asset Retirement', frequency: 156, conformance: 71, testCoverage: 0 },
    ],
    recommendedActions: [
      {
        step: 1,
        title: 'Defer to hypercare',
        detail: 'Re-queue after go-live if incident rate exceeds threshold.',
      },
    ],
    evidenceSignals: [
      { label: 'Monthly occurrences', value: '12' },
      { label: 'Rejection reason', value: 'Sprint scope' },
    ],
  },
  {
    id: 'SUG-005',
    title: 'Optimize material master data loading',
    process: 'Plan to Produce',
    processId: 'ptpr',
    type: 'performance',
    priority: 'medium',
    confidence: 84,
    status: 'pending',
    impact: 'Reduce test execution time by 20%',
    createdAt: '2026-05-06T16:45:00Z',
    summary:
      'Test fixture reload for material master runs on every case — switch to shared snapshot for MRP suite.',
    rationale:
      'SUITE_MRP_REGRESSION reloads 2,400 material records per case. Shared fixture MAT_SNAPSHOT_QAS cut execution time by 22% in pilot run.',
    agent: 'Performance Agent',
    estimatedEffort: '3 hours',
    relatedTcCodes: ['MM01', 'MD04', 'MD05'],
    affectedVariants: [
      { id: 'VAR-019', name: 'MRP Run Processing', frequency: 520, conformance: 88, testCoverage: 82 },
      { id: 'VAR-020', name: 'Capacity Leveling', frequency: 198, conformance: 75, testCoverage: 65 },
    ],
    recommendedActions: [
      {
        step: 1,
        title: 'Create shared fixture',
        detail: 'Promote MAT_SNAPSHOT_QAS from pilot to suite-level beforeEach hook.',
      },
      {
        step: 2,
        title: 'Validate isolation',
        detail: 'Run parallel execution smoke test to confirm no cross-case contamination.',
      },
    ],
    evidenceSignals: [
      { label: 'Time saved per run', value: '~22%' },
      { label: 'Records per reload', value: '2,400' },
      { label: 'Pilot pass rate', value: '100%' },
    ],
  },
]

export function getSuggestionById(id: string): AISuggestion | undefined {
  return AI_SUGGESTIONS.find((s) => s.id === id)
}
