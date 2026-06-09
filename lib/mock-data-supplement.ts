/**
 * Supplemental mock records — merged into domain mock-data exports for richer list/table views.
 */

import type {
  Transport,
  TransportObject,
  TransportState,
  ScreenDiff,
  ImpactVerdictEntry,
} from './transport-mock-data'
import type { Defect } from './defect-mock-data'
import type { ActiveRun, PastRun } from './execution-mock-data'

const OWNERS = [
  { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com', avatar_initials: 'PS', role: 'Migration Manager' },
  { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com', avatar_initials: 'JR', role: 'QA Lead' },
  { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com', avatar_initials: 'MR', role: 'ABAP Developer' },
  { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com', avatar_initials: 'SK', role: 'FI Consultant' },
  { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com', avatar_initials: 'KI', role: 'SD Consultant' },
  { id: 'u_6', name: 'A.Mehta', email: 'a.mehta@starcement.com', avatar_initials: 'AM', role: 'MM Consultant' },
  { id: 'u_7', name: 'R.Patel', email: 'r.patel@starcement.com', avatar_initials: 'RP', role: 'Basis Admin' },
] as const

const TRANSPORT_SPECS: {
  num: number
  description: string
  state: TransportState
  risk_score: number
  risk_band: Transport['risk_band']
  risk_factor: string
  ownerIdx: number
  linked_tests: number
}[] = [
  { num: 138, description: 'Credit management activation for new sales org', state: 'In_Test', risk_score: 0.76, risk_band: 'high', risk_factor: 'Credit limits affect OTC revenue path', ownerIdx: 0, linked_tests: 18 },
  { num: 139, description: 'Batch management for cement grades', state: 'Released_to_PROD', risk_score: 0.41, risk_band: 'medium', risk_factor: 'Batch split affects inventory valuation', ownerIdx: 5, linked_tests: 11 },
  { num: 140, description: 'Vendor master duplicate check BAdI', state: 'Analyzed', risk_score: 0.55, risk_band: 'high', risk_factor: 'Vendor master is shared across PTP flows', ownerIdx: 5, linked_tests: 9 },
  { num: 141, description: 'GL account determination for freight', state: 'Test_Plan_Approved', risk_score: 0.63, risk_band: 'high', risk_factor: 'Freight accruals touch FI and MM integration', ownerIdx: 3, linked_tests: 14 },
  { num: 142, description: 'Plant maintenance order type ZPM1', state: 'Classified', risk_score: 0.48, risk_band: 'medium', risk_factor: 'PM order types affect maintenance workflows', ownerIdx: 6, linked_tests: 6 },
  { num: 143, description: 'Output type for proforma invoice', state: 'Released_to_PROD', risk_score: 0.29, risk_band: 'low', risk_factor: 'Output determination is document-specific', ownerIdx: 4, linked_tests: 4 },
  { num: 144, description: 'Condition record ZPR0 for export pricing', state: 'Test_Plan_Ready', risk_score: 0.81, risk_band: 'critical', risk_factor: 'Export pricing is compliance-sensitive', ownerIdx: 4, linked_tests: 26 },
  { num: 145, description: 'Workflow for PO release strategy', state: 'In_Test', risk_score: 0.69, risk_band: 'high', risk_factor: 'Release strategy gates procurement approvals', ownerIdx: 5, linked_tests: 16 },
  { num: 146, description: 'Serial number profile for equipment', state: 'Captured', risk_score: 0.35, risk_band: 'medium', risk_factor: 'Serial numbers affect asset tracking', ownerIdx: 6, linked_tests: 5 },
  { num: 147, description: 'Bank determination for vendor payments', state: 'Released_to_PROD', risk_score: 0.33, risk_band: 'medium', risk_factor: 'Payment runs depend on bank master', ownerIdx: 3, linked_tests: 7 },
  { num: 148, description: 'Z-report for daily dispatch summary', state: 'Closed', risk_score: 0.15, risk_band: 'low', risk_factor: 'Report-only change with no transactional impact', ownerIdx: 2, linked_tests: 2 },
  { num: 149, description: 'ATP checking rule for bulk materials', state: 'Released_to_QAS', risk_score: 0.58, risk_band: 'high', risk_factor: 'ATP rules affect order confirmation timing', ownerIdx: 4, linked_tests: 13 },
  { num: 150, description: 'Integration IDoc for weighbridge', state: 'Analyzed', risk_score: 0.74, risk_band: 'high', risk_factor: 'Weighbridge IDoc is logistics-critical', ownerIdx: 6, linked_tests: 10 },
  { num: 151, description: 'Cost center assignment for freight orders', state: 'In_Test', risk_score: 0.52, risk_band: 'high', risk_factor: 'CO assignment affects margin reporting', ownerIdx: 3, linked_tests: 8 },
  { num: 152, description: 'Material type extension for packaging', state: 'Released_to_PROD', risk_score: 0.27, risk_band: 'low', risk_factor: 'Packaging material type is low blast radius', ownerIdx: 5, linked_tests: 3 },
  { num: 153, description: 'Tax jurisdiction code for interstate sales', state: 'Test_Plan_Ready', risk_score: 0.88, risk_band: 'critical', risk_factor: 'Tax jurisdiction drives statutory reporting', ownerIdx: 0, linked_tests: 31 },
  { num: 154, description: 'User exit for delivery split logic', state: 'Test_Plan_Approved', risk_score: 0.71, risk_band: 'high', risk_factor: 'Delivery split affects shipment planning', ownerIdx: 2, linked_tests: 12 },
  { num: 155, description: 'Number range for billing documents', state: 'Classified', risk_score: 0.44, risk_band: 'medium', risk_factor: 'Number range misconfiguration blocks billing', ownerIdx: 4, linked_tests: 6 },
  { num: 156, description: 'Partner function for bill-to party', state: 'Released_to_PROD', risk_score: 0.36, risk_band: 'medium', risk_factor: 'Partner determination affects invoice routing', ownerIdx: 4, linked_tests: 5 },
  { num: 157, description: 'WM storage type for raw materials', state: 'In_Test', risk_score: 0.64, risk_band: 'high', risk_factor: 'Storage type drives putaway strategy', ownerIdx: 5, linked_tests: 11 },
  { num: 158, description: 'FI document type for accruals', state: 'Captured', risk_score: 0.39, risk_band: 'medium', risk_factor: 'Accrual postings affect period close', ownerIdx: 3, linked_tests: 4 },
  { num: 159, description: 'Pricing access sequence for discounts', state: 'Analyzed', risk_score: 0.77, risk_band: 'high', risk_factor: 'Discount access affects net price calculation', ownerIdx: 4, linked_tests: 19 },
  { num: 160, description: 'RFC destination for legacy weighbridge', state: 'Released_to_QAS', risk_score: 0.46, risk_band: 'medium', risk_factor: 'RFC connectivity is integration-critical', ownerIdx: 6, linked_tests: 7 },
  { num: 161, description: 'BAPI wrapper for customer credit check', state: 'Test_Plan_Ready', risk_score: 0.83, risk_band: 'critical', risk_factor: 'Credit BAPI is on critical OTC path', ownerIdx: 0, linked_tests: 24 },
  { num: 162, description: 'Customizing for delivery block reasons', state: 'Closed', risk_score: 0.19, risk_band: 'low', risk_factor: 'Delivery block reasons are configuration-only', ownerIdx: 1, linked_tests: 3 },
]

function isoDate(daysAgo: number, hour = 10, minute = 0): string {
  const d = new Date('2026-05-07T00:00:00+05:30')
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString().replace('Z', '+05:30').replace('.000', '')
}

function pipelineDates(state: TransportState, baseDaysAgo: number) {
  const captured = isoDate(baseDaysAgo + 14, 8)
  const dates: Partial<Transport> = { captured_at: captured }
  const order: TransportState[] = [
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
  const idx = order.indexOf(state)
  if (idx >= 1) dates.classified_at = isoDate(baseDaysAgo + 13, 9)
  if (idx >= 2) dates.analyzed_at = isoDate(baseDaysAgo + 12, 10)
  if (idx >= 3) dates.test_plan_ready_at = isoDate(baseDaysAgo + 11, 11)
  if (idx >= 4) dates.test_plan_approved_at = isoDate(baseDaysAgo + 10, 14)
  if (idx >= 5) dates.in_test_at = isoDate(baseDaysAgo + 9, 10)
  if (idx >= 6) dates.released_to_qas_at = isoDate(baseDaysAgo + 5, 16)
  if (idx >= 7) dates.released_to_prod_at = isoDate(baseDaysAgo + 2, 18)
  if (idx >= 8) dates.closed_at = isoDate(baseDaysAgo, 9)
  return dates
}

function buildTransportObjects(spec: (typeof TRANSPORT_SPECS)[number], objId: string): TransportObject[] {
  if (spec.num === 153) {
    return [
      {
        id: `${objId}_1`,
        object_type: 'CUS0',
        object_name: 'ZOBJ153',
        classification_category: 'customizing',
        screen_models_touched: 1,
        abap_findings_count: 1,
      },
      {
        id: `${objId}_2`,
        object_type: 'TABL',
        object_name: 'ZTAX_JURIS',
        classification_category: 'ddic',
        screen_models_touched: 0,
        abap_findings_count: 0,
      },
      {
        id: `${objId}_3`,
        object_type: 'PROG',
        object_name: 'ZSD_TAX_JURIS',
        classification_category: 'z-program',
        screen_models_touched: 2,
        abap_findings_count: 3,
      },
      {
        id: `${objId}_4`,
        object_type: 'TRAN',
        object_name: 'ZSDTJ',
        classification_category: 'dialog-transaction',
        screen_models_touched: 1,
        abap_findings_count: 1,
      },
      {
        id: `${objId}_5`,
        object_type: 'DOMA',
        object_name: 'ZJURIS_CD',
        classification_category: 'ddic',
        screen_models_touched: 0,
        abap_findings_count: 0,
      },
      {
        id: `${objId}_6`,
        object_type: 'VIEW',
        object_name: 'V_TJURIS_SD',
        classification_category: 'customizing',
        screen_models_touched: 1,
        abap_findings_count: 0,
      },
      {
        id: `${objId}_7`,
        object_type: 'FUGR',
        object_name: 'ZSD_TAX',
        classification_category: 'functional',
        screen_models_touched: 0,
        abap_findings_count: 2,
      },
      {
        id: `${objId}_8`,
        object_type: 'CLAS',
        object_name: 'ZCL_TAX_JURIS',
        classification_category: 'z-program',
        screen_models_touched: 0,
        abap_findings_count: 2,
      },
    ]
  }

  if (spec.risk_band === 'critical' || spec.risk_score > 0.75) {
    return [
      {
        id: objId,
        object_type: 'CUS0',
        object_name: `ZOBJ${spec.num}`,
        classification_category: 'customizing',
        screen_models_touched: 1,
        abap_findings_count: 1,
      },
      {
        id: `${objId}_p`,
        object_type: 'PROG',
        object_name: `ZPROG${spec.num}`,
        classification_category: 'z-program',
        screen_models_touched: 1,
        abap_findings_count: 2,
      },
      {
        id: `${objId}_t`,
        object_type: 'TABL',
        object_name: `ZTBL${spec.num}`,
        classification_category: 'ddic',
        screen_models_touched: 0,
        abap_findings_count: 0,
      },
      {
        id: `${objId}_tr`,
        object_type: 'TRAN',
        object_name: `ZTR${spec.num}`,
        classification_category: 'dialog-transaction',
        screen_models_touched: 1,
        abap_findings_count: 0,
      },
    ]
  }

  return [
    {
      id: objId,
      object_type: 'CUS0',
      object_name: `ZOBJ${spec.num}`,
      classification_category: 'customizing',
      screen_models_touched: spec.risk_score > 0.7 ? 1 : 0,
      abap_findings_count: spec.risk_score > 0.75 ? 1 : 0,
    },
  ]
}

function buildScreenDiffs(spec: (typeof TRANSPORT_SPECS)[number]): ScreenDiff[] {
  if (spec.num !== 153) return []

  return [
    {
      id: 'sd_153_1',
      program: 'SAPMV45A',
      dynpro: '4100',
      severity: 'breaking',
      summary: 'Tax jurisdiction code (TXJCD) made required on interstate sales orders',
      fields_added: 1,
      fields_removed: 0,
      fields_modified: 1,
      before_model: [
        { id: 'f1', name: 'VBELN', label: 'Sales Document', type: 'input', x: 20, y: 20, width: 150, height: 24, required: true, visible: true },
        { id: 'f2', name: 'KUNNR', label: 'Sold-To Party', type: 'input', x: 20, y: 50, width: 120, height: 24, required: true, visible: true },
        { id: 'f3', name: 'TXJCD', label: 'Tax Jurisdiction', type: 'input', x: 20, y: 80, width: 100, height: 24, required: false, visible: true },
        { id: 'f4', name: 'AUART', label: 'Order Type', type: 'dropdown', x: 20, y: 110, width: 80, height: 24, required: true, visible: true },
        { id: 'f5', name: 'VKORG', label: 'Sales Org', type: 'dropdown', x: 20, y: 140, width: 80, height: 24, required: true, visible: true },
      ],
      after_model: [
        { id: 'f1', name: 'VBELN', label: 'Sales Document', type: 'input', x: 20, y: 20, width: 150, height: 24, required: true, visible: true },
        { id: 'f2', name: 'KUNNR', label: 'Sold-To Party', type: 'input', x: 20, y: 50, width: 120, height: 24, required: true, visible: true },
        { id: 'f3', name: 'TXJCD', label: 'Tax Jurisdiction', type: 'input', x: 20, y: 80, width: 100, height: 24, required: true, visible: true, changed: 'modified' },
        { id: 'f4', name: 'AUART', label: 'Order Type', type: 'dropdown', x: 20, y: 110, width: 80, height: 24, required: true, visible: true },
        { id: 'f5', name: 'VKORG', label: 'Sales Org', type: 'dropdown', x: 20, y: 140, width: 80, height: 24, required: true, visible: true },
        { id: 'f6', name: 'ZINTER', label: 'Interstate Flag', type: 'checkbox', x: 20, y: 170, width: 24, height: 24, required: false, visible: true, changed: 'added' },
      ],
    },
    {
      id: 'sd_153_2',
      program: 'SAPLZSDTJ',
      dynpro: '0100',
      severity: 'minor',
      summary: 'ZSDTJ jurisdiction maintenance — F4 help added for state code lookup',
      fields_added: 1,
      fields_removed: 0,
      fields_modified: 1,
      before_model: [
        { id: 'f1', name: 'JURIS_CD', label: 'Jurisdiction Code', type: 'input', x: 20, y: 20, width: 120, height: 24, required: true, visible: true },
        { id: 'f2', name: 'STATE_CD', label: 'State Code', type: 'input', x: 20, y: 50, width: 60, height: 24, required: true, visible: true },
        { id: 'f3', name: 'DESCR', label: 'Description', type: 'input', x: 20, y: 80, width: 200, height: 24, required: false, visible: true },
      ],
      after_model: [
        { id: 'f1', name: 'JURIS_CD', label: 'Jurisdiction Code', type: 'input', x: 20, y: 20, width: 120, height: 24, required: true, visible: true },
        { id: 'f2', name: 'STATE_CD', label: 'State Code', type: 'input', x: 20, y: 50, width: 60, height: 24, required: true, visible: true, changed: 'modified' },
        { id: 'f3', name: 'DESCR', label: 'Description', type: 'input', x: 20, y: 80, width: 200, height: 24, required: false, visible: true },
        { id: 'f4', name: 'REGION', label: 'GST Region', type: 'dropdown', x: 20, y: 110, width: 100, height: 24, required: true, visible: true, changed: 'added' },
      ],
    },
    {
      id: 'sd_153_3',
      program: 'SAPMV60A',
      dynpro: '0200',
      severity: 'cosmetic',
      summary: 'VF01 billing header — jurisdiction display field repositioned',
      fields_added: 0,
      fields_removed: 0,
      fields_modified: 1,
      before_model: [
        { id: 'f1', name: 'VBELN', label: 'Billing Doc', type: 'input', x: 20, y: 20, width: 150, height: 24, required: true, visible: true },
        { id: 'f2', name: 'FKDAT', label: 'Billing Date', type: 'input', x: 20, y: 50, width: 100, height: 24, required: true, visible: true },
        { id: 'f3', name: 'TXJCD', label: 'Tax Jurisdiction', type: 'label', x: 20, y: 200, width: 100, height: 24, required: false, visible: true },
      ],
      after_model: [
        { id: 'f1', name: 'VBELN', label: 'Billing Doc', type: 'input', x: 20, y: 20, width: 150, height: 24, required: true, visible: true },
        { id: 'f2', name: 'FKDAT', label: 'Billing Date', type: 'input', x: 20, y: 50, width: 100, height: 24, required: true, visible: true },
        { id: 'f3', name: 'TXJCD', label: 'Tax Jurisdiction', type: 'label', x: 20, y: 80, width: 100, height: 24, required: false, visible: true, changed: 'modified' },
      ],
    },
    {
      id: 'sd_153_4',
      program: 'SAPLFTXP',
      dynpro: '0100',
      severity: 'breaking',
      summary: 'Tax procedure assignment screen — new interstate condition type row',
      fields_added: 1,
      fields_removed: 0,
      fields_modified: 0,
      before_model: [
        { id: 'f1', name: 'KALSM', label: 'Procedure', type: 'input', x: 20, y: 20, width: 100, height: 24, required: true, visible: true },
        { id: 'f2', name: 'MWSKZ', label: 'Tax Code', type: 'input', x: 20, y: 50, width: 60, height: 24, required: true, visible: true },
      ],
      after_model: [
        { id: 'f1', name: 'KALSM', label: 'Procedure', type: 'input', x: 20, y: 20, width: 100, height: 24, required: true, visible: true },
        { id: 'f2', name: 'MWSKZ', label: 'Tax Code', type: 'input', x: 20, y: 50, width: 60, height: 24, required: true, visible: true },
        { id: 'f3', name: 'ZIGST', label: 'IGST Condition', type: 'input', x: 20, y: 80, width: 80, height: 24, required: true, visible: true, changed: 'added' },
      ],
    },
  ]
}

function buildImpactVerdicts(spec: (typeof TRANSPORT_SPECS)[number]): ImpactVerdictEntry[] {
  if (spec.num !== 153) return []

  return [
    { id: 'iv_153_1', test_case_id: 'tc_t1', test_case_code: 'TC_SD_101', test_case_name: 'VA01 Interstate Sales Order', test_scenario: 'OTC Interstate Sales', last_pass_rate: 88, verdict: 'regenerate', rationale: 'TXJCD now required — test IR must populate jurisdiction before save', approved: false },
    { id: 'iv_153_2', test_case_id: 'tc_t2', test_case_code: 'TC_SD_102', test_case_name: 'VA01 Intrastate Sales Order', test_scenario: 'OTC Standard Sales', last_pass_rate: 96, verdict: 'safe', rationale: 'Intrastate flow uses default jurisdiction — unaffected', approved: true },
    { id: 'iv_153_3', test_case_id: 'tc_t3', test_case_code: 'TC_SD_103', test_case_name: 'VF01 Billing Tax Jurisdiction', test_scenario: 'OTC Billing', last_pass_rate: 91, verdict: 'needs_healing', rationale: 'Billing header jurisdiction field moved — selector update required', approved: false },
    { id: 'iv_153_4', test_case_id: 'tc_t4', test_case_code: 'TC_SD_104', test_case_name: 'Export Sales Tax Exemption', test_scenario: 'OTC Export Suite', last_pass_rate: 94, verdict: 'safe', rationale: 'Export exemption path bypasses interstate jurisdiction check', approved: true },
    { id: 'iv_153_5', test_case_id: 'tc_t5', test_case_code: 'TC_FI_201', test_case_name: 'FI Tax Posting Verification', test_scenario: 'RTR Tax Posting', last_pass_rate: 97, verdict: 'safe', rationale: 'FI posting uses document-level tax — no screen dependency', approved: true },
    { id: 'iv_153_6', test_case_id: 'tc_t6', test_case_code: 'TC_SD_105', test_case_name: 'Credit Memo Tax Reversal', test_scenario: 'OTC Returns', last_pass_rate: 85, verdict: 'regenerate', rationale: 'Credit memo must reference original jurisdiction code', approved: false },
    { id: 'iv_153_7', test_case_id: 'tc_t7', test_case_code: 'TC_SD_106', test_case_name: 'Intercompany Billing Tax', test_scenario: 'OTC Intercompany', last_pass_rate: 78, verdict: 'broken', rationale: 'Intercompany billing fails — jurisdiction mapping missing for plant pair', approved: false },
    { id: 'iv_153_8', test_case_id: 'tc_t8', test_case_code: 'TC_SD_107', test_case_name: 'ZSDTJ Maintain Jurisdiction', test_scenario: 'SD Tax Config', last_pass_rate: 92, verdict: 'regenerate', rationale: 'New GST Region dropdown must be set in maintenance transaction', approved: false },
    { id: 'iv_153_9', test_case_id: 'tc_t9', test_case_code: 'TC_SD_108', test_case_name: 'VA02 Change Sales Order Tax', test_scenario: 'OTC Change Flow', last_pass_rate: 90, verdict: 'needs_healing', rationale: 'Change mode shows jurisdiction as read-only — assertion update needed', approved: false },
    { id: 'iv_153_10', test_case_id: 'tc_t10', test_case_code: 'TC_SD_109', test_case_name: 'Delivery with IGST Split', test_scenario: 'OTC Logistics', last_pass_rate: 86, verdict: 'regenerate', rationale: 'IGST condition type added to tax procedure — pricing step must be updated', approved: false },
    { id: 'iv_153_11', test_case_id: 'tc_t11', test_case_code: 'TC_SD_110', test_case_name: 'Standard Domestic Order', test_scenario: 'OTC Happy Path', last_pass_rate: 99, verdict: 'safe', rationale: 'Domestic orders within same state — no interstate logic triggered', approved: true },
    { id: 'iv_153_12', test_case_id: 'tc_t12', test_case_code: 'TC_FI_202', test_case_name: 'GST Return Reconciliation', test_scenario: 'RTR Compliance', last_pass_rate: 93, verdict: 'safe', rationale: 'Reconciliation reads posted documents — not affected by entry screen change', approved: true },
  ]
}

function buildRiskFactors(spec: (typeof TRANSPORT_SPECS)[number], rfId: string) {
  if (spec.num !== 153) {
    return [{ id: rfId, description: spec.risk_factor, weight: Math.round(spec.risk_score * 40) / 100 }]
  }
  return [
    { id: rfId, description: spec.risk_factor, weight: 0.35 },
    { id: `${rfId}_2`, description: 'VA01 interstate path is high-traffic (31 linked tests)', weight: 0.28 },
    { id: `${rfId}_3`, description: 'Tax procedure change affects pricing condition types', weight: 0.15 },
    { id: `${rfId}_4`, description: 'Z-program ZSD_TAX_JURIS modified with 3 ABAP findings', weight: 0.10 },
  ]
}

export const SUPPLEMENTAL_TRANSPORTS: Transport[] = TRANSPORT_SPECS.map((spec, i) => {
  const owner = OWNERS[spec.ownerIdx % OWNERS.length]
  const id = `tr_${16 + i}`
  const objId = `obj_s${spec.num}`
  const rfId = `rf_s${spec.num}`
  return {
    id,
    tr_number: `STAK900${spec.num}`,
    description: spec.description,
    source_system: 'SD1',
    source_system_type: 'DEV',
    owner,
    state: spec.state,
    risk_score: spec.risk_score,
    risk_band: spec.risk_band,
    classification_summary:
      spec.num === 153
        ? ['Customizing', 'Z-Program', 'Dialog Transaction', 'DDIC']
        : ['Customizing', 'Z-Program'].slice(0, spec.risk_band === 'critical' ? 2 : 1),
    linked_tests_count: spec.linked_tests,
    linked_migration_id: spec.linked_tests > 10 ? 'mig_1' : undefined,
    linked_migration_name: spec.linked_tests > 10 ? 'Star Cement S/4HANA Migration' : undefined,
    objects: buildTransportObjects(spec, objId),
    risk_factors: buildRiskFactors(spec, rfId),
    impact_verdicts: buildImpactVerdicts(spec),
    screen_diffs: buildScreenDiffs(spec),
    ...pipelineDates(spec.state, i % 10),
  }
})

const DEFECT_TITLES = [
  'VL01N: Delivery split creates duplicate line items',
  'MIGO: Goods receipt posts to wrong storage location',
  'F110: Payment run excludes vendor batch',
  'CO11N: Production confirmation quantity mismatch',
  'ME59N: RFQ response mapping incorrect',
  'VF01: Billing block not released after credit check',
  'KS01: Cost center hierarchy node missing',
  'PA30: Personnel action type not available',
  'SM37: Background job variant not found',
  'LT01: Transfer order creation timeout',
  'IW32: Maintenance order status stuck',
  'MB51: Material document list filter broken',
  'FK10: Vendor invoice parking fails validation',
  'CS01: BOM component quantity rounding error',
  'PA20: Infotype 0001 read fails for new hires',
  'ZSD001: Custom pricing routine returns zero',
  'ME21N: Account assignment category default wrong',
  'VA02: Sales order change log missing entries',
  'FB03: Document display shows wrong fiscal year',
  'MBST: Cancellation posts reversal twice',
]

export const SUPPLEMENTAL_DEFECTS: Defect[] = DEFECT_TITLES.map((title, i) => {
  const num = 439 + i
  const severities: Defect['severity'][] = ['Critical', 'High', 'Medium', 'Low']
  const states: Defect['state'][] = ['Open', 'Triaged', 'Assigned', 'In Fix', 'Retest Pending', 'Closed']
  const severity = severities[i % severities.length]
  const state = states[i % states.length]
  const assignee = OWNERS[i % OWNERS.length]
  return {
    id: `def_${13 + i}`,
    code: `DEF-2026-00${num}`,
    title,
    description: `${title}. Detected during regression execution on QAS client 200.`,
    severity,
    priority: severity === 'Critical' ? 'P1' : severity === 'High' ? 'P2' : 'P3',
    state,
    source_kind: i % 3 === 0 ? 'manual' : 'test_failure',
    source_ref: i % 3 !== 0 ? `exec_supp_${i}_case_001` : undefined,
    assignee: state !== 'Open' ? { id: assignee.id, name: assignee.name, email: assignee.email } : undefined,
    assigned_team: ['SD Functional', 'MM Functional', 'FI Functional', 'CO Functional'][i % 4],
    opened_by: { id: 'agent_executor', name: 'Executor Agent', email: 'agent@voltus.ai' },
    opened_at: isoDate(i % 12, 9 + (i % 8), 15),
    migration: { id: 'mig_1', name: 'Star Cement S/4HANA Migration' },
    transport: i % 4 === 0 ? { id: `tr_${16 + (i % 20)}`, number: `STAK900${138 + (i % 20)}` } : undefined,
    itsm_ref: i % 5 !== 0 ? `INC0012${350 + i}` : undefined,
    itsm_sync_state: i % 5 === 0 ? 'conflict' : i % 3 === 0 ? 'pending' : 'synced',
    comments_count: (i % 6) + 1,
    evidence_count: (i % 4) + 1,
  }
})

export const SUPPLEMENTAL_ACTIVE_RUNS: ActiveRun[] = [
  {
    id: 'run_supp_1',
    type: 'suite',
    name: 'PTP Regression Pack',
    code: 'PTP_REG',
    target_system: { sid: 'Q01', client: '200', type: 'QAS' },
    runner_pool: { id: 'pool_2', name: 'QAS-Pool-B' },
    state: 'InProgress',
    progress: { total: 198, done: 112, in_progress: 6, pending: 80 },
    counts: { pass: 98, healed: 8, fail: 6, todo: 86 },
    healing_events: 8,
    started_at: isoDate(0, 11, 0),
    eta_remaining_mins: 95,
    elapsed_mins: 78,
    triggered_by: 'A.Mehta',
  },
  {
    id: 'run_supp_2',
    type: 'scenario',
    name: 'Intercompany Billing Flow',
    code: 'IC_BILL',
    target_system: { sid: 'Q01', client: '200', type: 'QAS' },
    runner_pool: { id: 'pool_1', name: 'QAS-Pool-A' },
    state: 'InProgress',
    progress: { total: 24, done: 18, in_progress: 2, pending: 4 },
    counts: { pass: 15, healed: 2, fail: 1, todo: 6 },
    healing_events: 2,
    started_at: isoDate(0, 13, 30),
    eta_remaining_mins: 22,
    elapsed_mins: 35,
    triggered_by: 'S.Kumar',
  },
  {
    id: 'run_supp_3',
    type: 'suite',
    name: 'Transport STAK900144 Validation',
    code: 'TR_900144',
    target_system: { sid: 'Q01', client: '200', type: 'QAS' },
    runner_pool: { id: 'pool_3', name: 'QAS-Pool-C' },
    state: 'Pending',
    progress: { total: 26, done: 0, in_progress: 0, pending: 26 },
    counts: { pass: 0, healed: 0, fail: 0, todo: 26 },
    healing_events: 0,
    started_at: isoDate(0, 14, 0),
    eta_remaining_mins: 45,
    elapsed_mins: 0,
    triggered_by: 'On Transport',
  },
  {
    id: 'run_supp_4',
    type: 'suite',
    name: 'WM Cycle Count Suite',
    code: 'WM_CYCLE',
    target_system: { sid: 'D01', client: '100', type: 'DEV' },
    runner_pool: { id: 'pool_4', name: 'DEV-Pool-A' },
    state: 'InProgress',
    progress: { total: 64, done: 41, in_progress: 3, pending: 20 },
    counts: { pass: 38, healed: 3, fail: 0, todo: 23 },
    healing_events: 3,
    started_at: isoDate(0, 10, 15),
    eta_remaining_mins: 38,
    elapsed_mins: 52,
    triggered_by: 'K.Iyer',
  },
]

export const SUPPLEMENTAL_PAST_RUNS: PastRun[] = Array.from({ length: 12 }, (_, i) => ({
  id: `pr_supp_${i + 1}`,
  type: (i % 4 === 0 ? 'scenario' : 'suite') as PastRun['type'],
  name: ['OTC Credit Check', 'MM GR/IR', 'FI Accruals', 'CO Allocation', 'PP Confirmation', 'WM Transfer'][i % 6],
  code: `SUPP_RUN_${i + 1}`,
  target_system: { sid: i % 2 === 0 ? 'Q01' : 'D01', client: i % 2 === 0 ? '200' : '100' },
  state: (i % 7 === 0 ? 'Failed' : 'Completed') as PastRun['state'],
  started_at: isoDate(i + 1, 8 + (i % 6), 0),
  completed_at: isoDate(i + 1, 10 + (i % 5), 30),
  duration_mins: 45 + i * 12,
  case_counts: {
    total: 80 + i * 15,
    pass: 70 + i * 12,
    healed: 3 + (i % 4),
    fail: 2 + (i % 3),
  },
  pass_rate: 88 + (i % 10),
  healing_events: 2 + (i % 5),
  defects_raised: i % 4,
  triggered_by: OWNERS[i % OWNERS.length].name,
}))
