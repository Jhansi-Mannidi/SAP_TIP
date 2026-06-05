// Transport Intelligence Mock Data

export type TransportState = 
  | 'Captured'
  | 'Classified'
  | 'Analyzed'
  | 'Test_Plan_Ready'
  | 'Test_Plan_Approved'
  | 'In_Test'
  | 'Released_to_QAS'
  | 'Released_to_PROD'
  | 'Closed'

export type ObjectType = 'PROG' | 'FUGR' | 'FUNC' | 'TABL' | 'TRAN' | 'CUS0' | 'CUS1' | 'DOMA' | 'DTEL' | 'ENQU' | 'MSAG' | 'VIEW' | 'CLAS' | 'INTF'

export type ClassificationCategory = 'functional' | 'customizing' | 'ddic' | 'z-program' | 'z-config' | 'dialog-transaction' | 'report' | 'interface'

export type ImpactVerdict = 'safe' | 'needs_healing' | 'regenerate' | 'broken'

export interface TransportObject {
  id: string
  object_type: ObjectType
  object_name: string
  classification_category: ClassificationCategory
  screen_models_touched: number
  abap_findings_count: number
}

export interface TransportRiskFactor {
  id: string
  description: string
  weight: number
}

export interface ImpactVerdictEntry {
  id: string
  test_case_id: string
  test_case_code: string
  test_case_name: string
  test_scenario: string
  last_pass_rate: number
  verdict: ImpactVerdict
  rationale: string
  approved: boolean
}

export interface ScreenDiff {
  id: string
  program: string
  dynpro: string
  severity: 'none' | 'cosmetic' | 'minor' | 'breaking'
  summary: string
  fields_added: number
  fields_removed: number
  fields_modified: number
  before_model: ScreenField[]
  after_model: ScreenField[]
}

export interface ScreenField {
  id: string
  name: string
  label: string
  type: 'input' | 'checkbox' | 'dropdown' | 'button' | 'label' | 'table'
  x: number
  y: number
  width: number
  height: number
  required: boolean
  visible: boolean
  changed?: 'added' | 'removed' | 'modified'
}

export interface Transport {
  id: string
  tr_number: string
  description: string
  source_system: string
  source_system_type: 'DEV' | 'QAS' | 'PROD'
  owner: {
    id: string
    name: string
    email: string
    avatar_initials: string
    role: string
  }
  state: TransportState
  risk_score: number
  risk_band: 'low' | 'medium' | 'high' | 'critical'
  classification_summary: string[]
  linked_tests_count: number
  linked_migration_id?: string
  linked_migration_name?: string
  objects: TransportObject[]
  risk_factors: TransportRiskFactor[]
  impact_verdicts: ImpactVerdictEntry[]
  screen_diffs: ScreenDiff[]
  captured_at: string
  classified_at?: string
  analyzed_at?: string
  test_plan_ready_at?: string
  test_plan_approved_at?: string
  in_test_at?: string
  released_to_qas_at?: string
  released_to_prod_at?: string
  closed_at?: string
}

export interface TransportAuditEvent {
  id: string
  transport_id: string
  timestamp: string
  actor: {
    id: string
    name: string
    role: string
    type: 'human' | 'agent'
  }
  action: string
  details: string
  previous_state?: TransportState
  new_state?: TransportState
}

// Sample ME21N Transport
const ME21N_TRANSPORT: Transport = {
  id: 'tr_1',
  tr_number: 'STAK900123',
  description: 'ME21N field ZTERM made required',
  source_system: 'SD1',
  source_system_type: 'DEV',
  owner: {
    id: 'u_3',
    name: 'M.Reddy',
    email: 'm.reddy@starcement.com',
    avatar_initials: 'MR',
    role: 'ABAP Developer',
  },
  state: 'In_Test',
  risk_score: 0.62,
  risk_band: 'high',
  classification_summary: ['Z-Program', 'Customizing', 'Dialog Transaction'],
  linked_tests_count: 14,
  linked_migration_id: 'mig_1',
  linked_migration_name: 'Star Cement S/4HANA Migration',
  objects: [
    { id: 'obj_1', object_type: 'PROG', object_name: 'ZME21N_USEREXIT', classification_category: 'z-program', screen_models_touched: 1, abap_findings_count: 1 },
    { id: 'obj_2', object_type: 'TRAN', object_name: 'ME21N', classification_category: 'dialog-transaction', screen_models_touched: 2, abap_findings_count: 0 },
    { id: 'obj_3', object_type: 'PROG', object_name: 'RM06ENN', classification_category: 'customizing', screen_models_touched: 1, abap_findings_count: 0 },
    { id: 'obj_4', object_type: 'TABL', object_name: 'T161', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
  ],
  risk_factors: [
    { id: 'rf_1', description: 'ME21N is high-traffic transaction (45 tests touch it)', weight: 0.25 },
    { id: 'rf_2', description: 'ZTERM became required field — high regression risk', weight: 0.20 },
    { id: 'rf_3', description: 'Z-program modification detected', weight: 0.10 },
    { id: 'rf_4', description: 'Customizing table change (T161)', weight: 0.07 },
  ],
  impact_verdicts: [
    { id: 'iv_1', test_case_id: 'tc_1', test_case_code: 'TC_OTC_001', test_case_name: 'Create Standard PO', test_scenario: 'PTP Standard Flow', last_pass_rate: 98, verdict: 'safe', rationale: 'No dependency on ZTERM field', approved: true },
    { id: 'iv_2', test_case_id: 'tc_2', test_case_code: 'TC_OTC_002', test_case_name: 'Create PO with Payment Terms', test_scenario: 'PTP Standard Flow', last_pass_rate: 95, verdict: 'regenerate', rationale: 'Test sets ZTERM - field now required, test IR needs update', approved: false },
    { id: 'iv_3', test_case_id: 'tc_3', test_case_code: 'TC_OTC_003', test_case_name: 'Create PO with Vendor Terms', test_scenario: 'PTP Vendor Managed', last_pass_rate: 92, verdict: 'regenerate', rationale: 'ZTERM validation will fail without required flag handling', approved: false },
    { id: 'iv_4', test_case_id: 'tc_4', test_case_code: 'TC_OTC_004', test_case_name: 'Modify PO Header', test_scenario: 'PTP Change Flow', last_pass_rate: 100, verdict: 'safe', rationale: 'Modification flow does not touch ZTERM', approved: true },
    { id: 'iv_5', test_case_id: 'tc_5', test_case_code: 'TC_OTC_005', test_case_name: 'Create Urgent PO', test_scenario: 'PTP Urgent Processing', last_pass_rate: 94, verdict: 'regenerate', rationale: 'Urgent PO bypasses ZTERM - needs validation update', approved: false },
    { id: 'iv_6', test_case_id: 'tc_6', test_case_code: 'TC_OTC_006', test_case_name: 'PO with Scheduling Agreement', test_scenario: 'PTP Scheduling', last_pass_rate: 91, verdict: 'safe', rationale: 'SA flow uses different field set', approved: true },
    { id: 'iv_7', test_case_id: 'tc_7', test_case_code: 'TC_OTC_007', test_case_name: 'Create Service PO', test_scenario: 'PTP Services', last_pass_rate: 96, verdict: 'safe', rationale: 'Service PO screen differs from standard', approved: true },
    { id: 'iv_8', test_case_id: 'tc_8', test_case_code: 'TC_OTC_008', test_case_name: 'PO Price Change', test_scenario: 'PTP Price Updates', last_pass_rate: 89, verdict: 'regenerate', rationale: 'Price change screen includes ZTERM display', approved: false },
    { id: 'iv_9', test_case_id: 'tc_9', test_case_code: 'TC_OTC_009', test_case_name: 'Create Contract Release', test_scenario: 'PTP Contracts', last_pass_rate: 97, verdict: 'safe', rationale: 'Contract release inherits terms from contract', approved: true },
    { id: 'iv_10', test_case_id: 'tc_10', test_case_code: 'TC_MM_001', test_case_name: 'Standard MM Flow', test_scenario: 'MM Procurement', last_pass_rate: 93, verdict: 'safe', rationale: 'MM flow does not use ME21N', approved: true },
    { id: 'iv_11', test_case_id: 'tc_11', test_case_code: 'TC_MM_002', test_case_name: 'Create RFQ', test_scenario: 'MM RFQ Process', last_pass_rate: 95, verdict: 'safe', rationale: 'RFQ uses ME41N not ME21N', approved: true },
    { id: 'iv_12', test_case_id: 'tc_12', test_case_code: 'TC_MM_003', test_case_name: 'Vendor Evaluation', test_scenario: 'MM Vendor Mgmt', last_pass_rate: 98, verdict: 'safe', rationale: 'No PO creation in this flow', approved: true },
    { id: 'iv_13', test_case_id: 'tc_13', test_case_code: 'TC_PTP_001', test_case_name: 'End-to-End PTP', test_scenario: 'PTP E2E', last_pass_rate: 88, verdict: 'regenerate', rationale: 'E2E includes PO creation with full field population', approved: false },
    { id: 'iv_14', test_case_id: 'tc_14', test_case_code: 'TC_PTP_002', test_case_name: 'PTP with Invoice Match', test_scenario: 'PTP Invoice', last_pass_rate: 90, verdict: 'safe', rationale: 'Invoice matching does not reference ZTERM required state', approved: true },
  ],
  screen_diffs: [
    {
      id: 'sd_1',
      program: 'SAPLMEPO',
      dynpro: '0120',
      severity: 'breaking',
      summary: 'ZTERM field changed from optional to required',
      fields_added: 0,
      fields_removed: 0,
      fields_modified: 1,
      before_model: [
        { id: 'f1', name: 'EBELN', label: 'PO Number', type: 'input', x: 20, y: 20, width: 150, height: 24, required: true, visible: true },
        { id: 'f2', name: 'BUKRS', label: 'Company Code', type: 'input', x: 20, y: 50, width: 80, height: 24, required: true, visible: true },
        { id: 'f3', name: 'BSART', label: 'Doc Type', type: 'dropdown', x: 20, y: 80, width: 80, height: 24, required: true, visible: true },
        { id: 'f4', name: 'LIFNR', label: 'Vendor', type: 'input', x: 20, y: 110, width: 120, height: 24, required: true, visible: true },
        { id: 'f5', name: 'ZTERM', label: 'Payment Terms', type: 'input', x: 20, y: 140, width: 80, height: 24, required: false, visible: true },
        { id: 'f6', name: 'WAERS', label: 'Currency', type: 'dropdown', x: 20, y: 170, width: 60, height: 24, required: true, visible: true },
      ],
      after_model: [
        { id: 'f1', name: 'EBELN', label: 'PO Number', type: 'input', x: 20, y: 20, width: 150, height: 24, required: true, visible: true },
        { id: 'f2', name: 'BUKRS', label: 'Company Code', type: 'input', x: 20, y: 50, width: 80, height: 24, required: true, visible: true },
        { id: 'f3', name: 'BSART', label: 'Doc Type', type: 'dropdown', x: 20, y: 80, width: 80, height: 24, required: true, visible: true },
        { id: 'f4', name: 'LIFNR', label: 'Vendor', type: 'input', x: 20, y: 110, width: 120, height: 24, required: true, visible: true },
        { id: 'f5', name: 'ZTERM', label: 'Payment Terms', type: 'input', x: 20, y: 140, width: 80, height: 24, required: true, visible: true, changed: 'modified' },
        { id: 'f6', name: 'WAERS', label: 'Currency', type: 'dropdown', x: 20, y: 170, width: 60, height: 24, required: true, visible: true },
      ],
    },
    {
      id: 'sd_2',
      program: 'SAPLMEPO',
      dynpro: '0130',
      severity: 'minor',
      summary: 'Item overview layout adjusted',
      fields_added: 0,
      fields_removed: 0,
      fields_modified: 2,
      before_model: [],
      after_model: [],
    },
  ],
  captured_at: '2026-05-05T08:00:00+05:30',
  classified_at: '2026-05-05T08:15:00+05:30',
  analyzed_at: '2026-05-05T09:00:00+05:30',
  test_plan_ready_at: '2026-05-05T09:30:00+05:30',
  test_plan_approved_at: '2026-05-06T10:00:00+05:30',
  in_test_at: '2026-05-06T11:00:00+05:30',
}

// Generate 15 transports with variety
export const MOCK_TRANSPORTS: Transport[] = [
  ME21N_TRANSPORT,
  {
    id: 'tr_2',
    tr_number: 'STAK900124',
    description: 'VA01 credit check enhancement',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', avatar_initials: 'PS', role: 'Migration Manager' },
    state: 'Released_to_PROD',
    risk_score: 0.45,
    risk_band: 'medium',
    classification_summary: ['Z-Program', 'User Exit'],
    linked_tests_count: 8,
    linked_migration_id: 'mig_1',
    linked_migration_name: 'Star Cement S/4HANA Migration',
    objects: [
      { id: 'obj_5', object_type: 'PROG', object_name: 'ZSD_CREDIT_CHECK', classification_category: 'z-program', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_5', description: 'Credit check is critical business function', weight: 0.25 },
      { id: 'rf_6', description: 'Z-program touches core SD flow', weight: 0.20 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-01T10:00:00+05:30',
    classified_at: '2026-05-01T10:30:00+05:30',
    analyzed_at: '2026-05-01T11:00:00+05:30',
    test_plan_ready_at: '2026-05-01T12:00:00+05:30',
    test_plan_approved_at: '2026-05-02T09:00:00+05:30',
    in_test_at: '2026-05-02T10:00:00+05:30',
    released_to_qas_at: '2026-05-03T14:00:00+05:30',
    released_to_prod_at: '2026-05-05T18:00:00+05:30',
  },
  {
    id: 'tr_3',
    tr_number: 'STAK900125',
    description: 'FI posting period configuration',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', avatar_initials: 'SK', role: 'FI Consultant' },
    state: 'Captured',
    risk_score: 0.25,
    risk_band: 'low',
    classification_summary: ['Customizing'],
    linked_tests_count: 3,
    objects: [
      { id: 'obj_6', object_type: 'CUS0', object_name: 'T001B', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_7', description: 'Posting period is time-sensitive', weight: 0.15 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-07T06:00:00+05:30',
  },
  {
    id: 'tr_4',
    tr_number: 'STAK900126',
    description: 'MM pricing procedure update',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', avatar_initials: 'JR', role: 'QA Lead' },
    state: 'Test_Plan_Ready',
    risk_score: 0.78,
    risk_band: 'critical',
    classification_summary: ['Customizing', 'Pricing', 'Z-Config'],
    linked_tests_count: 22,
    linked_migration_id: 'mig_1',
    linked_migration_name: 'Star Cement S/4HANA Migration',
    objects: [
      { id: 'obj_7', object_type: 'CUS0', object_name: 'T683S', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
      { id: 'obj_8', object_type: 'CUS1', object_name: 'V/08', classification_category: 'z-config', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_8', description: 'Pricing procedure affects all sales documents', weight: 0.35 },
      { id: 'rf_9', description: '22 tests depend on pricing calculation', weight: 0.25 },
      { id: 'rf_10', description: 'Z-config detected in pricing schema', weight: 0.18 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-04T14:00:00+05:30',
    classified_at: '2026-05-04T14:30:00+05:30',
    analyzed_at: '2026-05-04T15:30:00+05:30',
    test_plan_ready_at: '2026-05-04T16:00:00+05:30',
  },
  {
    id: 'tr_5',
    tr_number: 'STAK900127',
    description: 'Output determination for delivery',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', avatar_initials: 'KI', role: 'SD Consultant' },
    state: 'Released_to_QAS',
    risk_score: 0.38,
    risk_band: 'medium',
    classification_summary: ['Customizing', 'Output'],
    linked_tests_count: 6,
    objects: [
      { id: 'obj_9', object_type: 'CUS0', object_name: 'NACE', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_11', description: 'Output affects document printing', weight: 0.20 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-02T09:00:00+05:30',
    classified_at: '2026-05-02T09:20:00+05:30',
    analyzed_at: '2026-05-02T10:00:00+05:30',
    test_plan_ready_at: '2026-05-02T10:30:00+05:30',
    test_plan_approved_at: '2026-05-02T14:00:00+05:30',
    in_test_at: '2026-05-02T15:00:00+05:30',
    released_to_qas_at: '2026-05-04T10:00:00+05:30',
  },
  {
    id: 'tr_6',
    tr_number: 'STAK900128',
    description: 'Batch management enhancement',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', avatar_initials: 'MR', role: 'ABAP Developer' },
    state: 'Classified',
    risk_score: 0.55,
    risk_band: 'high',
    classification_summary: ['Z-Program', 'Batch Management'],
    linked_tests_count: 11,
    objects: [
      { id: 'obj_10', object_type: 'PROG', object_name: 'Z_BATCH_DETERMINATION', classification_category: 'z-program', screen_models_touched: 2, abap_findings_count: 2 },
    ],
    risk_factors: [
      { id: 'rf_12', description: 'Batch determination is inventory-critical', weight: 0.30 },
      { id: 'rf_13', description: 'ABAP findings detected', weight: 0.15 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-06T16:00:00+05:30',
    classified_at: '2026-05-06T16:30:00+05:30',
  },
  {
    id: 'tr_7',
    tr_number: 'STAK900129',
    description: 'Partner function configuration',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', avatar_initials: 'PS', role: 'Migration Manager' },
    state: 'Test_Plan_Approved',
    risk_score: 0.42,
    risk_band: 'medium',
    classification_summary: ['Customizing', 'Partner Functions'],
    linked_tests_count: 9,
    objects: [
      { id: 'obj_11', object_type: 'CUS0', object_name: 'VOPAN', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_14', description: 'Partner functions affect order processing', weight: 0.22 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-03T11:00:00+05:30',
    classified_at: '2026-05-03T11:30:00+05:30',
    analyzed_at: '2026-05-03T12:30:00+05:30',
    test_plan_ready_at: '2026-05-03T13:00:00+05:30',
    test_plan_approved_at: '2026-05-04T09:00:00+05:30',
  },
  {
    id: 'tr_8',
    tr_number: 'STAK900130',
    description: 'Material master extension fields',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', avatar_initials: 'SK', role: 'MM Consultant' },
    state: 'Analyzed',
    risk_score: 0.68,
    risk_band: 'high',
    classification_summary: ['Z-Program', 'DDIC', 'User Exit'],
    linked_tests_count: 18,
    linked_migration_id: 'mig_1',
    linked_migration_name: 'Star Cement S/4HANA Migration',
    objects: [
      { id: 'obj_12', object_type: 'TABL', object_name: 'ZMARA_EXT', classification_category: 'ddic', screen_models_touched: 3, abap_findings_count: 1 },
      { id: 'obj_13', object_type: 'PROG', object_name: 'Z_MM_USEREXIT', classification_category: 'z-program', screen_models_touched: 1, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_15', description: 'Material master is touched by 18 tests', weight: 0.30 },
      { id: 'rf_16', description: 'DDIC changes require careful migration', weight: 0.20 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-05T13:00:00+05:30',
    classified_at: '2026-05-05T13:30:00+05:30',
    analyzed_at: '2026-05-05T15:00:00+05:30',
  },
  {
    id: 'tr_9',
    tr_number: 'STAK900131',
    description: 'Intercompany billing setup',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', avatar_initials: 'JR', role: 'QA Lead' },
    state: 'In_Test',
    risk_score: 0.52,
    risk_band: 'high',
    classification_summary: ['Customizing', 'Intercompany'],
    linked_tests_count: 7,
    objects: [
      { id: 'obj_14', object_type: 'CUS0', object_name: 'VOFM', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_17', description: 'Intercompany affects multi-company scenarios', weight: 0.28 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-04T08:00:00+05:30',
    classified_at: '2026-05-04T08:30:00+05:30',
    analyzed_at: '2026-05-04T09:30:00+05:30',
    test_plan_ready_at: '2026-05-04T10:00:00+05:30',
    test_plan_approved_at: '2026-05-05T09:00:00+05:30',
    in_test_at: '2026-05-05T10:00:00+05:30',
  },
  {
    id: 'tr_10',
    tr_number: 'STAK900132',
    description: 'Shipping point determination',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', avatar_initials: 'KI', role: 'SD Consultant' },
    state: 'Released_to_PROD',
    risk_score: 0.22,
    risk_band: 'low',
    classification_summary: ['Customizing'],
    linked_tests_count: 4,
    objects: [
      { id: 'obj_15', object_type: 'CUS0', object_name: 'OVLK', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_18', description: 'Low-impact configuration change', weight: 0.12 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-04-28T10:00:00+05:30',
    classified_at: '2026-04-28T10:30:00+05:30',
    analyzed_at: '2026-04-28T11:00:00+05:30',
    test_plan_ready_at: '2026-04-28T11:30:00+05:30',
    test_plan_approved_at: '2026-04-28T14:00:00+05:30',
    in_test_at: '2026-04-28T15:00:00+05:30',
    released_to_qas_at: '2026-04-30T10:00:00+05:30',
    released_to_prod_at: '2026-05-02T18:00:00+05:30',
  },
  {
    id: 'tr_11',
    tr_number: 'STAK900133',
    description: 'Availability check configuration',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', avatar_initials: 'MR', role: 'ABAP Developer' },
    state: 'Captured',
    risk_score: 0.48,
    risk_band: 'medium',
    classification_summary: ['Customizing', 'ATP'],
    linked_tests_count: 12,
    objects: [
      { id: 'obj_16', object_type: 'CUS0', object_name: 'OVZ2', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_19', description: 'ATP configuration affects order confirmation', weight: 0.28 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-07T07:30:00+05:30',
  },
  {
    id: 'tr_12',
    tr_number: 'STAK900134',
    description: 'Tax calculation procedure update',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', avatar_initials: 'PS', role: 'Migration Manager' },
    state: 'Test_Plan_Ready',
    risk_score: 0.85,
    risk_band: 'critical',
    classification_summary: ['Customizing', 'Tax', 'Z-Config'],
    linked_tests_count: 28,
    linked_migration_id: 'mig_1',
    linked_migration_name: 'Star Cement S/4HANA Migration',
    objects: [
      { id: 'obj_17', object_type: 'CUS0', object_name: 'FTXP', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
      { id: 'obj_18', object_type: 'CUS1', object_name: 'OBCL', classification_category: 'z-config', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_20', description: 'Tax calculation is compliance-critical', weight: 0.40 },
      { id: 'rf_21', description: '28 tests depend on tax calculation', weight: 0.25 },
    ],
    impact_verdicts: [
      { id: 'iv_t1', test_case_id: 'tc_tax_1', test_case_code: 'TC_OTC_010', test_case_name: 'VA01 Sales Order Tax Calc', test_scenario: 'OTC Tax Flow', last_pass_rate: 91, verdict: 'regenerate', rationale: 'FTXP tax procedure change requires test IR update for condition type mapping', approved: false },
      { id: 'iv_t2', test_case_id: 'tc_tax_2', test_case_code: 'TC_OTC_011', test_case_name: 'Intercompany Billing Tax', test_scenario: 'OTC IC Billing', last_pass_rate: 78, verdict: 'regenerate', rationale: 'OBCL tax class configuration affects IC billing validation', approved: false },
      { id: 'iv_t3', test_case_id: 'tc_tax_3', test_case_code: 'TC_RTR_005', test_case_name: 'FI Tax Posting Verification', test_scenario: 'RTR Tax', last_pass_rate: 96, verdict: 'safe', rationale: 'Posting flow uses downstream tax document — no direct FTXP dependency', approved: true },
      { id: 'iv_t4', test_case_id: 'tc_tax_4', test_case_code: 'TC_OTC_012', test_case_name: 'Export Sales Tax Exemption', test_scenario: 'OTC Export', last_pass_rate: 88, verdict: 'needs_healing', rationale: 'Exemption rule may need runtime healing after procedure update', approved: false },
      { id: 'iv_t5', test_case_id: 'tc_tax_5', test_case_code: 'TC_PTP_003', test_case_name: 'PO with Input Tax', test_scenario: 'PTP Tax', last_pass_rate: 94, verdict: 'safe', rationale: 'Purchase tax uses separate condition table — unaffected by SD procedure', approved: true },
      { id: 'iv_t6', test_case_id: 'tc_tax_6', test_case_code: 'TC_OTC_013', test_case_name: 'Credit Memo Tax Reversal', test_scenario: 'OTC Returns', last_pass_rate: 85, verdict: 'regenerate', rationale: 'Reversal path references updated tax determination logic', approved: false },
    ],
    screen_diffs: [],
    captured_at: '2026-05-06T09:00:00+05:30',
    classified_at: '2026-05-06T09:30:00+05:30',
    analyzed_at: '2026-05-06T11:00:00+05:30',
    test_plan_ready_at: '2026-05-06T12:00:00+05:30',
  },
  {
    id: 'tr_13',
    tr_number: 'STAK900135',
    description: 'Route determination rules',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', avatar_initials: 'SK', role: 'Logistics Consultant' },
    state: 'Released_to_QAS',
    risk_score: 0.32,
    risk_band: 'medium',
    classification_summary: ['Customizing', 'Logistics'],
    linked_tests_count: 5,
    objects: [
      { id: 'obj_19', object_type: 'CUS0', object_name: 'OVLC', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_22', description: 'Route affects delivery processing', weight: 0.18 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-01T14:00:00+05:30',
    classified_at: '2026-05-01T14:30:00+05:30',
    analyzed_at: '2026-05-01T15:30:00+05:30',
    test_plan_ready_at: '2026-05-01T16:00:00+05:30',
    test_plan_approved_at: '2026-05-02T10:00:00+05:30',
    in_test_at: '2026-05-02T11:00:00+05:30',
    released_to_qas_at: '2026-05-03T16:00:00+05:30',
  },
  {
    id: 'tr_14',
    tr_number: 'STAK900136',
    description: 'Document type assignment',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', avatar_initials: 'JR', role: 'QA Lead' },
    state: 'Closed',
    risk_score: 0.18,
    risk_band: 'low',
    classification_summary: ['Customizing'],
    linked_tests_count: 2,
    objects: [
      { id: 'obj_20', object_type: 'CUS0', object_name: 'VOV8', classification_category: 'customizing', screen_models_touched: 0, abap_findings_count: 0 },
    ],
    risk_factors: [
      { id: 'rf_23', description: 'Minor configuration change', weight: 0.10 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-04-25T10:00:00+05:30',
    classified_at: '2026-04-25T10:30:00+05:30',
    analyzed_at: '2026-04-25T11:00:00+05:30',
    test_plan_ready_at: '2026-04-25T11:30:00+05:30',
    test_plan_approved_at: '2026-04-25T14:00:00+05:30',
    in_test_at: '2026-04-25T15:00:00+05:30',
    released_to_qas_at: '2026-04-26T10:00:00+05:30',
    released_to_prod_at: '2026-04-28T18:00:00+05:30',
    closed_at: '2026-04-29T09:00:00+05:30',
  },
  {
    id: 'tr_15',
    tr_number: 'STAK900137',
    description: 'Warehouse management interface',
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', avatar_initials: 'KI', role: 'WM Consultant' },
    state: 'Analyzed',
    risk_score: 0.72,
    risk_band: 'high',
    classification_summary: ['Z-Program', 'Interface', 'WM'],
    linked_tests_count: 15,
    objects: [
      { id: 'obj_21', object_type: 'PROG', object_name: 'Z_WM_INTERFACE', classification_category: 'z-program', screen_models_touched: 0, abap_findings_count: 3 },
      { id: 'obj_22', object_type: 'FUGR', object_name: 'Z_WM_FUNCTIONS', classification_category: 'z-program', screen_models_touched: 0, abap_findings_count: 1 },
    ],
    risk_factors: [
      { id: 'rf_24', description: 'WM interface is inventory-critical', weight: 0.35 },
      { id: 'rf_25', description: '4 ABAP findings detected', weight: 0.20 },
    ],
    impact_verdicts: [],
    screen_diffs: [],
    captured_at: '2026-05-06T14:00:00+05:30',
    classified_at: '2026-05-06T14:30:00+05:30',
    analyzed_at: '2026-05-06T16:00:00+05:30',
  },
]

// Audit trail for the ME21N transport
export const MOCK_TRANSPORT_AUDIT: TransportAuditEvent[] = [
  { id: 'ta_1', transport_id: 'tr_1', timestamp: '2026-05-05T08:00:00+05:30', actor: { id: 'agent_1', name: 'Transport Extraction Agent', role: 'Agent', type: 'agent' }, action: 'Transport captured', details: 'Captured from STMS - 4 objects extracted', previous_state: undefined, new_state: 'Captured' },
  { id: 'ta_2', transport_id: 'tr_1', timestamp: '2026-05-05T08:15:00+05:30', actor: { id: 'agent_2', name: 'Object Classification Agent', role: 'Agent', type: 'agent' }, action: 'Objects classified', details: 'All 4 objects classified: 1 Z-program, 1 dialog transaction, 1 customizing program, 1 customizing table', previous_state: 'Captured', new_state: 'Classified' },
  { id: 'ta_3', transport_id: 'tr_1', timestamp: '2026-05-05T09:00:00+05:30', actor: { id: 'agent_3', name: 'Impact Analysis Agent', role: 'Agent', type: 'agent' }, action: 'Impact analysis completed', details: '14 test cases analyzed: 9 safe, 5 regenerate', previous_state: 'Classified', new_state: 'Analyzed' },
  { id: 'ta_4', transport_id: 'tr_1', timestamp: '2026-05-05T09:30:00+05:30', actor: { id: 'agent_4', name: 'Test Plan Generator', role: 'Agent', type: 'agent' }, action: 'Test plan generated', details: 'Regeneration plan created for 5 test cases', previous_state: 'Analyzed', new_state: 'Test_Plan_Ready' },
  { id: 'ta_5', transport_id: 'tr_1', timestamp: '2026-05-06T10:00:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager', type: 'human' }, action: 'Test plan approved', details: 'Approved regeneration for all 5 test cases', previous_state: 'Test_Plan_Ready', new_state: 'Test_Plan_Approved' },
  { id: 'ta_6', transport_id: 'tr_1', timestamp: '2026-05-06T10:15:00+05:30', actor: { id: 'agent_5', name: 'Test Regeneration Agent', role: 'Agent', type: 'agent' }, action: 'Test regeneration started', details: 'Regenerating 5 test IRs', previous_state: 'Test_Plan_Approved', new_state: 'Test_Plan_Approved' },
  { id: 'ta_7', transport_id: 'tr_1', timestamp: '2026-05-06T10:45:00+05:30', actor: { id: 'agent_5', name: 'Test Regeneration Agent', role: 'Agent', type: 'agent' }, action: 'Test regeneration completed', details: 'All 5 test IRs regenerated successfully', previous_state: 'Test_Plan_Approved', new_state: 'Test_Plan_Approved' },
  { id: 'ta_8', transport_id: 'tr_1', timestamp: '2026-05-06T11:00:00+05:30', actor: { id: 'u_2', name: 'J.Rao', role: 'QA Lead', type: 'human' }, action: 'Test execution started', details: 'Scheduled Test Suite SUITE_ME21N_REGRESSION', previous_state: 'Test_Plan_Approved', new_state: 'In_Test' },
  { id: 'ta_9', transport_id: 'tr_1', timestamp: '2026-05-06T11:30:00+05:30', actor: { id: 'agent_6', name: 'Test Executor Agent', role: 'Agent', type: 'agent' }, action: 'Test case completed', details: 'TC_OTC_001 passed', previous_state: 'In_Test', new_state: 'In_Test' },
  { id: 'ta_10', transport_id: 'tr_1', timestamp: '2026-05-06T12:00:00+05:30', actor: { id: 'agent_6', name: 'Test Executor Agent', role: 'Agent', type: 'agent' }, action: 'Test case completed', details: 'TC_OTC_002 passed', previous_state: 'In_Test', new_state: 'In_Test' },
  { id: 'ta_11', transport_id: 'tr_1', timestamp: '2026-05-07T09:00:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager', type: 'human' }, action: 'Comment added', details: 'Good progress - expect QAS release by EOD', previous_state: 'In_Test', new_state: 'In_Test' },
  { id: 'ta_12', transport_id: 'tr_1', timestamp: '2026-05-07T14:00:00+05:30', actor: { id: 'agent_6', name: 'Test Executor Agent', role: 'Agent', type: 'agent' }, action: 'Test suite progress', details: '10/14 test cases completed', previous_state: 'In_Test', new_state: 'In_Test' },
]

// Pipeline stages
export const TRANSPORT_PIPELINE_STAGES = [
  { id: 'stage_1', name: 'Transport Extraction', input: 'TR number', output: 'E070/E071/E071K data' },
  { id: 'stage_2', name: 'Object Classification', input: 'Object list', output: 'Per-object classification' },
  { id: 'stage_3', name: 'Impact Analysis', input: 'ScreenModels + objects', output: 'Per-test verdicts' },
  { id: 'stage_4', name: 'Test Plan Generation', input: 'Verdicts', output: 'Regeneration list' },
  { id: 'stage_5', name: 'Test Generation / Regeneration', input: 'Regen list', output: 'New TestIRs' },
  { id: 'stage_6', name: 'Test Execution', input: 'Test Suite + IRs', output: 'Execution results' },
  { id: 'stage_7', name: 'Self-Healing Loop', input: 'Failures', output: 'Heal events' },
  { id: 'stage_8', name: 'Delta Scoring', input: 'Results', output: 'Scorecard' },
  { id: 'stage_9', name: 'Live Dashboard Projection', input: 'Scorecard', output: 'Dashboard tiles' },
]

export const TRANSPORT_STATES: TransportState[] = [
  'Captured',
  'Classified', 
  'Analyzed',
  'Test_Plan_Ready',
  'Test_Plan_Approved',
  'In_Test',
  'Released_to_QAS',
  'Released_to_PROD',
  'Closed',
]
