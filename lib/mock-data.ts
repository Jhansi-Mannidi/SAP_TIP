// MOCK DATA - Replace with real data hooks in production
// Section 2 - Sample Mock Data Bundle from SAP Test Assurance Specification

import type { MigrationKind, MigrationState } from './types'

// ============================================================================
// CORE MIGRATION CONTEXT
// ============================================================================

export const MOCK_MIGRATION = {
  id: 'mig_01H8X9N4',
  code: 'SC_S4_CUTOVER_2026',
  name: 'Star Cement S/4HANA Brownfield Migration',
  migration_kind: 'brownfield' as MigrationKind,
  state: 'Realization' as MigrationState,
  source_system_id: 'STA-ECC',
  target_system_id: 'S4H',
  program_owner: { name: 'Pradeep Sharma', role: 'Migration Manager' },
  cio: { name: 'Kaushik Iyer' },
  sponsoring_si_partner: 'Northstar Consulting',
  planned_cutover_date: '2026-08-15',
  scope_modules: ['SD', 'MM', 'FI', 'CO', 'PP', 'WM'],
  scope_business_processes: ['OTC', 'PTP', 'RTR'],
  bp_coverage_pct: 84,
  si_items_total: 96,
  si_items_closed: 73,
  abap_findings_total: 503,
  abap_findings_closed: 412,
  regression_pass_rate_pct: 91,
  healing_rate_pct: 12,
  open_critical_defects: 2,
  days_to_cutover: 84,
  cutover_readiness_score: 78,
}

// ============================================================================
// TRANSPORT REQUESTS
// ============================================================================

export const MOCK_TRANSPORTS = [
  {
    tr_number: 'STAK900123',
    description: 'ME21N field ZTERM made required',
    state: 'Test_Plan_Ready',
    risk_score: 0.62,
    owner: 'M.Reddy',
    linked_test_count: 14,
    classified_objects: { PROG: 1, TABL: 0, CUS0: 1 },
    system: 'STA',
  },
  {
    tr_number: 'STAK900124',
    description: 'Sales document type ZOR1 customizing',
    state: 'Released_QAS',
    risk_score: 0.31,
    owner: 'P.Sharma',
    linked_test_count: 8,
    classified_objects: { CUS0: 3 },
    system: 'STA',
  },
  {
    tr_number: 'STAK900125',
    description: 'Z_INVOICE_AGGREGATOR refactor for S/4',
    state: 'In_Test',
    risk_score: 0.84,
    owner: 'A.Mehta',
    linked_test_count: 22,
    classified_objects: { PROG: 2, FUGR: 1 },
    system: 'STA',
  },
  {
    tr_number: 'STAK900126',
    description: 'Pricing condition table 901 added',
    state: 'Captured',
    risk_score: 0.45,
    owner: 'M.Reddy',
    linked_test_count: 0,
    classified_objects: { TABL: 1, CUS0: 1 },
    system: 'STA',
  },
  {
    tr_number: 'STAK900127',
    description: 'BAdI implementation ZORDER_VALIDATE',
    state: 'Released_PROD',
    risk_score: 0.28,
    owner: 'S.Kumar',
    linked_test_count: 6,
    classified_objects: { CLAS: 1 },
    system: 'STA',
  },
]

// ============================================================================
// TEST SUITES
// ============================================================================

export type TestSuiteState = 'Draft' | 'Published' | 'Deprecated' | 'Archived'

export const MOCK_TEST_SUITES = [
  {
    id: 'sui_1',
    name: 'Star Cement Cutover Validation Suite',
    code: 'SC_CUTOVER_VAL',
    business_processes: ['OTC', 'PTP', 'RTR'],
    modules: ['SD', 'MM', 'FI'],
    scenario_count: 47,
    version: '2.4.0',
    state: 'Published' as TestSuiteState,
    last_pass_rate_pct: 91,
    prev_pass_rate_pct: 88,
    last_executed: '2026-05-07T08:00:00+05:30',
    owner: 'P.Sharma',
  },
  {
    id: 'sui_2',
    name: 'SD Core Regression Suite',
    code: 'SD_CORE_REG',
    business_processes: ['OTC'],
    modules: ['SD'],
    scenario_count: 18,
    version: '4.1.0',
    state: 'Published' as TestSuiteState,
    last_pass_rate_pct: 96,
    prev_pass_rate_pct: 94,
    last_executed: '2026-05-07T10:00:00+05:30',
    owner: 'J.Rao',
  },
  {
    id: 'sui_3',
    name: 'MM Procurement Smoke Suite',
    code: 'MM_SMOKE',
    business_processes: ['PTP'],
    modules: ['MM'],
    scenario_count: 9,
    version: '1.7.0',
    state: 'Published' as TestSuiteState,
    last_pass_rate_pct: 100,
    prev_pass_rate_pct: 100,
    last_executed: '2026-05-07T06:00:00+05:30',
    owner: 'M.Reddy',
  },
  {
    id: 'sui_4',
    name: 'FI Month-End Closing Suite',
    code: 'FI_MEC',
    business_processes: ['RTR'],
    modules: ['FI', 'CO'],
    scenario_count: 24,
    version: '3.0.0',
    state: 'Published' as TestSuiteState,
    last_pass_rate_pct: 88,
    prev_pass_rate_pct: 92,
    last_executed: '2026-05-06T22:00:00+05:30',
    owner: 'A.Mehta',
  },
  {
    id: 'sui_5',
    name: 'Hypercare Smoke Suite',
    code: 'HC_SMOKE',
    business_processes: ['OTC', 'PTP'],
    modules: ['SD', 'MM'],
    scenario_count: 12,
    version: '1.2.0',
    state: 'Published' as TestSuiteState,
    last_pass_rate_pct: 98,
    prev_pass_rate_pct: 95,
    last_executed: '2026-05-05T14:30:00+05:30',
    owner: 'S.Kumar',
  },
  {
    id: 'sui_6',
    name: 'WM Warehouse Operations Suite',
    code: 'WM_OPS',
    business_processes: ['PTP'],
    modules: ['WM', 'MM'],
    scenario_count: 15,
    version: '0.9.0',
    state: 'Draft' as TestSuiteState,
    last_pass_rate_pct: 0,
    prev_pass_rate_pct: 0,
    last_executed: null,
    owner: 'K.Iyer',
  },
  {
    id: 'sui_7',
    name: 'Legacy Credit Check Suite',
    code: 'LEGACY_CREDIT',
    business_processes: ['OTC'],
    modules: ['SD', 'FI'],
    scenario_count: 8,
    version: '1.0.0',
    state: 'Deprecated' as TestSuiteState,
    last_pass_rate_pct: 75,
    prev_pass_rate_pct: 80,
    last_executed: '2026-03-15T10:00:00+05:30',
    owner: 'P.Sharma',
  },
  {
    id: 'sui_8',
    name: 'PP Production Planning Suite',
    code: 'PP_PROD_PLAN',
    business_processes: ['PTP', 'OTC'],
    modules: ['PP', 'MM', 'SD'],
    scenario_count: 31,
    version: '2.1.0',
    state: 'Published' as TestSuiteState,
    last_pass_rate_pct: 94,
    prev_pass_rate_pct: 91,
    last_executed: '2026-05-06T18:00:00+05:30',
    owner: 'J.Rao',
  },
]

// ============================================================================
// TEST SCENARIOS
// ============================================================================

export type ScenarioState = 'Draft' | 'Published' | 'Deprecated' | 'Archived'
export type CustomerScope = 'Global' | 'Customer' | 'Workspace'

export const MOCK_TEST_SCENARIOS = [
  {
    id: 'sc_1',
    name: 'OTC Happy Path Domestic',
    code: 'OTC_HP_DOM',
    business_process: 'OTC',
    modules: ['SD', 'MM', 'FI'],
    task_count: 7,
    state: 'Published' as ScenarioState,
    version: '4.2.0',
    last_pass_rate_pct: 96,
    bp_scope_items: ['BD9', 'BD3'],
    customer_scope: 'Global' as CustomerScope,
    tags: ['regression', 'smoke', 'best-path'],
    ai_generated: false,
  },
  {
    id: 'sc_2',
    name: 'OTC with Credit Hold and Manual Release',
    code: 'OTC_CREDIT',
    business_process: 'OTC',
    modules: ['SD', 'FI'],
    task_count: 9,
    state: 'Published' as ScenarioState,
    version: '2.0.0',
    last_pass_rate_pct: 89,
    bp_scope_items: ['BD9'],
    customer_scope: 'Customer' as CustomerScope,
    tags: ['credit-management', 'edge-case'],
    ai_generated: false,
  },
  {
    id: 'sc_3',
    name: 'PTP with Three-Way Match',
    code: 'PTP_3WM',
    business_process: 'PTP',
    modules: ['MM', 'FI'],
    task_count: 11,
    state: 'Published' as ScenarioState,
    version: '3.1.0',
    last_pass_rate_pct: 94,
    bp_scope_items: ['BFK'],
    customer_scope: 'Global' as CustomerScope,
    tags: ['procurement', 'invoice-verification'],
    ai_generated: false,
  },
  {
    id: 'sc_4',
    name: 'FI Month-End Closing Steps 1-12',
    code: 'FI_MEC_FULL',
    business_process: 'RTR',
    modules: ['FI', 'CO'],
    task_count: 12,
    state: 'Published' as ScenarioState,
    version: '1.5.0',
    last_pass_rate_pct: 88,
    bp_scope_items: [],
    customer_scope: 'Customer' as CustomerScope,
    tags: ['month-end', 'closing', 'critical'],
    ai_generated: false,
  },
  {
    id: 'sc_5',
    name: 'OTC Export Sales with Letter of Credit',
    code: 'OTC_EXPORT_LC',
    business_process: 'OTC',
    modules: ['SD', 'FI'],
    task_count: 14,
    state: 'Published' as ScenarioState,
    version: '1.8.0',
    last_pass_rate_pct: 92,
    bp_scope_items: ['BD9', 'BD4'],
    customer_scope: 'Customer' as CustomerScope,
    tags: ['export', 'letter-of-credit', 'foreign-trade'],
    ai_generated: false,
  },
  {
    id: 'sc_6',
    name: 'OTC Returns Processing',
    code: 'OTC_RETURNS',
    business_process: 'OTC',
    modules: ['SD', 'MM', 'FI'],
    task_count: 8,
    state: 'Published' as ScenarioState,
    version: '2.1.0',
    last_pass_rate_pct: 100,
    bp_scope_items: ['BD9'],
    customer_scope: 'Workspace' as CustomerScope,
    tags: ['returns', 'reverse-logistics'],
    ai_generated: false,
  },
  {
    id: 'sc_7',
    name: 'OTC Intercompany Sales',
    code: 'OTC_INTERCO',
    business_process: 'OTC',
    modules: ['SD', 'FI', 'CO'],
    task_count: 11,
    state: 'Published' as ScenarioState,
    version: '1.3.0',
    last_pass_rate_pct: 85,
    bp_scope_items: ['BD9', 'BD5'],
    customer_scope: 'Customer' as CustomerScope,
    tags: ['intercompany', 'cross-company'],
    ai_generated: false,
  },
  {
    id: 'sc_8',
    name: 'PTP Purchase Order Creation ME21N',
    code: 'PTP_PO_CREATE',
    business_process: 'PTP',
    modules: ['MM'],
    task_count: 6,
    state: 'Published' as ScenarioState,
    version: '3.0.0',
    last_pass_rate_pct: 98,
    bp_scope_items: ['BFK'],
    customer_scope: 'Global' as CustomerScope,
    tags: ['procurement', 'smoke', 'best-path'],
    ai_generated: false,
  },
  {
    id: 'sc_9',
    name: 'PTP Goods Receipt MIGO',
    code: 'PTP_GR_MIGO',
    business_process: 'PTP',
    modules: ['MM', 'WM'],
    task_count: 5,
    state: 'Published' as ScenarioState,
    version: '2.5.0',
    last_pass_rate_pct: 100,
    bp_scope_items: ['BFK', 'BFL'],
    customer_scope: 'Global' as CustomerScope,
    tags: ['goods-receipt', 'warehouse'],
    ai_generated: false,
  },
  {
    id: 'sc_10',
    name: 'PTP Invoice Verification MIRO',
    code: 'PTP_IV_MIRO',
    business_process: 'PTP',
    modules: ['MM', 'FI'],
    task_count: 7,
    state: 'Published' as ScenarioState,
    version: '2.2.0',
    last_pass_rate_pct: 91,
    bp_scope_items: ['BFK'],
    customer_scope: 'Customer' as CustomerScope,
    tags: ['invoice-verification', 'procurement'],
    ai_generated: false,
  },
  {
    id: 'sc_11',
    name: 'Vendor Payment Automation with German Bank',
    code: 'PTP_PAY_DE',
    business_process: 'PTP',
    modules: ['FI'],
    task_count: 9,
    state: 'Draft' as ScenarioState,
    version: '0.1.0',
    last_pass_rate_pct: 0,
    bp_scope_items: ['BFK'],
    customer_scope: 'Workspace' as CustomerScope,
    tags: ['ai-generated', 'payment', 'german-vendor'],
    ai_generated: true,
    ai_confidence: 87,
  },
  {
    id: 'sc_12',
    name: 'RTR Journal Entry FB50',
    code: 'RTR_JE_FB50',
    business_process: 'RTR',
    modules: ['FI'],
    task_count: 4,
    state: 'Published' as ScenarioState,
    version: '3.2.0',
    last_pass_rate_pct: 100,
    bp_scope_items: [],
    customer_scope: 'Global' as CustomerScope,
    tags: ['journal-entry', 'smoke'],
    ai_generated: false,
  },
]

// ============================================================================
// TEST CASES (Atomic test units)
// ============================================================================

export type TestCaseTaskType = 
  | 'verify_master_data_exists'
  | 'run_transaction'
  | 'assert_data_state'
  | 'release_document'
  | 'sign_off_scenario'
  | 'capture_evidence'
  | 'set_test_data'
  | 'call_api'
  | 'propose_ir_update'

export type TestCaseState = 'Draft' | 'Published' | 'Deprecated' | 'Archived'

export const MOCK_TEST_CASES = [
  // 5 run_transaction types
  {
    id: 'tc_1',
    code: 'TC_VA01_CREATE',
    name: 'Create Sales Order via VA01',
    task_type: 'run_transaction' as TestCaseTaskType,
    criticality: 'critical' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 14,
    used_in_scenarios: ['sc_1', 'sc_2', 'sc_5', 'sc_7'],
    last_pass_rate_pct: 96,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['sales', 'order-creation', 'core'],
    tcode: 'VA01',
  },
  {
    id: 'tc_2',
    code: 'TC_ME21N_PO',
    name: 'Create Purchase Order via ME21N',
    task_type: 'run_transaction' as TestCaseTaskType,
    criticality: 'critical' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 12,
    used_in_scenarios: ['sc_3', 'sc_8'],
    last_pass_rate_pct: 98,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['procurement', 'purchase-order', 'core'],
    tcode: 'ME21N',
  },
  {
    id: 'tc_3',
    code: 'TC_FB01_JE',
    name: 'Post Journal Entry via FB01',
    task_type: 'run_transaction' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 8,
    used_in_scenarios: ['sc_4', 'sc_12'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Customer' as CustomerScope,
    tags: ['finance', 'journal-entry'],
    tcode: 'FB01',
  },
  {
    id: 'tc_4',
    code: 'TC_MIGO_GR',
    name: 'Goods Receipt via MIGO',
    task_type: 'run_transaction' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 9,
    used_in_scenarios: ['sc_3', 'sc_9'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['warehouse', 'goods-receipt', 'inventory'],
    tcode: 'MIGO',
  },
  {
    id: 'tc_5',
    code: 'TC_MIRO_IV',
    name: 'Invoice Verification via MIRO',
    task_type: 'run_transaction' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 11,
    used_in_scenarios: ['sc_3', 'sc_10'],
    last_pass_rate_pct: 91,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Customer' as CustomerScope,
    tags: ['invoice', 'accounts-payable'],
    tcode: 'MIRO',
  },
  // 3 verify_master_data_exists types
  {
    id: 'tc_6',
    code: 'TC_VERIFY_CUST',
    name: 'Verify Customer Master Data Exists',
    task_type: 'verify_master_data_exists' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 4,
    used_in_scenarios: ['sc_1', 'sc_2', 'sc_5', 'sc_6', 'sc_7'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'minimal' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['master-data', 'customer', 'prerequisite'],
    tcode: 'XD03',
  },
  {
    id: 'tc_7',
    code: 'TC_VERIFY_MAT',
    name: 'Verify Material Master Data Exists',
    task_type: 'verify_master_data_exists' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 5,
    used_in_scenarios: ['sc_1', 'sc_3', 'sc_8', 'sc_9'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'minimal' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['master-data', 'material', 'prerequisite'],
    tcode: 'MM03',
  },
  {
    id: 'tc_8',
    code: 'TC_VERIFY_VEND',
    name: 'Verify Vendor Master Data Exists',
    task_type: 'verify_master_data_exists' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 4,
    used_in_scenarios: ['sc_3', 'sc_10', 'sc_11'],
    last_pass_rate_pct: 98,
    state: 'Published' as TestCaseState,
    evidence_profile: 'minimal' as const,
    customer_scope: 'Customer' as CustomerScope,
    tags: ['master-data', 'vendor', 'prerequisite'],
    tcode: 'XK03',
  },
  // 2 assert_data_state types
  {
    id: 'tc_9',
    code: 'TC_ASSERT_ATP',
    name: 'Assert ATP Confirmation Status',
    task_type: 'assert_data_state' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 3,
    used_in_scenarios: ['sc_1', 'sc_2'],
    last_pass_rate_pct: 94,
    state: 'Published' as TestCaseState,
    evidence_profile: 'minimal' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['atp', 'availability', 'assertion'],
    tcode: 'VA03',
  },
  {
    id: 'tc_10',
    code: 'TC_ASSERT_DOC_FLOW',
    name: 'Assert Document Flow Complete',
    task_type: 'assert_data_state' as TestCaseTaskType,
    criticality: 'medium' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 6,
    used_in_scenarios: ['sc_1', 'sc_3', 'sc_5'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Customer' as CustomerScope,
    tags: ['document-flow', 'assertion', 'traceability'],
    tcode: 'VA03',
  },
  // 2 call_api types (OData endpoints)
  {
    id: 'tc_11',
    code: 'TC_API_SALESORDER',
    name: 'Call Sales Order OData API',
    task_type: 'call_api' as TestCaseTaskType,
    criticality: 'medium' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 2,
    used_in_scenarios: ['sc_1', 'sc_7'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'minimal' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['api', 'odata', 'integration'],
    odata_service: '/sap/opu/odata/sap/API_SALES_ORDER_SRV',
  },
  {
    id: 'tc_12',
    code: 'TC_API_PURCHASEORDER',
    name: 'Call Purchase Order OData API',
    task_type: 'call_api' as TestCaseTaskType,
    criticality: 'medium' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: true,
    ir_step_count: 2,
    used_in_scenarios: ['sc_3', 'sc_8'],
    last_pass_rate_pct: 98,
    state: 'Published' as TestCaseState,
    evidence_profile: 'minimal' as const,
    customer_scope: 'Customer' as CustomerScope,
    tags: ['api', 'odata', 'integration'],
    odata_service: '/sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV',
  },
  // 2 sign_off_scenario types
  {
    id: 'tc_13',
    code: 'TC_SIGNOFF_QA',
    name: 'QA Lead Sign-off',
    task_type: 'sign_off_scenario' as TestCaseTaskType,
    criticality: 'critical' as Criticality,
    default_assignee_class: 'human' as AssigneeClass,
    default_service_role: 'QA Lead',
    has_ir: false,
    ir_step_count: 0,
    used_in_scenarios: ['sc_1', 'sc_2', 'sc_3', 'sc_4', 'sc_5'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Global' as CustomerScope,
    tags: ['sign-off', 'qa', 'approval'],
  },
  {
    id: 'tc_14',
    code: 'TC_SIGNOFF_FUNC',
    name: 'Functional Lead Sign-off',
    task_type: 'sign_off_scenario' as TestCaseTaskType,
    criticality: 'high' as Criticality,
    default_assignee_class: 'human' as AssigneeClass,
    default_service_role: 'Functional Lead',
    has_ir: false,
    ir_step_count: 0,
    used_in_scenarios: ['sc_4', 'sc_12'],
    last_pass_rate_pct: 100,
    state: 'Published' as TestCaseState,
    evidence_profile: 'full' as const,
    customer_scope: 'Customer' as CustomerScope,
    tags: ['sign-off', 'functional', 'approval'],
  },
  // 1 propose_ir_update type
  {
    id: 'tc_15',
    code: 'TC_PROPOSE_IR_VA01',
    name: 'Propose IR Update for VA01 Field Change',
    task_type: 'propose_ir_update' as TestCaseTaskType,
    criticality: 'low' as Criticality,
    default_assignee_class: 'agent' as AssigneeClass,
    default_service_role: null,
    has_ir: false,
    ir_step_count: 0,
    used_in_scenarios: [],
    last_pass_rate_pct: 0,
    state: 'Draft' as TestCaseState,
    evidence_profile: 'none' as const,
    customer_scope: 'Workspace' as CustomerScope,
    tags: ['ai-generated', 'ir-update', 'maintenance'],
    ai_generated: true,
  },
]

// ============================================================================
// IR STEPS (for TC_VA01_CREATE test case)
// ============================================================================

export type IRStepType = 
  | 'open_transaction'
  | 'set_field'
  | 'press_button'
  | 'press_enter'
  | 'select_row'
  | 'click_menu'
  | 'assert_statusbar'
  | 'assert_field'
  | 'capture_field'
  | 'wait'

export interface IRStep {
  id: string
  order: number
  step_type: IRStepType
  description: string
  parameters: Record<string, any>
  is_assertion: boolean
  healing_hints?: string[]
  confidence?: number
}

export const MOCK_IR_STEPS_VA01: IRStep[] = [
  {
    id: 'ir_step_1',
    order: 1,
    step_type: 'open_transaction',
    description: 'Open transaction VA01',
    parameters: { tcode: 'VA01' },
    is_assertion: false,
    healing_hints: ['Transaction code is stable', 'Use /nVA01 as fallback'],
  },
  {
    id: 'ir_step_2',
    order: 2,
    step_type: 'set_field',
    description: 'Set Order Type to OR (Standard Order)',
    parameters: { field: 'VBAK-AUART', value: 'OR', label: 'Order Type' },
    is_assertion: false,
    healing_hints: ['Field ID changed in S/4HANA', 'Can use F4 value help'],
    confidence: 98,
  },
  {
    id: 'ir_step_3',
    order: 3,
    step_type: 'set_field',
    description: 'Set Sales Organization to 1000',
    parameters: { field: 'VBAK-VKORG', value: '1000', label: 'Sales Org' },
    is_assertion: false,
    healing_hints: ['Standard field path'],
    confidence: 100,
  },
  {
    id: 'ir_step_4',
    order: 4,
    step_type: 'set_field',
    description: 'Set Distribution Channel to 10',
    parameters: { field: 'VBAK-VTWEG', value: '10', label: 'Dist Channel' },
    is_assertion: false,
    healing_hints: ['Standard field path'],
    confidence: 100,
  },
  {
    id: 'ir_step_5',
    order: 5,
    step_type: 'set_field',
    description: 'Set Division to 00',
    parameters: { field: 'VBAK-SPART', value: '00', label: 'Division' },
    is_assertion: false,
    healing_hints: ['Standard field path'],
    confidence: 100,
  },
  {
    id: 'ir_step_6',
    order: 6,
    step_type: 'press_enter',
    description: 'Press Enter to continue to order details',
    parameters: {},
    is_assertion: false,
    healing_hints: ['Standard Enter key'],
  },
  {
    id: 'ir_step_7',
    order: 7,
    step_type: 'set_field',
    description: 'Set PO Number',
    parameters: { field: 'VBKD-BSTKD', value: 'PO-12345', label: 'PO Number' },
    is_assertion: false,
    healing_hints: ['Customer reference field'],
    confidence: 95,
  },
  {
    id: 'ir_step_8',
    order: 8,
    step_type: 'set_field',
    description: 'Set Material for line item 1',
    // ERROR: Missing required 'value' parameter for set_field (validation error)
    parameters: { field: 'VBAP-MATNR[1]', label: 'Material' },
    is_assertion: false,
    healing_hints: ['Line item array index', 'Material field may have validation'],
    confidence: 92,
    has_validation_error: true, // Flag for demo
  },
  {
    id: 'ir_step_9',
    order: 9,
    step_type: 'set_field',
    description: 'Set Quantity for line item 1',
    parameters: { field: 'VBAP-KWMENG[1]', value: '100', label: 'Quantity', unit: 'EA' },
    is_assertion: false,
    healing_hints: ['Quantity field with unit'],
    confidence: 98,
  },
  {
    id: 'ir_step_10',
    order: 10,
    step_type: 'press_enter',
    description: 'Press Enter to validate line item',
    parameters: {},
    is_assertion: false,
    // WARNING: No healing_hints on this step (validation warning)
  },
  {
    id: 'ir_step_11',
    order: 11,
    step_type: 'press_button',
    description: 'Save the sales order',
    parameters: { button: 'btn[11]', label: 'Save', icon: 'SAVE' },
    is_assertion: false,
    healing_hints: ['Standard toolbar button', 'Ctrl+S as fallback'],
  },
  {
    id: 'ir_step_12',
    order: 12,
    step_type: 'assert_statusbar',
    description: 'Verify order saved successfully',
    parameters: { contains: 'saved', message_type: 'S' },
    is_assertion: true,
    healing_hints: ['Status bar message assertion', 'Look for "Standard Order" in message'],
    confidence: 100,
  },
  {
    id: 'ir_step_13',
    order: 13,
    step_type: 'capture_field',
    description: 'Capture the created Sales Order number',
    parameters: { field: 'VBELN', variable: 'created_order_number', pattern: '\\d{10}' },
    is_assertion: false,
    healing_hints: ['Extract from status bar if field not visible'],
  },
  {
    id: 'ir_step_14',
    order: 14,
    step_type: 'assert_field',
    description: 'Assert order number is captured',
    parameters: { variable: 'created_order_number', not_empty: true },
    is_assertion: true,
  },
]

// Test Case Detail mock
export const MOCK_TEST_CASE_DETAIL = {
  ...MOCK_TEST_CASES[0],
  description: `Creates a standard sales order (OR) via transaction VA01 with two line items.
  
This test case validates the core sales order creation flow including:
- Order header data entry (org structure, customer, PO reference)
- Line item entry with material and quantity
- ATP check and availability confirmation
- Document saving and number assignment

Prerequisites: Customer master and material master must exist with valid ATP.`,
  inputs_schema: {
    customer: { type: 'string', required: true, example: '1000234' },
    sales_org: { type: 'string', required: true, example: '1000' },
    dist_channel: { type: 'string', required: true, example: '10' },
    division: { type: 'string', required: true, example: '00' },
    po_number: { type: 'string', required: false, example: 'PO-12345' },
    materials: {
      type: 'array',
      items: {
        material: { type: 'string', required: true },
        quantity: { type: 'number', required: true },
        unit: { type: 'string', default: 'EA' },
      },
    },
  },
  expected_outcome: 'Sales order document created with 10-digit order number. All line items confirmed with full quantity.',
  retry_policy: { max_attempts: 2, backoff_ms: 2000 },
  healing_enabled: true,
  bp_scope_items: ['BD9', 'BD3'],
  quick_stats: {
    used_in_scenarios: 4,
    total_executions: 156,
    last_7_days_executions: 23,
    avg_duration_ms: 45000,
  },
  ir_steps: MOCK_IR_STEPS_VA01,
  execution_history: [
    {
      id: 'exec_tc1_001',
      suite_context: 'SC_CUTOVER_VAL',
      scenario_context: 'OTC_HP_DOM',
      started_at: '2026-05-07T08:15:00+05:30',
      duration_ms: 42000,
      state: 'Completed_Passed',
      outcome_message: 'Sales order 0000012345 created successfully',
      healing_events: 0,
      defect_id: null,
    },
    {
      id: 'exec_tc1_002',
      suite_context: 'SC_CUTOVER_VAL',
      scenario_context: 'OTC_HP_DOM',
      started_at: '2026-05-06T14:30:00+05:30',
      duration_ms: 48000,
      state: 'Completed_Passed_With_Healing',
      outcome_message: 'Sales order 0000012344 created with healed step',
      healing_events: 1,
      defect_id: null,
    },
    {
      id: 'exec_tc1_003',
      suite_context: 'SD_CORE_REG',
      scenario_context: 'OTC_CREDIT',
      started_at: '2026-05-05T10:00:00+05:30',
      duration_ms: 35000,
      state: 'Failed',
      outcome_message: 'ATP check failed - insufficient stock',
      healing_events: 0,
      defect_id: 'DEF-0042',
    },
    {
      id: 'exec_tc1_004',
      suite_context: 'SC_CUTOVER_VAL',
      scenario_context: 'OTC_HP_DOM',
      started_at: '2026-05-04T09:00:00+05:30',
      duration_ms: 44000,
      state: 'Completed_Passed',
      outcome_message: 'Sales order 0000012340 created successfully',
      healing_events: 0,
      defect_id: null,
    },
  ],
}

// ============================================================================
// SCENARIO TASKS (for OTC Happy Path Domestic - sc_1)
// ============================================================================

export type TaskType = 
  | 'verify_master_data_exists'
  | 'run_transaction'
  | 'assert_data_state'
  | 'release_document'
  | 'sign_off_scenario'
  | 'capture_evidence'
  | 'set_test_data'

export type AssigneeClass = 'human' | 'agent'
export type Criticality = 'critical' | 'high' | 'medium' | 'low'

export interface ScenarioTask {
  id: string
  order: number
  name: string
  description: string
  task_type: TaskType
  default_assignee_class: AssigneeClass
  default_service_role?: string
  criticality: Criticality
  evidence_capture_profile?: 'full' | 'minimal' | 'none'
  retry_policy?: { max_attempts: number; backoff_ms: number }
  healing_enabled: boolean
  predecessors: string[]
  parallel_group?: string
  tcode?: string
  ir_id?: string
}

export const MOCK_SCENARIO_TASKS: ScenarioTask[] = [
  {
    id: 'task_1',
    order: 1,
    name: 'Verify customer exists in plant',
    description: 'Verify customer 1000234 exists in plant 1000',
    task_type: 'verify_master_data_exists',
    default_assignee_class: 'agent',
    criticality: 'high',
    evidence_capture_profile: 'minimal',
    retry_policy: { max_attempts: 3, backoff_ms: 1000 },
    healing_enabled: true,
    predecessors: [],
    tcode: 'XD03',
    ir_id: 'ir_verify_customer',
  },
  {
    id: 'task_2',
    order: 2,
    name: 'Verify materials exist',
    description: 'Verify materials FG-001234 and FG-001235 exist',
    task_type: 'verify_master_data_exists',
    default_assignee_class: 'agent',
    criticality: 'high',
    evidence_capture_profile: 'minimal',
    retry_policy: { max_attempts: 3, backoff_ms: 1000 },
    healing_enabled: true,
    predecessors: ['task_1'],
    tcode: 'MM03',
    ir_id: 'ir_verify_material',
  },
  {
    id: 'task_3',
    order: 3,
    name: 'Create sales order VA01',
    description: 'Create sales order via VA01 with two line items',
    task_type: 'run_transaction',
    default_assignee_class: 'agent',
    criticality: 'critical',
    evidence_capture_profile: 'full',
    retry_policy: { max_attempts: 2, backoff_ms: 2000 },
    healing_enabled: true,
    predecessors: ['task_2'],
    tcode: 'VA01',
    ir_id: 'ir_create_sales_order',
  },
  {
    id: 'task_4',
    order: 4,
    name: 'Verify ATP confirmation',
    description: 'Verify ATP confirmed all quantities',
    task_type: 'assert_data_state',
    default_assignee_class: 'agent',
    criticality: 'high',
    evidence_capture_profile: 'minimal',
    healing_enabled: true,
    predecessors: ['task_3'],
    tcode: 'VA03',
    ir_id: 'ir_assert_atp',
  },
  {
    id: 'task_5',
    order: 5,
    name: 'Release to delivery VL10A',
    description: 'Release order to delivery via VL10A',
    task_type: 'release_document',
    default_assignee_class: 'agent',
    criticality: 'high',
    evidence_capture_profile: 'full',
    retry_policy: { max_attempts: 2, backoff_ms: 2000 },
    healing_enabled: true,
    predecessors: ['task_4'],
    parallel_group: 'delivery_group',
    tcode: 'VL10A',
    ir_id: 'ir_release_delivery',
  },
  {
    id: 'task_6',
    order: 6,
    name: 'Post goods issue VL02N',
    description: 'Post goods issue via VL02N',
    task_type: 'run_transaction',
    default_assignee_class: 'agent',
    criticality: 'critical',
    evidence_capture_profile: 'full',
    retry_policy: { max_attempts: 2, backoff_ms: 2000 },
    healing_enabled: true,
    predecessors: ['task_4'],
    parallel_group: 'delivery_group',
    tcode: 'VL02N',
    ir_id: 'ir_post_goods_issue',
  },
  {
    id: 'task_7',
    order: 7,
    name: 'QA Lead sign-off',
    description: 'QA Lead signs off Scenario result',
    task_type: 'sign_off_scenario',
    default_assignee_class: 'human',
    default_service_role: 'QA Lead',
    criticality: 'critical',
    evidence_capture_profile: 'full',
    healing_enabled: false,
    predecessors: ['task_5', 'task_6'],
  },
]

// Extended scenario data for detail view
export const MOCK_SCENARIO_DETAIL = {
  ...MOCK_TEST_SCENARIOS[0],
  description: `End-to-end OTC happy path for domestic sales orders. Tests the complete order-to-cash flow including:
- Customer and material master data verification
- Sales order creation with multiple line items
- ATP check and confirmation
- Delivery creation and goods issue
- QA sign-off workflow

This scenario covers SAP Best Practice scope items BD9 (Standard Sales) and BD3 (Domestic Delivery).`,
  success_criteria: {
    pass_rate_pct: 95,
    max_failed_critical_cases: 0,
    max_healed_pct: 15,
    target_runner_pool: 'pool_sap_gui_01',
  },
  prerequisites: [
    { type: 'test_data', description: 'Customer 1000234 must exist in plant 1000 with credit limit > 50,000 INR' },
    { type: 'test_data', description: 'Materials FG-001234 and FG-001235 must have stock in storage location 0001' },
    { type: 'system_state', description: 'Plant 1000 must be open for sales in company code 1000' },
    { type: 'prior_scenario', description: 'MM Procurement smoke must have run successfully in last 24h', scenario_id: 'sc_3' },
  ],
  linked_migrations: ['SC_S4_CUTOVER_2026'],
  tasks: MOCK_SCENARIO_TASKS,
  execution_history: [
    { run_id: 'run_sc1_001', started_at: '2026-05-07T08:00:00+05:30', duration_ms: 245000, state: 'Completed_Passed', passed: 7, healed: 0, failed: 0, triggered_by: 'P.Sharma', sign_off: 'Approved' },
    { run_id: 'run_sc1_002', started_at: '2026-05-06T14:30:00+05:30', duration_ms: 312000, state: 'Completed_Passed_With_Healing', passed: 6, healed: 1, failed: 0, triggered_by: 'Voltus AI', sign_off: 'Approved' },
    { run_id: 'run_sc1_003', started_at: '2026-05-05T10:15:00+05:30', duration_ms: 189000, state: 'Completed_Failed', passed: 5, healed: 0, failed: 2, triggered_by: 'J.Rao', sign_off: 'Rejected' },
  ],
  comments: [
    { id: 'cmt_1', author: 'P.Sharma', avatar: 'PS', timestamp: '2026-05-07T09:30:00+05:30', text: 'Task 5 and 6 can run in parallel now after the ATP fix. Updated predecessors.' },
    { id: 'cmt_2', author: 'J.Rao', avatar: 'JR', timestamp: '2026-05-06T16:45:00+05:30', text: '@P.Sharma confirmed. The VL10A and VL02N can execute concurrently.' },
    { id: 'cmt_3', author: 'Voltus AI', avatar: 'AI', timestamp: '2026-05-06T14:35:00+05:30', text: 'Auto-healed task_3: Updated field selector for VA01 material input from #MATERIAL to #MATNR after S/4HANA migration.' },
  ],
}

// ============================================================================
// DEFECTS
// ============================================================================

export const MOCK_DEFECTS = [
  {
    code: 'DEF-2026-00427',
    title: 'ME21N: ZTERM not validated when posting to vendor 1000234',
    severity: 'high' as const,
    priority: 'p2' as const,
    state: 'In_Fix',
    source_kind: 'test_failure',
    assignee: 'A.Mehta',
    migration: 'SC_S4_CUTOVER_2026',
    transport: 'STAK900123',
    opened_at: '2026-04-21T10:23:00+05:30',
  },
  {
    code: 'DEF-2026-00428',
    title: 'Pricing procedure ZIN12 not picked for sales org 1000',
    severity: 'critical' as const,
    priority: 'p1' as const,
    state: 'Triaged',
    source_kind: 'test_failure',
    assignee: 'S.Kumar',
    migration: 'SC_S4_CUTOVER_2026',
    transport: 'STAK900125',
    opened_at: '2026-04-22T14:11:00+05:30',
  },
  {
    code: 'DEF-2026-00429',
    title: 'Custom Z-program ZINV_AGG aborts on missing pricing record',
    severity: 'high' as const,
    priority: 'p2' as const,
    state: 'Assigned',
    source_kind: 'abap_finding',
    assignee: 'A.Mehta',
    migration: 'SC_S4_CUTOVER_2026',
    opened_at: '2026-04-20T08:45:00+05:30',
  },
  {
    code: 'DEF-2026-00430',
    title: 'Material master MM01 — UoM conversion not honored in S/4',
    severity: 'medium' as const,
    priority: 'p3' as const,
    state: 'Open',
    source_kind: 'si_item',
    migration: 'SC_S4_CUTOVER_2026',
    opened_at: '2026-04-23T09:30:00+05:30',
  },
]

// ============================================================================
// SIMPLIFICATION ITEMS
// ============================================================================

export const MOCK_SI_ITEMS = [
  {
    id: 'si_1',
    si_code: 'SAP_NOTE_2622437',
    title: 'Material Number length change to 40 characters',
    severity: 'high' as const,
    state: 'Decided_Remediate',
    effort_estimate_days: 8.5,
    assignee: 'S.Kumar',
  },
  {
    id: 'si_2',
    si_code: 'SAP_NOTE_2933229',
    title: 'Business Partner approach mandatory in S/4HANA',
    severity: 'critical' as const,
    state: 'In_Remediation',
    effort_estimate_days: 21,
    assignee: 'P.Sharma',
  },
  {
    id: 'si_3',
    si_code: 'SAP_NOTE_2270333',
    title: 'Cash Management new architecture',
    severity: 'medium' as const,
    state: 'Validated',
    effort_estimate_days: 12,
    assignee: 'J.Rao',
  },
]

// ============================================================================
// ABAP FINDINGS
// ============================================================================

export const MOCK_ABAP_FINDINGS = [
  {
    id: 'abap_1',
    zobject: 'Z_INVOICE_AGGREGATOR',
    zobject_kind: 'PROG',
    provider: 'sap_atc_remote',
    severity: 'high' as const,
    priority: 'p1' as const,
    state: 'Remediated',
    rule_id: 'CCMW_DB_OPS_INDEX_ACCESS',
    rule_description: 'Direct DB access on table BSEG bypasses CDS view',
  },
  {
    id: 'abap_2',
    zobject: 'Z_PRICING_CALC',
    zobject_kind: 'CLAS',
    provider: 'joule',
    severity: 'critical' as const,
    priority: 'p1' as const,
    state: 'Identified',
    rule_id: 'JOULE_S4_INCOMPATIBLE_FIELD',
    rule_description: 'Field MWST removed in S/4; replacement is MWSTV',
  },
  {
    id: 'abap_3',
    zobject: 'Z_ORDER_VALIDATE',
    zobject_kind: 'FUGR',
    provider: 'voltus_abap_analyzer',
    severity: 'medium' as const,
    priority: 'p3' as const,
    state: 'Verified',
    rule_id: 'VAA_DEPRECATED_FM',
    rule_description: 'Function module SD_ORDER_CREDIT_CHECK is deprecated',
  },
]

// ============================================================================
// STEP LIBRARY (Reusable IR Step Fragments)
// ============================================================================

export interface StepFragment {
  id: string
  name: string
  description: string
  step_type: IRStepType
  parameter_template: Record<string, any>
  used_in_irs: string[]
  tags: string[]
  created_at: string
  created_by: string
}

export const MOCK_STEP_FRAGMENTS: StepFragment[] = [
  {
    id: 'frag_1',
    name: 'Login to SAP GUI as NTU',
    description: 'Standard SAP GUI login sequence using NTU authentication with popup handling',
    step_type: 'open_transaction',
    parameter_template: {
      tcode: '/nSE80',
      handle_popup: true,
      auth_type: 'NTU',
      timeout_ms: 30000,
    },
    used_in_irs: ['ir_va01_create', 'ir_me21n_create', 'ir_fb01_post', 'ir_migo_gr', 'ir_miro_iv'],
    tags: ['authentication', 'login', 'gui', 'ntu'],
    created_at: '2026-02-15T10:00:00+05:30',
    created_by: 'P.Sharma',
  },
  {
    id: 'frag_2',
    name: 'Open transaction with handle popup',
    description: 'Opens any SAP transaction with intelligent popup detection and dismissal',
    step_type: 'open_transaction',
    parameter_template: {
      tcode: '{{tcode}}',
      handle_popup: true,
      popup_actions: ['dismiss', 'continue', 'cancel'],
      max_popups: 3,
    },
    used_in_irs: ['ir_va01_create', 'ir_me21n_create', 'ir_mm01_create', 'ir_xd01_create'],
    tags: ['transaction', 'popup', 'navigation'],
    created_at: '2026-02-18T14:30:00+05:30',
    created_by: 'J.Rao',
  },
  {
    id: 'frag_3',
    name: 'Check if popup is dismissable',
    description: 'Conditional check for popup presence with configurable dismiss strategy',
    step_type: 'assert_field',
    parameter_template: {
      condition: 'popup_present',
      action_if_true: 'dismiss',
      action_if_false: 'continue',
      popup_types: ['info', 'warning', 'confirm'],
    },
    used_in_irs: ['ir_va01_create', 'ir_vl02n_pgi'],
    tags: ['popup', 'conditional', 'navigation'],
    created_at: '2026-02-20T09:15:00+05:30',
    created_by: 'P.Sharma',
  },
  {
    id: 'frag_4',
    name: 'Capture VBELN from statusbar',
    description: 'Extracts 10-digit document number from SAP status bar message',
    step_type: 'capture_field',
    parameter_template: {
      source: 'statusbar',
      pattern: '\\d{10}',
      variable: 'captured_doc_number',
      fallback_source: 'field:VBELN',
    },
    used_in_irs: ['ir_va01_create', 'ir_vl01n_delivery', 'ir_vf01_billing', 'ir_me21n_create'],
    tags: ['capture', 'document-number', 'statusbar', 'vbeln'],
    created_at: '2026-02-22T11:45:00+05:30',
    created_by: 'S.Kumar',
  },
  {
    id: 'frag_5',
    name: 'Assert pricing condition exists',
    description: 'Validates that a specific pricing condition is present in the document',
    step_type: 'assert_field',
    parameter_template: {
      table: 'pricing_conditions',
      condition_type: '{{condition_type}}',
      exists: true,
      value_check: 'not_zero',
    },
    used_in_irs: ['ir_va01_create', 'ir_va02_change', 'ir_vf01_billing'],
    tags: ['pricing', 'assertion', 'validation', 'sales'],
    created_at: '2026-03-01T16:20:00+05:30',
    created_by: 'A.Mehta',
  },
  {
    id: 'frag_6',
    name: 'Create customer master KD01 quick',
    description: 'Quick customer master creation template for test data setup',
    step_type: 'set_field',
    parameter_template: {
      fields: [
        { field: 'KNA1-KUNNR', value: '{{customer_number}}' },
        { field: 'KNA1-NAME1', value: '{{customer_name}}' },
        { field: 'KNA1-LAND1', value: '{{country}}', default: 'IN' },
        { field: 'KNA1-SPRAS', value: '{{language}}', default: 'EN' },
      ],
      auto_save: true,
    },
    used_in_irs: ['ir_xd01_create', 'ir_test_data_setup'],
    tags: ['master-data', 'customer', 'setup', 'kd01'],
    created_at: '2026-03-05T08:30:00+05:30',
    created_by: 'M.Reddy',
  },
  {
    id: 'frag_7',
    name: 'Generic dialog dismiss',
    description: 'Universal dialog/popup dismissal with configurable button selection',
    step_type: 'press_button',
    parameter_template: {
      button_priority: ['OK', 'Continue', 'Yes', 'Cancel', 'No'],
      fallback: 'press_enter',
      wait_after_ms: 500,
    },
    used_in_irs: ['ir_va01_create', 'ir_me21n_create', 'ir_fb01_post', 'ir_migo_gr', 'ir_miro_iv', 'ir_vl02n_pgi'],
    tags: ['dialog', 'popup', 'dismiss', 'universal'],
    created_at: '2026-03-08T13:00:00+05:30',
    created_by: 'J.Rao',
  },
  {
    id: 'frag_8',
    name: 'Wait for async process',
    description: 'Configurable wait step for background jobs and async processes',
    step_type: 'wait',
    parameter_template: {
      min_wait_ms: 1000,
      max_wait_ms: 30000,
      poll_interval_ms: 500,
      success_indicator: '{{success_field}}',
    },
    used_in_irs: ['ir_vl10a_release', 'ir_f110_payment'],
    tags: ['wait', 'async', 'background-job'],
    created_at: '2026-03-10T10:45:00+05:30',
    created_by: 'K.Iyer',
  },
]

// ============================================================================
// DATA FIXTURES (Reusable Test Data Sets)
// ============================================================================

export type DataKind = 'master' | 'transactional' | 'mixed'
export type PIILevel = 'none' | 'low' | 'medium' | 'high'
export type FixtureState = 'Draft' | 'Published' | 'Deprecated' | 'Expired'

export interface DataFixture {
  id: string
  code: string
  name: string
  description: string
  data_kind: DataKind
  sap_object_type: string
  tenant_scope: CustomerScope
  has_pii: PIILevel
  version: string
  state: FixtureState
  expires_at: string | null
  record_count: number
  used_in_scenarios: string[]
  created_at: string
  created_by: string
}

export const MOCK_DATA_FIXTURES: DataFixture[] = [
  {
    id: 'fix_1',
    code: 'CUST_DOMESTIC_SET',
    name: 'Domestic Customer Master Set',
    description: 'Set of 50 domestic customer masters for OTC testing',
    data_kind: 'master',
    sap_object_type: 'KNA1',
    tenant_scope: 'Global',
    has_pii: 'medium',
    version: '2.1.0',
    state: 'Published',
    expires_at: '2026-12-31T23:59:59+05:30',
    record_count: 50,
    used_in_scenarios: ['sc_1', 'sc_2', 'sc_5', 'sc_6', 'sc_7'],
    created_at: '2026-01-15T10:00:00+05:30',
    created_by: 'P.Sharma',
  },
  {
    id: 'fix_2',
    code: 'VEND_DOMESTIC_SET',
    name: 'Domestic Vendor Master Set',
    description: 'Set of 30 domestic vendor masters for PTP testing',
    data_kind: 'master',
    sap_object_type: 'LFA1',
    tenant_scope: 'Customer',
    has_pii: 'low',
    version: '1.5.0',
    state: 'Published',
    expires_at: '2026-12-31T23:59:59+05:30',
    record_count: 30,
    used_in_scenarios: ['sc_3', 'sc_10', 'sc_11'],
    created_at: '2026-01-18T14:30:00+05:30',
    created_by: 'J.Rao',
  },
  {
    id: 'fix_3',
    code: 'MAT_FINISHED_GOODS',
    name: 'Finished Goods Material Set',
    description: 'Material masters for finished goods with BOMs',
    data_kind: 'master',
    sap_object_type: 'MARA',
    tenant_scope: 'Global',
    has_pii: 'none',
    version: '3.0.0',
    state: 'Published',
    expires_at: null,
    record_count: 120,
    used_in_scenarios: ['sc_1', 'sc_2', 'sc_3', 'sc_8', 'sc_9'],
    created_at: '2026-01-20T09:15:00+05:30',
    created_by: 'M.Reddy',
  },
  {
    id: 'fix_4',
    code: 'MAT_RAW_MATERIALS',
    name: 'Raw Materials Set',
    description: 'Raw material masters for procurement testing',
    data_kind: 'master',
    sap_object_type: 'MARA',
    tenant_scope: 'Global',
    has_pii: 'none',
    version: '2.2.0',
    state: 'Published',
    expires_at: null,
    record_count: 85,
    used_in_scenarios: ['sc_3', 'sc_8', 'sc_9'],
    created_at: '2026-01-22T11:45:00+05:30',
    created_by: 'S.Kumar',
  },
  {
    id: 'fix_5',
    code: 'SO_SAMPLE_ORDERS',
    name: 'Sample Sales Orders',
    description: 'Pre-created sales orders for delivery/billing testing',
    data_kind: 'transactional',
    sap_object_type: 'VBAK',
    tenant_scope: 'Workspace',
    has_pii: 'none',
    version: '1.8.0',
    state: 'Published',
    expires_at: '2026-06-30T23:59:59+05:30',
    record_count: 25,
    used_in_scenarios: ['sc_1', 'sc_5', 'sc_6'],
    created_at: '2026-02-01T16:20:00+05:30',
    created_by: 'A.Mehta',
  },
  {
    id: 'fix_6',
    code: 'PO_SAMPLE_ORDERS',
    name: 'Sample Purchase Orders',
    description: 'Pre-created POs for GR/IR testing',
    data_kind: 'transactional',
    sap_object_type: 'EKKO',
    tenant_scope: 'Workspace',
    has_pii: 'none',
    version: '1.4.0',
    state: 'Published',
    expires_at: '2026-06-30T23:59:59+05:30',
    record_count: 20,
    used_in_scenarios: ['sc_3', 'sc_9', 'sc_10'],
    created_at: '2026-02-05T08:30:00+05:30',
    created_by: 'K.Iyer',
  },
  {
    id: 'fix_7',
    code: 'CUST_EXPORT_SET',
    name: 'Export Customer Master Set',
    description: 'International customers with export controls',
    data_kind: 'master',
    sap_object_type: 'KNA1',
    tenant_scope: 'Customer',
    has_pii: 'high',
    version: '1.2.0',
    state: 'Published',
    expires_at: '2026-09-30T23:59:59+05:30',
    record_count: 15,
    used_in_scenarios: ['sc_5'],
    created_at: '2026-02-10T13:00:00+05:30',
    created_by: 'P.Sharma',
  },
  {
    id: 'fix_8',
    code: 'MIXED_OTC_SET',
    name: 'OTC End-to-End Data Set',
    description: 'Mixed master and transactional data for full OTC flow',
    data_kind: 'mixed',
    sap_object_type: 'MIXED',
    tenant_scope: 'Workspace',
    has_pii: 'low',
    version: '2.0.0',
    state: 'Published',
    expires_at: '2026-07-31T23:59:59+05:30',
    record_count: 45,
    used_in_scenarios: ['sc_1', 'sc_2'],
    created_at: '2026-02-15T10:45:00+05:30',
    created_by: 'J.Rao',
  },
  {
    id: 'fix_9',
    code: 'GL_ACCOUNTS_SET',
    name: 'GL Account Master Set',
    description: 'Chart of accounts for FI testing',
    data_kind: 'master',
    sap_object_type: 'SKA1',
    tenant_scope: 'Global',
    has_pii: 'none',
    version: '1.0.0',
    state: 'Published',
    expires_at: null,
    record_count: 200,
    used_in_scenarios: ['sc_4', 'sc_12', 'sc_13'],
    created_at: '2026-02-20T09:00:00+05:30',
    created_by: 'A.Mehta',
  },
  {
    id: 'fix_10',
    code: 'LEGACY_CUST_SET',
    name: 'Legacy Customer Data (Deprecated)',
    description: 'Old customer master format - do not use',
    data_kind: 'master',
    sap_object_type: 'KNA1',
    tenant_scope: 'Workspace',
    has_pii: 'medium',
    version: '0.9.0',
    state: 'Deprecated',
    expires_at: '2026-05-01T23:59:59+05:30',
    record_count: 40,
    used_in_scenarios: [],
    created_at: '2025-11-01T10:00:00+05:30',
    created_by: 'M.Reddy',
  },
]

// ============================================================================
// FIXTURE DETAIL (Star Cement Pilot Customer)
// ============================================================================

export interface KNA1Field {
  field: string
  label: string
  value: string
  dataType: 'string' | 'number' | 'date' | 'select'
  required: boolean
  pii_level: PIILevel
  options?: string[]
}

export const MOCK_FIXTURE_DETAIL = {
  id: 'fix_pilot_1',
  code: 'CUST_PILOT_1000234',
  name: 'Star Cement Pilot Customer 1000234',
  description: 'Primary pilot customer master for Star Cement OTC testing. Represents a typical domestic cement buyer with complete sales area data.',
  data_kind: 'master' as DataKind,
  sap_object_type: 'KNA1',
  tenant_scope: 'Customer' as CustomerScope,
  has_pii: 'medium' as PIILevel,
  version: '1.3.0',
  state: 'Published' as FixtureState,
  expires_at: '2026-12-31T23:59:59+05:30',
  record_count: 1,
  used_in_scenarios: ['sc_1', 'sc_2', 'sc_5', 'sc_6'],
  used_in_test_cases: ['tc_1', 'tc_6', 'tc_9'],
  created_at: '2026-02-01T10:00:00+05:30',
  created_by: 'P.Sharma',
  updated_at: '2026-05-05T14:30:00+05:30',
  updated_by: 'J.Rao',
  
  // KNA1 payload fields
  payload: [
    { field: 'KUNNR', label: 'Customer Number', value: '1000234', dataType: 'string', required: true, pii_level: 'none' },
    { field: 'NAME1', label: 'Name 1', value: 'Rajasthan Construction Ltd', dataType: 'string', required: true, pii_level: 'medium' },
    { field: 'NAME2', label: 'Name 2', value: 'Cement Division', dataType: 'string', required: false, pii_level: 'none' },
    { field: 'LAND1', label: 'Country', value: 'IN', dataType: 'select', required: true, pii_level: 'none', options: ['IN', 'US', 'DE', 'GB', 'JP'] },
    { field: 'ORT01', label: 'City', value: 'Jaipur', dataType: 'string', required: true, pii_level: 'low' },
    { field: 'PSTLZ', label: 'Postal Code', value: '302001', dataType: 'string', required: false, pii_level: 'none' },
    { field: 'REGIO', label: 'Region', value: 'RJ', dataType: 'select', required: false, pii_level: 'none', options: ['RJ', 'MH', 'GJ', 'KA', 'TN', 'DL'] },
    { field: 'SPRAS', label: 'Language', value: 'EN', dataType: 'select', required: true, pii_level: 'none', options: ['EN', 'DE', 'HI', 'ES'] },
    { field: 'KTOKD', label: 'Account Group', value: 'KUNA', dataType: 'select', required: true, pii_level: 'none', options: ['KUNA', 'KUNB', 'KUNC'] },
    { field: 'BUKRS', label: 'Company Code', value: '1000', dataType: 'string', required: true, pii_level: 'none' },
    { field: 'SBGRP', label: 'Sales Group', value: 'Z01', dataType: 'select', required: false, pii_level: 'none', options: ['Z01', 'Z02', 'Z03'] },
  ] as KNA1Field[],
  
  // Audit events
  audit_events: [
    {
      id: 'ae_1',
      timestamp: '2026-05-05T14:30:00+05:30',
      actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@stacement.com', role: 'QA Lead' },
      action: 'field_updated',
      entityType: 'fixture',
      entityId: 'fix_pilot_1',
      fieldChanged: 'NAME1',
      oldValue: 'Rajasthan Construction Pvt Ltd',
      newValue: 'Rajasthan Construction Ltd',
      signatureStatus: 'signed' as const,
    },
    {
      id: 'ae_2',
      timestamp: '2026-04-20T10:15:00+05:30',
      actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@stacement.com', role: 'Migration Manager' },
      action: 'pii_level_changed',
      entityType: 'fixture',
      entityId: 'fix_pilot_1',
      fieldChanged: 'ORT01',
      oldValue: 'none',
      newValue: 'low',
      signatureStatus: 'verified' as const,
    },
    {
      id: 'ae_3',
      timestamp: '2026-02-01T10:00:00+05:30',
      actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@stacement.com', role: 'Migration Manager' },
      action: 'created',
      entityType: 'fixture',
      entityId: 'fix_pilot_1',
      signatureStatus: 'verified' as const,
    },
  ],
}

// ============================================================================
// DATA GENERATORS (On-demand test value generators from DDIC)
// ============================================================================

export type RandomizationStrategy = 'sequential' | 'random' | 'weighted' | 'round_robin'
export type GeneratorState = 'Active' | 'Inactive' | 'Draft'

export interface DataGenerator {
  id: string
  name: string
  description: string
  source_table: string
  join_tables?: { table: string; on: string }[]
  where_clause: string
  projection: string[]
  randomization: RandomizationStrategy
  state: GeneratorState
  last_run: string | null
  sample_values?: string[]
  created_by: string
  created_at: string
}

export const MOCK_DATA_GENERATORS: DataGenerator[] = [
  {
    id: 'gen_1',
    name: 'Valid Material Number for Plant 1000 Type FERT',
    description: 'Returns valid finished goods material numbers available in plant 1000',
    source_table: 'MARA',
    join_tables: [{ table: 'MARC', on: 'MARA~MATNR = MARC~MATNR' }],
    where_clause: "MTART = 'FERT' AND MARC~WERKS = '1000'",
    projection: ['MATNR', 'MAKTX'],
    randomization: 'random',
    state: 'Active',
    last_run: '2026-05-07T10:30:00+05:30',
    sample_values: ['FG-001234', 'FG-001235', 'FG-002001', 'FG-002045', 'FG-003100'],
    created_by: 'P.Sharma',
    created_at: '2026-02-10T09:00:00+05:30',
  },
  {
    id: 'gen_2',
    name: 'Active Customer for Sales Org 1000',
    description: 'Returns active customers with valid sales area in sales organization 1000',
    source_table: 'KNA1',
    join_tables: [{ table: 'KNVV', on: 'KNA1~KUNNR = KNVV~KUNNR' }],
    where_clause: "KNA1~LOEVM = '' AND KNVV~VKORG = '1000'",
    projection: ['KUNNR', 'NAME1', 'ORT01'],
    randomization: 'random',
    state: 'Active',
    last_run: '2026-05-06T14:15:00+05:30',
    sample_values: ['1000234', '1000456', '1000789', '1001023', '1001567'],
    created_by: 'J.Rao',
    created_at: '2026-02-12T11:30:00+05:30',
  },
  {
    id: 'gen_3',
    name: 'Vendor with Payment Terms Z001',
    description: 'Returns vendors configured with standard payment terms Z001',
    source_table: 'LFA1',
    join_tables: [{ table: 'LFB1', on: 'LFA1~LIFNR = LFB1~LIFNR' }],
    where_clause: "LFB1~ZTERM = 'Z001' AND LFA1~LOEVM = ''",
    projection: ['LIFNR', 'NAME1', 'LAND1'],
    randomization: 'sequential',
    state: 'Active',
    last_run: '2026-05-05T09:45:00+05:30',
    sample_values: ['V100001', 'V100023', 'V100045', 'V100078', 'V100089'],
    created_by: 'M.Reddy',
    created_at: '2026-02-15T14:00:00+05:30',
  },
  {
    id: 'gen_4',
    name: 'Open Sales Order for Billing',
    description: 'Returns sales orders ready for billing (delivery complete, not yet billed)',
    source_table: 'VBAK',
    join_tables: [
      { table: 'VBUK', on: 'VBAK~VBELN = VBUK~VBELN' },
      { table: 'VBUP', on: 'VBAK~VBELN = VBUP~VBELN' }
    ],
    where_clause: "VBUK~LFSTK = 'C' AND VBUK~FKSTK <> 'C'",
    projection: ['VBELN', 'KUNNR', 'NETWR'],
    randomization: 'round_robin',
    state: 'Active',
    last_run: '2026-05-07T08:00:00+05:30',
    sample_values: ['0000012340', '0000012341', '0000012342', '0000012343', '0000012344'],
    created_by: 'S.Kumar',
    created_at: '2026-02-20T10:30:00+05:30',
  },
  {
    id: 'gen_5',
    name: 'GL Account for Cost Center Posting',
    description: 'Returns expense GL accounts valid for cost center postings',
    source_table: 'SKA1',
    join_tables: [{ table: 'SKB1', on: 'SKA1~SAKNR = SKB1~SAKNR' }],
    where_clause: "SKA1~KTOKS = 'KOST' AND SKB1~BUKRS = '1000'",
    projection: ['SAKNR', 'TXT20'],
    randomization: 'random',
    state: 'Active',
    last_run: '2026-05-04T16:20:00+05:30',
    sample_values: ['0040100000', '0040200000', '0040300000', '0040400000', '0040500000'],
    created_by: 'A.Mehta',
    created_at: '2026-02-25T09:15:00+05:30',
  },
  {
    id: 'gen_6',
    name: 'Storage Location with Stock',
    description: 'Returns storage locations with available unrestricted stock',
    source_table: 'MARD',
    where_clause: "WERKS = '1000' AND LABST > 0",
    projection: ['MATNR', 'LGORT', 'LABST'],
    randomization: 'weighted',
    state: 'Active',
    last_run: '2026-05-06T11:30:00+05:30',
    sample_values: ['0001', '0002', '0003', '0010', '0020'],
    created_by: 'K.Iyer',
    created_at: '2026-03-01T13:45:00+05:30',
  },
  {
    id: 'gen_7',
    name: 'Purchase Order Pending GR',
    description: 'Returns purchase orders with open GR quantity',
    source_table: 'EKKO',
    join_tables: [{ table: 'EKPO', on: 'EKKO~EBELN = EKPO~EBELN' }],
    where_clause: "EKPO~ELIKZ = '' AND EKKO~FRGKE = '3'",
    projection: ['EBELN', 'LIFNR', 'BEDAT'],
    randomization: 'sequential',
    state: 'Active',
    last_run: '2026-05-07T07:00:00+05:30',
    sample_values: ['4500001234', '4500001235', '4500001240', '4500001245', '4500001250'],
    created_by: 'J.Rao',
    created_at: '2026-03-05T10:00:00+05:30',
  },
  {
    id: 'gen_8',
    name: 'Cost Center for Plant 1000',
    description: 'Returns active cost centers for manufacturing plant',
    source_table: 'CSKS',
    where_clause: "KOKRS = '1000' AND DATBI >= sy-datum",
    projection: ['KOSTL', 'KTEXT'],
    randomization: 'random',
    state: 'Inactive',
    last_run: '2026-04-15T14:30:00+05:30',
    sample_values: ['CC1001', 'CC1002', 'CC1003', 'CC1010', 'CC1020'],
    created_by: 'A.Mehta',
    created_at: '2026-03-10T11:20:00+05:30',
  },
  {
    id: 'gen_9',
    name: 'Batch Number for Material Type ROH',
    description: 'Draft generator for raw material batch numbers',
    source_table: 'MCHA',
    join_tables: [{ table: 'MARA', on: 'MCHA~MATNR = MARA~MATNR' }],
    where_clause: "MARA~MTART = 'ROH' AND MCHA~WERKS = '1000'",
    projection: ['MATNR', 'CHARG', 'HSDAT'],
    randomization: 'random',
    state: 'Draft',
    last_run: null,
    created_by: 'M.Reddy',
    created_at: '2026-05-01T09:00:00+05:30',
  },
]

// ============================================================================
// MASTER DATA SNAPSHOTS
// ============================================================================

export type StalenessLevel = 'fresh' | 'aging' | 'stale'

export interface MasterDataSnapshot {
  id: string
  name: string
  description: string
  source_system: string
  source_client: string
  ddic_table: string
  taken_at: string
  row_count: number
  size_kb: number
  staleness: StalenessLevel
  scope_filter?: string
  restorable_as_fixture: boolean
  created_by: string
}

export const MOCK_SNAPSHOTS: MasterDataSnapshot[] = [
  {
    id: 'snap_1',
    name: 'KNA1 Customer Master from STA-100',
    description: 'Full customer master snapshot including sales area data',
    source_system: 'STA',
    source_client: '100',
    ddic_table: 'KNA1',
    taken_at: '2026-05-06T10:00:00+05:30',
    row_count: 1250,
    size_kb: 2840,
    staleness: 'fresh',
    scope_filter: "BUKRS = '1000'",
    restorable_as_fixture: true,
    created_by: 'P.Sharma',
  },
  {
    id: 'snap_2',
    name: 'MARA Material Master from STA-100',
    description: 'Material master including basic data and plant views',
    source_system: 'STA',
    source_client: '100',
    ddic_table: 'MARA',
    taken_at: '2026-05-05T14:30:00+05:30',
    row_count: 4500,
    size_kb: 8920,
    staleness: 'fresh',
    scope_filter: "MTART IN ('FERT', 'ROH', 'HALB')",
    restorable_as_fixture: true,
    created_by: 'J.Rao',
  },
  {
    id: 'snap_3',
    name: 'LFA1 Vendor Master from STA-100',
    description: 'Vendor master data for procurement testing',
    source_system: 'STA',
    source_client: '100',
    ddic_table: 'LFA1',
    taken_at: '2026-05-03T09:15:00+05:30',
    row_count: 890,
    size_kb: 1560,
    staleness: 'aging',
    scope_filter: "LAND1 = 'IN'",
    restorable_as_fixture: true,
    created_by: 'M.Reddy',
  },
  {
    id: 'snap_4',
    name: 'T001 Company Codes Reference',
    description: 'Company code configuration reference data',
    source_system: 'STA',
    source_client: '100',
    ddic_table: 'T001',
    taken_at: '2026-04-15T08:00:00+05:30',
    row_count: 12,
    size_kb: 24,
    staleness: 'stale',
    restorable_as_fixture: true,
    created_by: 'A.Mehta',
  },
  {
    id: 'snap_5',
    name: 'T024 Purchasing Groups Reference',
    description: 'Purchasing group master data for MM testing',
    source_system: 'STA',
    source_client: '100',
    ddic_table: 'T024',
    taken_at: '2026-04-20T11:45:00+05:30',
    row_count: 25,
    size_kb: 18,
    staleness: 'stale',
    restorable_as_fixture: true,
    created_by: 'K.Iyer',
  },
]

// ============================================================================
// TEST PACKS (Distributable Test Content)
// ============================================================================

export type DistributionStatus = 'Draft' | 'Published' | 'Distributed'
export type SignatureState = 'verified' | 'pending' | 'unsigned'

export interface TestPack {
  id: string
  name: string
  version: string
  description: string
  contents: {
    suites: number
    scenarios: number
    cases: number
    fixtures: number
  }
  distribution_status: DistributionStatus
  download_count: number
  signature_state: SignatureState
  signature_did?: string
  recipients: { id: string; name: string; type: 'customer' | 'partner' }[]
  created_at: string
  created_by: string
  published_at?: string
  tags: string[]
}

export const MOCK_TEST_PACKS: TestPack[] = [
  {
    id: 'tp_1',
    name: 'Star Cement Cutover Test Pack',
    version: 'v1.2',
    description: 'Complete test coverage for Star Cement S/4HANA cutover validation including OTC, PTP, and RTR processes.',
    contents: {
      suites: 1,
      scenarios: 47,
      cases: 188,
      fixtures: 24,
    },
    distribution_status: 'Published',
    download_count: 12,
    signature_state: 'verified',
    signature_did: 'did:voltus:0x4f8a...',
    recipients: [
      { id: 'cust_1', name: 'Star Cement', type: 'customer' },
    ],
    created_at: '2026-03-15T10:00:00+05:30',
    created_by: 'P.Sharma',
    published_at: '2026-04-01T09:00:00+05:30',
    tags: ['cutover', 'star-cement', 'otc', 'ptp', 'rtr'],
  },
  {
    id: 'tp_2',
    name: 'SD Core Regression Pack',
    version: 'v4.1',
    description: 'Standard SD module regression test pack covering all core sales and distribution processes.',
    contents: {
      suites: 2,
      scenarios: 35,
      cases: 142,
      fixtures: 18,
    },
    distribution_status: 'Published',
    download_count: 45,
    signature_state: 'verified',
    signature_did: 'did:voltus:0x7b2c...',
    recipients: [],
    created_at: '2026-01-10T14:30:00+05:30',
    created_by: 'J.Rao',
    published_at: '2026-02-15T10:00:00+05:30',
    tags: ['sd', 'regression', 'core', 'internal'],
  },
  {
    id: 'tp_3',
    name: 'Q4 2025 SAP BP Compliance Pack',
    version: 'v0.9',
    description: 'Draft compliance test pack for Q4 2025 SAP Best Practices updates.',
    contents: {
      suites: 3,
      scenarios: 28,
      cases: 96,
      fixtures: 12,
    },
    distribution_status: 'Draft',
    download_count: 0,
    signature_state: 'unsigned',
    recipients: [],
    created_at: '2026-05-01T09:00:00+05:30',
    created_by: 'M.Reddy',
    tags: ['compliance', 'best-practices', 'draft'],
  },
  {
    id: 'tp_4',
    name: 'Northstar Consulting OTC Accelerator Pack',
    version: 'v2.0',
    description: 'Pre-built OTC test scenarios from Northstar Consulting for rapid S/4HANA implementations.',
    contents: {
      suites: 2,
      scenarios: 52,
      cases: 215,
      fixtures: 32,
    },
    distribution_status: 'Distributed',
    download_count: 156,
    signature_state: 'verified',
    signature_did: 'did:voltus:0x9d4e...',
    recipients: [
      { id: 'cust_2', name: 'Dalmia Cement', type: 'customer' },
      { id: 'cust_3', name: 'UltraTech Industries', type: 'customer' },
      { id: 'part_1', name: 'TechMahindra', type: 'partner' },
    ],
    created_at: '2025-11-20T11:00:00+05:30',
    created_by: 'Northstar Consulting',
    published_at: '2025-12-01T09:00:00+05:30',
    tags: ['otc', 'accelerator', 'partner', 'northstar'],
  },
]

// ============================================================================
// IMPORTED TEST PACKS (From external sources)
// ============================================================================

export type SignatureVerificationState = 'verified' | 'unverified' | 'failed'
export type ProvenanceSource = 'voltuswave' | 'partner'

export interface ImportedTestPack {
  id: string
  name: string
  version: string
  description: string
  provenance: {
    source: ProvenanceSource
    partner_name?: string
    partner_did?: string
  }
  contents: {
    suites: number
    scenarios: number
    cases: number
    fixtures: number
  }
  signature_state: SignatureVerificationState
  signature_did?: string
  imported_at: string
  last_updated: string
  available_update?: {
    version: string
    released_at: string
    changelog: string
  }
  tags: string[]
}

export const MOCK_IMPORTED_PACKS: ImportedTestPack[] = [
  {
    id: 'imp_1',
    name: 'VoltusWave SAP Best Practices OTC Pack',
    version: 'v3.2.1',
    description: 'Official VoltusWave test pack covering SAP Best Practices for Order-to-Cash processes.',
    provenance: {
      source: 'voltuswave',
    },
    contents: {
      suites: 3,
      scenarios: 68,
      cases: 312,
      fixtures: 45,
    },
    signature_state: 'verified',
    signature_did: 'did:voltus:global:0xabcd...',
    imported_at: '2026-02-01T10:00:00+05:30',
    last_updated: '2026-04-15T09:00:00+05:30',
    available_update: {
      version: 'v3.3.0',
      released_at: '2026-05-01T09:00:00+05:30',
      changelog: 'Added 5 new scenarios for S/4HANA 2025 FPS01, improved ATP handling',
    },
    tags: ['otc', 'best-practices', 'official'],
  },
  {
    id: 'imp_2',
    name: 'Deloitte MM Regression Suite',
    version: 'v2.1.0',
    description: 'Comprehensive Materials Management regression pack from Deloitte SAP Practice.',
    provenance: {
      source: 'partner',
      partner_name: 'Deloitte',
      partner_did: 'did:voltus:partner:deloitte:0x1234...',
    },
    contents: {
      suites: 2,
      scenarios: 42,
      cases: 186,
      fixtures: 28,
    },
    signature_state: 'verified',
    signature_did: 'did:voltus:partner:deloitte:0x1234...',
    imported_at: '2026-01-15T14:30:00+05:30',
    last_updated: '2026-03-20T11:00:00+05:30',
    tags: ['mm', 'regression', 'procurement'],
  },
  {
    id: 'imp_3',
    name: 'Accenture FI/CO Compliance Pack',
    version: 'v1.8.0',
    description: 'Finance and Controlling compliance test scenarios for audit readiness.',
    provenance: {
      source: 'partner',
      partner_name: 'Accenture',
      partner_did: 'did:voltus:partner:accenture:0x5678...',
    },
    contents: {
      suites: 4,
      scenarios: 56,
      cases: 224,
      fixtures: 32,
    },
    signature_state: 'verified',
    signature_did: 'did:voltus:partner:accenture:0x5678...',
    imported_at: '2026-03-01T09:00:00+05:30',
    last_updated: '2026-04-10T14:00:00+05:30',
    tags: ['fi', 'co', 'compliance', 'audit'],
  },
  {
    id: 'imp_4',
    name: 'TCS S/4HANA Migration Accelerator',
    version: 'v4.0.0',
    description: 'End-to-end S/4HANA migration validation pack from TCS SAP Center of Excellence.',
    provenance: {
      source: 'partner',
      partner_name: 'TCS',
      partner_did: 'did:voltus:partner:tcs:0x9abc...',
    },
    contents: {
      suites: 5,
      scenarios: 89,
      cases: 412,
      fixtures: 56,
    },
    signature_state: 'unverified',
    imported_at: '2026-04-01T10:00:00+05:30',
    last_updated: '2026-04-01T10:00:00+05:30',
    tags: ['migration', 's4hana', 'accelerator'],
  },
  {
    id: 'imp_5',
    name: 'Legacy ECC Test Archive',
    version: 'v1.0.0',
    description: 'Archived ECC test scenarios from previous implementation partner.',
    provenance: {
      source: 'partner',
      partner_name: 'Unknown Partner',
    },
    contents: {
      suites: 1,
      scenarios: 23,
      cases: 78,
      fixtures: 12,
    },
    signature_state: 'failed',
    imported_at: '2025-06-15T08:00:00+05:30',
    last_updated: '2025-06-15T08:00:00+05:30',
    tags: ['legacy', 'ecc', 'archive'],
  },
]

// ============================================================================
// PROCESS TEMPLATES (Generic process templates beyond Test Scenarios)
// ============================================================================

export type ProcessTaskCategory = 'data_prep' | 'execution' | 'lifecycle' | 'verification' | 'sign_off' | 'healing'

export type ProcessTaskType = 
  // Data Prep
  | 'extract_data'
  | 'transform_data'
  | 'load_data'
  | 'validate_data'
  | 'cleanse_data'
  // Execution
  | 'run_transaction'
  | 'execute_batch_job'
  | 'trigger_interface'
  | 'call_api'
  // Lifecycle
  | 'create_snapshot'
  | 'restore_snapshot'
  | 'backup_config'
  | 'rollback'
  // Verification
  | 'verify_master_data'
  | 'assert_data_state'
  | 'compare_systems'
  | 'reconcile_data'
  // Sign Off
  | 'manual_review'
  | 'approval_gate'
  | 'stakeholder_sign_off'
  // Healing
  | 'auto_heal'
  | 'retry_failed'
  | 'escalate_issue'

export const PROCESS_TASK_CATEGORIES: Record<ProcessTaskCategory, { label: string; color: string; tasks: ProcessTaskType[] }> = {
  data_prep: {
    label: 'Data Preparation',
    color: 'bg-blue-500',
    tasks: ['extract_data', 'transform_data', 'load_data', 'validate_data', 'cleanse_data'],
  },
  execution: {
    label: 'Execution',
    color: 'bg-emerald-500',
    tasks: ['run_transaction', 'execute_batch_job', 'trigger_interface', 'call_api'],
  },
  lifecycle: {
    label: 'Lifecycle',
    color: 'bg-violet-500',
    tasks: ['create_snapshot', 'restore_snapshot', 'backup_config', 'rollback'],
  },
  verification: {
    label: 'Verification',
    color: 'bg-amber-500',
    tasks: ['verify_master_data', 'assert_data_state', 'compare_systems', 'reconcile_data'],
  },
  sign_off: {
    label: 'Sign Off',
    color: 'bg-rose-500',
    tasks: ['manual_review', 'approval_gate', 'stakeholder_sign_off'],
  },
  healing: {
    label: 'Healing',
    color: 'bg-cyan-500',
    tasks: ['auto_heal', 'retry_failed', 'escalate_issue'],
  },
}

export const PROCESS_TASK_LABELS: Record<ProcessTaskType, string> = {
  extract_data: 'Extract Data',
  transform_data: 'Transform Data',
  load_data: 'Load Data',
  validate_data: 'Validate Data',
  cleanse_data: 'Cleanse Data',
  run_transaction: 'Run Transaction',
  execute_batch_job: 'Execute Batch Job',
  trigger_interface: 'Trigger Interface',
  call_api: 'Call API',
  create_snapshot: 'Create Snapshot',
  restore_snapshot: 'Restore Snapshot',
  backup_config: 'Backup Config',
  rollback: 'Rollback',
  verify_master_data: 'Verify Master Data',
  assert_data_state: 'Assert Data State',
  compare_systems: 'Compare Systems',
  reconcile_data: 'Reconcile Data',
  manual_review: 'Manual Review',
  approval_gate: 'Approval Gate',
  stakeholder_sign_off: 'Stakeholder Sign Off',
  auto_heal: 'Auto Heal',
  retry_failed: 'Retry Failed',
  escalate_issue: 'Escalate Issue',
}

export type TemplateType = 'cutover' | 'migration' | 'hypercare' | 'onboarding' | 'regression'

export interface ProcessTemplateTask {
  id: string
  order: number
  name: string
  description: string
  task_type: ProcessTaskType
  category: ProcessTaskCategory
  assignee_class: AssigneeClass
  service_role?: string
  duration_estimate_mins?: number
  predecessors: string[]
  parallel_group?: string
  is_milestone?: boolean
  is_critical_path?: boolean
}

export interface ProcessTemplate {
  id: string
  code: string
  name: string
  description: string
  template_type: TemplateType
  version: string
  state: 'Draft' | 'Published' | 'Deprecated'
  tasks: ProcessTemplateTask[]
  created_at: string
  created_by: string
}

// Star Cement Cutover Plan with 22 tasks
export const MOCK_PROCESS_TEMPLATE: ProcessTemplate = {
  id: 'pt_1',
  code: 'PT_CUTOVER_STARCEMENT',
  name: 'Star Cement Cutover Plan',
  description: 'Complete S/4HANA cutover plan for Star Cement with data migration, verification, and go-live activities.',
  template_type: 'cutover',
  version: 'v1.0.0',
  state: 'Published',
  created_at: '2026-03-01T10:00:00+05:30',
  created_by: 'P.Sharma',
  tasks: [
    // Phase 1: Pre-Cutover Data Prep (1-6)
    { id: 'pt_1', order: 1, name: 'Extract Customer Masters from ECC', description: 'Extract KNA1/KNVV from source ECC system', task_type: 'extract_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 120, predecessors: [], is_milestone: false, is_critical_path: true },
    { id: 'pt_2', order: 2, name: 'Extract Vendor Masters from ECC', description: 'Extract LFA1/LFB1 from source ECC system', task_type: 'extract_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 90, predecessors: [], parallel_group: 'extract', is_critical_path: false },
    { id: 'pt_3', order: 3, name: 'Extract Material Masters from ECC', description: 'Extract MARA/MARC/MARD from source ECC system', task_type: 'extract_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 180, predecessors: [], parallel_group: 'extract', is_critical_path: true },
    { id: 'pt_4', order: 4, name: 'Transform Customer Data for S/4', description: 'Apply BP transformation rules', task_type: 'transform_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 60, predecessors: ['pt_1'], is_critical_path: true },
    { id: 'pt_5', order: 5, name: 'Transform Vendor Data for S/4', description: 'Apply BP transformation rules', task_type: 'transform_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 45, predecessors: ['pt_2'], parallel_group: 'transform', is_critical_path: false },
    { id: 'pt_6', order: 6, name: 'Transform Material Data for S/4', description: 'Apply S/4 material transformation', task_type: 'transform_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 90, predecessors: ['pt_3'], parallel_group: 'transform', is_critical_path: true },
    
    // Phase 2: Data Load & Validation (7-11)
    { id: 'pt_7', order: 7, name: 'Create Pre-Load Snapshot', description: 'Create system snapshot before data load', task_type: 'create_snapshot', category: 'lifecycle', assignee_class: 'agent', duration_estimate_mins: 30, predecessors: ['pt_4', 'pt_5', 'pt_6'], is_milestone: true, is_critical_path: true },
    { id: 'pt_8', order: 8, name: 'Load Customer Masters to S/4', description: 'LTMC load of customer business partners', task_type: 'load_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 45, predecessors: ['pt_7'], is_critical_path: true },
    { id: 'pt_9', order: 9, name: 'Load Vendor Masters to S/4', description: 'LTMC load of vendor business partners', task_type: 'load_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 30, predecessors: ['pt_7'], parallel_group: 'load', is_critical_path: false },
    { id: 'pt_10', order: 10, name: 'Load Material Masters to S/4', description: 'LTMC load of materials', task_type: 'load_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 60, predecessors: ['pt_7'], parallel_group: 'load', is_critical_path: true },
    { id: 'pt_11', order: 11, name: 'Validate Data Load Counts', description: 'Compare source and target record counts', task_type: 'validate_data', category: 'data_prep', assignee_class: 'agent', duration_estimate_mins: 15, predecessors: ['pt_8', 'pt_9', 'pt_10'], is_critical_path: true },
    
    // Phase 3: Functional Verification (12-16)
    { id: 'pt_12', order: 12, name: 'Verify Customer Masters', description: 'Sample check customer BP records', task_type: 'verify_master_data', category: 'verification', assignee_class: 'agent', duration_estimate_mins: 30, predecessors: ['pt_11'], is_critical_path: true },
    { id: 'pt_13', order: 13, name: 'Verify Vendor Masters', description: 'Sample check vendor BP records', task_type: 'verify_master_data', category: 'verification', assignee_class: 'agent', duration_estimate_mins: 25, predecessors: ['pt_11'], parallel_group: 'verify', is_critical_path: false },
    { id: 'pt_14', order: 14, name: 'Verify Material Masters', description: 'Sample check material records', task_type: 'verify_master_data', category: 'verification', assignee_class: 'agent', duration_estimate_mins: 35, predecessors: ['pt_11'], parallel_group: 'verify', is_critical_path: true },
    { id: 'pt_15', order: 15, name: 'Execute OTC Happy Path', description: 'Run critical OTC test scenario', task_type: 'run_transaction', category: 'execution', assignee_class: 'agent', duration_estimate_mins: 45, predecessors: ['pt_12', 'pt_13', 'pt_14'], is_milestone: true, is_critical_path: true },
    { id: 'pt_16', order: 16, name: 'Execute PTP Happy Path', description: 'Run critical PTP test scenario', task_type: 'run_transaction', category: 'execution', assignee_class: 'agent', duration_estimate_mins: 40, predecessors: ['pt_15'], is_critical_path: true },
    
    // Phase 4: Sign-Off & Go-Live (17-22)
    { id: 'pt_17', order: 17, name: 'Data Migration Sign-Off', description: 'Data team approval gate', task_type: 'approval_gate', category: 'sign_off', assignee_class: 'human', service_role: 'Data Lead', duration_estimate_mins: 30, predecessors: ['pt_16'], is_milestone: true, is_critical_path: true },
    { id: 'pt_18', order: 18, name: 'Functional Testing Sign-Off', description: 'QA team approval gate', task_type: 'approval_gate', category: 'sign_off', assignee_class: 'human', service_role: 'QA Lead', duration_estimate_mins: 30, predecessors: ['pt_17'], is_critical_path: true },
    { id: 'pt_19', order: 19, name: 'Execute Interface Jobs', description: 'Trigger outbound interfaces', task_type: 'trigger_interface', category: 'execution', assignee_class: 'agent', duration_estimate_mins: 60, predecessors: ['pt_18'], is_critical_path: true },
    { id: 'pt_20', order: 20, name: 'Reconcile ECC vs S/4 Balances', description: 'Compare financial balances', task_type: 'reconcile_data', category: 'verification', assignee_class: 'agent', duration_estimate_mins: 45, predecessors: ['pt_19'], is_critical_path: true },
    { id: 'pt_21', order: 21, name: 'Business Go-Live Sign-Off', description: 'Business owner final approval', task_type: 'stakeholder_sign_off', category: 'sign_off', assignee_class: 'human', service_role: 'Business Owner', duration_estimate_mins: 60, predecessors: ['pt_20'], is_milestone: true, is_critical_path: true },
    { id: 'pt_22', order: 22, name: 'Create Post-Go-Live Snapshot', description: 'Create system snapshot after go-live', task_type: 'create_snapshot', category: 'lifecycle', assignee_class: 'agent', duration_estimate_mins: 30, predecessors: ['pt_21'], is_milestone: true, is_critical_path: true },
  ],
}

export const MOCK_PROCESS_TEMPLATES: ProcessTemplate[] = [
  MOCK_PROCESS_TEMPLATE,
  {
    id: 'pt_2',
    code: 'PT_HYPERCARE_GENERIC',
    name: 'Hypercare Support Template',
    description: 'Standard hypercare monitoring and issue resolution template.',
    template_type: 'hypercare',
    version: 'v2.1.0',
    state: 'Published',
    created_at: '2026-02-15T10:00:00+05:30',
    created_by: 'J.Rao',
    tasks: [],
  },
  {
    id: 'pt_3',
    code: 'PT_ONBOARD_USER',
    name: 'User Onboarding Template',
    description: 'New user onboarding and training workflow.',
    template_type: 'onboarding',
    version: 'v1.2.0',
    state: 'Draft',
    created_at: '2026-04-01T10:00:00+05:30',
    created_by: 'M.Reddy',
    tasks: [],
  },
]

// ============================================================================
// HEALING PROMOTIONS (Proposed IR updates from runtime healings)
// ============================================================================

export type FailureClass = 'extra_modal' | 'missing_field' | 'changed_layout' | 'timeout' | 'element_not_found' | 'validation_error'
export type RepairStrategy = 'add_step' | 'modify_selector' | 'add_wait' | 'skip_step' | 'retry_with_fallback' | 'update_assertion'
export type PromotionConfidence = 'high' | 'medium' | 'low'

export interface HealingPromotion {
  id: string
  target_ir: {
    id: string
    name: string
    version: string
  }
  failure_class: FailureClass
  occurrence_count: number
  occurrence_window_days: number
  repair_strategy: RepairStrategy
  repair_description: string
  confidence: PromotionConfidence
  confidence_score: number
  impacted_test_cases: number
  originating_suite: string
  proposed_at: string
  proposed_by: 'agent' | 'human'
  last_occurrence: string
  sample_execution_ids: string[]
  auto_promotable: boolean
}

export const FAILURE_CLASS_LABELS: Record<FailureClass, string> = {
  extra_modal: 'Extra Modal Dialog',
  missing_field: 'Missing Field',
  changed_layout: 'Changed Layout',
  timeout: 'Timeout',
  element_not_found: 'Element Not Found',
  validation_error: 'Validation Error',
}

export const REPAIR_STRATEGY_LABELS: Record<RepairStrategy, string> = {
  add_step: 'Add Step',
  modify_selector: 'Modify Selector',
  add_wait: 'Add Wait',
  skip_step: 'Skip Step',
  retry_with_fallback: 'Retry with Fallback',
  update_assertion: 'Update Assertion',
}

export const MOCK_HEALING_PROMOTIONS: HealingPromotion[] = [
  {
    id: 'hp_1',
    target_ir: { id: 'ir_va01_create', name: 'VA01 Create Sales Order', version: 'v2.3.0' },
    failure_class: 'extra_modal',
    occurrence_count: 12,
    occurrence_window_days: 14,
    repair_strategy: 'add_step',
    repair_description: 'Add step to dismiss ATP availability popup that appears after S/4HANA 2025 FPS01 upgrade',
    confidence: 'high',
    confidence_score: 94,
    impacted_test_cases: 8,
    originating_suite: 'Star Cement Cutover Validation Suite',
    proposed_at: '2026-05-06T14:30:00+05:30',
    proposed_by: 'agent',
    last_occurrence: '2026-05-07T08:15:00+05:30',
    sample_execution_ids: ['exec_001', 'exec_002', 'exec_003'],
    auto_promotable: true,
  },
  {
    id: 'hp_2',
    target_ir: { id: 'ir_me21n_create', name: 'ME21N Create Purchase Order', version: 'v1.8.0' },
    failure_class: 'changed_layout',
    occurrence_count: 7,
    occurrence_window_days: 14,
    repair_strategy: 'modify_selector',
    repair_description: 'Update field selector for Vendor field after Fiori 3.0 theme migration changed DOM structure',
    confidence: 'medium',
    confidence_score: 78,
    impacted_test_cases: 5,
    originating_suite: 'SD Core Regression Suite',
    proposed_at: '2026-05-05T10:00:00+05:30',
    proposed_by: 'agent',
    last_occurrence: '2026-05-06T16:45:00+05:30',
    sample_execution_ids: ['exec_004', 'exec_005'],
    auto_promotable: false,
  },
  {
    id: 'hp_3',
    target_ir: { id: 'ir_fb01_post', name: 'FB01 Post GL Document', version: 'v3.1.0' },
    failure_class: 'timeout',
    occurrence_count: 5,
    occurrence_window_days: 7,
    repair_strategy: 'add_wait',
    repair_description: 'Increase wait time after document posting to allow for async validation completion',
    confidence: 'medium',
    confidence_score: 72,
    impacted_test_cases: 3,
    originating_suite: 'FI Core Regression Suite',
    proposed_at: '2026-05-04T16:20:00+05:30',
    proposed_by: 'agent',
    last_occurrence: '2026-05-06T11:30:00+05:30',
    sample_execution_ids: ['exec_006'],
    auto_promotable: false,
  },
  {
    id: 'hp_4',
    target_ir: { id: 'ir_migo_gr', name: 'MIGO Goods Receipt', version: 'v2.0.0' },
    failure_class: 'element_not_found',
    occurrence_count: 4,
    occurrence_window_days: 10,
    repair_strategy: 'retry_with_fallback',
    repair_description: 'Add fallback selector for Material Document field using alternative XPath when primary fails',
    confidence: 'medium',
    confidence_score: 68,
    impacted_test_cases: 4,
    originating_suite: 'MM Regression Suite',
    proposed_at: '2026-05-03T09:15:00+05:30',
    proposed_by: 'agent',
    last_occurrence: '2026-05-05T14:00:00+05:30',
    sample_execution_ids: ['exec_007', 'exec_008'],
    auto_promotable: false,
  },
  {
    id: 'hp_5',
    target_ir: { id: 'ir_vf01_billing', name: 'VF01 Create Billing Document', version: 'v1.5.0' },
    failure_class: 'validation_error',
    occurrence_count: 3,
    occurrence_window_days: 21,
    repair_strategy: 'update_assertion',
    repair_description: 'Update assertion to handle new tax calculation rounding behavior - CONTROVERSIAL: may mask actual defects',
    confidence: 'low',
    confidence_score: 45,
    impacted_test_cases: 6,
    originating_suite: 'Star Cement Cutover Validation Suite',
    proposed_at: '2026-05-01T11:00:00+05:30',
    proposed_by: 'agent',
    last_occurrence: '2026-05-04T09:30:00+05:30',
    sample_execution_ids: ['exec_009'],
    auto_promotable: false,
  },
]

// ============================================================================
// HEALING PROMOTION HISTORY (Historical record of decisions)
// ============================================================================

export type PromotionDecision = 'Approved' | 'Rejected' | 'Approved with Modifications'

export interface HealingPromotionHistory {
  id: string
  target_ir: {
    id: string
    name: string
    version: string
  }
  decision: PromotionDecision
  reviewer: {
    id: string
    name: string
    role: string
  }
  decided_at: string
  failure_class: FailureClass
  repair_strategy: RepairStrategy
  success_rate_post_merge?: number
  rationale?: string
  proposed_at: string
}

export const MOCK_HEALING_HISTORY: HealingPromotionHistory[] = [
  {
    id: 'hph_1',
    target_ir: { id: 'ir_va01_create', name: 'VA01 Create Sales Order', version: 'v2.2.0' },
    decision: 'Approved',
    reviewer: { id: 'u_1', name: 'P.Sharma', role: 'Test Engineering Lead' },
    decided_at: '2026-04-28T14:30:00+05:30',
    failure_class: 'extra_modal',
    repair_strategy: 'add_step',
    success_rate_post_merge: 98,
    proposed_at: '2026-04-25T10:00:00+05:30',
  },
  {
    id: 'hph_2',
    target_ir: { id: 'ir_me21n_create', name: 'ME21N Create Purchase Order', version: 'v1.7.0' },
    decision: 'Approved with Modifications',
    reviewer: { id: 'u_2', name: 'J.Rao', role: 'QA Lead' },
    decided_at: '2026-04-22T11:15:00+05:30',
    failure_class: 'changed_layout',
    repair_strategy: 'modify_selector',
    success_rate_post_merge: 94,
    rationale: 'Approved with additional fallback selector for edge cases',
    proposed_at: '2026-04-20T09:00:00+05:30',
  },
  {
    id: 'hph_3',
    target_ir: { id: 'ir_vf01_billing', name: 'VF01 Create Billing Document', version: 'v1.4.0' },
    decision: 'Rejected',
    reviewer: { id: 'u_1', name: 'P.Sharma', role: 'Test Engineering Lead' },
    decided_at: '2026-04-18T16:45:00+05:30',
    failure_class: 'validation_error',
    repair_strategy: 'update_assertion',
    rationale: 'Masking actual tax calculation defect - referred to development team',
    proposed_at: '2026-04-15T14:00:00+05:30',
  },
  {
    id: 'hph_4',
    target_ir: { id: 'ir_fb01_post', name: 'FB01 Post GL Document', version: 'v3.0.0' },
    decision: 'Approved',
    reviewer: { id: 'u_3', name: 'M.Reddy', role: 'Senior Test Engineer' },
    decided_at: '2026-04-10T10:00:00+05:30',
    failure_class: 'timeout',
    repair_strategy: 'add_wait',
    success_rate_post_merge: 100,
    proposed_at: '2026-04-08T08:30:00+05:30',
  },
  {
    id: 'hph_5',
    target_ir: { id: 'ir_migo_gr', name: 'MIGO Goods Receipt', version: 'v1.9.0' },
    decision: 'Approved',
    reviewer: { id: 'u_2', name: 'J.Rao', role: 'QA Lead' },
    decided_at: '2026-04-05T15:20:00+05:30',
    failure_class: 'element_not_found',
    repair_strategy: 'retry_with_fallback',
    success_rate_post_merge: 96,
    proposed_at: '2026-04-03T11:00:00+05:30',
  },
  {
    id: 'hph_6',
    target_ir: { id: 'ir_vl01n_delivery', name: 'VL01N Create Delivery', version: 'v2.1.0' },
    decision: 'Rejected',
    reviewer: { id: 'u_1', name: 'P.Sharma', role: 'Test Engineering Lead' },
    decided_at: '2026-03-28T09:30:00+05:30',
    failure_class: 'missing_field',
    repair_strategy: 'skip_step',
    rationale: 'Field is required for compliance - cannot skip',
    proposed_at: '2026-03-26T14:15:00+05:30',
  },
  {
    id: 'hph_7',
    target_ir: { id: 'ir_xd01_create', name: 'XD01 Create Customer', version: 'v1.2.0' },
    decision: 'Approved',
    reviewer: { id: 'u_4', name: 'S.Kumar', role: 'Test Engineer' },
    decided_at: '2026-03-20T11:45:00+05:30',
    failure_class: 'extra_modal',
    repair_strategy: 'add_step',
    success_rate_post_merge: 100,
    proposed_at: '2026-03-18T10:00:00+05:30',
  },
  {
    id: 'hph_8',
    target_ir: { id: 'ir_va02_change', name: 'VA02 Change Sales Order', version: 'v1.5.0' },
    decision: 'Approved with Modifications',
    reviewer: { id: 'u_2', name: 'J.Rao', role: 'QA Lead' },
    decided_at: '2026-03-15T14:00:00+05:30',
    failure_class: 'changed_layout',
    repair_strategy: 'modify_selector',
    success_rate_post_merge: 92,
    rationale: 'Added timeout buffer before selector modification',
    proposed_at: '2026-03-12T09:30:00+05:30',
  },
]

// ============================================================================
// REPOSITORY AUDIT TRAIL (30 entries spanning 30 days)
// ============================================================================

export type RepositoryEntityClass = 'Suite' | 'Scenario' | 'Case' | 'Pack' | 'Promotion' | 'Fixture' | 'IR'

export interface RepositoryAuditEvent {
  id: string
  timestamp: string
  actor: {
    id: string
    name: string
    email: string
    role: string
  }
  entityClass: RepositoryEntityClass
  entityId: string
  entityName: string
  action: string
  fieldChanged?: string
  oldValue?: string
  newValue?: string
  signatureStatus: 'signed' | 'unsigned' | 'verified'
}

export const MOCK_REPOSITORY_AUDIT: RepositoryAuditEvent[] = [
  // Day 1 (today - May 7)
  { id: 'ra_1', timestamp: '2026-05-07T14:30:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Scenario', entityId: 'sc_1', entityName: 'OTC Happy Path Domestic', action: 'status_changed', fieldChanged: 'state', oldValue: 'Draft', newValue: 'Published', signatureStatus: 'verified' },
  { id: 'ra_2', timestamp: '2026-05-07T11:15:00+05:30', actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'QA Lead' }, entityClass: 'Case', entityId: 'tc_5', entityName: 'Verify Delivery Note Print', action: 'field_updated', fieldChanged: 'expected_result', oldValue: 'Document printed', newValue: 'Document printed with QR code', signatureStatus: 'signed' },
  { id: 'ra_3', timestamp: '2026-05-07T09:00:00+05:30', actor: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Test Engineer' }, entityClass: 'IR', entityId: 'ir_va01', entityName: 'VA01 Create Sales Order', action: 'version_incremented', fieldChanged: 'version', oldValue: 'v2.2.0', newValue: 'v2.3.0', signatureStatus: 'verified' },
  
  // Day 2 (May 6)
  { id: 'ra_4', timestamp: '2026-05-06T16:45:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Suite', entityId: 'suite_1', entityName: 'Star Cement Cutover Validation Suite', action: 'scenario_added', fieldChanged: 'scenarios', oldValue: '46 scenarios', newValue: '47 scenarios', signatureStatus: 'verified' },
  { id: 'ra_5', timestamp: '2026-05-06T14:20:00+05:30', actor: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Senior Test Engineer' }, entityClass: 'Fixture', entityId: 'fix_1', entityName: 'Domestic Customer Master Set', action: 'pii_level_changed', fieldChanged: 'has_pii', oldValue: 'low', newValue: 'medium', signatureStatus: 'signed' },
  { id: 'ra_6', timestamp: '2026-05-06T10:30:00+05:30', actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'QA Lead' }, entityClass: 'Case', entityId: 'tc_12', entityName: 'Process Credit Block Release', action: 'created', signatureStatus: 'signed' },
  
  // Day 3 (May 5)
  { id: 'ra_7', timestamp: '2026-05-05T17:00:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', role: 'Test Engineer' }, entityClass: 'Promotion', entityId: 'hp_1', entityName: 'VA01 Extra Modal Fix', action: 'submitted', signatureStatus: 'signed' },
  { id: 'ra_8', timestamp: '2026-05-05T14:30:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Pack', entityId: 'tp_1', entityName: 'Star Cement Cutover Test Pack', action: 'version_released', fieldChanged: 'version', oldValue: 'v1.1', newValue: 'v1.2', signatureStatus: 'verified' },
  { id: 'ra_9', timestamp: '2026-05-05T11:00:00+05:30', actor: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Test Engineer' }, entityClass: 'Scenario', entityId: 'sc_3', entityName: 'PTP Standard PO Flow', action: 'field_updated', fieldChanged: 'description', oldValue: 'Standard PO creation', newValue: 'Standard PO creation with 3-way match', signatureStatus: 'signed' },
  
  // Day 5 (May 3)
  { id: 'ra_10', timestamp: '2026-05-03T15:45:00+05:30', actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'QA Lead' }, entityClass: 'Suite', entityId: 'suite_2', entityName: 'SD Core Regression Suite', action: 'owner_changed', fieldChanged: 'owner', oldValue: 'M.Reddy', newValue: 'J.Rao', signatureStatus: 'verified' },
  { id: 'ra_11', timestamp: '2026-05-03T10:20:00+05:30', actor: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Senior Test Engineer' }, entityClass: 'IR', entityId: 'ir_me21n', entityName: 'ME21N Create PO', action: 'step_added', fieldChanged: 'steps', oldValue: '14 steps', newValue: '15 steps', signatureStatus: 'signed' },
  
  // Day 7 (May 1)
  { id: 'ra_12', timestamp: '2026-05-01T16:00:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Pack', entityId: 'tp_3', entityName: 'Q4 2025 SAP BP Compliance Pack', action: 'created', signatureStatus: 'signed' },
  { id: 'ra_13', timestamp: '2026-05-01T13:30:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', role: 'Test Engineer' }, entityClass: 'Case', entityId: 'tc_8', entityName: 'Create Billing Document', action: 'assertion_modified', fieldChanged: 'assertions', oldValue: '3 assertions', newValue: '4 assertions', signatureStatus: 'signed' },
  { id: 'ra_14', timestamp: '2026-05-01T09:15:00+05:30', actor: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Test Engineer' }, entityClass: 'Fixture', entityId: 'fix_3', entityName: 'Finished Goods Material Set', action: 'record_count_updated', fieldChanged: 'record_count', oldValue: '100', newValue: '120', signatureStatus: 'signed' },
  
  // Day 10 (Apr 28)
  { id: 'ra_15', timestamp: '2026-04-28T14:30:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Promotion', entityId: 'hph_1', entityName: 'VA01 Extra Modal Fix', action: 'approved', fieldChanged: 'decision', oldValue: 'pending', newValue: 'Approved', signatureStatus: 'verified' },
  { id: 'ra_16', timestamp: '2026-04-28T11:00:00+05:30', actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'QA Lead' }, entityClass: 'Scenario', entityId: 'sc_5', entityName: 'OTC Export with LC', action: 'status_changed', fieldChanged: 'state', oldValue: 'Draft', newValue: 'In Review', signatureStatus: 'signed' },
  
  // Day 12 (Apr 26)
  { id: 'ra_17', timestamp: '2026-04-26T15:20:00+05:30', actor: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Senior Test Engineer' }, entityClass: 'Case', entityId: 'tc_15', entityName: 'Verify Intercompany Billing', action: 'created', signatureStatus: 'signed' },
  { id: 'ra_18', timestamp: '2026-04-26T10:45:00+05:30', actor: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Test Engineer' }, entityClass: 'IR', entityId: 'ir_vf01', entityName: 'VF01 Create Billing', action: 'field_updated', fieldChanged: 'transaction_code', oldValue: 'VF01', newValue: 'VF01 / VF04', signatureStatus: 'signed' },
  
  // Day 15 (Apr 23)
  { id: 'ra_19', timestamp: '2026-04-23T16:30:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Suite', entityId: 'suite_1', entityName: 'Star Cement Cutover Validation Suite', action: 'milestone_set', fieldChanged: 'milestone', oldValue: 'none', newValue: 'Cutover Go-Live', signatureStatus: 'verified' },
  { id: 'ra_20', timestamp: '2026-04-23T09:00:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', role: 'Test Engineer' }, entityClass: 'Fixture', entityId: 'fix_5', entityName: 'Sample Sales Orders', action: 'expires_at_set', fieldChanged: 'expires_at', oldValue: 'null', newValue: '2026-06-30', signatureStatus: 'signed' },
  
  // Day 18 (Apr 20)
  { id: 'ra_21', timestamp: '2026-04-20T14:00:00+05:30', actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'QA Lead' }, entityClass: 'Scenario', entityId: 'sc_2', entityName: 'OTC with Credit Hold', action: 'case_removed', fieldChanged: 'cases', oldValue: '12 cases', newValue: '11 cases', signatureStatus: 'signed' },
  { id: 'ra_22', timestamp: '2026-04-20T10:15:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Pack', entityId: 'tp_1', entityName: 'Star Cement Cutover Test Pack', action: 'distributed', fieldChanged: 'recipients', oldValue: '0', newValue: '1 (Star Cement)', signatureStatus: 'verified' },
  
  // Day 21 (Apr 17)
  { id: 'ra_23', timestamp: '2026-04-17T15:45:00+05:30', actor: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Senior Test Engineer' }, entityClass: 'IR', entityId: 'ir_migo', entityName: 'MIGO Goods Receipt', action: 'version_incremented', fieldChanged: 'version', oldValue: 'v1.9.0', newValue: 'v2.0.0', signatureStatus: 'verified' },
  { id: 'ra_24', timestamp: '2026-04-17T11:30:00+05:30', actor: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Test Engineer' }, entityClass: 'Case', entityId: 'tc_20', entityName: 'Post Goods Receipt', action: 'data_fixture_linked', fieldChanged: 'fixtures', oldValue: '1 fixture', newValue: '2 fixtures', signatureStatus: 'signed' },
  
  // Day 24 (Apr 14)
  { id: 'ra_25', timestamp: '2026-04-14T16:20:00+05:30', actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'QA Lead' }, entityClass: 'Suite', entityId: 'suite_3', entityName: 'FI Core Regression Suite', action: 'created', signatureStatus: 'signed' },
  { id: 'ra_26', timestamp: '2026-04-14T10:00:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', role: 'Test Engineer' }, entityClass: 'Scenario', entityId: 'sc_8', entityName: 'RTR Month-End Close', action: 'field_updated', fieldChanged: 'priority', oldValue: 'Medium', newValue: 'High', signatureStatus: 'signed' },
  
  // Day 27 (Apr 11)
  { id: 'ra_27', timestamp: '2026-04-11T14:45:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', role: 'Migration Manager' }, entityClass: 'Promotion', entityId: 'hph_3', entityName: 'VF01 Tax Calculation Fix', action: 'rejected', fieldChanged: 'decision', oldValue: 'pending', newValue: 'Rejected', signatureStatus: 'verified' },
  { id: 'ra_28', timestamp: '2026-04-11T09:30:00+05:30', actor: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', role: 'Senior Test Engineer' }, entityClass: 'Fixture', entityId: 'fix_7', entityName: 'Export Customer Master Set', action: 'created', signatureStatus: 'signed' },
  
  // Day 30 (Apr 8)
  { id: 'ra_29', timestamp: '2026-04-08T15:00:00+05:30', actor: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', role: 'Test Engineer' }, entityClass: 'Case', entityId: 'tc_25', entityName: 'Verify Tax Calculation', action: 'status_changed', fieldChanged: 'state', oldValue: 'Active', newValue: 'Deprecated', signatureStatus: 'signed' },
  { id: 'ra_30', timestamp: '2026-04-08T08:45:00+05:30', actor: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', role: 'QA Lead' }, entityClass: 'Pack', entityId: 'tp_2', entityName: 'SD Core Regression Pack', action: 'version_released', fieldChanged: 'version', oldValue: 'v4.0', newValue: 'v4.1', signatureStatus: 'verified' },
]

// ============================================================================
// CURRENT USER
// ============================================================================

export const MOCK_USER = {
  did: 'did:voltus:0x4f8a...',
  name: 'Pradeep Sharma',
  role: 'Migration Manager',
  customer: 'Star Cement',
  workspace: 'Manufacturing IT',
}

// ============================================================================
// ADDITIONAL MOCK DATA FOR UI
// ============================================================================

// Mock Assignees (SAP enterprise personas)
export const mockAssignees = [
  { id: '1', name: 'Pradeep Sharma', email: 'pradeep.sharma@starcement.com', class: 'human' as const, initials: 'PS' },
  { id: '2', name: 'Jahnavi Rao', email: 'jahnavi.rao@starcement.com', class: 'human' as const, initials: 'JR' },
  { id: '3', name: 'Manoj Reddy', email: 'manoj.reddy@starcement.com', class: 'human' as const, initials: 'MR' },
  { id: '4', name: 'Sandeep Kumar', email: 'sandeep.kumar@starcement.com', class: 'human' as const, initials: 'SK' },
  { id: '5', name: 'Kaushik Iyer', email: 'kaushik.iyer@starcement.com', class: 'human' as const, initials: 'KI' },
  { id: '6', name: 'Amit Mehta', email: 'amit.mehta@starcement.com', class: 'human' as const, initials: 'AM' },
  { id: 'agent-1', name: 'Voltus AI Agent', email: 'agent@voltuswave.com', class: 'agent' as const, initials: 'AI' },
]

// Mock SAP Systems
export const mockSystems = [
  { sid: 'STA', client: '100', description: 'Star Cement Development', isProductive: false, environment: 'DEV' as const },
  { sid: 'STQ', client: '200', description: 'Star Cement Quality', isProductive: false, environment: 'QAS' as const },
  { sid: 'STP', client: '300', description: 'Star Cement Production', isProductive: true, environment: 'PRD' as const },
  { sid: 'D01', client: '800', description: 'Development Sandbox', isProductive: false, environment: 'DEV' as const },
  { sid: 'S4H', client: '100', description: 'S/4HANA Target System', isProductive: false, environment: 'QAS' as const },
]

// Mock Activities
export const mockActivities = [
  {
    id: 'ACT-001',
    action: 'Test Suite started',
    actor: mockAssignees[6], // Voltus AI Agent
    timestamp: '2026-05-07T10:00:00+05:30',
    details: 'Automated test execution initiated for SC_CUTOVER_VAL',
  },
  {
    id: 'ACT-002',
    action: 'Defect created',
    actor: mockAssignees[1],
    timestamp: '2026-05-07T09:45:00+05:30',
    details: 'DEF-2026-00428 raised from failed test case OTC_CREDIT',
  },
  {
    id: 'ACT-003',
    action: 'Test Case healed',
    actor: mockAssignees[6],
    timestamp: '2026-05-07T09:30:00+05:30',
    details: 'OTC_HP_DOM auto-healed by AI Agent due to UI selector change',
  },
  {
    id: 'ACT-004',
    action: 'Transport promoted',
    actor: mockAssignees[2],
    timestamp: '2026-05-07T09:00:00+05:30',
    details: 'STAK900124 released to QAS after test approval',
  },
  {
    id: 'ACT-005',
    action: 'Sign-off requested',
    actor: mockAssignees[0],
    timestamp: '2026-05-06T17:30:00+05:30',
    details: 'SC_CUTOVER_VAL submitted for QA Lead sign-off',
  },
]

// Dashboard metrics derived from migration data
export const mockDashboardMetrics = {
  totalTestSuites: 5,
  totalScenarios: MOCK_TEST_SUITES.reduce((acc, s) => acc + s.scenario_count, 0),
  passRate: MOCK_MIGRATION.regression_pass_rate_pct,
  healingRate: MOCK_MIGRATION.healing_rate_pct,
  openDefects: MOCK_DEFECTS.filter(d => d.state !== 'Closed').length,
  criticalDefects: MOCK_MIGRATION.open_critical_defects,
  pendingTransports: MOCK_TRANSPORTS.filter(t => t.state !== 'Released_PROD').length,
  coveragePercent: MOCK_MIGRATION.bp_coverage_pct,
  daysToCutover: MOCK_MIGRATION.days_to_cutover,
  cutoverReadiness: MOCK_MIGRATION.cutover_readiness_score,
  siItemsTotal: MOCK_MIGRATION.si_items_total,
  siItemsClosed: MOCK_MIGRATION.si_items_closed,
  abapFindingsTotal: MOCK_MIGRATION.abap_findings_total,
  abapFindingsClosed: MOCK_MIGRATION.abap_findings_closed,
}

// Test Execution Runs
export const mockTestRuns = [
  {
    id: 'run_001',
    suite: MOCK_TEST_SUITES[0],
    started_at: '2026-05-07T08:00:00+05:30',
    ended_at: '2026-05-07T09:45:00+05:30',
    state: 'Completed_Passed_With_Healing',
    passed: 43,
    failed: 0,
    healed: 4,
    skipped: 0,
    total: 47,
    triggered_by: mockAssignees[0],
    system: mockSystems[1],
  },
  {
    id: 'run_002',
    suite: MOCK_TEST_SUITES[1],
    started_at: '2026-05-07T10:00:00+05:30',
    state: 'InProgress',
    passed: 12,
    failed: 1,
    healed: 1,
    skipped: 0,
    total: 18,
    triggered_by: mockAssignees[6],
    system: mockSystems[4],
  },
  {
    id: 'run_003',
    suite: MOCK_TEST_SUITES[2],
    started_at: '2026-05-07T06:00:00+05:30',
    ended_at: '2026-05-07T06:22:00+05:30',
    state: 'Completed_Passed',
    passed: 9,
    failed: 0,
    healed: 0,
    skipped: 0,
    total: 9,
    triggered_by: mockAssignees[1],
    system: mockSystems[1],
  },
  {
    id: 'run_004',
    suite: MOCK_TEST_SUITES[3],
    started_at: '2026-05-06T22:00:00+05:30',
    ended_at: '2026-05-07T00:15:00+05:30',
    state: 'Completed_Failed',
    passed: 19,
    failed: 3,
    healed: 2,
    skipped: 0,
    total: 24,
    triggered_by: mockAssignees[2],
    system: mockSystems[1],
  },
]

// Test Runners
export const mockRunners = [
  { id: 'runner_1', name: 'VOLTUS-RUNNER-01', state: 'Idle' as const, last_heartbeat: '2026-05-07T10:29:55+05:30', current_task: null, host: 'runner-01.voltuswave.local' },
  { id: 'runner_2', name: 'VOLTUS-RUNNER-02', state: 'Busy' as const, last_heartbeat: '2026-05-07T10:30:00+05:30', current_task: 'OTC_HP_DOM Step 4', host: 'runner-02.voltuswave.local' },
  { id: 'runner_3', name: 'VOLTUS-RUNNER-03', state: 'Busy' as const, last_heartbeat: '2026-05-07T10:29:58+05:30', current_task: 'PTP_3WM Step 7', host: 'runner-03.voltuswave.local' },
  { id: 'runner_4', name: 'VOLTUS-RUNNER-04', state: 'Offline' as const, last_heartbeat: '2026-05-07T08:15:00+05:30', current_task: null, host: 'runner-04.voltuswave.local' },
  { id: 'runner_5', name: 'VOLTUS-RUNNER-05', state: 'Idle' as const, last_heartbeat: '2026-05-07T10:29:52+05:30', current_task: null, host: 'runner-05.voltuswave.local' },
]

// KB Articles
export const mockKBArticles = [
  {
    id: 'kb_001',
    title: 'Handling Credit Block in VA01 during S/4 Migration',
    category: 'Test Patterns',
    tags: ['SD', 'OTC', 'Credit Management'],
    created_by: mockAssignees[0],
    created_at: '2026-04-15T10:00:00+05:30',
    views: 234,
    helpful_votes: 45,
  },
  {
    id: 'kb_002',
    title: 'Best Practices for ABAP ATC Findings Remediation',
    category: 'ABAP Analysis',
    tags: ['ABAP', 'ATC', 'S/4HANA'],
    created_by: mockAssignees[3],
    created_at: '2026-04-10T14:30:00+05:30',
    views: 567,
    helpful_votes: 89,
  },
  {
    id: 'kb_003',
    title: 'Understanding Business Partner Migration',
    category: 'Migration Guides',
    tags: ['BP', 'Customer', 'Vendor', 'S/4HANA'],
    created_by: mockAssignees[1],
    created_at: '2026-04-05T09:00:00+05:30',
    views: 891,
    helpful_votes: 156,
  },
]

// Z-Object Inventory
export const mockZObjects = [
  { name: 'Z_INVOICE_AGGREGATOR', kind: 'PROG' as const, package: 'ZFINANCE', s4_status: 'Needs_Remediation' as const, atc_findings: 3, last_analyzed: '2026-05-06T14:00:00+05:30' },
  { name: 'Z_PRICING_CALC', kind: 'CLAS' as const, package: 'ZSD_PRICING', s4_status: 'Needs_Remediation' as const, atc_findings: 5, last_analyzed: '2026-05-06T14:00:00+05:30' },
  { name: 'Z_ORDER_VALIDATE', kind: 'FUGR' as const, package: 'ZSD_ORDER', s4_status: 'Compatible' as const, atc_findings: 1, last_analyzed: '2026-05-06T14:00:00+05:30' },
  { name: 'ZSDREP_PRICING_ENH', kind: 'PROG' as const, package: 'ZSD_PRICING', s4_status: 'Compatible' as const, atc_findings: 0, last_analyzed: '2026-05-06T14:00:00+05:30' },
  { name: 'ZCL_MM_WF_HANDLER', kind: 'CLAS' as const, package: 'ZMM_WORKFLOW', s4_status: 'Under_Review' as const, atc_findings: 2, last_analyzed: '2026-05-06T14:00:00+05:30' },
]
