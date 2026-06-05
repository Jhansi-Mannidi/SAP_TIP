// ============================================================================
// MIGRATION COCKPIT MOCK DATA
// ============================================================================

export type MigrationKind = 'Brownfield' | 'Greenfield' | 'Bluefield' | 'Upgrade' | 'Rollout'
export type MigrationPhase = 'Initiation' | 'Design' | 'Realization' | 'Test_Prep' | 'Cutover' | 'Hypercare' | 'Closed'
export type MigrationState = 'Draft' | 'Active' | 'On_Hold' | 'Completed' | 'Cancelled'

export interface MigrationTeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  did?: string
}

export interface MigrationScorecard {
  bp_coverage_pct: number
  si_closed_pct: number
  abap_closed_pct: number
  regression_pass_rate: number
  open_critical_defects: number
  test_healing_rate: number
  cutover_readiness_score: number
  test_pack_coverage: number
  active_suites_today: number
  healed_cases_7d: number
  defect_resolution_time_days: number
}

export interface MigrationPhaseData {
  id: string
  phase: MigrationPhase
  state: 'Pending' | 'In_Progress' | 'Completed' | 'Skipped'
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  gate_criteria: GateCriterion[]
}

export interface GateCriterion {
  id: string
  kpi_code: string
  label: string
  comparator: '>=' | '<=' | '=' | '>'
  threshold: number
  current_value: number
  unit: string
  passed: boolean
}

export interface Migration {
  id: string
  code: string
  name: string
  description: string
  kind: MigrationKind
  state: MigrationState
  current_phase: MigrationPhase
  planned_cutover_date: string
  planned_start_date: string
  days_to_cutover: number
  scorecard: MigrationScorecard
  phases: MigrationPhaseData[]
  team: {
    migration_manager: MigrationTeamMember
    cio: MigrationTeamMember
    solution_architect: MigrationTeamMember
    sponsoring_si: string
  }
  scope: {
    modules: string[]
    business_processes: string[]
    org_units: { code: string; name: string; type: string }[]
    zobject_count: number
  }
  created_at: string
}

// Sample Migrations
export const MOCK_MIGRATIONS: Migration[] = [
  {
    id: 'mig_1',
    code: 'MIG-STAR-2026',
    name: 'Star Cement S/4HANA Brownfield Migration',
    description: 'Complete ECC to S/4HANA brownfield migration for Star Cement manufacturing operations.',
    kind: 'Brownfield',
    state: 'Active',
    current_phase: 'Realization',
    planned_cutover_date: '2026-07-30',
    planned_start_date: '2026-01-15',
    days_to_cutover: 84,
    scorecard: {
      bp_coverage_pct: 73,
      si_closed_pct: 68,
      abap_closed_pct: 45,
      regression_pass_rate: 94.2,
      open_critical_defects: 3,
      test_healing_rate: 87,
      cutover_readiness_score: 62,
      test_pack_coverage: 89,
      active_suites_today: 4,
      healed_cases_7d: 12,
      defect_resolution_time_days: 3.2,
    },
    phases: [
      { id: 'ph_1', phase: 'Initiation', state: 'Completed', planned_start: '2026-01-15', planned_end: '2026-02-01', actual_start: '2026-01-15', actual_end: '2026-02-01', gate_criteria: [] },
      { id: 'ph_2', phase: 'Design', state: 'Completed', planned_start: '2026-02-01', planned_end: '2026-03-01', actual_start: '2026-02-01', actual_end: '2026-03-05', gate_criteria: [] },
      { id: 'ph_3', phase: 'Realization', state: 'In_Progress', planned_start: '2026-03-05', planned_end: '2026-05-15', actual_start: '2026-03-05', gate_criteria: [
        { id: 'gc_1', kpi_code: 'BP_COVERAGE', label: 'BP Coverage', comparator: '>=', threshold: 80, current_value: 73, unit: '%', passed: false },
        { id: 'gc_2', kpi_code: 'SI_CLOSED', label: 'SI Items Closed', comparator: '>=', threshold: 60, current_value: 68, unit: '%', passed: true },
        { id: 'gc_3', kpi_code: 'ABAP_CLOSED', label: 'ABAP Findings Closed', comparator: '>=', threshold: 40, current_value: 45, unit: '%', passed: true },
        { id: 'gc_4', kpi_code: 'REG_PASS', label: 'Regression Pass Rate', comparator: '>=', threshold: 90, current_value: 94.2, unit: '%', passed: true },
      ] },
      { id: 'ph_4', phase: 'Test_Prep', state: 'Pending', planned_start: '2026-05-15', planned_end: '2026-06-15', gate_criteria: [] },
      { id: 'ph_5', phase: 'Cutover', state: 'Pending', planned_start: '2026-07-25', planned_end: '2026-07-30', gate_criteria: [] },
      { id: 'ph_6', phase: 'Hypercare', state: 'Pending', planned_start: '2026-07-30', planned_end: '2026-08-30', gate_criteria: [] },
      { id: 'ph_7', phase: 'Closed', state: 'Pending', planned_start: '2026-08-30', planned_end: '2026-09-15', gate_criteria: [] },
    ],
    team: {
      migration_manager: { id: 'u_1', name: 'Pradeep Sharma', role: 'Migration Manager', did: 'did:voltus:0x4f8a...' },
      cio: { id: 'u_6', name: 'Sandeep Mehta', role: 'CIO', did: 'did:voltus:0x7c2d...' },
      solution_architect: { id: 'u_7', name: 'Rajesh Kumar', role: 'Solution Architect', did: 'did:voltus:0x9a3f...' },
      sponsoring_si: 'Deloitte',
    },
    scope: {
      modules: ['SD', 'MM', 'FI', 'CO', 'PP', 'WM'],
      business_processes: ['OTC', 'PTP', 'RTR', 'P2P'],
      org_units: [
        { code: '1000', name: 'Star Cement Ltd', type: 'Company Code' },
        { code: '1010', name: 'Meghalaya Plant', type: 'Plant' },
        { code: '1020', name: 'Assam Plant', type: 'Plant' },
        { code: 'IN01', name: 'India Sales Org', type: 'Sales Org' },
      ],
      zobject_count: 156,
    },
    created_at: '2026-01-10T10:00:00+05:30',
  },
  {
    id: 'mig_2',
    code: 'MIG-VERTEX-2026',
    name: 'Vertex Industries S/4HANA Greenfield Rollout',
    description: 'Greenfield S/4HANA implementation for Vertex Industries new manufacturing facility.',
    kind: 'Greenfield',
    state: 'Active',
    current_phase: 'Test_Prep',
    planned_cutover_date: '2026-06-08',
    planned_start_date: '2025-11-01',
    days_to_cutover: 32,
    scorecard: {
      bp_coverage_pct: 91,
      si_closed_pct: 95,
      abap_closed_pct: 88,
      regression_pass_rate: 97.5,
      open_critical_defects: 1,
      test_healing_rate: 92,
      cutover_readiness_score: 85,
      test_pack_coverage: 96,
      active_suites_today: 6,
      healed_cases_7d: 8,
      defect_resolution_time_days: 2.1,
    },
    phases: [
      { id: 'ph_v1', phase: 'Initiation', state: 'Completed', planned_start: '2025-11-01', planned_end: '2025-11-15', actual_start: '2025-11-01', actual_end: '2025-11-15', gate_criteria: [] },
      { id: 'ph_v2', phase: 'Design', state: 'Completed', planned_start: '2025-11-15', planned_end: '2026-01-15', actual_start: '2025-11-15', actual_end: '2026-01-20', gate_criteria: [] },
      { id: 'ph_v3', phase: 'Realization', state: 'Completed', planned_start: '2026-01-20', planned_end: '2026-04-01', actual_start: '2026-01-20', actual_end: '2026-04-05', gate_criteria: [] },
      { id: 'ph_v4', phase: 'Test_Prep', state: 'In_Progress', planned_start: '2026-04-05', planned_end: '2026-05-20', actual_start: '2026-04-05', gate_criteria: [] },
      { id: 'ph_v5', phase: 'Cutover', state: 'Pending', planned_start: '2026-06-01', planned_end: '2026-06-08', gate_criteria: [] },
      { id: 'ph_v6', phase: 'Hypercare', state: 'Pending', planned_start: '2026-06-08', planned_end: '2026-07-08', gate_criteria: [] },
      { id: 'ph_v7', phase: 'Closed', state: 'Pending', planned_start: '2026-07-08', planned_end: '2026-07-15', gate_criteria: [] },
    ],
    team: {
      migration_manager: { id: 'u_10', name: 'Amit Patel', role: 'Migration Manager' },
      cio: { id: 'u_11', name: 'Vikram Singh', role: 'CIO' },
      solution_architect: { id: 'u_12', name: 'Neha Gupta', role: 'Solution Architect' },
      sponsoring_si: 'Accenture',
    },
    scope: {
      modules: ['SD', 'MM', 'FI', 'CO', 'PP'],
      business_processes: ['OTC', 'PTP', 'RTR'],
      org_units: [
        { code: '2000', name: 'Vertex Industries Ltd', type: 'Company Code' },
        { code: '2010', name: 'Gujarat Plant', type: 'Plant' },
      ],
      zobject_count: 42,
    },
    created_at: '2025-10-15T10:00:00+05:30',
  },
  {
    id: 'mig_3',
    code: 'MIG-NWIND-2026',
    name: 'Northwind Manufacturing ECC Upgrade',
    description: 'ECC 6.0 to ECC 6.08 enhancement pack upgrade with functional improvements.',
    kind: 'Upgrade',
    state: 'Active',
    current_phase: 'Cutover',
    planned_cutover_date: '2026-05-10',
    planned_start_date: '2025-12-01',
    days_to_cutover: 3,
    scorecard: {
      bp_coverage_pct: 98,
      si_closed_pct: 100,
      abap_closed_pct: 97,
      regression_pass_rate: 99.1,
      open_critical_defects: 0,
      test_healing_rate: 95,
      cutover_readiness_score: 98,
      test_pack_coverage: 100,
      active_suites_today: 2,
      healed_cases_7d: 3,
      defect_resolution_time_days: 1.5,
    },
    phases: [
      { id: 'ph_n1', phase: 'Initiation', state: 'Completed', planned_start: '2025-12-01', planned_end: '2025-12-15', actual_start: '2025-12-01', actual_end: '2025-12-15', gate_criteria: [] },
      { id: 'ph_n2', phase: 'Design', state: 'Completed', planned_start: '2025-12-15', planned_end: '2026-01-15', actual_start: '2025-12-15', actual_end: '2026-01-15', gate_criteria: [] },
      { id: 'ph_n3', phase: 'Realization', state: 'Completed', planned_start: '2026-01-15', planned_end: '2026-03-15', actual_start: '2026-01-15', actual_end: '2026-03-15', gate_criteria: [] },
      { id: 'ph_n4', phase: 'Test_Prep', state: 'Completed', planned_start: '2026-03-15', planned_end: '2026-04-30', actual_start: '2026-03-15', actual_end: '2026-04-30', gate_criteria: [] },
      { id: 'ph_n5', phase: 'Cutover', state: 'In_Progress', planned_start: '2026-05-07', planned_end: '2026-05-10', actual_start: '2026-05-07', gate_criteria: [] },
      { id: 'ph_n6', phase: 'Hypercare', state: 'Pending', planned_start: '2026-05-10', planned_end: '2026-06-10', gate_criteria: [] },
      { id: 'ph_n7', phase: 'Closed', state: 'Pending', planned_start: '2026-06-10', planned_end: '2026-06-15', gate_criteria: [] },
    ],
    team: {
      migration_manager: { id: 'u_20', name: 'Sarah Chen', role: 'Migration Manager' },
      cio: { id: 'u_21', name: 'Michael Johnson', role: 'CIO' },
      solution_architect: { id: 'u_22', name: 'David Williams', role: 'Solution Architect' },
      sponsoring_si: 'TCS',
    },
    scope: {
      modules: ['SD', 'MM', 'FI'],
      business_processes: ['OTC', 'PTP'],
      org_units: [
        { code: '3000', name: 'Northwind Manufacturing Inc', type: 'Company Code' },
      ],
      zobject_count: 89,
    },
    created_at: '2025-11-15T10:00:00+05:30',
  },
]

// SI Items
export type SIItemState = 'Identified' | 'Assessed' | 'Decided_Remediate' | 'Decided_Accept' | 'Decided_Defer' | 'Remediation_Planned' | 'In_Remediation' | 'Validated' | 'Closed'
export type SISeverity = 'Critical' | 'High' | 'Medium' | 'Low'

export interface SimplificationItem {
  id: string
  si_code: string
  title: string
  description: string
  severity: SISeverity
  state: SIItemState
  effort_estimate_days: number
  decision_rationale?: string
  decision_made_by?: string
  decision_made_at?: string
  assignee?: MigrationTeamMember
  affected_zobjects: string[]
  linked_defects: number
  validation_scenario_id?: string
  last_updated: string
}

export const MOCK_SI_ITEMS: SimplificationItem[] = [
  { id: 'si_1', si_code: 'SAP_NOTE_2622437', title: 'Material Number Length Extension', description: 'S/4HANA requires material number length evaluation for 40-character support.', severity: 'High', state: 'In_Remediation', effort_estimate_days: 15, decision_rationale: 'Must remediate - core master data impact', decision_made_by: 'P.Sharma', decision_made_at: '2026-03-15T10:00:00+05:30', assignee: { id: 'u_3', name: 'M.Reddy', role: 'Test Engineer' }, affected_zobjects: ['Z_MATERIAL_CHECK', 'Z_MM_VALIDATE'], linked_defects: 2, last_updated: '2026-05-06T14:00:00+05:30' },
  { id: 'si_2', si_code: 'SAP_NOTE_2933229', title: 'Business Partner Mandatory Migration', description: 'Customer and vendor master data must be migrated to Business Partner model.', severity: 'Critical', state: 'Decided_Remediate', effort_estimate_days: 21, decision_rationale: 'Critical path - affects all OTC and PTP processes', decision_made_by: 'P.Sharma', decision_made_at: '2026-03-10T11:00:00+05:30', assignee: { id: 'u_4', name: 'S.Kumar', role: 'Senior Test Engineer' }, affected_zobjects: ['Z_CUSTOMER_EXIT', 'Z_VENDOR_CHECK', 'Z_BP_SYNC'], linked_defects: 5, last_updated: '2026-05-05T10:00:00+05:30' },
  { id: 'si_3', si_code: 'SAP_NOTE_2268093', title: 'Credit Management Simplification', description: 'New SAP Credit Management replaces classic credit management.', severity: 'High', state: 'Assessed', effort_estimate_days: 12, affected_zobjects: ['Z_CREDIT_BLOCK', 'Z_SD_CREDIT'], linked_defects: 0, last_updated: '2026-05-04T09:00:00+05:30' },
  { id: 'si_4', si_code: 'SAP_NOTE_2249880', title: 'New Asset Accounting', description: 'Migration to new asset accounting model required.', severity: 'Medium', state: 'Decided_Accept', effort_estimate_days: 8, decision_rationale: 'Already using new asset accounting - no action needed', decision_made_by: 'R.Kumar', decision_made_at: '2026-03-20T14:00:00+05:30', affected_zobjects: [], linked_defects: 0, last_updated: '2026-03-20T14:00:00+05:30' },
  { id: 'si_5', si_code: 'SAP_NOTE_2220841', title: 'Extended Warehouse Management', description: 'WM to EWM migration consideration.', severity: 'High', state: 'Decided_Defer', effort_estimate_days: 30, decision_rationale: 'Deferred to Phase 2 post go-live', decision_made_by: 'P.Sharma', decision_made_at: '2026-03-25T10:00:00+05:30', affected_zobjects: ['Z_WM_TRANSFER', 'Z_WM_PUTAWAY'], linked_defects: 0, last_updated: '2026-03-25T10:00:00+05:30' },
  { id: 'si_6', si_code: 'SAP_NOTE_2363246', title: 'MRP Live Activation', description: 'New MRP Live functionality available in S/4HANA.', severity: 'Medium', state: 'Remediation_Planned', effort_estimate_days: 10, decision_rationale: 'Will activate MRP Live for improved planning', decision_made_by: 'R.Kumar', decision_made_at: '2026-04-01T09:00:00+05:30', assignee: { id: 'u_5', name: 'K.Iyer', role: 'Test Engineer' }, affected_zobjects: ['Z_PP_MRP_EXIT'], linked_defects: 1, last_updated: '2026-05-01T11:00:00+05:30' },
  { id: 'si_7', si_code: 'SAP_NOTE_2600030', title: 'Profit Center Accounting Changes', description: 'Document splitting mandatory with new G/L.', severity: 'Medium', state: 'Validated', effort_estimate_days: 5, decision_rationale: 'Configuration complete', decision_made_by: 'P.Sharma', decision_made_at: '2026-03-28T10:00:00+05:30', affected_zobjects: [], linked_defects: 0, validation_scenario_id: 'sc_rtr_1', last_updated: '2026-04-28T16:00:00+05:30' },
  { id: 'si_8', si_code: 'SAP_NOTE_2340562', title: 'Output Management Simplification', description: 'New output management framework replaces NAST.', severity: 'High', state: 'Identified', effort_estimate_days: 18, affected_zobjects: ['Z_SD_OUTPUT', 'Z_NAST_EXIT'], linked_defects: 0, last_updated: '2026-05-02T08:00:00+05:30' },
  { id: 'si_9', si_code: 'SAP_NOTE_2731331', title: 'Embedded Analytics Activation', description: 'CDS views for embedded analytics.', severity: 'Low', state: 'Closed', effort_estimate_days: 3, decision_rationale: 'Activated and tested', decision_made_by: 'M.Reddy', decision_made_at: '2026-04-10T10:00:00+05:30', affected_zobjects: [], linked_defects: 0, last_updated: '2026-04-20T10:00:00+05:30' },
  { id: 'si_10', si_code: 'SAP_NOTE_2521071', title: 'Fiori Apps Deployment', description: 'Required Fiori apps for S/4HANA transactions.', severity: 'Medium', state: 'In_Remediation', effort_estimate_days: 14, decision_rationale: 'Deploy standard Fiori apps', decision_made_by: 'R.Kumar', decision_made_at: '2026-04-05T11:00:00+05:30', assignee: { id: 'u_2', name: 'J.Rao', role: 'QA Lead' }, affected_zobjects: [], linked_defects: 1, last_updated: '2026-05-06T09:00:00+05:30' },
  { id: 'si_11', si_code: 'SAP_NOTE_2674935', title: 'Bank Account Management', description: 'New bank account management functionality.', severity: 'Low', state: 'Assessed', effort_estimate_days: 4, affected_zobjects: ['Z_FI_BANK'], linked_defects: 0, last_updated: '2026-05-03T14:00:00+05:30' },
  { id: 'si_12', si_code: 'SAP_NOTE_2186744', title: 'Central Finance Preparation', description: 'Central Finance readiness assessment.', severity: 'Low', state: 'Decided_Defer', effort_estimate_days: 25, decision_rationale: 'Not in scope for initial go-live', decision_made_by: 'P.Sharma', decision_made_at: '2026-03-12T10:00:00+05:30', affected_zobjects: [], linked_defects: 0, last_updated: '2026-03-12T10:00:00+05:30' },
]

// ABAP Findings
export type ABAPProvider = 'Joule' | 'SAP_ATC_Remote' | 'Voltus_ABAP_Analyzer' | 'SonarQube_ABAP'
export type ABAPFindingState = 'Open' | 'Triaged' | 'In_Remediation' | 'Remediated' | 'Verified' | 'Closed' | 'Accepted_FalsePositive'
export type ZObjectKind = 'PROG' | 'CLAS' | 'FUGR' | 'INTF' | 'MSAG' | 'TABL' | 'VIEW' | 'DTEL' | 'DOMA' | 'TTYP' | 'SHLP' | 'ENQU'

export interface ABAPFinding {
  id: string
  zobject: string
  kind: ZObjectKind
  provider: ABAPProvider
  severity: SISeverity
  priority: 'P1' | 'P2' | 'P3' | 'P4'
  rule_id: string
  rule_description: string
  state: ABAPFindingState
  assignee?: MigrationTeamMember
  linked_defects: number
  discovered_at: string
  code_excerpt?: string
  line_number?: number
  remediation_guidance?: string
}

export const MOCK_ABAP_FINDINGS: ABAPFinding[] = [
  { id: 'abap_1', zobject: 'Z_PRICING_CALC', kind: 'PROG', provider: 'Joule', severity: 'Critical', priority: 'P1', rule_id: 'JOULE_S4_INCOMPATIBLE_FIELD', rule_description: 'Field KONV-KBETR incompatible with S/4HANA simplified pricing', state: 'In_Remediation', assignee: { id: 'u_3', name: 'M.Reddy', role: 'Test Engineer' }, linked_defects: 1, discovered_at: '2026-04-01T10:00:00+05:30', line_number: 145, code_excerpt: 'SELECT SINGLE kbetr FROM konv INTO lv_price WHERE knumv = iv_knumv.', remediation_guidance: 'Replace direct KONV access with pricing API CL_PRC_RESULT_FACTORY' },
  { id: 'abap_2', zobject: 'Z_CUSTOMER_EXIT', kind: 'FUGR', provider: 'SAP_ATC_Remote', severity: 'High', priority: 'P1', rule_id: 'ATC_BP_MIGRATION', rule_description: 'Direct KNA1 access must migrate to Business Partner APIs', state: 'Triaged', linked_defects: 0, discovered_at: '2026-04-02T11:00:00+05:30', line_number: 78 },
  { id: 'abap_3', zobject: 'Z_SD_OUTPUT', kind: 'CLAS', provider: 'Voltus_ABAP_Analyzer', severity: 'Medium', priority: 'P2', rule_id: 'VOLTUS_NAST_DEPRECATED', rule_description: 'NAST-based output processing deprecated in S/4HANA', state: 'Open', linked_defects: 0, discovered_at: '2026-04-03T09:00:00+05:30' },
  { id: 'abap_4', zobject: 'Z_MATERIAL_CHECK', kind: 'PROG', provider: 'Joule', severity: 'High', priority: 'P1', rule_id: 'JOULE_MATNR_LENGTH', rule_description: 'Material number field length incompatibility', state: 'Remediated', assignee: { id: 'u_4', name: 'S.Kumar', role: 'Senior Test Engineer' }, linked_defects: 0, discovered_at: '2026-04-01T14:00:00+05:30' },
  { id: 'abap_5', zobject: 'Z_WM_TRANSFER', kind: 'FUGR', provider: 'SAP_ATC_Remote', severity: 'Critical', priority: 'P1', rule_id: 'ATC_WM_OBSOLETE', rule_description: 'Classic WM functions obsolete - migrate to EWM or Stock Room Management', state: 'Triaged', linked_defects: 2, discovered_at: '2026-04-05T10:00:00+05:30' },
  { id: 'abap_6', zobject: 'Z_FI_POSTING', kind: 'CLAS', provider: 'SonarQube_ABAP', severity: 'Low', priority: 'P3', rule_id: 'SONAR_PERFORMANCE', rule_description: 'Nested SELECT statements should use JOINs', state: 'Open', linked_defects: 0, discovered_at: '2026-04-06T08:00:00+05:30' },
  { id: 'abap_7', zobject: 'Z_CREDIT_BLOCK', kind: 'PROG', provider: 'Joule', severity: 'High', priority: 'P2', rule_id: 'JOULE_CREDIT_MGMT', rule_description: 'Classic credit management APIs deprecated', state: 'In_Remediation', assignee: { id: 'u_5', name: 'K.Iyer', role: 'Test Engineer' }, linked_defects: 1, discovered_at: '2026-04-07T11:00:00+05:30' },
  { id: 'abap_8', zobject: 'Z_PP_MRP_EXIT', kind: 'FUGR', provider: 'Voltus_ABAP_Analyzer', severity: 'Medium', priority: 'P2', rule_id: 'VOLTUS_MRP_LIVE', rule_description: 'MRP user exits may behave differently with MRP Live', state: 'Verified', linked_defects: 0, discovered_at: '2026-04-08T09:00:00+05:30' },
  { id: 'abap_9', zobject: 'Z_VENDOR_CHECK', kind: 'CLAS', provider: 'SAP_ATC_Remote', severity: 'High', priority: 'P1', rule_id: 'ATC_BP_MIGRATION', rule_description: 'Direct LFA1 access must migrate to Business Partner APIs', state: 'Open', linked_defects: 0, discovered_at: '2026-04-09T10:00:00+05:30' },
  { id: 'abap_10', zobject: 'Z_BP_SYNC', kind: 'PROG', provider: 'Joule', severity: 'Medium', priority: 'P2', rule_id: 'JOULE_BP_SYNC', rule_description: 'Custom BP synchronization logic needs review', state: 'Closed', linked_defects: 0, discovered_at: '2026-04-01T10:00:00+05:30' },
  { id: 'abap_11', zobject: 'Z_MM_VALIDATE', kind: 'FUGR', provider: 'Voltus_ABAP_Analyzer', severity: 'Low', priority: 'P4', rule_id: 'VOLTUS_CODE_QUALITY', rule_description: 'Dead code detected in validation routine', state: 'Accepted_FalsePositive', linked_defects: 0, discovered_at: '2026-04-10T08:00:00+05:30' },
  { id: 'abap_12', zobject: 'Z_SD_PRICING', kind: 'CLAS', provider: 'Joule', severity: 'Critical', priority: 'P1', rule_id: 'JOULE_S4_INCOMPATIBLE_FIELD', rule_description: 'KOMP structure usage incompatible', state: 'In_Remediation', assignee: { id: 'u_3', name: 'M.Reddy', role: 'Test Engineer' }, linked_defects: 2, discovered_at: '2026-04-11T09:00:00+05:30' },
  { id: 'abap_13', zobject: 'Z_NAST_EXIT', kind: 'PROG', provider: 'SAP_ATC_Remote', severity: 'High', priority: 'P2', rule_id: 'ATC_OUTPUT_OBSOLETE', rule_description: 'NAST-based output determination obsolete', state: 'Triaged', linked_defects: 0, discovered_at: '2026-04-12T10:00:00+05:30' },
  { id: 'abap_14', zobject: 'Z_WM_PUTAWAY', kind: 'FUGR', provider: 'Joule', severity: 'High', priority: 'P1', rule_id: 'JOULE_WM_API', rule_description: 'WM APIs will not function in S/4HANA', state: 'Open', linked_defects: 0, discovered_at: '2026-04-13T11:00:00+05:30' },
  { id: 'abap_15', zobject: 'Z_FI_BANK', kind: 'CLAS', provider: 'SonarQube_ABAP', severity: 'Low', priority: 'P3', rule_id: 'SONAR_NAMING', rule_description: 'Variable naming convention violation', state: 'Open', linked_defects: 0, discovered_at: '2026-04-14T08:00:00+05:30' },
  { id: 'abap_16', zobject: 'Z_CO_ALLOCATION', kind: 'PROG', provider: 'Voltus_ABAP_Analyzer', severity: 'Medium', priority: 'P2', rule_id: 'VOLTUS_CO_SIMPLIFY', rule_description: 'CO allocation APIs simplified in S/4HANA', state: 'Remediated', linked_defects: 0, discovered_at: '2026-04-15T09:00:00+05:30' },
  { id: 'abap_17', zobject: 'Z_DELIVERY_SPLIT', kind: 'FUGR', provider: 'Joule', severity: 'Medium', priority: 'P2', rule_id: 'JOULE_DELIVERY', rule_description: 'Delivery split logic may need adjustment', state: 'Verified', linked_defects: 0, discovered_at: '2026-04-16T10:00:00+05:30' },
  { id: 'abap_18', zobject: 'Z_CEMENT_GRADE', kind: 'CLAS', provider: 'SAP_ATC_Remote', severity: 'Low', priority: 'P4', rule_id: 'ATC_BEST_PRACTICE', rule_description: 'Exception handling improvement recommended', state: 'Open', linked_defects: 0, discovered_at: '2026-04-17T08:00:00+05:30' },
]

// BP Violations
export type BPViolationKind = 'missing_coverage' | 'deviating_implementation' | 'custom_replacement'
export type BPViolationState = 'Open' | 'Under_Review' | 'Remediation_Planned' | 'In_Remediation' | 'Accepted_Deviation' | 'Closed'

export interface BPViolation {
  id: string
  bp_scope_item: { id: string; code: string; name: string }
  violation_kind: BPViolationKind
  severity: SISeverity
  state: BPViolationState
  description: string
  acceptance_rationale?: string
  accepted_by_did?: string
  accepted_at?: string
  assignee?: MigrationTeamMember
  linked_scenarios: string[]
  last_updated: string
}

export const MOCK_BP_VIOLATIONS: BPViolation[] = [
  { id: 'bpv_1', bp_scope_item: { id: 'bps_1', code: 'BD3', name: 'Sales Order Processing' }, violation_kind: 'custom_replacement', severity: 'Medium', state: 'Accepted_Deviation', description: 'Star Cement uses custom credit-hold workflow ZSDCREDIT instead of standard SAP credit management', acceptance_rationale: 'Accepted as deliberate deviation due to industry-specific approval matrix required for cement sales.', accepted_by_did: 'did:voltus:0x9a3f...', accepted_at: '2026-04-10T10:00:00+05:30', linked_scenarios: ['sc_otc_1', 'sc_otc_2'], last_updated: '2026-04-10T10:00:00+05:30' },
  { id: 'bpv_2', bp_scope_item: { id: 'bps_2', code: '1FR', name: 'Accounts Receivable' }, violation_kind: 'missing_coverage', severity: 'High', state: 'In_Remediation', description: 'No test coverage for dunning process scenarios', assignee: { id: 'u_2', name: 'J.Rao', role: 'QA Lead' }, linked_scenarios: [], last_updated: '2026-05-05T14:00:00+05:30' },
  { id: 'bpv_3', bp_scope_item: { id: 'bps_3', code: '2OM', name: 'Purchasing' }, violation_kind: 'missing_coverage', severity: 'Medium', state: 'Open', description: 'Service procurement scenarios not fully covered', linked_scenarios: ['sc_ptp_1'], last_updated: '2026-05-04T09:00:00+05:30' },
  { id: 'bpv_4', bp_scope_item: { id: 'bps_4', code: 'J58', name: 'Inventory Management' }, violation_kind: 'deviating_implementation', severity: 'Low', state: 'Under_Review', description: 'Batch management uses custom determination logic instead of standard classification', linked_scenarios: ['sc_mm_1'], last_updated: '2026-05-03T11:00:00+05:30' },
  { id: 'bpv_5', bp_scope_item: { id: 'bps_5', code: 'BNX', name: 'Financial Closing' }, violation_kind: 'missing_coverage', severity: 'High', state: 'Remediation_Planned', description: 'Year-end closing process lacks comprehensive test coverage', assignee: { id: 'u_5', name: 'K.Iyer', role: 'Test Engineer' }, linked_scenarios: ['sc_rtr_1'], last_updated: '2026-05-02T10:00:00+05:30' },
  { id: 'bpv_6', bp_scope_item: { id: 'bps_6', code: '1FS', name: 'General Ledger' }, violation_kind: 'deviating_implementation', severity: 'Medium', state: 'In_Remediation', description: 'Custom document splitting rules deviate from SAP best practice', assignee: { id: 'u_4', name: 'S.Kumar', role: 'Senior Test Engineer' }, linked_scenarios: ['sc_rtr_2'], last_updated: '2026-05-01T14:00:00+05:30' },
  { id: 'bpv_7', bp_scope_item: { id: 'bps_7', code: '4D1', name: 'Production Planning' }, violation_kind: 'custom_replacement', severity: 'Medium', state: 'Accepted_Deviation', description: 'Custom MRP enhancement ZMRP_CEMENT replaces standard cement industry planning', acceptance_rationale: 'Industry-specific cement production planning requirements justify custom solution.', accepted_by_did: 'did:voltus:0x9a3f...', accepted_at: '2026-04-15T11:00:00+05:30', linked_scenarios: ['sc_pp_1'], last_updated: '2026-04-15T11:00:00+05:30' },
  { id: 'bpv_8', bp_scope_item: { id: 'bps_8', code: 'BMD', name: 'Quality Management' }, violation_kind: 'deviating_implementation', severity: 'Low', state: 'Closed', description: 'Quality inspection lot creation uses custom triggers - resolved with standard configuration', linked_scenarios: ['sc_qm_1'], last_updated: '2026-04-20T10:00:00+05:30' },
]

// Cutover Plan Steps
export type CutoverStepStatus = 'Pending' | 'In_Progress' | 'Complete' | 'Failed' | 'Skipped' | 'Blocked'

export interface CutoverStep {
  id: string
  step_number: string
  title: string
  description: string
  owner_role: string
  planned_duration_mins: number
  actual_duration_mins?: number
  dependencies: string[]
  status: CutoverStepStatus
  evidence_required: boolean
  completion_criteria: string
  sub_tasks?: { id: string; title: string; status: CutoverStepStatus }[]
  started_at?: string
  completed_at?: string
}

export const MOCK_CUTOVER_STEPS: CutoverStep[] = [
  { id: 'cs_1', step_number: 'T-24', title: 'Final Pre-Cutover Validation Suite', description: 'Execute final validation suite before cutover window begins', owner_role: 'Test Lead', planned_duration_mins: 240, dependencies: [], status: 'Complete', evidence_required: true, completion_criteria: 'All critical scenarios passed, report generated', completed_at: '2026-05-06T08:00:00+05:30' },
  { id: 'cs_2', step_number: 'T-12', title: 'Backup Production ECC System', description: 'Create full system backup of production ECC', owner_role: 'Basis Admin', planned_duration_mins: 180, dependencies: ['cs_1'], status: 'Complete', evidence_required: true, completion_criteria: 'Backup completed and verified', completed_at: '2026-05-06T20:00:00+05:30' },
  { id: 'cs_3', step_number: 'T0', title: 'Lock Down ECC for Changes', description: 'Stop all transactional activities and lock system for changes', owner_role: 'Basis Admin', planned_duration_mins: 30, dependencies: ['cs_2'], status: 'In_Progress', evidence_required: true, completion_criteria: 'All users logged out, system locked', started_at: '2026-05-07T06:00:00+05:30' },
  { id: 'cs_4', step_number: 'T0+30m', title: 'Final Delta Data Extract', description: 'Extract final delta of transactional data from ECC', owner_role: 'Data Migration Lead', planned_duration_mins: 120, dependencies: ['cs_3'], status: 'Pending', evidence_required: true, completion_criteria: 'Delta files generated and validated' },
  { id: 'cs_5', step_number: 'T0+2.5h', title: 'Begin Cutover Scripts Run', description: 'Execute automated cutover migration scripts', owner_role: 'Technical Lead', planned_duration_mins: 60, dependencies: ['cs_4'], status: 'Pending', evidence_required: true, completion_criteria: 'Scripts completed without errors' },
  { id: 'cs_6', step_number: 'T0+3.5h', title: 'Migrate Master Data Subsets', description: 'Load remaining master data changes to S/4HANA', owner_role: 'Data Migration Lead', planned_duration_mins: 90, dependencies: ['cs_5'], status: 'Pending', evidence_required: true, completion_criteria: 'Master data counts reconciled' },
  { id: 'cs_7', step_number: 'T0+5h', title: 'Migrate Transactional Cutoff Data', description: 'Load open transactions and balances', owner_role: 'Data Migration Lead', planned_duration_mins: 120, dependencies: ['cs_6'], status: 'Pending', evidence_required: true, completion_criteria: 'Open items and balances reconciled' },
  { id: 'cs_8', step_number: 'T0+7h', title: 'Validate Target System', description: 'Run automated validation checks on target S/4HANA', owner_role: 'Test Lead', planned_duration_mins: 60, dependencies: ['cs_7'], status: 'Pending', evidence_required: true, completion_criteria: 'All validation checks passed' },
  { id: 'cs_9', step_number: 'T0+8h', title: 'Run Cutover Validation Suite', description: 'Execute critical cutover validation test suite', owner_role: 'Test Lead', planned_duration_mins: 180, dependencies: ['cs_8'], status: 'Pending', evidence_required: true, completion_criteria: '100% pass rate on critical scenarios' },
  { id: 'cs_10', step_number: 'T0+11h', title: 'SD Module Functional Sign-Off', description: 'Business sign-off for Sales & Distribution', owner_role: 'SD Process Owner', planned_duration_mins: 30, dependencies: ['cs_9'], status: 'Pending', evidence_required: true, completion_criteria: 'Sign-off recorded in system' },
  { id: 'cs_11', step_number: 'T0+11h', title: 'MM Module Functional Sign-Off', description: 'Business sign-off for Materials Management', owner_role: 'MM Process Owner', planned_duration_mins: 30, dependencies: ['cs_9'], status: 'Pending', evidence_required: true, completion_criteria: 'Sign-off recorded in system' },
  { id: 'cs_12', step_number: 'T0+11h', title: 'FI Module Functional Sign-Off', description: 'Business sign-off for Finance', owner_role: 'FI Process Owner', planned_duration_mins: 30, dependencies: ['cs_9'], status: 'Pending', evidence_required: true, completion_criteria: 'Sign-off recorded in system' },
  { id: 'cs_13', step_number: 'T0+12h', title: 'Technical Go-Live Approval', description: 'Technical team confirms system ready for production', owner_role: 'Technical Lead', planned_duration_mins: 15, dependencies: ['cs_10', 'cs_11', 'cs_12'], status: 'Pending', evidence_required: true, completion_criteria: 'Technical approval recorded' },
  { id: 'cs_14', step_number: 'T0+12.5h', title: 'Business Go-Live Approval', description: 'CIO and business owners approve go-live', owner_role: 'CIO', planned_duration_mins: 15, dependencies: ['cs_13'], status: 'Pending', evidence_required: true, completion_criteria: 'Business approval with signatures' },
  { id: 'cs_15', step_number: 'T0+13h', title: 'Open System for Users', description: 'Unlock S/4HANA system for end users', owner_role: 'Basis Admin', planned_duration_mins: 15, dependencies: ['cs_14'], status: 'Pending', evidence_required: true, completion_criteria: 'Users can log in successfully' },
  { id: 'cs_16', step_number: 'T0+13.5h', title: 'Execute Interface Jobs', description: 'Trigger outbound interfaces and batch jobs', owner_role: 'Integration Lead', planned_duration_mins: 60, dependencies: ['cs_15'], status: 'Pending', evidence_required: true, completion_criteria: 'Interface jobs completed successfully' },
  { id: 'cs_17', step_number: 'T0+14.5h', title: 'Monitor Initial Transactions', description: 'Monitor first real transactions in production', owner_role: 'Support Team', planned_duration_mins: 120, dependencies: ['cs_16'], status: 'Pending', evidence_required: false, completion_criteria: 'No critical issues observed' },
  { id: 'cs_18', step_number: 'T0+16.5h', title: 'Begin Stabilization Mode', description: 'Transition to hypercare stabilization monitoring', owner_role: 'Migration Manager', planned_duration_mins: 30, dependencies: ['cs_17'], status: 'Pending', evidence_required: true, completion_criteria: 'Hypercare team activated' },
  { id: 'cs_19', step_number: 'T0+17h', title: 'Generate Cutover Report', description: 'Generate comprehensive cutover completion report', owner_role: 'Migration Manager', planned_duration_mins: 60, dependencies: ['cs_18'], status: 'Pending', evidence_required: true, completion_criteria: 'Report generated and distributed' },
  { id: 'cs_20', step_number: 'T0+18h', title: 'Archive ECC System Access', description: 'Reconfigure ECC access for archive-only mode', owner_role: 'Basis Admin', planned_duration_mins: 30, dependencies: ['cs_18'], status: 'Pending', evidence_required: true, completion_criteria: 'ECC in read-only archive mode' },
  { id: 'cs_21', step_number: 'T0+18.5h', title: 'Communication to Stakeholders', description: 'Send go-live announcement to all stakeholders', owner_role: 'Project Manager', planned_duration_mins: 15, dependencies: ['cs_19'], status: 'Pending', evidence_required: false, completion_criteria: 'Communication sent' },
  { id: 'cs_22', step_number: 'T0+19h', title: 'Cutover Window Closure Sign-Off', description: 'Formal closure of cutover window', owner_role: 'Migration Manager', planned_duration_mins: 15, dependencies: ['cs_21'], status: 'Pending', evidence_required: true, completion_criteria: 'Cutover closure documented' },
]

// Hypercare Data
export interface HypercareMetrics {
  days_into_hypercare: number
  days_remaining: number
  sla_compliance_pct: number
  defects_opened: number
  defects_closed: number
  defects_breached_sla: number
  hypercare_suite_pass_rate: number
}

export const MOCK_HYPERCARE_METRICS: HypercareMetrics = {
  days_into_hypercare: 14,
  days_remaining: 16,
  sla_compliance_pct: 96,
  defects_opened: 7,
  defects_closed: 5,
  defects_breached_sla: 1,
  hypercare_suite_pass_rate: 98.5,
}

// Migration Activity Events
export type ActivityEventClass = 'Transport' | 'SI_Item' | 'ABAP_Finding' | 'BP_Violation' | 'Test_Execution' | 'Defect' | 'Decision_Log' | 'Approval' | 'Phase_Transition' | 'Cutover'
export type ActivitySeverity = 'info' | 'warn' | 'critical'

export interface MigrationActivityEvent {
  id: string
  timestamp: string
  event_class: ActivityEventClass
  severity: ActivitySeverity
  actor: { id: string; name: string; role: string }
  description: string
  linked_entities: { type: string; id: string; name: string }[]
  signed: boolean
}

export const MOCK_MIGRATION_ACTIVITIES: MigrationActivityEvent[] = [
  { id: 'act_1', timestamp: '2026-05-07T14:30:00+05:30', event_class: 'Test_Execution', severity: 'info', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager' }, description: 'Initiated Cutover Validation Suite execution', linked_entities: [{ type: 'Suite', id: 'suite_1', name: 'Cutover Validation Suite' }], signed: false },
  { id: 'act_2', timestamp: '2026-05-07T11:15:00+05:30', event_class: 'Cutover', severity: 'critical', actor: { id: 'u_7', name: 'R.Kumar', role: 'Solution Architect' }, description: 'Cutover step T0 - Lock Down ECC started', linked_entities: [{ type: 'CutoverStep', id: 'cs_3', name: 'Lock Down ECC' }], signed: true },
  { id: 'act_3', timestamp: '2026-05-07T09:00:00+05:30', event_class: 'Approval', severity: 'info', actor: { id: 'u_6', name: 'S.Mehta', role: 'CIO' }, description: 'Approved Pre-Cutover Gate transition', linked_entities: [{ type: 'Phase', id: 'ph_4', name: 'Test_Prep → Cutover' }], signed: true },
  { id: 'act_4', timestamp: '2026-05-06T16:45:00+05:30', event_class: 'Test_Execution', severity: 'info', actor: { id: 'u_2', name: 'J.Rao', role: 'QA Lead' }, description: 'Pre-Cutover Validation Suite completed with 100% pass rate', linked_entities: [{ type: 'Suite', id: 'suite_2', name: 'Pre-Cutover Suite' }], signed: false },
  { id: 'act_5', timestamp: '2026-05-06T14:20:00+05:30', event_class: 'Defect', severity: 'warn', actor: { id: 'u_3', name: 'M.Reddy', role: 'Test Engineer' }, description: 'Defect DEF-456 resolved - ATP calculation fix', linked_entities: [{ type: 'Defect', id: 'def_456', name: 'ATP Calculation Error' }], signed: false },
  { id: 'act_6', timestamp: '2026-05-06T10:30:00+05:30', event_class: 'SI_Item', severity: 'info', actor: { id: 'u_4', name: 'S.Kumar', role: 'Senior Test Engineer' }, description: 'SI Item SAP_NOTE_2622437 moved to In_Remediation', linked_entities: [{ type: 'SI_Item', id: 'si_1', name: 'Material Number Length' }], signed: false },
  { id: 'act_7', timestamp: '2026-05-05T17:00:00+05:30', event_class: 'ABAP_Finding', severity: 'info', actor: { id: 'u_3', name: 'M.Reddy', role: 'Test Engineer' }, description: 'ABAP finding Z_PRICING_CALC remediation started', linked_entities: [{ type: 'ABAP_Finding', id: 'abap_1', name: 'Z_PRICING_CALC' }], signed: false },
  { id: 'act_8', timestamp: '2026-05-05T14:30:00+05:30', event_class: 'BP_Violation', severity: 'warn', actor: { id: 'u_7', name: 'R.Kumar', role: 'Solution Architect' }, description: 'BP Violation BD3 accepted as deliberate deviation', linked_entities: [{ type: 'BP_Violation', id: 'bpv_1', name: 'Sales Order Processing' }], signed: true },
  { id: 'act_9', timestamp: '2026-05-05T11:00:00+05:30', event_class: 'Transport', severity: 'info', actor: { id: 'u_4', name: 'S.Kumar', role: 'Senior Test Engineer' }, description: 'Transport SK4K900123 imported to QAS', linked_entities: [{ type: 'Transport', id: 'tr_123', name: 'SK4K900123' }], signed: false },
  { id: 'act_10', timestamp: '2026-05-04T16:00:00+05:30', event_class: 'Decision_Log', severity: 'info', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager' }, description: 'Cutover dry run scheduled for May 10', linked_entities: [{ type: 'Decision', id: 'dec_45', name: 'Dry Run Schedule' }], signed: true },
]
