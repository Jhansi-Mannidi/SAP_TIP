// Defect & Issue Management Mock Data

export type DefectSeverity = 'Critical' | 'High' | 'Medium' | 'Low'
export type DefectPriority = 'P1' | 'P2' | 'P3' | 'P4'
export type DefectState = 'Open' | 'Triaged' | 'Assigned' | 'In Fix' | 'Retest Pending' | 'Retest In Progress' | 'Closed' | 'Rejected'
export type DefectSourceKind = 'test_failure' | 'healing_failure' | 'si_item' | 'abap_finding' | 'bp_violation' | 'manual'
export type ITSMSyncState = 'synced' | 'pending' | 'conflict' | 'not_linked'

export interface Defect {
  id: string
  code: string
  title: string
  description: string
  severity: DefectSeverity
  priority: DefectPriority
  state: DefectState
  source_kind: DefectSourceKind
  source_ref?: string
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  assigned_team?: string
  opened_by: {
    id: string
    name: string
    email: string
  }
  opened_at: string
  closed_at?: string
  time_to_close_hours?: number
  migration?: {
    id: string
    name: string
  }
  transport?: {
    id: string
    number: string
  }
  itsm_ref?: string
  itsm_sync_state: ITSMSyncState
  comments_count: number
  evidence_count: number
}

export const DEFECT_SOURCE_LABELS: Record<DefectSourceKind, string> = {
  test_failure: 'Test Failure',
  healing_failure: 'Healing Failure',
  si_item: 'SI Item',
  abap_finding: 'ABAP Finding',
  bp_violation: 'BP Violation',
  manual: 'Manual',
}

export const DEFECT_SOURCE_ICONS: Record<DefectSourceKind, string> = {
  test_failure: 'play',
  healing_failure: 'sparkles',
  si_item: 'alert-triangle',
  abap_finding: 'code',
  bp_violation: 'alert-circle',
  manual: 'pencil',
}

export const MOCK_DEFECTS: Defect[] = [
  {
    id: 'def_1',
    code: 'DEF-2026-00427',
    title: 'ME21N: ZTERM not validated when posting to vendor 1000234',
    description: `## Issue Summary
When creating a Purchase Order in ME21N for vendor 1000234, the payment terms field (ZTERM) is not validated against the vendor master.

## Reproduction Steps
1. Open transaction ME21N
2. Enter vendor 1000234
3. Enter payment terms "Z999" (invalid)
4. Save the PO

**Expected:** Validation error should appear
**Actual:** PO is saved without validation

## Evidence
See attached screenshot from test execution run_2026_05_07_001.`,
    severity: 'Critical',
    priority: 'P1',
    state: 'In Fix',
    source_kind: 'test_failure',
    source_ref: 'exec_001_case_005',
    assignee: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com' },
    assigned_team: 'MM Functional',
    opened_by: { id: 'agent_executor', name: 'Executor Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-05-05T14:30:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    transport: { id: 'tr_1', number: 'STAK900123' },
    itsm_ref: 'INC0012345',
    itsm_sync_state: 'synced',
    comments_count: 8,
    evidence_count: 3,
  },
  {
    id: 'def_2',
    code: 'DEF-2026-00428',
    title: 'VA01: ATP check fails silently for material 100-200',
    description: 'ATP availability check does not display results for material 100-200 in VA01. The popup fails to render.',
    severity: 'Critical',
    priority: 'P1',
    state: 'Assigned',
    source_kind: 'test_failure',
    source_ref: 'exec_002_case_012',
    assignee: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com' },
    assigned_team: 'SD Functional',
    opened_by: { id: 'agent_executor', name: 'Executor Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-05-06T09:15:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    itsm_ref: 'INC0012346',
    itsm_sync_state: 'synced',
    comments_count: 3,
    evidence_count: 2,
  },
  {
    id: 'def_3',
    code: 'DEF-2026-00429',
    title: 'FB01: Document posting hangs for company code 1000',
    description: 'When posting GL documents in FB01 for company code 1000, the transaction hangs after clicking Post button.',
    severity: 'High',
    priority: 'P2',
    state: 'Triaged',
    source_kind: 'test_failure',
    source_ref: 'exec_003_case_008',
    assignee: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com' },
    assigned_team: 'FI Functional',
    opened_by: { id: 'agent_executor', name: 'Executor Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-05-04T16:00:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    itsm_ref: 'INC0012347',
    itsm_sync_state: 'pending',
    comments_count: 5,
    evidence_count: 1,
  },
  {
    id: 'def_4',
    code: 'DEF-2026-00430',
    title: 'VF01: Tax calculation rounding error in billing document',
    description: 'Billing documents created via VF01 show 0.01 INR rounding discrepancy in tax calculation for large orders.',
    severity: 'High',
    priority: 'P2',
    state: 'Retest Pending',
    source_kind: 'healing_failure',
    source_ref: 'healing_event_045',
    assignee: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com' },
    assigned_team: 'SD Functional',
    opened_by: { id: 'agent_healing', name: 'Healing Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-05-03T11:30:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    transport: { id: 'tr_2', number: 'STAK900124' },
    itsm_ref: 'INC0012348',
    itsm_sync_state: 'synced',
    comments_count: 12,
    evidence_count: 4,
  },
  {
    id: 'def_5',
    code: 'DEF-2026-00431',
    title: 'Material number length incompatibility in custom report ZMM_STOCK',
    description: 'Custom report ZMM_STOCK fails due to 18-digit material number not fitting in display column.',
    severity: 'High',
    priority: 'P2',
    state: 'In Fix',
    source_kind: 'si_item',
    source_ref: 'si_SAP_NOTE_2622437',
    assignee: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com' },
    assigned_team: 'ABAP Development',
    opened_by: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com' },
    opened_at: '2026-05-01T10:00:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    transport: { id: 'tr_3', number: 'STAK900125' },
    itsm_ref: 'CHG0005678',
    itsm_sync_state: 'synced',
    comments_count: 6,
    evidence_count: 2,
  },
  {
    id: 'def_6',
    code: 'DEF-2026-00432',
    title: 'MIGO: Goods receipt blocked for storage location 0001',
    description: 'Goods receipt posting in MIGO fails with error "Storage location locked" for SLoc 0001.',
    severity: 'Medium',
    priority: 'P3',
    state: 'Open',
    source_kind: 'test_failure',
    source_ref: 'exec_004_case_003',
    opened_by: { id: 'agent_executor', name: 'Executor Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-05-07T08:00:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    itsm_sync_state: 'not_linked',
    comments_count: 1,
    evidence_count: 1,
  },
  {
    id: 'def_7',
    code: 'DEF-2026-00433',
    title: 'VL01N: Delivery creation missing batch determination',
    description: 'When creating deliveries in VL01N, batch determination does not run automatically.',
    severity: 'Medium',
    priority: 'P3',
    state: 'Assigned',
    source_kind: 'bp_violation',
    source_ref: 'bp_viol_012',
    assignee: { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com' },
    assigned_team: 'SD Functional',
    opened_by: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com' },
    opened_at: '2026-04-28T14:00:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    itsm_ref: 'INC0012350',
    itsm_sync_state: 'conflict',
    comments_count: 4,
    evidence_count: 2,
  },
  {
    id: 'def_8',
    code: 'DEF-2026-00434',
    title: 'Custom BAPI ZSD_ORDER_CREATE has obsolete parameter',
    description: 'BAPI ZSD_ORDER_CREATE uses obsolete VBAK-VBELN parameter incompatible with S/4HANA.',
    severity: 'High',
    priority: 'P2',
    state: 'In Fix',
    source_kind: 'abap_finding',
    source_ref: 'abap_find_078',
    assignee: { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com' },
    assigned_team: 'ABAP Development',
    opened_by: { id: 'agent_discovery', name: 'Discovery Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-04-25T09:30:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    transport: { id: 'tr_4', number: 'STAK900126' },
    itsm_ref: 'CHG0005679',
    itsm_sync_state: 'synced',
    comments_count: 9,
    evidence_count: 1,
  },
  {
    id: 'def_9',
    code: 'DEF-2026-00435',
    title: 'MM60: Analysis period selection UI broken',
    description: 'Period selection dropdown in MM60 does not populate correctly after S/4HANA upgrade.',
    severity: 'Low',
    priority: 'P4',
    state: 'Closed',
    source_kind: 'manual',
    assignee: { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com' },
    assigned_team: 'MM Functional',
    opened_by: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com' },
    opened_at: '2026-04-20T11:00:00+05:30',
    closed_at: '2026-04-28T16:00:00+05:30',
    time_to_close_hours: 197,
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    itsm_ref: 'INC0012351',
    itsm_sync_state: 'synced',
    comments_count: 7,
    evidence_count: 3,
  },
  {
    id: 'def_10',
    code: 'DEF-2026-00436',
    title: 'XD01: Customer creation fails for account group Z001',
    description: 'Business Partner creation in S/4HANA fails when using legacy account group Z001.',
    severity: 'Medium',
    priority: 'P3',
    state: 'Retest In Progress',
    source_kind: 'test_failure',
    source_ref: 'exec_005_case_001',
    assignee: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com' },
    assigned_team: 'SD Functional',
    opened_by: { id: 'agent_executor', name: 'Executor Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-04-22T15:30:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    transport: { id: 'tr_5', number: 'STAK900127' },
    itsm_ref: 'INC0012352',
    itsm_sync_state: 'synced',
    comments_count: 11,
    evidence_count: 5,
  },
  {
    id: 'def_11',
    code: 'DEF-2026-00437',
    title: 'Intercompany pricing condition PR00 not determined',
    description: 'Intercompany sales orders do not pick up PR00 pricing condition from condition table.',
    severity: 'High',
    priority: 'P2',
    state: 'Triaged',
    source_kind: 'test_failure',
    source_ref: 'exec_006_case_007',
    assignee: { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com' },
    assigned_team: 'SD Functional',
    opened_by: { id: 'agent_executor', name: 'Executor Agent', email: 'agent@voltus.ai' },
    opened_at: '2026-05-02T10:15:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    itsm_ref: 'INC0012353',
    itsm_sync_state: 'pending',
    comments_count: 4,
    evidence_count: 2,
  },
  {
    id: 'def_12',
    code: 'DEF-2026-00438',
    title: 'CO-PA: Profitability segment not derived for new materials',
    description: 'CO-PA profitability segments are not derived for materials created after migration.',
    severity: 'Medium',
    priority: 'P3',
    state: 'Open',
    source_kind: 'manual',
    opened_by: { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com' },
    opened_at: '2026-05-06T16:45:00+05:30',
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    itsm_sync_state: 'not_linked',
    comments_count: 2,
    evidence_count: 1,
  },
]

export const MOCK_DEFECT_KPIS = {
  open_total: 10,
  critical_open: 2,
  high_open: 4,
  in_fix: 3,
  mttr_hours: 72,
}

export interface DefectComment {
  id: string
  defect_id: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  created_at: string
  is_internal: boolean
}

export const MOCK_DEFECT_COMMENTS: DefectComment[] = [
  { id: 'c_1', defect_id: 'def_1', author: { id: 'u_3', name: 'M.Reddy' }, content: 'Investigating the validation exit. Looks like ZTERM_CHECK is not being called.', created_at: '2026-05-05T15:00:00+05:30', is_internal: false },
  { id: 'c_2', defect_id: 'def_1', author: { id: 'u_1', name: 'P.Sharma' }, content: 'Please prioritize - this is blocking cutover validation.', created_at: '2026-05-05T15:30:00+05:30', is_internal: false },
  { id: 'c_3', defect_id: 'def_1', author: { id: 'u_3', name: 'M.Reddy' }, content: 'Found root cause - user exit not activated in S/4. Fix in progress.', created_at: '2026-05-06T10:00:00+05:30', is_internal: false },
]

export interface DefectEvidence {
  id: string
  defect_id: string
  type: 'screenshot' | 'video' | 'log' | 'document'
  title: string
  file_name: string
  file_size_kb: number
  uploaded_by: string
  uploaded_at: string
  signature_verified: boolean
}

export const MOCK_DEFECT_EVIDENCE: DefectEvidence[] = [
  { id: 'ev_1', defect_id: 'def_1', type: 'screenshot', title: 'ME21N Error Screen', file_name: 'me21n_error_001.png', file_size_kb: 245, uploaded_by: 'Executor Agent', uploaded_at: '2026-05-05T14:30:00+05:30', signature_verified: true },
  { id: 'ev_2', defect_id: 'def_1', type: 'log', title: 'Transaction Log', file_name: 'st22_dump_log.txt', file_size_kb: 12, uploaded_by: 'Executor Agent', uploaded_at: '2026-05-05T14:30:00+05:30', signature_verified: true },
  { id: 'ev_3', defect_id: 'def_1', type: 'screenshot', title: 'Vendor Master Config', file_name: 'vendor_config.png', file_size_kb: 189, uploaded_by: 'M.Reddy', uploaded_at: '2026-05-06T09:00:00+05:30', signature_verified: false },
]

export interface RootCauseLink {
  id: string
  defect_id: string
  entity_type: 'si_item' | 'abap_finding' | 'bp_violation' | 'zobject' | 'transport'
  entity_id: string
  entity_title: string
  entity_state: string
  summary: string
  linked_by: string
  linked_at: string
  ai_suggested: boolean
  ai_confidence?: number
}

export const MOCK_ROOT_CAUSE_LINKS: RootCauseLink[] = [
  { id: 'rcl_1', defect_id: 'def_1', entity_type: 'si_item', entity_id: 'si_001', entity_title: 'SAP_NOTE_2622437 - Material Number Length', entity_state: 'In Progress', summary: 'Material number extended to 40 characters requires user exit updates', linked_by: 'AI Agent', linked_at: '2026-05-05T14:35:00+05:30', ai_suggested: true, ai_confidence: 78 },
  { id: 'rcl_2', defect_id: 'def_1', entity_type: 'transport', entity_id: 'tr_1', entity_title: 'STAK900123', entity_state: 'Released to DEV', summary: 'Transport containing ME21N user exit fix', linked_by: 'M.Reddy', linked_at: '2026-05-06T11:00:00+05:30', ai_suggested: false },
]

export interface ResolutionActivity {
  id: string
  defect_id: string
  timestamp: string
  actor: string
  actor_type: 'human' | 'agent'
  action: string
  details?: string
}

export const MOCK_RESOLUTION_ACTIVITIES: ResolutionActivity[] = [
  { id: 'ra_1', defect_id: 'def_1', timestamp: '2026-05-05T14:30:00+05:30', actor: 'Executor Agent', actor_type: 'agent', action: 'Defect auto-raised', details: 'Test case TC_ME21N_VALIDATION failed' },
  { id: 'ra_2', defect_id: 'def_1', timestamp: '2026-05-05T15:00:00+05:30', actor: 'P.Sharma', actor_type: 'human', action: 'Triaged', details: 'Set severity to Critical, priority P1' },
  { id: 'ra_3', defect_id: 'def_1', timestamp: '2026-05-05T15:15:00+05:30', actor: 'P.Sharma', actor_type: 'human', action: 'Assigned', details: 'Assigned to M.Reddy (MM Functional)' },
  { id: 'ra_4', defect_id: 'def_1', timestamp: '2026-05-06T10:30:00+05:30', actor: 'M.Reddy', actor_type: 'human', action: 'State changed to In Fix', details: 'Root cause identified, fix in progress' },
  { id: 'ra_5', defect_id: 'def_1', timestamp: '2026-05-06T14:00:00+05:30', actor: 'M.Reddy', actor_type: 'human', action: 'Commit pushed', details: 'ZME21N_USEREXIT.abap pushed to TR STAK900123' },
  { id: 'ra_6', defect_id: 'def_1', timestamp: '2026-05-07T09:00:00+05:30', actor: 'M.Reddy', actor_type: 'human', action: 'Transport released', details: 'TR STAK900123 released to QAS' },
]

export interface ITSMConnection {
  id: string
  type: 'servicenow' | 'jira' | 'sap_charm'
  name: string
  connected: boolean
  last_sync: string
  queue_depth: number
  sync_errors: number
  mapped_fields: number
  conformant_fields: number
}

export const MOCK_ITSM_CONNECTIONS: ITSMConnection[] = [
  { id: 'itsm_1', type: 'servicenow', name: 'Star Cement ServiceNow', connected: true, last_sync: '2026-05-07T14:25:00+05:30', queue_depth: 3, sync_errors: 1, mapped_fields: 18, conformant_fields: 17 },
  { id: 'itsm_2', type: 'jira', name: 'Jira Software Cloud', connected: true, last_sync: '2026-05-07T14:20:00+05:30', queue_depth: 0, sync_errors: 0, mapped_fields: 15, conformant_fields: 15 },
  { id: 'itsm_3', type: 'sap_charm', name: 'SAP Solution Manager ChaRM', connected: false, last_sync: '2026-05-01T08:00:00+05:30', queue_depth: 0, sync_errors: 0, mapped_fields: 12, conformant_fields: 10 },
]

export interface FailedSyncItem {
  id: string
  defect_code: string
  itsm_type: string
  reason: string
  retry_count: number
  last_attempt: string
}

export const MOCK_FAILED_SYNCS: FailedSyncItem[] = [
  { id: 'fs_1', defect_code: 'DEF-2026-00433', itsm_type: 'servicenow', reason: 'Field mapping conflict: Priority value "P3" not found in ServiceNow picklist', retry_count: 3, last_attempt: '2026-05-07T14:00:00+05:30' },
]
