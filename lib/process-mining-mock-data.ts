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
]

export const PROCESS_GROUPS = [
  { id: 'otc', name: 'Order to Cash', module: 'SD' },
  { id: 'ptp', name: 'Procure to Pay', module: 'MM' },
  { id: 'rtr', name: 'Record to Report', module: 'FI' },
  { id: 'ptpr', name: 'Plan to Produce', module: 'PP' },
] as const
