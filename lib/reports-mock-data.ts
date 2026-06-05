// Reports & Analytics Mock Data

// ============================================================================
// TEST PACK COVERAGE (9.1)
// ============================================================================

export interface CoverageCell {
  module: string
  process: string
  testCases: number
  scopeItems: number
  coverage: number // percentage
  state: 'high' | 'medium' | 'low' | 'out-of-scope'
}

export const MOCK_COVERAGE_KPIS = {
  totalSuites: 8,
  totalScenarios: 47,
  totalCases: 234,
  modulesCovered: { covered: 10, total: 10 },
  processesCovered: { covered: 5, total: 5 },
  zobjectCoverage: 84,
}

export const MOCK_COVERAGE_MATRIX: CoverageCell[] = [
  // SD Module
  { module: 'SD', process: 'OTC', testCases: 45, scopeItems: 12, coverage: 92, state: 'high' },
  { module: 'SD', process: 'PTP', testCases: 8, scopeItems: 3, coverage: 75, state: 'medium' },
  { module: 'SD', process: 'RTR', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'SD', process: 'HTH', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'SD', process: 'STP', testCases: 12, scopeItems: 4, coverage: 85, state: 'high' },
  // MM Module
  { module: 'MM', process: 'OTC', testCases: 5, scopeItems: 2, coverage: 60, state: 'medium' },
  { module: 'MM', process: 'PTP', testCases: 38, scopeItems: 10, coverage: 88, state: 'high' },
  { module: 'MM', process: 'RTR', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'MM', process: 'HTH', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'MM', process: 'STP', testCases: 6, scopeItems: 2, coverage: 70, state: 'medium' },
  // FI Module
  { module: 'FI', process: 'OTC', testCases: 12, scopeItems: 4, coverage: 82, state: 'high' },
  { module: 'FI', process: 'PTP', testCases: 15, scopeItems: 5, coverage: 78, state: 'medium' },
  { module: 'FI', process: 'RTR', testCases: 42, scopeItems: 14, coverage: 91, state: 'high' },
  { module: 'FI', process: 'HTH', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'FI', process: 'STP', testCases: 8, scopeItems: 3, coverage: 72, state: 'medium' },
  // CO Module
  { module: 'CO', process: 'OTC', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'CO', process: 'PTP', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'CO', process: 'RTR', testCases: 18, scopeItems: 6, coverage: 85, state: 'high' },
  { module: 'CO', process: 'HTH', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'CO', process: 'STP', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  // PP Module
  { module: 'PP', process: 'OTC', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'PP', process: 'PTP', testCases: 4, scopeItems: 2, coverage: 45, state: 'low' },
  { module: 'PP', process: 'RTR', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'PP', process: 'HTH', testCases: 0, scopeItems: 0, coverage: 0, state: 'out-of-scope' },
  { module: 'PP', process: 'STP', testCases: 21, scopeItems: 8, coverage: 82, state: 'high' },
]

export const MOCK_UNCOVERED_ZOBJECTS = [
  { id: 'z_1', name: 'Z_PRICING_CUSTOM', type: 'Function Module', riskScore: 'high', usageCount: 45 },
  { id: 'z_2', name: 'ZSALES_ORDER_ENH', type: 'Enhancement', riskScore: 'high', usageCount: 38 },
  { id: 'z_3', name: 'Z_TAX_CALC_OVERRIDE', type: 'Function Module', riskScore: 'medium', usageCount: 22 },
  { id: 'z_4', name: 'ZCUSTOMER_REPORT', type: 'Report', riskScore: 'low', usageCount: 12 },
]

// ============================================================================
// PASS RATE TRENDS (9.2)
// ============================================================================

export interface PassRateDataPoint {
  date: string
  suite: string
  passRate: number
  healingRate?: number
  mtth?: number
  defectRate?: number
}

export const MOCK_PASS_RATE_DATA: PassRateDataPoint[] = [
  // Star Cement Cutover Suite
  { date: '2026-04-08', suite: 'Star Cement Cutover', passRate: 92, healingRate: 8, mtth: 12, defectRate: 3 },
  { date: '2026-04-15', suite: 'Star Cement Cutover', passRate: 88, healingRate: 12, mtth: 15, defectRate: 5 },
  { date: '2026-04-22', suite: 'Star Cement Cutover', passRate: 91, healingRate: 9, mtth: 11, defectRate: 4 },
  { date: '2026-04-29', suite: 'Star Cement Cutover', passRate: 94, healingRate: 6, mtth: 9, defectRate: 2 },
  { date: '2026-05-06', suite: 'Star Cement Cutover', passRate: 96, healingRate: 4, mtth: 8, defectRate: 1 },
  // SD Core Regression
  { date: '2026-04-08', suite: 'SD Core Regression', passRate: 89, healingRate: 11, mtth: 14, defectRate: 4 },
  { date: '2026-04-15', suite: 'SD Core Regression', passRate: 85, healingRate: 15, mtth: 18, defectRate: 6 },
  { date: '2026-04-22', suite: 'SD Core Regression', passRate: 90, healingRate: 10, mtth: 12, defectRate: 3 },
  { date: '2026-04-29', suite: 'SD Core Regression', passRate: 93, healingRate: 7, mtth: 10, defectRate: 2 },
  { date: '2026-05-06', suite: 'SD Core Regression', passRate: 91, healingRate: 9, mtth: 11, defectRate: 3 },
  // FI Core Regression
  { date: '2026-04-08', suite: 'FI Core Regression', passRate: 94, healingRate: 6, mtth: 10, defectRate: 2 },
  { date: '2026-04-15', suite: 'FI Core Regression', passRate: 92, healingRate: 8, mtth: 12, defectRate: 3 },
  { date: '2026-04-22', suite: 'FI Core Regression', passRate: 88, healingRate: 12, mtth: 16, defectRate: 5 },
  { date: '2026-04-29', suite: 'FI Core Regression', passRate: 95, healingRate: 5, mtth: 8, defectRate: 2 },
  { date: '2026-05-06', suite: 'FI Core Regression', passRate: 97, healingRate: 3, mtth: 6, defectRate: 1 },
  // MM Regression
  { date: '2026-04-08', suite: 'MM Regression', passRate: 87, healingRate: 13, mtth: 16, defectRate: 5 },
  { date: '2026-04-15', suite: 'MM Regression', passRate: 84, healingRate: 16, mtth: 20, defectRate: 7 },
  { date: '2026-04-22', suite: 'MM Regression', passRate: 89, healingRate: 11, mtth: 14, defectRate: 4 },
  { date: '2026-04-29', suite: 'MM Regression', passRate: 91, healingRate: 9, mtth: 11, defectRate: 3 },
  { date: '2026-05-06', suite: 'MM Regression', passRate: 88, healingRate: 12, mtth: 15, defectRate: 4 },
  // PP Regression
  { date: '2026-04-08', suite: 'PP Regression', passRate: 91, healingRate: 9, mtth: 11, defectRate: 3 },
  { date: '2026-04-15', suite: 'PP Regression', passRate: 93, healingRate: 7, mtth: 9, defectRate: 2 },
  { date: '2026-04-22', suite: 'PP Regression', passRate: 90, healingRate: 10, mtth: 13, defectRate: 4 },
  { date: '2026-04-29', suite: 'PP Regression', passRate: 94, healingRate: 6, mtth: 8, defectRate: 2 },
  { date: '2026-05-06', suite: 'PP Regression', passRate: 95, healingRate: 5, mtth: 7, defectRate: 1 },
]

export const MOCK_TOP_FAILING_SUITES = [
  { suite: 'MM Regression', last7dPassRate: 88, delta: -3, trend: 'down' as const },
  { suite: 'SD Core Regression', last7dPassRate: 91, delta: -2, trend: 'down' as const },
  { suite: 'FI Core Regression', last7dPassRate: 97, delta: +2, trend: 'up' as const },
]

// ============================================================================
// HEALING EFFECTIVENESS (9.3)
// ============================================================================

export const MOCK_HEALING_KPIS = {
  healingRate: 87,
  mtth: 12,
  repairedSuccessfully: 342,
  repairFailed: 48,
  patternsPromoted: 23,
  patternsActive: 45,
}

export interface FailureClassData {
  failureClass: string
  frequency: number
  percentage: number
  repaired: number
  failed: number
  deferred: number
  healRate: number
}

export const MOCK_FAILURE_CLASS_DATA: FailureClassData[] = [
  { failureClass: 'extra_modal', frequency: 172, percentage: 43, repaired: 156, failed: 8, deferred: 8, healRate: 91 },
  { failureClass: 'field_renamed', frequency: 88, percentage: 22, repaired: 77, failed: 6, deferred: 5, healRate: 87 },
  { failureClass: 'locator_drift', frequency: 72, percentage: 18, repaired: 55, failed: 10, deferred: 7, healRate: 76 },
  { failureClass: 'deprecated_FM_called', frequency: 32, percentage: 8, repaired: 19, failed: 8, deferred: 5, healRate: 60 },
  { failureClass: 'unknown', frequency: 36, percentage: 9, repaired: 0, failed: 0, deferred: 36, healRate: 0 },
]

export const MOCK_TOP_HEALING_PATTERNS = [
  { id: 'hp_1', signature: 'dismiss_modal_before_field_input', occurrences: 45, successRate: 98, lastSeen: '2026-05-07T10:30:00+05:30', promoted: true },
  { id: 'hp_2', signature: 'wait_for_element_visible_before_click', occurrences: 38, successRate: 94, lastSeen: '2026-05-06T16:45:00+05:30', promoted: true },
  { id: 'hp_3', signature: 'retry_with_fallback_selector', occurrences: 32, successRate: 89, lastSeen: '2026-05-07T08:15:00+05:30', promoted: false },
  { id: 'hp_4', signature: 'scroll_into_view_before_action', occurrences: 28, successRate: 92, lastSeen: '2026-05-05T14:00:00+05:30', promoted: true },
  { id: 'hp_5', signature: 'handle_async_popup', occurrences: 22, successRate: 85, lastSeen: '2026-05-06T11:30:00+05:30', promoted: false },
]

// ============================================================================
// RUNNER UTILIZATION (9.4)
// ============================================================================

export interface RunnerPool {
  id: string
  name: string
  currentUtilization: number
  capacity: number
  activeWorkers: number
  queueDepth: number
}

export const MOCK_RUNNER_POOLS: RunnerPool[] = [
  { id: 'pool_1', name: 'Star Cement DEV', currentUtilization: 65, capacity: 20, activeWorkers: 13, queueDepth: 4 },
  { id: 'pool_2', name: 'Star Cement QAS', currentUtilization: 82, capacity: 30, activeWorkers: 25, queueDepth: 12 },
  { id: 'pool_3', name: 'Star Cement PROD', currentUtilization: 45, capacity: 15, activeWorkers: 7, queueDepth: 2 },
  { id: 'pool_4', name: 'Shared Regression', currentUtilization: 78, capacity: 50, activeWorkers: 39, queueDepth: 8 },
]

export interface HourlyUtilization {
  pool: string
  hour: number
  utilization: number
}

export const MOCK_HOURLY_UTILIZATION: HourlyUtilization[] = []
// Generate hourly utilization for each pool
const pools = ['Star Cement DEV', 'Star Cement QAS', 'Star Cement PROD', 'Shared Regression']
pools.forEach(pool => {
  for (let hour = 0; hour < 24; hour++) {
    // Create realistic utilization patterns - higher during business hours
    let baseUtil = pool === 'Star Cement QAS' ? 60 : pool === 'Shared Regression' ? 50 : 30
    if (hour >= 9 && hour <= 18) {
      baseUtil += 30
    } else if (hour >= 6 && hour <= 8 || hour >= 19 && hour <= 22) {
      baseUtil += 15
    }
    MOCK_HOURLY_UTILIZATION.push({
      pool,
      hour,
      utilization: Math.min(100, baseUtil + Math.floor(Math.random() * 20))
    })
  }
})

export const MOCK_CAPACITY_RECOMMENDATIONS = [
  { pool: 'Star Cement QAS', message: 'Peaks at 95% at 14:00 IST — consider auto-scale max increase to 60', severity: 'warning' as const },
  { pool: 'Shared Regression', message: 'Consistent high utilization 10:00-16:00 IST — schedule large suites off-peak', severity: 'info' as const },
]

// ============================================================================
// DEFECT AGING (9.5)
// ============================================================================

export const MOCK_DEFECT_AGING_KPIS = {
  meanTimeToTriage: 4.2,
  meanTimeToFix: 18.5,
  meanTimeToClose: 24.3,
  openOver7Days: 8,
  openOver30Days: 3,
}

export interface AgeBucketData {
  bucket: string
  critical: number
  high: number
  medium: number
  low: number
}

export const MOCK_AGE_BUCKET_DATA: AgeBucketData[] = [
  { bucket: '0-1d', critical: 1, high: 3, medium: 5, low: 8 },
  { bucket: '1-3d', critical: 0, high: 2, medium: 4, low: 6 },
  { bucket: '3-7d', critical: 1, high: 1, medium: 3, low: 4 },
  { bucket: '7-14d', critical: 0, high: 2, medium: 2, low: 2 },
  { bucket: '14-30d', critical: 1, high: 0, medium: 1, low: 1 },
  { bucket: '30+d', critical: 1, high: 1, medium: 0, low: 0 },
]

export const MOCK_OLDEST_DEFECTS = [
  { id: 'DEF-001', title: 'Tax calculation rounding error in VF01', severity: 'Critical', age: 45, assignee: 'J.Rao', lastActivity: '2026-04-28' },
  { id: 'DEF-012', title: 'Intercompany pricing inconsistency', severity: 'High', age: 32, assignee: 'M.Reddy', lastActivity: '2026-05-01' },
  { id: 'DEF-023', title: 'Credit limit check bypass scenario', severity: 'Critical', age: 28, assignee: 'P.Sharma', lastActivity: '2026-05-03' },
]

// ============================================================================
// MULTI-MIGRATION SCORECARD (9.6)
// ============================================================================

export interface MigrationScorecard {
  id: string
  name: string
  kind: string
  phase: string
  daysToCutover: number
  bpCoverage: number
  bpCoverageDelta: number
  siClosed: number
  siClosedDelta: number
  abapClosed: number
  abapClosedDelta: number
  passRate: number
  passRateDelta: number
  healingRate: number
  healingRateDelta: number
  openCriticalDefects: number
  readinessScore: number
  readinessScoreDelta: number
}

export const MOCK_MIGRATION_SCORECARDS: MigrationScorecard[] = [
  {
    id: 'mig_1',
    name: 'Star Cement S/4HANA',
    kind: 'Greenfield',
    phase: 'Realize',
    daysToCutover: 84,
    bpCoverage: 84,
    bpCoverageDelta: 3,
    siClosed: 76,
    siClosedDelta: 4,
    abapClosed: 82,
    abapClosedDelta: 5,
    passRate: 91,
    passRateDelta: 2,
    healingRate: 87,
    healingRateDelta: 1,
    openCriticalDefects: 2,
    readinessScore: 78,
    readinessScoreDelta: 4,
  },
  {
    id: 'mig_2',
    name: 'Vertex Industries',
    kind: 'System Conversion',
    phase: 'Deploy',
    daysToCutover: 42,
    bpCoverage: 92,
    bpCoverageDelta: 1,
    siClosed: 94,
    siClosedDelta: 2,
    abapClosed: 89,
    abapClosedDelta: 3,
    passRate: 94,
    passRateDelta: 1,
    healingRate: 91,
    healingRateDelta: 2,
    openCriticalDefects: 1,
    readinessScore: 88,
    readinessScoreDelta: 2,
  },
  {
    id: 'mig_3',
    name: 'Northwind Manufacturing',
    kind: 'Selective Data Transition',
    phase: 'Explore',
    daysToCutover: 156,
    bpCoverage: 45,
    bpCoverageDelta: 8,
    siClosed: 32,
    siClosedDelta: 12,
    abapClosed: 28,
    abapClosedDelta: 10,
    passRate: 78,
    passRateDelta: 5,
    healingRate: 72,
    healingRateDelta: 4,
    openCriticalDefects: 5,
    readinessScore: 42,
    readinessScoreDelta: 8,
  },
]

// ============================================================================
// SI BURNDOWN (9.7) & ABAP BURNDOWN (9.8)
// ============================================================================

export interface BurndownDataPoint {
  date: string
  actual: number
  ideal: number
  phase?: string
}

export const MOCK_SI_BURNDOWN: BurndownDataPoint[] = [
  { date: '2026-01-15', actual: 96, ideal: 96, phase: 'Discover' },
  { date: '2026-02-01', actual: 92, ideal: 88, phase: 'Discover' },
  { date: '2026-02-15', actual: 85, ideal: 80, phase: 'Prepare' },
  { date: '2026-03-01', actual: 78, ideal: 72, phase: 'Prepare' },
  { date: '2026-03-15', actual: 68, ideal: 64, phase: 'Explore' },
  { date: '2026-04-01', actual: 55, ideal: 56, phase: 'Explore' },
  { date: '2026-04-15', actual: 42, ideal: 48, phase: 'Realize' },
  { date: '2026-05-01', actual: 28, ideal: 40, phase: 'Realize' },
  { date: '2026-05-07', actual: 23, ideal: 36, phase: 'Realize' },
]

export const MOCK_ABAP_BURNDOWN: BurndownDataPoint[] = [
  { date: '2026-01-15', actual: 503, ideal: 503, phase: 'Discover' },
  { date: '2026-02-01', actual: 485, ideal: 460, phase: 'Discover' },
  { date: '2026-02-15', actual: 445, ideal: 420, phase: 'Prepare' },
  { date: '2026-03-01', actual: 398, ideal: 380, phase: 'Prepare' },
  { date: '2026-03-15', actual: 342, ideal: 340, phase: 'Explore' },
  { date: '2026-04-01', actual: 278, ideal: 300, phase: 'Explore' },
  { date: '2026-04-15', actual: 198, ideal: 260, phase: 'Realize' },
  { date: '2026-05-01', actual: 118, ideal: 220, phase: 'Realize' },
  { date: '2026-05-07', actual: 91, ideal: 200, phase: 'Realize' },
]

// ============================================================================
// BP COVERAGE (9.9)
// ============================================================================

export const MOCK_BP_COVERAGE_KPIS = {
  scopeItemsInScope: 25,
  coveredPassing: 18,
  coveredHealing: 4,
  coveredFailing: 0,
  notCovered: 3,
  overallCoverage: 88,
}

export interface BPCoverageItem {
  id: string
  module: string
  code: string
  name: string
  status: 'passing' | 'healing' | 'failing' | 'uncovered' | 'out-of-scope'
  linkedScenarios: number
  lastPassRate?: number
}

export const MOCK_BP_COVERAGE_ITEMS: BPCoverageItem[] = [
  // SD Module
  { id: 'bp_1', module: 'SD', code: 'BD9', name: 'Order to Cash', status: 'passing', linkedScenarios: 8, lastPassRate: 96 },
  { id: 'bp_2', module: 'SD', code: '1F1', name: 'Sales Order Processing', status: 'passing', linkedScenarios: 6, lastPassRate: 94 },
  { id: 'bp_3', module: 'SD', code: '2BN', name: 'Free of Charge Delivery', status: 'healing', linkedScenarios: 2, lastPassRate: 88 },
  { id: 'bp_4', module: 'SD', code: '1NY', name: 'Intercompany Sales', status: 'healing', linkedScenarios: 3, lastPassRate: 85 },
  { id: 'bp_5', module: 'SD', code: '4CA', name: 'Credit Memo Processing', status: 'passing', linkedScenarios: 4, lastPassRate: 92 },
  { id: 'bp_6', module: 'SD', code: '2KK', name: 'Rebate Processing', status: 'uncovered', linkedScenarios: 0 },
  // MM Module
  { id: 'bp_7', module: 'MM', code: '1A3', name: 'Procure to Pay', status: 'passing', linkedScenarios: 7, lastPassRate: 95 },
  { id: 'bp_8', module: 'MM', code: '2FM', name: 'Purchase Order Processing', status: 'passing', linkedScenarios: 5, lastPassRate: 93 },
  { id: 'bp_9', module: 'MM', code: '1ND', name: 'Goods Receipt Processing', status: 'healing', linkedScenarios: 3, lastPassRate: 87 },
  { id: 'bp_10', module: 'MM', code: '4HH', name: 'Subcontracting', status: 'uncovered', linkedScenarios: 0 },
  // FI Module
  { id: 'bp_11', module: 'FI', code: '1YB', name: 'Record to Report', status: 'passing', linkedScenarios: 9, lastPassRate: 97 },
  { id: 'bp_12', module: 'FI', code: '2BT', name: 'General Ledger Posting', status: 'passing', linkedScenarios: 6, lastPassRate: 95 },
  { id: 'bp_13', module: 'FI', code: '1HN', name: 'Accounts Payable', status: 'passing', linkedScenarios: 5, lastPassRate: 94 },
  { id: 'bp_14', module: 'FI', code: '3KL', name: 'Accounts Receivable', status: 'passing', linkedScenarios: 4, lastPassRate: 93 },
  { id: 'bp_15', module: 'FI', code: '2MT', name: 'Bank Reconciliation', status: 'healing', linkedScenarios: 2, lastPassRate: 86 },
  { id: 'bp_16', module: 'FI', code: '4QR', name: 'Asset Accounting', status: 'uncovered', linkedScenarios: 0 },
]

// ============================================================================
// EVIDENCE LOCKER (9.10)
// ============================================================================

export interface EvidenceBundle {
  id: string
  kind: 'case_execution' | 'scenario_execution' | 'suite_execution' | 'defect' | 'decision_log_entry' | 'audit_pack'
  parentEntity: string
  parentEntityKind: string
  parentEntityId: string
  itemCounts: {
    screenshots: number
    videos: number
    screenModels: number
    statusBarCaptures: number
  }
  createdAt: string
  retentionUntil: string
  signatureStatus: 'verified' | 'unverified' | 'failed'
  size: string
}

export const MOCK_EVIDENCE_BUNDLES: EvidenceBundle[] = [
  { id: 'EVB-001', kind: 'suite_execution', parentEntity: 'Star Cement Cutover Run #47', parentEntityKind: 'Suite', parentEntityId: 'run_47', itemCounts: { screenshots: 245, videos: 8, screenModels: 45, statusBarCaptures: 12 }, createdAt: '2026-05-07T10:00:00+05:30', retentionUntil: '2027-05-07', signatureStatus: 'verified', size: '2.4 GB' },
  { id: 'EVB-002', kind: 'case_execution', parentEntity: 'VA01 Create Sales Order', parentEntityKind: 'Case', parentEntityId: 'case_1', itemCounts: { screenshots: 12, videos: 1, screenModels: 4, statusBarCaptures: 2 }, createdAt: '2026-05-07T08:30:00+05:30', retentionUntil: '2027-05-07', signatureStatus: 'verified', size: '124 MB' },
  { id: 'EVB-003', kind: 'defect', parentEntity: 'DEF-045 Tax Calc Error', parentEntityKind: 'Defect', parentEntityId: 'def_45', itemCounts: { screenshots: 8, videos: 1, screenModels: 2, statusBarCaptures: 1 }, createdAt: '2026-05-06T16:45:00+05:30', retentionUntil: '2027-05-06', signatureStatus: 'verified', size: '86 MB' },
  { id: 'EVB-004', kind: 'scenario_execution', parentEntity: 'OTC Happy Path Domestic', parentEntityKind: 'Scenario', parentEntityId: 'sc_1', itemCounts: { screenshots: 45, videos: 3, screenModels: 12, statusBarCaptures: 4 }, createdAt: '2026-05-06T14:00:00+05:30', retentionUntil: '2026-05-14', signatureStatus: 'unverified', size: '456 MB' },
  { id: 'EVB-005', kind: 'decision_log_entry', parentEntity: 'Go/No-Go Decision #12', parentEntityKind: 'Decision', parentEntityId: 'dec_12', itemCounts: { screenshots: 2, videos: 0, screenModels: 0, statusBarCaptures: 0 }, createdAt: '2026-05-05T11:00:00+05:30', retentionUntil: '2028-05-05', signatureStatus: 'verified', size: '12 MB' },
  { id: 'EVB-006', kind: 'suite_execution', parentEntity: 'SD Core Regression Run #23', parentEntityKind: 'Suite', parentEntityId: 'run_23', itemCounts: { screenshots: 156, videos: 5, screenModels: 32, statusBarCaptures: 8 }, createdAt: '2026-05-04T09:00:00+05:30', retentionUntil: '2027-05-04', signatureStatus: 'failed', size: '1.8 GB' },
]

// ============================================================================
// SIGN-OFF TRAIL (9.11)
// ============================================================================

export interface SignOffApproval {
  id: string
  subjectKind: string
  subject: string
  subjectId: string
  requiredApproverCount: number
  requiredRoles: string[]
  signatures: { name: string; role: string; signedAt?: string; status: 'signed' | 'pending' }[]
  state: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn' | 'Expired'
  requestedAt: string
  decisionAt?: string
  rationale?: string
}

export const MOCK_SIGNOFF_APPROVALS: SignOffApproval[] = [
  { id: 'APR-001', subjectKind: 'suite_signoff', subject: 'Star Cement Cutover Run #47', subjectId: 'run_47', requiredApproverCount: 2, requiredRoles: ['QA Lead', 'Migration Manager'], signatures: [{ name: 'J.Rao', role: 'QA Lead', signedAt: '2026-05-07T10:30:00+05:30', status: 'signed' }, { name: 'P.Sharma', role: 'Migration Manager', signedAt: '2026-05-07T11:00:00+05:30', status: 'signed' }], state: 'Approved', requestedAt: '2026-05-07T09:00:00+05:30', decisionAt: '2026-05-07T11:00:00+05:30' },
  { id: 'APR-002', subjectKind: 'healing_promotion', subject: 'VA01 Extra Modal Fix', subjectId: 'hp_1', requiredApproverCount: 1, requiredRoles: ['Test Engineering Lead'], signatures: [{ name: 'P.Sharma', role: 'Test Engineering Lead', signedAt: '2026-05-06T14:30:00+05:30', status: 'signed' }], state: 'Approved', requestedAt: '2026-05-06T10:00:00+05:30', decisionAt: '2026-05-06T14:30:00+05:30' },
  { id: 'APR-003', subjectKind: 'cutover_go_nogo', subject: 'Star Cement Mock Cutover #2', subjectId: 'cutover_2', requiredApproverCount: 3, requiredRoles: ['CIO', 'Migration Manager', 'QA Lead'], signatures: [{ name: 'K.Iyer', role: 'CIO', status: 'pending' }, { name: 'P.Sharma', role: 'Migration Manager', signedAt: '2026-05-05T16:00:00+05:30', status: 'signed' }, { name: 'J.Rao', role: 'QA Lead', status: 'pending' }], state: 'Pending', requestedAt: '2026-05-05T14:00:00+05:30' },
  { id: 'APR-004', subjectKind: 'defect_close', subject: 'DEF-023 Credit Limit Bypass', subjectId: 'def_23', requiredApproverCount: 1, requiredRoles: ['QA Lead'], signatures: [{ name: 'J.Rao', role: 'QA Lead', signedAt: '2026-05-04T11:30:00+05:30', status: 'signed' }], state: 'Rejected', requestedAt: '2026-05-04T10:00:00+05:30', decisionAt: '2026-05-04T11:30:00+05:30', rationale: 'Root cause not fully addressed - defect can recur under edge conditions' },
]

// ============================================================================
// IMMUTABLE RUN RECORDS (9.12)
// ============================================================================

export interface ImmutableRunRecord {
  id: string
  suiteName: string
  migration: string
  triggeredBy: string
  triggeredByKind: 'human' | 'agent' | 'schedule'
  startedAt: string
  completedAt: string
  duration: string
  outcome: 'Passed' | 'Failed' | 'Partial' | 'Aborted'
  manifestHash: string
  signatureKeyId: string
  signatureVerified: boolean
  storageUri: string
}

export const MOCK_RUN_RECORDS: ImmutableRunRecord[] = [
  { id: 'RUN-047', suiteName: 'Star Cement Cutover', migration: 'Star Cement S/4HANA', triggeredBy: 'P.Sharma', triggeredByKind: 'human', startedAt: '2026-05-07T06:00:00+05:30', completedAt: '2026-05-07T09:45:00+05:30', duration: '3h 45m', outcome: 'Passed', manifestHash: 'sha256:a1b2c3d4...', signatureKeyId: 'key_voltus_prod_2026', signatureVerified: true, storageUri: 's3://voltus-evidence/run_047/' },
  { id: 'RUN-046', suiteName: 'SD Core Regression', migration: 'Star Cement S/4HANA', triggeredBy: 'Scheduler', triggeredByKind: 'schedule', startedAt: '2026-05-06T22:00:00+05:30', completedAt: '2026-05-07T01:30:00+05:30', duration: '3h 30m', outcome: 'Partial', manifestHash: 'sha256:e5f6g7h8...', signatureKeyId: 'key_voltus_prod_2026', signatureVerified: true, storageUri: 's3://voltus-evidence/run_046/' },
  { id: 'RUN-045', suiteName: 'FI Core Regression', migration: 'Star Cement S/4HANA', triggeredBy: 'J.Rao', triggeredByKind: 'human', startedAt: '2026-05-06T10:00:00+05:30', completedAt: '2026-05-06T12:15:00+05:30', duration: '2h 15m', outcome: 'Passed', manifestHash: 'sha256:i9j0k1l2...', signatureKeyId: 'key_voltus_prod_2026', signatureVerified: true, storageUri: 's3://voltus-evidence/run_045/' },
]

// ============================================================================
// AUDIT TEMPLATES (9.13)
// ============================================================================

export interface AuditTemplate {
  id: string
  name: string
  description: string
  evidenceTypes: string[]
  estimatedSize: string
  lastUsed?: string
}

export const MOCK_AUDIT_TEMPLATES: AuditTemplate[] = [
  { id: 'tmpl_1', name: 'SOX Walkthrough Pack', description: 'Complete SOX compliance walkthrough with control evidence', evidenceTypes: ['Suite Executions', 'Evidence Bundles', 'Approvals', 'Configuration changes'], estimatedSize: '~500 MB', lastUsed: '2026-04-15' },
  { id: 'tmpl_2', name: 'GDPR Data-Subject Request', description: 'Data subject access request evidence package', evidenceTypes: ['Evidence Bundles', 'Decisions', 'Configuration changes'], estimatedSize: '~100 MB' },
  { id: 'tmpl_3', name: 'GxP Validation Pack', description: 'Pharmaceutical industry validation documentation', evidenceTypes: ['Suite Executions', 'Evidence Bundles', 'Approvals', 'Decisions'], estimatedSize: '~1.2 GB', lastUsed: '2026-03-22' },
  { id: 'tmpl_4', name: 'Internal Audit Standard Pack', description: 'Standard internal audit evidence collection', evidenceTypes: ['Suite Executions', 'Approvals'], estimatedSize: '~300 MB', lastUsed: '2026-05-01' },
  { id: 'tmpl_5', name: 'ISO 27001 Audit Pack', description: 'Information security management evidence', evidenceTypes: ['Configuration changes', 'Approvals', 'Decisions'], estimatedSize: '~200 MB' },
  { id: 'tmpl_6', name: 'Custom Template', description: 'Create a custom audit export template', evidenceTypes: [], estimatedSize: 'Variable' },
]

// ============================================================================
// AUDIT EXPORTS (9.14)
// ============================================================================

export interface AuditExport {
  id: string
  requestedBy: string
  requestedByRole: string
  requestedAt: string
  scopeSummary: string
  bundleCount: number
  size: string
  state: 'Queued' | 'Generating' | 'Ready' | 'Failed' | 'Expired'
  downloadExpiresAt?: string
  outputHash?: string
  progress?: number
}

export const MOCK_AUDIT_EXPORTS: AuditExport[] = [
  { id: 'EXP-001', requestedBy: 'P.Sharma', requestedByRole: 'Migration Manager', requestedAt: '2026-05-07T10:00:00+05:30', scopeSummary: 'Star Cement May 2026 Cutover Evidence', bundleCount: 45, size: '4.2 GB', state: 'Ready', downloadExpiresAt: '2026-05-14', outputHash: 'sha256:m3n4o5p6...' },
  { id: 'EXP-002', requestedBy: 'K.Iyer', requestedByRole: 'CIO', requestedAt: '2026-05-06T14:30:00+05:30', scopeSummary: 'Q1 2026 SOX Compliance Pack', bundleCount: 128, size: '12.8 GB', state: 'Ready', downloadExpiresAt: '2026-05-13', outputHash: 'sha256:q7r8s9t0...' },
  { id: 'EXP-003', requestedBy: 'J.Rao', requestedByRole: 'QA Lead', requestedAt: '2026-05-07T11:00:00+05:30', scopeSummary: 'SD Module Regression Evidence', bundleCount: 23, size: '1.8 GB', state: 'Generating', progress: 67 },
  { id: 'EXP-004', requestedBy: 'M.Reddy', requestedByRole: 'Test Engineer', requestedAt: '2026-04-15T09:00:00+05:30', scopeSummary: 'April 2026 Monthly Pack', bundleCount: 89, size: '8.4 GB', state: 'Expired' },
  { id: 'EXP-005', requestedBy: 'S.Kumar', requestedByRole: 'Senior Test Engineer', requestedAt: '2026-04-01T10:00:00+05:30', scopeSummary: 'March Defect Evidence', bundleCount: 34, size: '2.1 GB', state: 'Expired' },
]

// ============================================================================
// CIO DASHBOARD (9.15)
// ============================================================================

export const MOCK_CIO_KPIS = {
  bpCoverage: 84,
  siBurndown: 76,
  abapBurndown: 82,
  openCriticalDefects: 2,
  passRate: 91,
  daysToNextCutover: 84,
  readinessScore: 78,
  signoffsPending: 1,
}

export const MOCK_CIO_DECISIONS = [
  { id: 'dec_1', title: 'Go/No-Go: Mock Cutover #2', type: 'cutover_go_nogo', requestedAt: '2026-05-05T14:00:00+05:30', urgency: 'high' },
]

export const MOCK_CIO_RISKS = [
  { id: 'risk_1', title: 'DEF-001: Tax calculation rounding error (45 days open)', type: 'defect', severity: 'critical' },
  { id: 'risk_2', title: 'BP Scope Item 2KK (Rebate Processing) uncovered', type: 'coverage_gap', severity: 'high' },
  { id: 'risk_3', title: '3 SI Items at risk of slipping past cutover', type: 'burndown', severity: 'medium' },
]

// ============================================================================
// KPI DICTIONARY (9.18)
// ============================================================================

export interface KPIDefinition {
  id: string
  name: string
  category: 'Coverage' | 'Quality' | 'Velocity' | 'Risk' | 'Compliance'
  definition: string
  formula: string
  sourceEvents: string[]
  refreshCadence: string
  exampleValues: { date: string; value: string }[]
  apiEndpoint: string
}

export const MOCK_KPI_DEFINITIONS: KPIDefinition[] = [
  { id: 'kpi_1', name: 'BP Coverage %', category: 'Coverage', definition: 'Percentage of in-scope SAP Best Practice Scope Items that have at least one passing Test Scenario linked.', formula: '(Covered_BP_Scope_Items / In_Scope_BP_Scope_Items) × 100', sourceEvents: ['test_execution_completed', 'scenario_linked', 'bp_scope_updated'], refreshCadence: 'Real-time', exampleValues: [{ date: '2026-05-05', value: '82%' }, { date: '2026-05-06', value: '84%' }, { date: '2026-05-07', value: '84%' }], apiEndpoint: '/odata/v1/KPIs(\'bp_coverage\')' },
  { id: 'kpi_2', name: 'Test Pack Coverage %', category: 'Coverage', definition: 'Percentage of SAP modules and business processes covered by the test library.', formula: '(Covered_Intersections / In_Scope_Intersections) × 100', sourceEvents: ['test_case_created', 'test_case_linked'], refreshCadence: 'Real-time', exampleValues: [{ date: '2026-05-05', value: '78%' }, { date: '2026-05-06', value: '79%' }, { date: '2026-05-07', value: '80%' }], apiEndpoint: '/odata/v1/KPIs(\'test_pack_coverage\')' },
  { id: 'kpi_3', name: 'Pass Rate', category: 'Quality', definition: 'Percentage of Test Case executions that passed without healing intervention.', formula: '(Passed_Executions / Total_Executions) × 100', sourceEvents: ['test_execution_completed'], refreshCadence: 'Real-time', exampleValues: [{ date: '2026-05-05', value: '89%' }, { date: '2026-05-06', value: '91%' }, { date: '2026-05-07', value: '91%' }], apiEndpoint: '/odata/v1/KPIs(\'pass_rate\')' },
  { id: 'kpi_4', name: 'Healing Rate', category: 'Quality', definition: 'Percentage of test failures automatically healed by the platform.', formula: '(Healed_Failures / Total_Failures) × 100', sourceEvents: ['healing_event_completed'], refreshCadence: 'Real-time', exampleValues: [{ date: '2026-05-05', value: '85%' }, { date: '2026-05-06', value: '87%' }, { date: '2026-05-07', value: '87%' }], apiEndpoint: '/odata/v1/KPIs(\'healing_rate\')' },
  { id: 'kpi_5', name: 'Mean Time to Heal', category: 'Velocity', definition: 'Average time from failure detection to successful healing in minutes.', formula: 'AVG(healing_completed_at - failure_detected_at)', sourceEvents: ['healing_event_completed'], refreshCadence: 'Hourly', exampleValues: [{ date: '2026-05-05', value: '14m' }, { date: '2026-05-06', value: '12m' }, { date: '2026-05-07', value: '12m' }], apiEndpoint: '/odata/v1/KPIs(\'mtth\')' },
  { id: 'kpi_6', name: 'Mean Time to Close Defect', category: 'Velocity', definition: 'Average time from defect creation to closure in hours.', formula: 'AVG(closed_at - created_at)', sourceEvents: ['defect_closed'], refreshCadence: 'Daily', exampleValues: [{ date: '2026-05-05', value: '26h' }, { date: '2026-05-06', value: '24h' }, { date: '2026-05-07', value: '24h' }], apiEndpoint: '/odata/v1/KPIs(\'mttc_defect\')' },
  { id: 'kpi_7', name: 'SI Burndown Rate', category: 'Velocity', definition: 'Rate of Simplification Items being closed per week.', formula: 'SI_Closed_This_Week / SI_Open_Start_Of_Week', sourceEvents: ['si_item_closed'], refreshCadence: 'Weekly', exampleValues: [{ date: '2026-04-21', value: '8/wk' }, { date: '2026-04-28', value: '10/wk' }, { date: '2026-05-05', value: '7/wk' }], apiEndpoint: '/odata/v1/KPIs(\'si_burndown_rate\')' },
  { id: 'kpi_8', name: 'ABAP Burndown Rate', category: 'Velocity', definition: 'Rate of ABAP Impact Findings being resolved per week.', formula: 'ABAP_Resolved_This_Week / ABAP_Open_Start_Of_Week', sourceEvents: ['abap_finding_resolved'], refreshCadence: 'Weekly', exampleValues: [{ date: '2026-04-21', value: '42/wk' }, { date: '2026-04-28', value: '38/wk' }, { date: '2026-05-05', value: '27/wk' }], apiEndpoint: '/odata/v1/KPIs(\'abap_burndown_rate\')' },
  { id: 'kpi_9', name: 'Open Critical Defects', category: 'Risk', definition: 'Count of defects with Critical severity that are not yet closed.', formula: 'COUNT(defects WHERE severity=Critical AND state!=Closed)', sourceEvents: ['defect_created', 'defect_closed', 'defect_severity_changed'], refreshCadence: 'Real-time', exampleValues: [{ date: '2026-05-05', value: '3' }, { date: '2026-05-06', value: '2' }, { date: '2026-05-07', value: '2' }], apiEndpoint: '/odata/v1/KPIs(\'open_critical_defects\')' },
  { id: 'kpi_10', name: 'Productive-Write Exception Count', category: 'Risk', definition: 'Count of test executions that performed write operations in Production systems.', formula: 'COUNT(executions WHERE system_tier=PROD AND write_detected=true)', sourceEvents: ['test_execution_completed'], refreshCadence: 'Real-time', exampleValues: [{ date: '2026-05-05', value: '0' }, { date: '2026-05-06', value: '0' }, { date: '2026-05-07', value: '0' }], apiEndpoint: '/odata/v1/KPIs(\'prod_write_exceptions\')' },
  { id: 'kpi_11', name: 'Sign-off Compliance %', category: 'Compliance', definition: 'Percentage of sign-off requests completed within SLA.', formula: '(On_Time_Signoffs / Total_Signoffs) × 100', sourceEvents: ['approval_completed'], refreshCadence: 'Daily', exampleValues: [{ date: '2026-05-05', value: '94%' }, { date: '2026-05-06', value: '95%' }, { date: '2026-05-07', value: '95%' }], apiEndpoint: '/odata/v1/KPIs(\'signoff_compliance\')' },
  { id: 'kpi_12', name: 'Evidence Signature Verified %', category: 'Compliance', definition: 'Percentage of evidence bundles with verified cryptographic signatures.', formula: '(Verified_Bundles / Total_Bundles) × 100', sourceEvents: ['evidence_bundle_created', 'signature_verified'], refreshCadence: 'Daily', exampleValues: [{ date: '2026-05-05', value: '98%' }, { date: '2026-05-06', value: '99%' }, { date: '2026-05-07', value: '99%' }], apiEndpoint: '/odata/v1/KPIs(\'evidence_verified\')' },
  { id: 'kpi_13', name: 'Cutover Readiness Score', category: 'Coverage', definition: 'Composite score indicating readiness for production cutover (0-100).', formula: 'WEIGHTED_AVG(bp_coverage, si_closed, abap_closed, pass_rate, open_defects)', sourceEvents: ['Multiple'], refreshCadence: 'Real-time', exampleValues: [{ date: '2026-05-05', value: '74' }, { date: '2026-05-06', value: '76' }, { date: '2026-05-07', value: '78' }], apiEndpoint: '/odata/v1/KPIs(\'readiness_score\')' },
  { id: 'kpi_14', name: 'Days to Cutover', category: 'Velocity', definition: 'Calendar days remaining until planned production cutover date.', formula: 'cutover_date - today()', sourceEvents: ['migration_updated'], refreshCadence: 'Daily', exampleValues: [{ date: '2026-05-05', value: '86' }, { date: '2026-05-06', value: '85' }, { date: '2026-05-07', value: '84' }], apiEndpoint: '/odata/v1/KPIs(\'days_to_cutover\')' },
  { id: 'kpi_15', name: 'Hypercare SLA Compliance %', category: 'Compliance', definition: 'Percentage of hypercare issues resolved within SLA during post-go-live period.', formula: '(Issues_Resolved_In_SLA / Total_Issues) × 100', sourceEvents: ['hypercare_issue_resolved'], refreshCadence: 'Hourly', exampleValues: [{ date: '2026-05-05', value: '92%' }, { date: '2026-05-06', value: '94%' }, { date: '2026-05-07', value: '94%' }], apiEndpoint: '/odata/v1/KPIs(\'hypercare_sla\')' },
]

// ============================================================================
// CUSTOM REPORTS (9.19)
// ============================================================================

export interface CustomReport {
  id: string
  name: string
  owner: string
  lastRun?: string
  schedule?: string
  createdAt: string
}

export const MOCK_CUSTOM_REPORTS: CustomReport[] = [
  { id: 'cr_1', name: 'Weekly Defect Summary by Module', owner: 'J.Rao', lastRun: '2026-05-06T06:00:00+05:30', schedule: 'Weekly (Mon 06:00)', createdAt: '2026-03-15' },
  { id: 'cr_2', name: 'Z-objects with Failing Tests', owner: 'M.Reddy', lastRun: '2026-05-07T08:00:00+05:30', schedule: 'Daily (08:00)', createdAt: '2026-04-01' },
  { id: 'cr_3', name: 'Healing Effectiveness by Pattern (Sandeep\'s view)', owner: 'S.Kumar', lastRun: '2026-05-05T10:00:00+05:30', createdAt: '2026-04-20' },
  { id: 'cr_4', name: 'Star Cement Pre-Cutover Readiness Custom', owner: 'P.Sharma', lastRun: '2026-05-07T07:00:00+05:30', schedule: 'Daily (07:00)', createdAt: '2026-05-01' },
]
