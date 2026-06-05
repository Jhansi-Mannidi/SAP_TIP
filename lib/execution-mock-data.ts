// ============================================================================
// TEST EXECUTION MOCK DATA
// ============================================================================

export type ExecutionState = 'Pending' | 'InProgress' | 'Paused' | 'Completed' | 'Failed' | 'Aborted'
export type CaseState = 'ToDo' | 'InProgress' | 'Passed' | 'Healed' | 'Failed' | 'Skipped' | 'Defected'

export interface ActiveRun {
  id: string
  type: 'suite' | 'scenario'
  name: string
  code: string
  target_system: {
    sid: string
    client: string
    type: 'DEV' | 'QAS' | 'PRE' | 'PROD'
  }
  runner_pool: {
    id: string
    name: string
  }
  state: ExecutionState
  progress: {
    total: number
    done: number
    in_progress: number
    pending: number
  }
  counts: {
    pass: number
    healed: number
    fail: number
    todo: number
  }
  healing_events: number
  started_at: string
  eta_remaining_mins: number
  elapsed_mins: number
  triggered_by: string
}

export const MOCK_ACTIVE_RUNS: ActiveRun[] = [
  {
    id: 'run_1',
    type: 'suite',
    name: 'Star Cement Cutover Validation Suite',
    code: 'SC_CUTOVER_VAL',
    target_system: { sid: 'STA-CAL', client: '100', type: 'QAS' },
    runner_pool: { id: 'pool_1', name: 'QAS-Pool-A' },
    state: 'InProgress',
    progress: { total: 47, done: 32, in_progress: 8, pending: 7 },
    counts: { pass: 28, healed: 3, fail: 1, todo: 15 },
    healing_events: 4,
    started_at: '2026-05-07T09:00:00+05:30',
    eta_remaining_mins: 45,
    elapsed_mins: 95,
    triggered_by: 'P.Sharma',
  },
  {
    id: 'run_2',
    type: 'suite',
    name: 'SD Core Regression Suite',
    code: 'SD_CORE_REG',
    target_system: { sid: 'Q01', client: '200', type: 'QAS' },
    runner_pool: { id: 'pool_2', name: 'QAS-Pool-B' },
    state: 'InProgress',
    progress: { total: 28, done: 14, in_progress: 4, pending: 10 },
    counts: { pass: 12, healed: 2, fail: 0, todo: 14 },
    healing_events: 2,
    started_at: '2026-05-07T10:30:00+05:30',
    eta_remaining_mins: 35,
    elapsed_mins: 40,
    triggered_by: 'J.Rao',
  },
  {
    id: 'run_3',
    type: 'scenario',
    name: 'OTC Happy Path Domestic',
    code: 'OTC_HAPPY_DOM',
    target_system: { sid: 'D01', client: '100', type: 'DEV' },
    runner_pool: { id: 'pool_3', name: 'DEV-Pool' },
    state: 'InProgress',
    progress: { total: 7, done: 4, in_progress: 1, pending: 2 },
    counts: { pass: 4, healed: 0, fail: 0, todo: 3 },
    healing_events: 0,
    started_at: '2026-05-07T11:15:00+05:30',
    eta_remaining_mins: 8,
    elapsed_mins: 12,
    triggered_by: 'M.Reddy',
  },
  {
    id: 'run_4',
    type: 'suite',
    name: 'FI Month-End Close',
    code: 'FI_MEC',
    target_system: { sid: 'Q01', client: '200', type: 'QAS' },
    runner_pool: { id: 'pool_2', name: 'QAS-Pool-B' },
    state: 'InProgress',
    progress: { total: 18, done: 6, in_progress: 2, pending: 10 },
    counts: { pass: 5, healed: 1, fail: 0, todo: 12 },
    healing_events: 1,
    started_at: '2026-05-07T10:45:00+05:30',
    eta_remaining_mins: 50,
    elapsed_mins: 30,
    triggered_by: 'S.Kumar',
  },
]

// Scheduled Runs
export type TriggerType = 'manual' | 'scheduled' | 'on_transport_release' | 'on_phase_gate'
export type SuiteKind = 'regression' | 'cutover' | 'smoke' | 'hypercare'

export interface ScheduledRun {
  id: string
  scheduled_at: string
  suite: {
    id: string
    name: string
    code: string
    kind: SuiteKind
  }
  trigger_type: TriggerType
  triggered_by_user?: string
  target_system: {
    sid: string
    client: string
  }
  runner_pool: string
  estimated_duration_mins: number
}

export const MOCK_SCHEDULED_RUNS: ScheduledRun[] = [
  {
    id: 'sched_1',
    scheduled_at: '2026-05-07T14:00:00+05:30',
    suite: { id: 's_1', name: 'OTC Full Regression', code: 'OTC_FULL_REG', kind: 'regression' },
    trigger_type: 'scheduled',
    target_system: { sid: 'Q01', client: '200' },
    runner_pool: 'QAS-Pool-A',
    estimated_duration_mins: 120,
  },
  {
    id: 'sched_2',
    scheduled_at: '2026-05-07T18:00:00+05:30',
    suite: { id: 's_2', name: 'Weekly Full Regression', code: 'WEEKLY_FULL', kind: 'regression' },
    trigger_type: 'scheduled',
    target_system: { sid: 'Q01', client: '200' },
    runner_pool: 'QAS-Pool-A',
    estimated_duration_mins: 240,
  },
  {
    id: 'sched_3',
    scheduled_at: '2026-05-08T02:00:00+05:30',
    suite: { id: 's_3', name: 'Hypercare Smoke Run', code: 'HC_SMOKE', kind: 'hypercare' },
    trigger_type: 'scheduled',
    target_system: { sid: 'P01', client: '100' },
    runner_pool: 'PROD-Pool',
    estimated_duration_mins: 30,
  },
  {
    id: 'sched_4',
    scheduled_at: '2026-05-08T09:00:00+05:30',
    suite: { id: 's_4', name: 'SD Core Regression', code: 'SD_CORE_REG', kind: 'regression' },
    trigger_type: 'manual',
    triggered_by_user: 'J.Rao',
    target_system: { sid: 'Q01', client: '200' },
    runner_pool: 'QAS-Pool-B',
    estimated_duration_mins: 90,
  },
  {
    id: 'sched_5',
    scheduled_at: '2026-05-08T12:00:00+05:30',
    suite: { id: 's_5', name: 'Cutover Readiness Check', code: 'CUT_READY', kind: 'cutover' },
    trigger_type: 'on_phase_gate',
    target_system: { sid: 'PRE', client: '100' },
    runner_pool: 'PRE-Pool',
    estimated_duration_mins: 180,
  },
  {
    id: 'sched_6',
    scheduled_at: '2026-05-08T15:00:00+05:30',
    suite: { id: 's_6', name: 'Transport Validation', code: 'TR_VAL', kind: 'smoke' },
    trigger_type: 'on_transport_release',
    target_system: { sid: 'Q01', client: '200' },
    runner_pool: 'QAS-Pool-A',
    estimated_duration_mins: 45,
  },
]

// My Tasks (Human tasks)
export interface HumanTask {
  id: string
  name: string
  scenario: {
    id: string
    name: string
  }
  suite: {
    id: string
    name: string
    execution_id: string
  }
  task_type: string
  state: 'ToDo' | 'InProgress'
  assigned_at: string
  due_at?: string
}

export const MOCK_HUMAN_TASKS: HumanTask[] = [
  {
    id: 'ht_1',
    name: 'Sign Off OTC Happy Path Scenario',
    scenario: { id: 'sc_1', name: 'OTC Happy Path Domestic' },
    suite: { id: 's_1', name: 'SC_CUTOVER_VAL', execution_id: 'run_1' },
    task_type: 'sign_off',
    state: 'ToDo',
    assigned_at: '2026-05-07T10:30:00+05:30',
  },
  {
    id: 'ht_2',
    name: 'Sign Off PTP Standard Flow Scenario',
    scenario: { id: 'sc_2', name: 'PTP Standard PO Flow' },
    suite: { id: 's_1', name: 'SC_CUTOVER_VAL', execution_id: 'run_1' },
    task_type: 'sign_off',
    state: 'ToDo',
    assigned_at: '2026-05-07T10:45:00+05:30',
  },
  {
    id: 'ht_3',
    name: 'Sign Off FI Posting Scenario',
    scenario: { id: 'sc_3', name: 'FI Document Posting' },
    suite: { id: 's_1', name: 'SC_CUTOVER_VAL', execution_id: 'run_1' },
    task_type: 'sign_off',
    state: 'ToDo',
    assigned_at: '2026-05-07T11:00:00+05:30',
  },
  {
    id: 'ht_4',
    name: 'Accept Deviation: Tax Rounding',
    scenario: { id: 'sc_4', name: 'OTC with Tax Calculation' },
    suite: { id: 's_2', name: 'SD_CORE_REG', execution_id: 'run_2' },
    task_type: 'accept_deviation',
    state: 'InProgress',
    assigned_at: '2026-05-07T11:15:00+05:30',
    due_at: '2026-05-07T17:00:00+05:30',
  },
  {
    id: 'ht_5',
    name: 'Approve Cutover Go-Live',
    scenario: { id: 'sc_5', name: 'Cutover Final Validation' },
    suite: { id: 's_5', name: 'CUT_READY', execution_id: 'run_5' },
    task_type: 'approval_gate',
    state: 'ToDo',
    assigned_at: '2026-05-07T09:00:00+05:30',
    due_at: '2026-05-08T18:00:00+05:30',
  },
]

// Agent Tasks
export interface AgentTask {
  id: string
  name: string
  scenario: {
    id: string
    name: string
  }
  suite: {
    id: string
    name: string
    execution_id: string
  }
  agent: {
    id: string
    name: string
    type: 'executor' | 'healing' | 'generator'
  }
  task_type: string
  state: 'ToDo' | 'InProgress' | 'Completed'
  confidence?: number
  outcome?: 'success' | 'healed' | 'failed'
  started_at?: string
  completed_at?: string
}

export const MOCK_AGENT_TASKS: AgentTask[] = [
  {
    id: 'at_1',
    name: 'Execute VA01 Create Sales Order',
    scenario: { id: 'sc_1', name: 'OTC Happy Path Domestic' },
    suite: { id: 's_1', name: 'SC_CUTOVER_VAL', execution_id: 'run_1' },
    agent: { id: 'ag_1', name: 'Executor Agent', type: 'executor' },
    task_type: 'run_transaction',
    state: 'Completed',
    confidence: 0.98,
    outcome: 'success',
    started_at: '2026-05-07T09:15:00+05:30',
    completed_at: '2026-05-07T09:18:00+05:30',
  },
  {
    id: 'at_2',
    name: 'Heal ME21N Selector Issue',
    scenario: { id: 'sc_2', name: 'PTP Standard PO Flow' },
    suite: { id: 's_1', name: 'SC_CUTOVER_VAL', execution_id: 'run_1' },
    agent: { id: 'ag_2', name: 'Healing Agent', type: 'healing' },
    task_type: 'heal_failure',
    state: 'Completed',
    confidence: 0.87,
    outcome: 'healed',
    started_at: '2026-05-07T09:45:00+05:30',
    completed_at: '2026-05-07T09:46:00+05:30',
  },
  {
    id: 'at_3',
    name: 'Execute MIGO Goods Receipt',
    scenario: { id: 'sc_3', name: 'MM Goods Movement' },
    suite: { id: 's_1', name: 'SC_CUTOVER_VAL', execution_id: 'run_1' },
    agent: { id: 'ag_1', name: 'Executor Agent', type: 'executor' },
    task_type: 'run_transaction',
    state: 'InProgress',
    started_at: '2026-05-07T11:30:00+05:30',
  },
]

// Suite Execution Detail
export interface SuiteExecution {
  id: string
  suite: {
    id: string
    name: string
    code: string
  }
  state: ExecutionState
  target_system: {
    sid: string
    client: string
    type: 'DEV' | 'QAS' | 'PRE' | 'PROD'
  }
  runner_pool: {
    id: string
    name: string
    utilization: number
  }
  triggered_by: {
    type: TriggerType
    user?: string
  }
  started_at: string
  completed_at?: string
  eta_remaining_mins?: number
  progress: {
    total_scenarios: number
    done_scenarios: number
    in_progress_scenarios: number
    pending_scenarios: number
  }
  case_counts: {
    total: number
    pass: number
    healed: number
    fail: number
    todo: number
  }
  healing_events: number
  defects_raised: number
  pass_rate: number
}

export const MOCK_SUITE_EXECUTION: SuiteExecution = {
  id: 'run_1',
  suite: { id: 'suite_1', name: 'Star Cement Cutover Validation Suite', code: 'SC_CUTOVER_VAL' },
  state: 'InProgress',
  target_system: { sid: 'STA-CAL', client: '100', type: 'QAS' },
  runner_pool: { id: 'pool_1', name: 'QAS-Pool-A', utilization: 65 },
  triggered_by: { type: 'manual', user: 'P.Sharma' },
  started_at: '2026-05-07T09:00:00+05:30',
  eta_remaining_mins: 45,
  progress: { total_scenarios: 47, done_scenarios: 32, in_progress_scenarios: 8, pending_scenarios: 7 },
  case_counts: { total: 312, pass: 186, healed: 18, fail: 6, todo: 102 },
  healing_events: 4,
  defects_raised: 1,
  pass_rate: 87.5,
}

// Scenario Executions within a Suite
export interface ScenarioExecution {
  id: string
  scenario: {
    id: string
    name: string
    code: string
  }
  business_process: string
  modules: string[]
  state: ExecutionState
  case_counts: {
    pass: number
    healed: number
    fail: number
    todo: number
  }
  started_at?: string
  completed_at?: string
  duration_mins?: number
}

export const MOCK_SCENARIO_EXECUTIONS: ScenarioExecution[] = [
  { id: 'se_1', scenario: { id: 'sc_1', name: 'OTC Happy Path Domestic', code: 'OTC_HAPPY_DOM' }, business_process: 'Order to Cash', modules: ['SD', 'FI'], state: 'Completed', case_counts: { pass: 5, healed: 1, fail: 1, todo: 0 }, started_at: '2026-05-07T09:00:00+05:30', completed_at: '2026-05-07T09:25:00+05:30', duration_mins: 25 },
  { id: 'se_2', scenario: { id: 'sc_2', name: 'OTC with Credit Hold', code: 'OTC_CREDIT' }, business_process: 'Order to Cash', modules: ['SD', 'FI'], state: 'Completed', case_counts: { pass: 6, healed: 0, fail: 0, todo: 0 }, started_at: '2026-05-07T09:25:00+05:30', completed_at: '2026-05-07T09:45:00+05:30', duration_mins: 20 },
  { id: 'se_3', scenario: { id: 'sc_3', name: 'PTP Standard PO Flow', code: 'PTP_STD' }, business_process: 'Procure to Pay', modules: ['MM', 'FI'], state: 'Completed', case_counts: { pass: 8, healed: 2, fail: 0, todo: 0 }, started_at: '2026-05-07T09:30:00+05:30', completed_at: '2026-05-07T10:00:00+05:30', duration_mins: 30 },
  { id: 'se_4', scenario: { id: 'sc_4', name: 'FI Document Posting', code: 'FI_DOC_POST' }, business_process: 'Record to Report', modules: ['FI'], state: 'InProgress', case_counts: { pass: 3, healed: 0, fail: 0, todo: 2 }, started_at: '2026-05-07T10:00:00+05:30' },
  { id: 'se_5', scenario: { id: 'sc_5', name: 'MM Goods Movement', code: 'MM_GOODS' }, business_process: 'Procure to Pay', modules: ['MM', 'WM'], state: 'InProgress', case_counts: { pass: 2, healed: 1, fail: 0, todo: 3 }, started_at: '2026-05-07T10:15:00+05:30' },
  { id: 'se_6', scenario: { id: 'sc_6', name: 'OTC Export with LC', code: 'OTC_EXPORT' }, business_process: 'Order to Cash', modules: ['SD', 'FI', 'LE'], state: 'Pending', case_counts: { pass: 0, healed: 0, fail: 0, todo: 8 } },
  { id: 'se_7', scenario: { id: 'sc_7', name: 'Intercompany Sales', code: 'IC_SALES' }, business_process: 'Order to Cash', modules: ['SD', 'FI'], state: 'Pending', case_counts: { pass: 0, healed: 0, fail: 0, todo: 6 } },
]

// Test Case Executions
export interface CaseExecution {
  id: string
  case: {
    id: string
    name: string
    code: string
  }
  task_type: string
  assignee_class: 'agent' | 'human'
  assignee?: {
    id: string
    name: string
    role?: string
    agent_type?: 'executor' | 'healing'
  }
  state: CaseState
  runner_id?: string
  started_at?: string
  completed_at?: string
  duration_secs?: number
  healing_event_count: number
  defect_id?: string
  retry_count: number
}

export const MOCK_CASE_EXECUTIONS: CaseExecution[] = [
  { id: 'ce_1', case: { id: 'tc_1', name: 'Create Sales Order via VA01', code: 'VA01_CREATE' }, task_type: 'run_transaction', assignee_class: 'agent', assignee: { id: 'ag_1', name: 'Executor Agent', agent_type: 'executor' }, state: 'Passed', runner_id: 'runner_1', started_at: '2026-05-07T09:00:00+05:30', completed_at: '2026-05-07T09:03:00+05:30', duration_secs: 180, healing_event_count: 0, retry_count: 0 },
  { id: 'ce_2', case: { id: 'tc_2', name: 'Add Line Items', code: 'VA01_LINES' }, task_type: 'run_transaction', assignee_class: 'agent', assignee: { id: 'ag_1', name: 'Executor Agent', agent_type: 'executor' }, state: 'Passed', runner_id: 'runner_1', started_at: '2026-05-07T09:03:00+05:30', completed_at: '2026-05-07T09:06:00+05:30', duration_secs: 180, healing_event_count: 0, retry_count: 0 },
  { id: 'ce_3', case: { id: 'tc_3', name: 'Check Availability', code: 'VA01_ATP' }, task_type: 'verify_data', assignee_class: 'agent', assignee: { id: 'ag_1', name: 'Executor Agent', agent_type: 'executor' }, state: 'Healed', runner_id: 'runner_2', started_at: '2026-05-07T09:06:00+05:30', completed_at: '2026-05-07T09:10:00+05:30', duration_secs: 240, healing_event_count: 1, retry_count: 1 },
  { id: 'ce_4', case: { id: 'tc_4', name: 'Save Sales Order', code: 'VA01_SAVE' }, task_type: 'run_transaction', assignee_class: 'agent', assignee: { id: 'ag_1', name: 'Executor Agent', agent_type: 'executor' }, state: 'Passed', runner_id: 'runner_1', started_at: '2026-05-07T09:10:00+05:30', completed_at: '2026-05-07T09:12:00+05:30', duration_secs: 120, healing_event_count: 0, retry_count: 0 },
  { id: 'ce_5', case: { id: 'tc_5', name: 'Create Delivery VL01N', code: 'VL01N_CREATE' }, task_type: 'run_transaction', assignee_class: 'agent', assignee: { id: 'ag_1', name: 'Executor Agent', agent_type: 'executor' }, state: 'Passed', runner_id: 'runner_3', started_at: '2026-05-07T09:12:00+05:30', completed_at: '2026-05-07T09:16:00+05:30', duration_secs: 240, healing_event_count: 0, retry_count: 0 },
  { id: 'ce_6', case: { id: 'tc_6', name: 'Post Goods Issue', code: 'VL02N_PGI' }, task_type: 'run_transaction', assignee_class: 'agent', assignee: { id: 'ag_1', name: 'Executor Agent', agent_type: 'executor' }, state: 'Failed', runner_id: 'runner_2', started_at: '2026-05-07T09:16:00+05:30', completed_at: '2026-05-07T09:20:00+05:30', duration_secs: 240, healing_event_count: 0, defect_id: 'def_1', retry_count: 2 },
  { id: 'ce_7', case: { id: 'tc_7', name: 'Sign Off Scenario', code: 'SIGNOFF' }, task_type: 'sign_off', assignee_class: 'human', assignee: { id: 'u_1', name: 'P.Sharma', role: 'QA Lead' }, state: 'ToDo', healing_event_count: 0, retry_count: 0 },
]

// Healing Events in a run
export interface RunHealingEvent {
  id: string
  case: {
    id: string
    name: string
    execution_id: string
  }
  failure_class: string
  repair_strategy: string
  confidence: number
  outcome: 'Repaired Successfully' | 'Repair Failed' | 'Unrepairable' | 'Repair Deferred'
  agent: {
    id: string
    name: string
  }
  occurred_at: string
  promoted: boolean
}

export const MOCK_RUN_HEALINGS: RunHealingEvent[] = [
  { id: 'rh_1', case: { id: 'tc_3', name: 'Check Availability', execution_id: 'ce_3' }, failure_class: 'extra_modal', repair_strategy: 'close_modal', confidence: 0.93, outcome: 'Repaired Successfully', agent: { id: 'ag_2', name: 'Healing Agent' }, occurred_at: '2026-05-07T09:08:00+05:30', promoted: false },
  { id: 'rh_2', case: { id: 'tc_8', name: 'ME21N Create PO', execution_id: 'ce_8' }, failure_class: 'changed_layout', repair_strategy: 'modify_selector', confidence: 0.87, outcome: 'Repaired Successfully', agent: { id: 'ag_2', name: 'Healing Agent' }, occurred_at: '2026-05-07T09:35:00+05:30', promoted: true },
  { id: 'rh_3', case: { id: 'tc_12', name: 'MIGO Goods Receipt', execution_id: 'ce_12' }, failure_class: 'element_not_found', repair_strategy: 'retry_with_fallback', confidence: 0.78, outcome: 'Repaired Successfully', agent: { id: 'ag_2', name: 'Healing Agent' }, occurred_at: '2026-05-07T10:20:00+05:30', promoted: false },
  { id: 'rh_4', case: { id: 'tc_15', name: 'FB01 Post Document', execution_id: 'ce_15' }, failure_class: 'unknown', repair_strategy: 'none', confidence: 0.0, outcome: 'Repair Deferred', agent: { id: 'ag_2', name: 'Healing Agent' }, occurred_at: '2026-05-07T10:45:00+05:30', promoted: false },
]

// Past Runs
export interface PastRun {
  id: string
  type: 'suite' | 'scenario'
  name: string
  code: string
  target_system: {
    sid: string
    client: string
  }
  state: 'Completed' | 'Failed' | 'Aborted'
  started_at: string
  completed_at: string
  duration_mins: number
  case_counts: {
    total: number
    pass: number
    healed: number
    fail: number
  }
  pass_rate: number
  healing_events: number
  defects_raised: number
  triggered_by: string
}

export const MOCK_PAST_RUNS: PastRun[] = [
  { id: 'pr_1', type: 'suite', name: 'SC Cutover Validation', code: 'SC_CUTOVER_VAL', target_system: { sid: 'Q01', client: '200' }, state: 'Completed', started_at: '2026-05-06T09:00:00+05:30', completed_at: '2026-05-06T11:30:00+05:30', duration_mins: 150, case_counts: { total: 312, pass: 295, healed: 12, fail: 5 }, pass_rate: 94.6, healing_events: 12, defects_raised: 2, triggered_by: 'P.Sharma' },
  { id: 'pr_2', type: 'suite', name: 'SD Core Regression', code: 'SD_CORE_REG', target_system: { sid: 'Q01', client: '200' }, state: 'Completed', started_at: '2026-05-05T14:00:00+05:30', completed_at: '2026-05-05T15:30:00+05:30', duration_mins: 90, case_counts: { total: 186, pass: 180, healed: 4, fail: 2 }, pass_rate: 96.8, healing_events: 4, defects_raised: 1, triggered_by: 'J.Rao' },
  { id: 'pr_3', type: 'suite', name: 'Hypercare Smoke', code: 'HC_SMOKE', target_system: { sid: 'P01', client: '100' }, state: 'Completed', started_at: '2026-05-05T02:00:00+05:30', completed_at: '2026-05-05T02:25:00+05:30', duration_mins: 25, case_counts: { total: 45, pass: 45, healed: 0, fail: 0 }, pass_rate: 100, healing_events: 0, defects_raised: 0, triggered_by: 'Scheduled' },
  { id: 'pr_4', type: 'suite', name: 'Weekly Full Regression', code: 'WEEKLY_FULL', target_system: { sid: 'Q01', client: '200' }, state: 'Completed', started_at: '2026-05-04T18:00:00+05:30', completed_at: '2026-05-04T22:00:00+05:30', duration_mins: 240, case_counts: { total: 520, pass: 498, healed: 15, fail: 7 }, pass_rate: 95.8, healing_events: 15, defects_raised: 3, triggered_by: 'Scheduled' },
  { id: 'pr_5', type: 'scenario', name: 'OTC Happy Path', code: 'OTC_HAPPY', target_system: { sid: 'D01', client: '100' }, state: 'Completed', started_at: '2026-05-04T11:00:00+05:30', completed_at: '2026-05-04T11:20:00+05:30', duration_mins: 20, case_counts: { total: 7, pass: 7, healed: 0, fail: 0 }, pass_rate: 100, healing_events: 0, defects_raised: 0, triggered_by: 'M.Reddy' },
  { id: 'pr_6', type: 'suite', name: 'FI Month-End Close', code: 'FI_MEC', target_system: { sid: 'Q01', client: '200' }, state: 'Failed', started_at: '2026-05-03T10:00:00+05:30', completed_at: '2026-05-03T11:15:00+05:30', duration_mins: 75, case_counts: { total: 120, pass: 105, healed: 8, fail: 7 }, pass_rate: 87.5, healing_events: 8, defects_raised: 4, triggered_by: 'S.Kumar' },
  { id: 'pr_7', type: 'suite', name: 'Transport Validation', code: 'TR_VAL', target_system: { sid: 'Q01', client: '200' }, state: 'Completed', started_at: '2026-05-03T15:00:00+05:30', completed_at: '2026-05-03T15:40:00+05:30', duration_mins: 40, case_counts: { total: 65, pass: 63, healed: 2, fail: 0 }, pass_rate: 96.9, healing_events: 2, defects_raised: 0, triggered_by: 'On Transport' },
  { id: 'pr_8', type: 'suite', name: 'MM Regression', code: 'MM_REG', target_system: { sid: 'Q01', client: '200' }, state: 'Completed', started_at: '2026-05-02T09:00:00+05:30', completed_at: '2026-05-02T10:30:00+05:30', duration_mins: 90, case_counts: { total: 145, pass: 140, healed: 3, fail: 2 }, pass_rate: 96.6, healing_events: 3, defects_raised: 1, triggered_by: 'J.Rao' },
  { id: 'pr_9', type: 'suite', name: 'Hypercare Smoke', code: 'HC_SMOKE', target_system: { sid: 'P01', client: '100' }, state: 'Completed', started_at: '2026-05-02T02:00:00+05:30', completed_at: '2026-05-02T02:28:00+05:30', duration_mins: 28, case_counts: { total: 45, pass: 44, healed: 1, fail: 0 }, pass_rate: 97.8, healing_events: 1, defects_raised: 0, triggered_by: 'Scheduled' },
  { id: 'pr_10', type: 'suite', name: 'Cutover Dry Run 2', code: 'CUT_DRY_2', target_system: { sid: 'PRE', client: '100' }, state: 'Completed', started_at: '2026-05-01T06:00:00+05:30', completed_at: '2026-05-01T10:00:00+05:30', duration_mins: 240, case_counts: { total: 312, pass: 300, healed: 8, fail: 4 }, pass_rate: 96.2, healing_events: 8, defects_raised: 2, triggered_by: 'P.Sharma' },
  { id: 'pr_11', type: 'suite', name: 'SD Core Regression', code: 'SD_CORE_REG', target_system: { sid: 'Q01', client: '200' }, state: 'Aborted', started_at: '2026-04-30T14:00:00+05:30', completed_at: '2026-04-30T14:45:00+05:30', duration_mins: 45, case_counts: { total: 186, pass: 85, healed: 2, fail: 3 }, pass_rate: 45.7, healing_events: 2, defects_raised: 1, triggered_by: 'J.Rao' },
  { id: 'pr_12', type: 'suite', name: 'Weekly Full Regression', code: 'WEEKLY_FULL', target_system: { sid: 'Q01', client: '200' }, state: 'Completed', started_at: '2026-04-27T18:00:00+05:30', completed_at: '2026-04-27T22:15:00+05:30', duration_mins: 255, case_counts: { total: 520, pass: 505, healed: 10, fail: 5 }, pass_rate: 97.1, healing_events: 10, defects_raised: 2, triggered_by: 'Scheduled' },
  { id: 'pr_13', type: 'suite', name: 'Cutover Dry Run 1', code: 'CUT_DRY_1', target_system: { sid: 'PRE', client: '100' }, state: 'Completed', started_at: '2026-04-25T06:00:00+05:30', completed_at: '2026-04-25T10:30:00+05:30', duration_mins: 270, case_counts: { total: 312, pass: 285, healed: 15, fail: 12 }, pass_rate: 91.3, healing_events: 15, defects_raised: 6, triggered_by: 'P.Sharma' },
  { id: 'pr_14', type: 'suite', name: 'Integration Test', code: 'INT_TEST', target_system: { sid: 'Q01', client: '200' }, state: 'Completed', started_at: '2026-04-22T09:00:00+05:30', completed_at: '2026-04-22T12:00:00+05:30', duration_mins: 180, case_counts: { total: 280, pass: 265, healed: 10, fail: 5 }, pass_rate: 94.6, healing_events: 10, defects_raised: 3, triggered_by: 'M.Reddy' },
  { id: 'pr_15', type: 'suite', name: 'Hypercare Smoke', code: 'HC_SMOKE', target_system: { sid: 'P01', client: '100' }, state: 'Completed', started_at: '2026-04-20T02:00:00+05:30', completed_at: '2026-04-20T02:30:00+05:30', duration_mins: 30, case_counts: { total: 45, pass: 45, healed: 0, fail: 0 }, pass_rate: 100, healing_events: 0, defects_raised: 0, triggered_by: 'Scheduled' },
]

// Replay Surface data
export interface ReplayStep {
  order: number
  step_type: 'navigate' | 'click' | 'input' | 'select' | 'assert' | 'wait' | 'scroll' | 'screenshot' | 'api_call'
  description: string
  state: 'passed' | 'failed' | 'healed' | 'pending'
  duration_ms: number
  screenshot_url?: string
  healing_event?: {
    failure_class: string
    repair_strategy: string
    confidence: number
  }
}

export interface StatusBarEntry {
  timestamp: string
  type: 'S' | 'W' | 'E' | 'A' | 'I'  // Success, Warning, Error, Action, Info
  message: string
}

export interface ActionLogEntry {
  timestamp: string
  action: string
  arguments: string[]
  result?: string
}

export const MOCK_REPLAY_STEPS: ReplayStep[] = [
  { order: 1, step_type: 'navigate', description: 'Navigate to VA01 - Create Sales Order', state: 'passed', duration_ms: 1200, screenshot_url: '/mock/va01_initial.png' },
  { order: 2, step_type: 'input', description: 'Enter Order Type "OR" in field VBAK-AUART', state: 'passed', duration_ms: 450, screenshot_url: '/mock/va01_order_type.png' },
  { order: 3, step_type: 'input', description: 'Enter Sales Org "1000" in field VBAK-VKORG', state: 'passed', duration_ms: 380, screenshot_url: '/mock/va01_sales_org.png' },
  { order: 4, step_type: 'input', description: 'Enter Distribution Channel "10" in field VBAK-VTWEG', state: 'passed', duration_ms: 350, screenshot_url: '/mock/va01_dist_channel.png' },
  { order: 5, step_type: 'input', description: 'Enter Division "00" in field VBAK-SPART', state: 'passed', duration_ms: 320, screenshot_url: '/mock/va01_division.png' },
  { order: 6, step_type: 'click', description: 'Press Enter to continue', state: 'passed', duration_ms: 2100, screenshot_url: '/mock/va01_overview.png' },
  { order: 7, step_type: 'input', description: 'Enter Sold-to Party "10001" in field KUAGV-KUNNR', state: 'passed', duration_ms: 480, screenshot_url: '/mock/va01_sold_to.png' },
  { order: 8, step_type: 'input', description: 'Enter PO Number "PO-2026-001" in field VBKD-BSTKD', state: 'passed', duration_ms: 420, screenshot_url: '/mock/va01_po_number.png' },
  { order: 9, step_type: 'input', description: 'Enter Material "CEMENT-50KG" in first line item', state: 'passed', duration_ms: 550, screenshot_url: '/mock/va01_material.png' },
  { order: 10, step_type: 'click', description: 'Press Enter to validate', state: 'healed', duration_ms: 3500, screenshot_url: '/mock/va01_modal.png', healing_event: { failure_class: 'extra_modal', repair_strategy: 'close_modal', confidence: 0.93 } },
  { order: 11, step_type: 'assert', description: 'Verify ATP availability confirmed', state: 'passed', duration_ms: 280, screenshot_url: '/mock/va01_atp.png' },
  { order: 12, step_type: 'click', description: 'Click Save button to create order', state: 'passed', duration_ms: 2800, screenshot_url: '/mock/va01_saved.png' },
]

export const MOCK_STATUS_BAR: StatusBarEntry[] = [
  { timestamp: '09:00:01', type: 'I', message: 'Starting transaction VA01' },
  { timestamp: '09:00:02', type: 'S', message: 'Transaction VA01 started successfully' },
  { timestamp: '09:00:03', type: 'A', message: 'Entering order type OR' },
  { timestamp: '09:00:04', type: 'S', message: 'Order type accepted' },
  { timestamp: '09:00:08', type: 'A', message: 'Pressing Enter to navigate to overview screen' },
  { timestamp: '09:00:10', type: 'S', message: 'Overview screen displayed' },
  { timestamp: '09:00:15', type: 'A', message: 'Entering sold-to party 10001' },
  { timestamp: '09:00:16', type: 'S', message: 'Customer data retrieved' },
  { timestamp: '09:00:25', type: 'A', message: 'Pressing Enter to validate material' },
  { timestamp: '09:00:27', type: 'W', message: 'Unexpected modal dialog detected' },
  { timestamp: '09:00:28', type: 'I', message: 'Healing Agent activated - attempting close_modal strategy' },
  { timestamp: '09:00:29', type: 'S', message: 'Modal closed successfully (confidence: 0.93)' },
  { timestamp: '09:00:30', type: 'S', message: 'ATP check completed - material available' },
  { timestamp: '09:00:35', type: 'A', message: 'Saving sales order' },
  { timestamp: '09:00:38', type: 'S', message: 'Sales order 4500000123 created successfully' },
]

export const MOCK_ACTION_LOG: ActionLogEntry[] = [
  { timestamp: '09:00:01.123', action: 'startTransaction', arguments: ['VA01'], result: 'OK' },
  { timestamp: '09:00:02.456', action: 'findById', arguments: ["wnd[0]/usr/ctxtVBAK-AUART"], result: 'Found' },
  { timestamp: '09:00:02.789', action: 'setText', arguments: ["wnd[0]/usr/ctxtVBAK-AUART", "OR"], result: 'OK' },
  { timestamp: '09:00:03.123', action: 'findById', arguments: ["wnd[0]/usr/ctxtVBAK-VKORG"], result: 'Found' },
  { timestamp: '09:00:03.456', action: 'setText', arguments: ["wnd[0]/usr/ctxtVBAK-VKORG", "1000"], result: 'OK' },
  { timestamp: '09:00:08.123', action: 'sendVKey', arguments: ['0'], result: 'OK' },
  { timestamp: '09:00:10.456', action: 'findById', arguments: ["wnd[0]/usr/subSUBSCREEN_HEADER"], result: 'Found' },
  { timestamp: '09:00:15.123', action: 'findById', arguments: ["wnd[0]/usr/subSUBSCREEN_HEADER/ssubCUSTOMER/ctxtKUAGV-KUNNR"], result: 'Found' },
  { timestamp: '09:00:15.456', action: 'setText', arguments: ["wnd[0]/usr/.../ctxtKUAGV-KUNNR", "10001"], result: 'OK' },
  { timestamp: '09:00:25.123', action: 'sendVKey', arguments: ['0'], result: 'OK' },
  { timestamp: '09:00:27.456', action: 'findById', arguments: ["wnd[1]"], result: 'Found - UNEXPECTED' },
  { timestamp: '09:00:28.123', action: 'press', arguments: ["wnd[1]/tbar[0]/btn[0]"], result: 'OK (healed)' },
  { timestamp: '09:00:35.123', action: 'press', arguments: ["wnd[0]/tbar[0]/btn[11]"], result: 'OK' },
  { timestamp: '09:00:38.456', action: 'getStatusBarText', arguments: [], result: 'Sales order 4500000123 created' },
]

// Sign-off data
export interface SignOffApprover {
  id: string
  role: string
  name: string
  state: 'pending' | 'signed' | 'rejected'
  signed_at?: string
}

export const MOCK_SIGNOFF_APPROVERS: SignOffApprover[] = [
  { id: 'sa_1', role: 'QA Lead', name: 'J.Rao', state: 'signed', signed_at: '2026-05-07T10:30:00+05:30' },
  { id: 'sa_2', role: 'Test Manager', name: 'P.Sharma', state: 'pending' },
  { id: 'sa_3', role: 'Business Owner', name: 'R.Patel', state: 'pending' },
]

// KPI data
export interface ExecutionKPIs {
  active_suites: number
  active_scenarios: number
  cases_in_progress: number
  healing_events_last_hour: number
  runner_pool_utilization: number
}

export const MOCK_EXECUTION_KPIS: ExecutionKPIs = {
  active_suites: 3,
  active_scenarios: 12,
  cases_in_progress: 15,
  healing_events_last_hour: 4,
  runner_pool_utilization: 72,
}
