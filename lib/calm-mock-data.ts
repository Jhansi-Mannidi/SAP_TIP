export type CalmTenantStatus = 'connected' | 'warning' | 'disconnected'
export type BindingState =
  | 'PRE_GENERATED'
  | 'CALM_REQUESTED'
  | 'BOUND'
  | 'READY'
  | 'STALE'
  | 'RETIRED'
export type SyncState = 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'SKIPPED' | 'DEAD_LETTER'
export type OutboxState = 'NEW' | 'CLAIMED' | 'DISPATCHED' | 'CONFIRMED' | 'FAILED' | 'DEAD_LETTER'
export type OutboxOperation =
  | 'RAISE_DEFECT'
  | 'UPDATE_DEFECT'
  | 'UPDATE_REQUIREMENT_STATUS'
  | 'ATTACH_EVIDENCE'
  | 'UPDATE_TASK_STATUS'
export type EntityKind =
  | 'PROCESS'
  | 'REQUIREMENT'
  | 'FEATURE'
  | 'TEST_CASE'
  | 'TEST_STEP'
  | 'TEST_PLAN'
  | 'DEFECT'
  | 'SCOPE'

export interface CalmTenant {
  id: string
  name: string
  tenant_url: string
  region: string
  api_base: string
  sap_system: string
  phase1_inbound: boolean
  phase2_outbound: boolean
  oauth_client_id: string
  scopes: string[]
  status: CalmTenantStatus
  last_sync?: string
  projects_count: number
  bindings_ready: number
}

export interface CalmProject {
  id: string
  tenant_id: string
  calm_project_id: string
  name: string
  migration?: string
  bindings_count: number
}

export interface CalmScenarioBinding {
  id: string
  scenario_code: string
  scenario_name: string
  calm_test_case_ref: string
  project_name: string
  binding_state: BindingState
  match_method: 'CANONICAL_KEY' | 'CALM_ID' | 'MANUAL' | 'HEURISTIC'
  write_back_enabled: boolean
  bp_scope?: string
  updated_at: string
}

export interface CalmCaseBinding {
  id: string
  case_code: string
  case_name: string
  scenario_binding_id: string
  calm_test_step_ref: string
  binding_state: BindingState
  write_back_enabled: boolean
}

export interface CalmRunProjection {
  id: string
  run_id: string
  tenant_name: string
  scenario_name: string
  sync_state: SyncState
  calm_job_id?: string
  last_pull_at?: string
  outcome?: 'PASS' | 'FAIL' | 'SKIP'
}

export interface CalmExecutionProjection {
  id: string
  execution_id: string
  scenario_name: string
  calm_verdict: 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIP'
  sync_state: SyncState
  evidence_refs: number
}

export interface CalmDefectProjection {
  id: string
  defect_id: string
  calm_defect_id: string
  run_id: string
  requirement_ref: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  raised_at: string
}

export interface CalmOutboxEntry {
  id: string
  operation: OutboxOperation
  idempotency_key: string
  tenant_name: string
  state: OutboxState
  attempts: number
  next_attempt_at?: string
  created_at: string
  payload_summary: string
}

export interface CalmSyncLogEntry {
  id: string
  direction: 'INBOUND' | 'OUTBOUND'
  service: string
  operation: string
  status: SyncState
  tenant_name: string
  occurred_at: string
  duration_ms: number
  correlation_id: string
}

export interface CalmFieldMapping {
  id: string
  version: string
  calm_field: string
  satip_field: string
  entity_kind: EntityKind
  active: boolean
}

export const CALM_KPIS = {
  tenants: 5,
  scenario_bindings: 62,
  case_bindings: 384,
  bound_ready: 54,
  outbox_pending: 7,
  defects_raised: 18,
  sync_success_rate: 97,
}

export const MOCK_CALM_TENANTS: CalmTenant[] = [
  {
    id: 'ct_1',
    name: 'Acme S/4 CALM',
    tenant_url: 'acme-s4.eu10.alm.cloud.sap',
    region: 'eu10',
    api_base: 'https://acme-s4.eu10.alm.cloud.sap/api',
    sap_system: 'S4H-PRD-001',
    phase1_inbound: true,
    phase2_outbound: true,
    oauth_client_id: 'satip-outbound-acme',
    scopes: ['calm-tasks.write', 'calm-processmanagement.read', 'calm-defects.write'],
    status: 'connected',
    last_sync: '2026-06-05T08:45:00+05:30',
    projects_count: 3,
    bindings_ready: 28,
  },
  {
    id: 'ct_2',
    name: 'Globex QA CALM',
    tenant_url: 'globex-qa.us10.alm.cloud.sap',
    region: 'us10',
    api_base: 'https://globex-qa.us10.alm.cloud.sap/api',
    sap_system: 'S4H-QAS-002',
    phase1_inbound: true,
    phase2_outbound: false,
    oauth_client_id: 'satip-outbound-globex',
    scopes: ['calm-processmanagement.read'],
    status: 'warning',
    last_sync: '2026-06-04T16:20:00+05:30',
    projects_count: 1,
    bindings_ready: 13,
  },
  {
    id: 'ct_3',
    name: 'Star Cement CALM',
    tenant_url: 'starcement.eu10.alm.cloud.sap',
    region: 'eu10',
    api_base: 'https://starcement.eu10.alm.cloud.sap/api',
    sap_system: 'STA-S4H-PRD',
    phase1_inbound: true,
    phase2_outbound: true,
    oauth_client_id: 'satip-outbound-star',
    scopes: ['calm-tasks.write', 'calm-processmanagement.read', 'calm-defects.write', 'calm-projects.read'],
    status: 'connected',
    last_sync: '2026-06-05T09:15:00+05:30',
    projects_count: 4,
    bindings_ready: 35,
  },
  {
    id: 'ct_4',
    name: 'Northstar Dev CALM',
    tenant_url: 'northstar-dev.ap10.alm.cloud.sap',
    region: 'ap10',
    api_base: 'https://northstar-dev.ap10.alm.cloud.sap/api',
    sap_system: 'NS-DEV-001',
    phase1_inbound: true,
    phase2_outbound: false,
    oauth_client_id: 'satip-outbound-ns',
    scopes: ['calm-processmanagement.read'],
    status: 'connected',
    last_sync: '2026-06-05T07:00:00+05:30',
    projects_count: 2,
    bindings_ready: 9,
  },
  {
    id: 'ct_5',
    name: 'Legacy ECC Bridge CALM',
    tenant_url: 'ecc-bridge.us10.alm.cloud.sap',
    region: 'us10',
    api_base: 'https://ecc-bridge.us10.alm.cloud.sap/api',
    sap_system: 'ECC-LEG-001',
    phase1_inbound: true,
    phase2_outbound: true,
    oauth_client_id: 'satip-outbound-ecc',
    scopes: ['calm-tasks.write', 'calm-defects.write'],
    status: 'disconnected',
    last_sync: '2026-05-28T12:00:00+05:30',
    projects_count: 1,
    bindings_ready: 4,
  },
]

export const MOCK_CALM_PROJECTS: CalmProject[] = [
  {
    id: 'cp_1',
    tenant_id: 'ct_1',
    calm_project_id: 'PRJ-OTC-2024',
    name: 'Order to Cash Migration',
    migration: 'MIG-OTC-001',
    bindings_count: 18,
  },
  {
    id: 'cp_2',
    tenant_id: 'ct_1',
    calm_project_id: 'PRJ-PTP-2024',
    name: 'Procure to Pay Rollout',
    bindings_count: 14,
  },
  {
    id: 'cp_3',
    tenant_id: 'ct_1',
    calm_project_id: 'PRJ-RTR-2024',
    name: 'Record to Report Close',
    bindings_count: 16,
  },
]

export const MOCK_SCENARIO_BINDINGS: CalmScenarioBinding[] = [
  {
    id: 'sb_1',
    scenario_code: 'SCN-O2C-001',
    scenario_name: 'Standard Sales Order Flow',
    calm_test_case_ref: 'TC-OTC-STD-001',
    project_name: 'Order to Cash Migration',
    binding_state: 'READY',
    match_method: 'CANONICAL_KEY',
    write_back_enabled: true,
    bp_scope: 'BD1 — Sell from Stock',
    updated_at: '2026-06-05T07:30:00+05:30',
  },
  {
    id: 'sb_2',
    scenario_code: 'SCN-O2C-002',
    scenario_name: 'Credit Block Override',
    calm_test_case_ref: 'TC-OTC-CR-004',
    project_name: 'Order to Cash Migration',
    binding_state: 'BOUND',
    match_method: 'CALM_ID',
    write_back_enabled: true,
    bp_scope: 'BD2 — Credit Management',
    updated_at: '2026-06-04T14:00:00+05:30',
  },
  {
    id: 'sb_3',
    scenario_code: 'SCN-PTP-001',
    scenario_name: 'PO with 3-Way Match',
    calm_test_case_ref: 'TC-PTP-PO-001',
    project_name: 'Procure to Pay Rollout',
    binding_state: 'READY',
    match_method: 'CANONICAL_KEY',
    write_back_enabled: true,
    bp_scope: 'BK1 — Purchase Order',
    updated_at: '2026-06-05T06:15:00+05:30',
  },
  {
    id: 'sb_4',
    scenario_code: 'SCN-PTP-003',
    scenario_name: 'Non-PO Invoice Entry',
    calm_test_case_ref: 'TC-PTP-NPO-002',
    project_name: 'Procure to Pay Rollout',
    binding_state: 'STALE',
    match_method: 'HEURISTIC',
    write_back_enabled: false,
    updated_at: '2026-05-28T11:00:00+05:30',
  },
  {
    id: 'sb_5',
    scenario_code: 'SCN-RTR-001',
    scenario_name: 'Period End Close',
    calm_test_case_ref: 'TC-RTR-PEC-001',
    project_name: 'Record to Report Close',
    binding_state: 'CALM_REQUESTED',
    match_method: 'MANUAL',
    write_back_enabled: false,
    bp_scope: 'J91 — Period End',
    updated_at: '2026-06-05T09:00:00+05:30',
  },
  {
    id: 'sb_6',
    scenario_code: 'SCN-O2C-003',
    scenario_name: 'Export Sales Order',
    calm_test_case_ref: 'TC-OTC-EXP-003',
    project_name: 'Order to Cash Migration',
    binding_state: 'BOUND',
    match_method: 'CANONICAL_KEY',
    write_back_enabled: true,
    bp_scope: 'BD3 — Export Sales',
    updated_at: '2026-06-04T11:00:00+05:30',
  },
  {
    id: 'sb_7',
    scenario_code: 'SCN-PTP-002',
    scenario_name: 'Invoice Verification MIRO',
    calm_test_case_ref: 'TC-PTP-IV-002',
    project_name: 'Procure to Pay Rollout',
    binding_state: 'READY',
    match_method: 'CALM_ID',
    write_back_enabled: true,
    bp_scope: 'BK2 — Invoice Entry',
    updated_at: '2026-06-05T08:00:00+05:30',
  },
  {
    id: 'sb_8',
    scenario_code: 'SCN-RTR-002',
    scenario_name: 'Asset Accounting Depreciation',
    calm_test_case_ref: 'TC-RTR-AA-002',
    project_name: 'Record to Report Close',
    binding_state: 'PRE_GENERATED',
    match_method: 'HEURISTIC',
    write_back_enabled: false,
    updated_at: '2026-06-03T14:00:00+05:30',
  },
  {
    id: 'sb_9',
    scenario_code: 'SCN-WM-001',
    scenario_name: 'Warehouse Transfer Order',
    calm_test_case_ref: 'TC-WM-TO-001',
    project_name: 'Order to Cash Migration',
    binding_state: 'READY',
    match_method: 'MANUAL',
    write_back_enabled: true,
    updated_at: '2026-06-05T06:30:00+05:30',
  },
  {
    id: 'sb_10',
    scenario_code: 'SCN-CO-001',
    scenario_name: 'Cost Center Assessment',
    calm_test_case_ref: 'TC-CO-CC-001',
    project_name: 'Record to Report Close',
    binding_state: 'BOUND',
    match_method: 'CANONICAL_KEY',
    write_back_enabled: true,
    updated_at: '2026-06-02T10:00:00+05:30',
  },
]

export const MOCK_CASE_BINDINGS: CalmCaseBinding[] = [
  {
    id: 'cb_1',
    case_code: 'TC-1001',
    case_name: 'Create sales order VA01',
    scenario_binding_id: 'sb_1',
    calm_test_step_ref: 'TS-OTC-001-A',
    binding_state: 'READY',
    write_back_enabled: true,
  },
  {
    id: 'cb_2',
    case_code: 'TC-1002',
    case_name: 'Delivery & goods issue',
    scenario_binding_id: 'sb_1',
    calm_test_step_ref: 'TS-OTC-001-B',
    binding_state: 'READY',
    write_back_enabled: true,
  },
  {
    id: 'cb_3',
    case_code: 'TC-1045',
    case_name: 'Credit limit check',
    scenario_binding_id: 'sb_2',
    calm_test_step_ref: 'TS-OTC-CR-01',
    binding_state: 'BOUND',
    write_back_enabled: true,
  },
]

export const MOCK_RUN_PROJECTIONS: CalmRunProjection[] = [
  {
    id: 'rp_1',
    run_id: 'RUN-20260605-001',
    tenant_name: 'Acme S/4 CALM',
    scenario_name: 'Standard Sales Order Flow',
    sync_state: 'SUCCEEDED',
    calm_job_id: 'CALM-JOB-88421',
    last_pull_at: '2026-06-05T08:40:00+05:30',
    outcome: 'PASS',
  },
  {
    id: 'rp_2',
    run_id: 'RUN-20260605-002',
    tenant_name: 'Acme S/4 CALM',
    scenario_name: 'Credit Block Override',
    sync_state: 'IN_PROGRESS',
    calm_job_id: 'CALM-JOB-88422',
    outcome: 'FAIL',
  },
  {
    id: 'rp_3',
    run_id: 'RUN-20260604-089',
    tenant_name: 'Globex QA CALM',
    scenario_name: 'PO with 3-Way Match',
    sync_state: 'PENDING',
  },
]

export const MOCK_EXECUTION_PROJECTIONS: CalmExecutionProjection[] = [
  {
    id: 'ep_1',
    execution_id: 'EXEC-88421-01',
    scenario_name: 'Standard Sales Order Flow',
    calm_verdict: 'PASS',
    sync_state: 'SUCCEEDED',
    evidence_refs: 4,
  },
  {
    id: 'ep_2',
    execution_id: 'EXEC-88422-03',
    scenario_name: 'Credit Block Override',
    calm_verdict: 'FAIL',
    sync_state: 'IN_PROGRESS',
    evidence_refs: 6,
  },
  {
    id: 'ep_3',
    execution_id: 'EXEC-88422-04',
    scenario_name: 'Credit Block Override',
    calm_verdict: 'BLOCKED',
    sync_state: 'FAILED',
    evidence_refs: 2,
  },
]

export const MOCK_DEFECT_PROJECTIONS: CalmDefectProjection[] = [
  {
    id: 'dp_1',
    defect_id: 'DEF-20260605-001',
    calm_defect_id: 'CALM-DEF-4421',
    run_id: 'RUN-20260605-002',
    requirement_ref: 'REQ-OTC-CR-001',
    status: 'OPEN',
    raised_at: '2026-06-05T08:42:00+05:30',
  },
  {
    id: 'dp_2',
    defect_id: 'DEF-20260604-012',
    calm_defect_id: 'CALM-DEF-4398',
    run_id: 'RUN-20260604-078',
    requirement_ref: 'REQ-PTP-GR-002',
    status: 'IN_PROGRESS',
    raised_at: '2026-06-04T15:30:00+05:30',
  },
]

export const MOCK_OUTBOX: CalmOutboxEntry[] = [
  {
    id: 'ob_1',
    operation: 'RAISE_DEFECT',
    idempotency_key: 'satip-def-RUN-20260605-002',
    tenant_name: 'Acme S/4 CALM',
    state: 'DISPATCHED',
    attempts: 1,
    created_at: '2026-06-05T08:42:00+05:30',
    payload_summary: 'Failed bound run → defect linked to REQ-OTC-CR-001',
  },
  {
    id: 'ob_2',
    operation: 'UPDATE_REQUIREMENT_STATUS',
    idempotency_key: 'satip-req-RUN-20260605-002',
    tenant_name: 'Acme S/4 CALM',
    state: 'NEW',
    attempts: 0,
    next_attempt_at: '2026-06-05T09:00:00+05:30',
    created_at: '2026-06-05T08:43:00+05:30',
    payload_summary: 'Patch requirement status after failed test',
  },
  {
    id: 'ob_3',
    operation: 'ATTACH_EVIDENCE',
    idempotency_key: 'satip-ev-EXEC-88422-03',
    tenant_name: 'Acme S/4 CALM',
    state: 'FAILED',
    attempts: 3,
    next_attempt_at: '2026-06-05T09:15:00+05:30',
    created_at: '2026-06-05T08:44:00+05:30',
    payload_summary: 'Attach screenshot evidence URIs to CALM defect',
  },
  {
    id: 'ob_4',
    operation: 'RAISE_DEFECT',
    idempotency_key: 'satip-def-RUN-20260603-045',
    tenant_name: 'Globex QA CALM',
    state: 'DEAD_LETTER',
    attempts: 5,
    created_at: '2026-06-03T10:00:00+05:30',
    payload_summary: 'OAuth scope insufficient — defects.write missing',
  },
]

export const MOCK_SYNC_LOG: CalmSyncLogEntry[] = [
  {
    id: 'sl_1',
    direction: 'INBOUND',
    service: 'test-automation-api',
    operation: 'GET /testcases/executionhistory',
    status: 'SUCCEEDED',
    tenant_name: 'Acme S/4 CALM',
    occurred_at: '2026-06-05T08:40:00+05:30',
    duration_ms: 142,
    correlation_id: 'corr-88421',
  },
  {
    id: 'sl_2',
    direction: 'OUTBOUND',
    service: 'calm-tasks',
    operation: 'POST /tasks (defect)',
    status: 'SUCCEEDED',
    tenant_name: 'Acme S/4 CALM',
    occurred_at: '2026-06-05T08:42:00+05:30',
    duration_ms: 318,
    correlation_id: 'corr-88422-def',
  },
  {
    id: 'sl_3',
    direction: 'OUTBOUND',
    service: 'calm-processmanagement',
    operation: 'GET /scopes',
    status: 'SUCCEEDED',
    tenant_name: 'Acme S/4 CALM',
    occurred_at: '2026-06-05T08:35:00+05:30',
    duration_ms: 89,
    correlation_id: 'corr-scope-001',
  },
  {
    id: 'sl_4',
    direction: 'OUTBOUND',
    service: 'calm-tasks',
    operation: 'PATCH /tasks/{id}',
    status: 'FAILED',
    tenant_name: 'Globex QA CALM',
    occurred_at: '2026-06-04T16:18:00+05:30',
    duration_ms: 502,
    correlation_id: 'corr-patch-002',
  },
]

export const MOCK_FIELD_MAPPINGS: CalmFieldMapping[] = [
  {
    id: 'fm_1',
    version: 'v2.1',
    calm_field: 'testCase.title',
    satip_field: 'test_scenario.name',
    entity_kind: 'TEST_CASE',
    active: true,
  },
  {
    id: 'fm_2',
    version: 'v2.1',
    calm_field: 'testStep.description',
    satip_field: 'test_case.description',
    entity_kind: 'TEST_STEP',
    active: true,
  },
  {
    id: 'fm_3',
    version: 'v2.1',
    calm_field: 'execution.verdict',
    satip_field: 'execution.outcome',
    entity_kind: 'TEST_STEP',
    active: true,
  },
  {
    id: 'fm_4',
    version: 'v2.0',
    calm_field: 'defect.title',
    satip_field: 'defect.summary',
    entity_kind: 'DEFECT',
    active: false,
  },
  {
    id: 'fm_5',
    version: 'v2.1',
    calm_field: 'requirement.globalId',
    satip_field: 'bp_scope_item.calm_ref',
    entity_kind: 'REQUIREMENT',
    active: true,
  },
]

export const BINDING_STATE_LABELS: Record<BindingState, string> = {
  PRE_GENERATED: 'Pre-generated',
  CALM_REQUESTED: 'CALM Requested',
  BOUND: 'Bound',
  READY: 'Ready',
  STALE: 'Stale',
  RETIRED: 'Retired',
}

export const OUTBOX_STATE_PILLS: Record<OutboxState, string> = {
  NEW: 'pill pill-info',
  CLAIMED: 'pill pill-warning',
  DISPATCHED: 'pill pill-brand',
  CONFIRMED: 'pill pill-success',
  FAILED: 'pill pill-danger',
  DEAD_LETTER: 'pill pill-neutral',
}

export const SYNC_STATE_PILLS: Record<SyncState, string> = {
  PENDING: 'pill pill-neutral',
  IN_PROGRESS: 'pill pill-info',
  SUCCEEDED: 'pill pill-success',
  FAILED: 'pill pill-danger',
  SKIPPED: 'pill pill-neutral',
  DEAD_LETTER: 'pill pill-danger',
}
