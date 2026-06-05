// ============================================================================
// CONFIGURATION & SYSTEMS MOCK DATA
// ============================================================================

// ============================================================================
// SAP SYSTEMS
// ============================================================================

export type SystemKind = 'ECC' | 'S4HANA_ONPREM' | 'S4HANA_CLOUD' | 'S4HANA_PRIVATE' | 'BTP'
export type LandscapeRole = 'DEV' | 'QAS' | 'PRE' | 'PROD' | 'SBX' | 'TRN'
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown'

export interface SAPSystem {
  id: string
  sid: string
  display_name: string
  kind: SystemKind
  landscape_role: LandscapeRole
  host: string
  port: number
  message_server?: string
  default_client: string
  is_productive: boolean
  region: string
  kernel_release?: string
  support_pack?: string
  health: HealthStatus
  last_health_check: string
  linked_ihub_connector?: string
  clients: SAPClient[]
}

export interface SAPClient {
  id: string
  system_id: string
  client_number: string
  description: string
  is_productive: boolean
  is_locked: boolean
  recent_activity?: string
}

export const SYSTEM_KIND_LABELS: Record<SystemKind, string> = {
  ECC: 'ECC',
  S4HANA_ONPREM: 'S/4HANA On-Prem',
  S4HANA_CLOUD: 'S/4HANA Cloud',
  S4HANA_PRIVATE: 'S/4HANA Private',
  BTP: 'BTP',
}

export const LANDSCAPE_ROLE_COLORS: Record<LandscapeRole, string> = {
  DEV: 'bg-blue-500',
  QAS: 'bg-amber-500',
  PRE: 'bg-violet-500',
  PROD: 'bg-red-500',
  SBX: 'bg-emerald-500',
  TRN: 'bg-cyan-500',
}

export const MOCK_SAP_SYSTEMS: SAPSystem[] = [
  {
    id: 'sys_1',
    sid: 'STA',
    display_name: 'Star Cement ECC Production',
    kind: 'ECC',
    landscape_role: 'PROD',
    host: 'sta-ecc.starcement.internal',
    port: 3300,
    message_server: 'sta-ms.starcement.internal',
    default_client: '100',
    is_productive: true,
    region: 'ap-south-1',
    kernel_release: '753',
    support_pack: 'SAPKH75308',
    health: 'healthy',
    last_health_check: '2026-05-07T14:30:00+05:30',
    linked_ihub_connector: 'ihub_prod_01',
    clients: [
      { id: 'cl_1', system_id: 'sys_1', client_number: '100', description: 'Production Client', is_productive: true, is_locked: false, recent_activity: '2 mins ago' },
      { id: 'cl_2', system_id: 'sys_1', client_number: '200', description: 'Test Client', is_productive: false, is_locked: false, recent_activity: '1 hour ago' },
    ],
  },
  {
    id: 'sys_2',
    sid: 'S4H',
    display_name: 'S/4HANA Development',
    kind: 'S4HANA_ONPREM',
    landscape_role: 'DEV',
    host: 's4h-dev.starcement.internal',
    port: 3300,
    default_client: '100',
    is_productive: false,
    region: 'ap-south-1',
    kernel_release: '793',
    support_pack: 'S4CORE 108',
    health: 'healthy',
    last_health_check: '2026-05-07T14:25:00+05:30',
    linked_ihub_connector: 'ihub_dev_01',
    clients: [
      { id: 'cl_3', system_id: 'sys_2', client_number: '100', description: 'Development Client', is_productive: false, is_locked: false, recent_activity: '5 mins ago' },
    ],
  },
  {
    id: 'sys_3',
    sid: 'Q01',
    display_name: 'Quality Assurance System',
    kind: 'S4HANA_ONPREM',
    landscape_role: 'QAS',
    host: 'q01-qas.starcement.internal',
    port: 3300,
    default_client: '100',
    is_productive: false,
    region: 'ap-south-1',
    kernel_release: '793',
    support_pack: 'S4CORE 108',
    health: 'healthy',
    last_health_check: '2026-05-07T14:20:00+05:30',
    linked_ihub_connector: 'ihub_qas_01',
    clients: [
      { id: 'cl_4', system_id: 'sys_3', client_number: '100', description: 'QA Testing Client', is_productive: false, is_locked: false, recent_activity: '15 mins ago' },
      { id: 'cl_5', system_id: 'sys_3', client_number: '200', description: 'Integration Test Client', is_productive: false, is_locked: false, recent_activity: '30 mins ago' },
    ],
  },
  {
    id: 'sys_4',
    sid: 'CAL',
    display_name: 'SAP CAL Sandbox',
    kind: 'S4HANA_CLOUD',
    landscape_role: 'SBX',
    host: 'sta-cal.eu10.hana.ondemand.com',
    port: 443,
    default_client: '100',
    is_productive: false,
    region: 'eu-central-1',
    health: 'healthy',
    last_health_check: '2026-05-07T14:15:00+05:30',
    clients: [
      { id: 'cl_6', system_id: 'sys_4', client_number: '100', description: 'Sandbox Client', is_productive: false, is_locked: false, recent_activity: '2 hours ago' },
    ],
  },
  {
    id: 'sys_5',
    sid: 'DS4',
    display_name: 'S/4HANA Dev Sprint',
    kind: 'S4HANA_ONPREM',
    landscape_role: 'DEV',
    host: 'ds4-dev.starcement.internal',
    port: 3300,
    default_client: '100',
    is_productive: false,
    region: 'ap-south-1',
    kernel_release: '793',
    support_pack: 'S4CORE 109',
    health: 'degraded',
    last_health_check: '2026-05-07T14:00:00+05:30',
    linked_ihub_connector: 'ihub_dev_02',
    clients: [
      { id: 'cl_7', system_id: 'sys_5', client_number: '100', description: 'Sprint Dev Client', is_productive: false, is_locked: false, recent_activity: '45 mins ago' },
    ],
  },
  {
    id: 'sys_6',
    sid: 'PS4',
    display_name: 'S/4HANA Production',
    kind: 'S4HANA_ONPREM',
    landscape_role: 'PROD',
    host: 'ps4-prod.starcement.internal',
    port: 3300,
    message_server: 'ps4-ms.starcement.internal',
    default_client: '100',
    is_productive: true,
    region: 'ap-south-1',
    kernel_release: '793',
    support_pack: 'S4CORE 108',
    health: 'healthy',
    last_health_check: '2026-05-07T14:30:00+05:30',
    linked_ihub_connector: 'ihub_prod_02',
    clients: [
      { id: 'cl_8', system_id: 'sys_6', client_number: '100', description: 'Production Client', is_productive: true, is_locked: false, recent_activity: '1 min ago' },
    ],
  },
  {
    id: 'sys_7',
    sid: 'TRN',
    display_name: 'Training System',
    kind: 'S4HANA_CLOUD',
    landscape_role: 'TRN',
    host: 'sta-trn.us10.hana.ondemand.com',
    port: 443,
    default_client: '100',
    is_productive: false,
    region: 'us-east-1',
    health: 'healthy',
    last_health_check: '2026-05-07T13:45:00+05:30',
    clients: [
      { id: 'cl_9', system_id: 'sys_7', client_number: '100', description: 'Training Client', is_productive: false, is_locked: true, recent_activity: '1 day ago' },
    ],
  },
]

// ============================================================================
// RFC DESTINATIONS
// ============================================================================

export interface RFCDestination {
  id: string
  name: string
  system_id: string
  client: string
  ntu_ref: string
  pool_size: number
  health: HealthStatus
  last_health_check: string
}

export const MOCK_RFC_DESTINATIONS: RFCDestination[] = [
  { id: 'rfc_1', name: 'VOLTUS_STA_READ', system_id: 'sys_1', client: '100', ntu_ref: 'vault://ntu/sta-read', pool_size: 5, health: 'healthy', last_health_check: '2026-05-07T14:30:00+05:30' },
  { id: 'rfc_2', name: 'VOLTUS_S4H_DEV', system_id: 'sys_2', client: '100', ntu_ref: 'vault://ntu/s4h-dev', pool_size: 10, health: 'healthy', last_health_check: '2026-05-07T14:25:00+05:30' },
  { id: 'rfc_3', name: 'VOLTUS_Q01_TEST', system_id: 'sys_3', client: '100', ntu_ref: 'vault://ntu/q01-test', pool_size: 15, health: 'healthy', last_health_check: '2026-05-07T14:20:00+05:30' },
  { id: 'rfc_4', name: 'VOLTUS_PS4_READ', system_id: 'sys_6', client: '100', ntu_ref: 'vault://ntu/ps4-read', pool_size: 5, health: 'healthy', last_health_check: '2026-05-07T14:30:00+05:30' },
  { id: 'rfc_5', name: 'VOLTUS_DS4_DEV', system_id: 'sys_5', client: '100', ntu_ref: 'vault://ntu/ds4-dev', pool_size: 8, health: 'degraded', last_health_check: '2026-05-07T14:00:00+05:30' },
]

// ============================================================================
// NAMED TECHNICAL USERS (NTUs)
// ============================================================================

export type AuthorityProfile = 'READ_ONLY' | 'TEST_EXECUTION' | 'FULL_AUTH' | 'DATA_MIGRATION'
export type NTUStatus = 'active' | 'rotating' | 'expired' | 'disabled'

export interface NTU {
  id: string
  name: string
  system_id: string
  client: string
  vault_ref: string
  last_rotation: string
  authority_profile: AuthorityProfile
  status: NTUStatus
}

export const MOCK_NTUS: NTU[] = [
  { id: 'ntu_1', name: 'VOLTUS_STA_RO', system_id: 'sys_1', client: '100', vault_ref: 'vault://sap/ntu/sta-ro', last_rotation: '2026-04-15T00:00:00+05:30', authority_profile: 'READ_ONLY', status: 'active' },
  { id: 'ntu_2', name: 'VOLTUS_S4H_EXEC', system_id: 'sys_2', client: '100', vault_ref: 'vault://sap/ntu/s4h-exec', last_rotation: '2026-04-20T00:00:00+05:30', authority_profile: 'TEST_EXECUTION', status: 'active' },
  { id: 'ntu_3', name: 'VOLTUS_Q01_EXEC', system_id: 'sys_3', client: '100', vault_ref: 'vault://sap/ntu/q01-exec', last_rotation: '2026-04-25T00:00:00+05:30', authority_profile: 'TEST_EXECUTION', status: 'active' },
  { id: 'ntu_4', name: 'VOLTUS_PS4_RO', system_id: 'sys_6', client: '100', vault_ref: 'vault://sap/ntu/ps4-ro', last_rotation: '2026-04-10T00:00:00+05:30', authority_profile: 'READ_ONLY', status: 'active' },
  { id: 'ntu_5', name: 'VOLTUS_DS4_FULL', system_id: 'sys_5', client: '100', vault_ref: 'vault://sap/ntu/ds4-full', last_rotation: '2026-05-01T00:00:00+05:30', authority_profile: 'FULL_AUTH', status: 'active' },
  { id: 'ntu_6', name: 'VOLTUS_MIG_DATA', system_id: 'sys_2', client: '100', vault_ref: 'vault://sap/ntu/mig-data', last_rotation: '2026-04-28T00:00:00+05:30', authority_profile: 'DATA_MIGRATION', status: 'active' },
]

// ============================================================================
// SERVICE ROLES
// ============================================================================

export type ActorClass = 'Human' | 'Agent' | 'Either'

export interface ServiceRole {
  id: string
  code: string
  display_name: string
  actor_class: ActorClass
  capability_scopes: string[]
  member_count: number
  linked_rules_count: number
  is_system_role: boolean
}

export const MOCK_SERVICE_ROLES: ServiceRole[] = [
  { id: 'sr_1', code: 'migration_manager', display_name: 'Migration Manager', actor_class: 'Human', capability_scopes: ['migration.manage', 'approval.grant', 'defect.triage'], member_count: 2, linked_rules_count: 5, is_system_role: true },
  { id: 'sr_2', code: 'qa_lead', display_name: 'QA Lead', actor_class: 'Human', capability_scopes: ['test.approve', 'defect.triage', 'suite.publish'], member_count: 1, linked_rules_count: 4, is_system_role: true },
  { id: 'sr_3', code: 'test_engineer', display_name: 'Test Engineer', actor_class: 'Human', capability_scopes: ['test.execute', 'scenario.edit', 'defect.create'], member_count: 8, linked_rules_count: 3, is_system_role: true },
  { id: 'sr_4', code: 'abap_lead', display_name: 'ABAP Lead', actor_class: 'Human', capability_scopes: ['zobject.manage', 'code.review', 'transport.approve'], member_count: 1, linked_rules_count: 2, is_system_role: true },
  { id: 'sr_5', code: 'basis_lead', display_name: 'Basis Lead', actor_class: 'Human', capability_scopes: ['system.manage', 'runner.configure', 'ntu.rotate'], member_count: 1, linked_rules_count: 2, is_system_role: true },
  { id: 'sr_6', code: 'solution_architect', display_name: 'Solution Architect', actor_class: 'Human', capability_scopes: ['architecture.review', 'approval.grant', 'policy.approve'], member_count: 1, linked_rules_count: 3, is_system_role: true },
  { id: 'sr_7', code: 'cio', display_name: 'CIO', actor_class: 'Human', capability_scopes: ['approval.grant', 'policy.approve', 'audit.view'], member_count: 1, linked_rules_count: 2, is_system_role: true },
  { id: 'sr_8', code: 'internal_audit', display_name: 'Internal Audit', actor_class: 'Human', capability_scopes: ['audit.view', 'evidence.export', 'policy.approve'], member_count: 2, linked_rules_count: 4, is_system_role: true },
  { id: 'sr_9', code: 'classification_agent', display_name: 'Classification Agent', actor_class: 'Agent', capability_scopes: ['classify.defect', 'classify.failure'], member_count: 1, linked_rules_count: 1, is_system_role: true },
  { id: 'sr_10', code: 'impact_analysis_agent', display_name: 'Impact Analysis Agent', actor_class: 'Agent', capability_scopes: ['analyze.impact', 'suggest.tests'], member_count: 1, linked_rules_count: 1, is_system_role: true },
  { id: 'sr_11', code: 'test_execution_agent', display_name: 'Test Execution Agent', actor_class: 'Agent', capability_scopes: ['test.execute', 'data.generate'], member_count: 1, linked_rules_count: 2, is_system_role: true },
  { id: 'sr_12', code: 'healing_agent', display_name: 'Healing Agent', actor_class: 'Agent', capability_scopes: ['heal.failure', 'promote.fix'], member_count: 1, linked_rules_count: 1, is_system_role: true },
  { id: 'sr_13', code: 'data_steward', display_name: 'Data Steward', actor_class: 'Human', capability_scopes: ['fixture.manage', 'pii.redact'], member_count: 2, linked_rules_count: 1, is_system_role: false },
  { id: 'sr_14', code: 'functional_lead', display_name: 'Functional Lead', actor_class: 'Human', capability_scopes: ['scenario.approve', 'kb.curate'], member_count: 3, linked_rules_count: 2, is_system_role: false },
]

// ============================================================================
// PAIRING RULES
// ============================================================================

export interface PairingRule {
  id: string
  priority: number
  predicate: string
  predicate_display: string
  target_role: string
  assignee_mode: 'specific' | 'first_available' | 'round_robin'
  assignee_name?: string
  fallback_chain: string[]
  is_active: boolean
}

export const MOCK_PAIRING_RULES: PairingRule[] = [
  { id: 'pr_1', priority: 1, predicate: 'scenario.module == "SD" && migration.code == "SC_S4_CUTOVER_2026"', predicate_display: 'For any Scenario in module SD under Migration SC_S4_CUTOVER_2026', target_role: 'qa_lead', assignee_mode: 'specific', assignee_name: 'Jahnavi Rao', fallback_chain: ['Pradeep Sharma'], is_active: true },
  { id: 'pr_2', priority: 2, predicate: 'defect.severity == "Critical"', predicate_display: 'For any Defect with severity Critical', target_role: 'functional_lead', assignee_mode: 'first_available', fallback_chain: ['migration_manager'], is_active: true },
  { id: 'pr_3', priority: 3, predicate: 'task.type == "cutover_approval" && migration.code == "SC_S4_CUTOVER_2026"', predicate_display: 'For any cutover approval in Migration SC_S4_CUTOVER_2026', target_role: 'migration_manager', assignee_mode: 'specific', assignee_name: 'Pradeep Sharma', fallback_chain: [], is_active: true },
  { id: 'pr_4', priority: 4, predicate: 'task.requires_cio_approval == true', predicate_display: 'For any task requiring CIO approval', target_role: 'cio', assignee_mode: 'specific', assignee_name: 'Rajiv Menon', fallback_chain: [], is_active: true },
  { id: 'pr_5', priority: 5, predicate: 'scenario.module IN ["FI", "CO"] && task.type == "test_execution"', predicate_display: 'For any FI/CO test execution', target_role: 'test_engineer', assignee_mode: 'round_robin', fallback_chain: [], is_active: true },
  { id: 'pr_6', priority: 6, predicate: 'healing_event.confidence < 0.7', predicate_display: 'For any low-confidence healing event', target_role: 'qa_lead', assignee_mode: 'first_available', fallback_chain: ['test_engineer'], is_active: false },
]

// ============================================================================
// AI AGENTS
// ============================================================================

export type AgentKind = 'Classification' | 'Impact Analysis' | 'Test Generation' | 'Test Execution' | 'Test Data' | 'Healing' | 'Defect Triage' | 'Reporting' | 'Audit Pack Composer' | 'KB Curation'
export type AgentStatus = 'Active' | 'Disabled' | 'Maintenance'

export interface AIAgent {
  id: string
  display_name: string
  agent_kind: AgentKind
  did: string
  capability_scopes: string[]
  assignable_roles: string[]
  threshold_count: number
  recent_tasks_24h: number
  status: AgentStatus
}

export const MOCK_AI_AGENTS: AIAgent[] = [
  { id: 'ag_1', display_name: 'Voltus Classification Agent', agent_kind: 'Classification', did: 'did:voltus:agent:class:0x1a2b...', capability_scopes: ['classify.defect', 'classify.failure', 'classify.transport'], assignable_roles: ['classification_agent'], threshold_count: 3, recent_tasks_24h: 47, status: 'Active' },
  { id: 'ag_2', display_name: 'Voltus Impact Analysis Agent', agent_kind: 'Impact Analysis', did: 'did:voltus:agent:impact:0x3c4d...', capability_scopes: ['analyze.code', 'analyze.process', 'suggest.tests'], assignable_roles: ['impact_analysis_agent'], threshold_count: 4, recent_tasks_24h: 12, status: 'Active' },
  { id: 'ag_3', display_name: 'Voltus Test Generation Agent', agent_kind: 'Test Generation', did: 'did:voltus:agent:testgen:0x5e6f...', capability_scopes: ['generate.scenario', 'generate.case', 'generate.data'], assignable_roles: ['test_generation_agent'], threshold_count: 5, recent_tasks_24h: 8, status: 'Active' },
  { id: 'ag_4', display_name: 'Voltus Test Execution Agent', agent_kind: 'Test Execution', did: 'did:voltus:agent:exec:0x7g8h...', capability_scopes: ['execute.test', 'capture.evidence', 'report.result'], assignable_roles: ['test_execution_agent'], threshold_count: 2, recent_tasks_24h: 156, status: 'Active' },
  { id: 'ag_5', display_name: 'Voltus Test Data Agent', agent_kind: 'Test Data', did: 'did:voltus:agent:data:0x9i0j...', capability_scopes: ['generate.fixture', 'mask.pii', 'validate.data'], assignable_roles: ['test_data_agent'], threshold_count: 3, recent_tasks_24h: 23, status: 'Active' },
  { id: 'ag_6', display_name: 'Voltus Healing Agent', agent_kind: 'Healing', did: 'did:voltus:agent:heal:0xab1c...', capability_scopes: ['heal.failure', 'propose.fix', 'promote.change'], assignable_roles: ['healing_agent'], threshold_count: 4, recent_tasks_24h: 7, status: 'Active' },
  { id: 'ag_7', display_name: 'Voltus Defect Triage Agent', agent_kind: 'Defect Triage', did: 'did:voltus:agent:triage:0xcd2e...', capability_scopes: ['triage.defect', 'suggest.owner', 'link.evidence'], assignable_roles: ['defect_triage_agent'], threshold_count: 3, recent_tasks_24h: 15, status: 'Active' },
  { id: 'ag_8', display_name: 'Voltus Reporting Agent', agent_kind: 'Reporting', did: 'did:voltus:agent:report:0xef3g...', capability_scopes: ['generate.report', 'compile.metrics', 'format.output'], assignable_roles: ['reporting_agent'], threshold_count: 2, recent_tasks_24h: 4, status: 'Active' },
  { id: 'ag_9', display_name: 'Voltus Audit Pack Composer', agent_kind: 'Audit Pack Composer', did: 'did:voltus:agent:audit:0xhi4j...', capability_scopes: ['compile.evidence', 'generate.pack', 'sign.artefact'], assignable_roles: ['audit_composer_agent'], threshold_count: 2, recent_tasks_24h: 1, status: 'Active' },
  { id: 'ag_10', display_name: 'Voltus KB Curation Agent', agent_kind: 'KB Curation', did: 'did:voltus:agent:kb:0xkl5m...', capability_scopes: ['curate.article', 'link.entity', 'suggest.content'], assignable_roles: ['kb_curation_agent'], threshold_count: 3, recent_tasks_24h: 31, status: 'Active' },
]

// ============================================================================
// IDENTITY PROVIDERS
// ============================================================================

export type IdPKind = 'SAP_IAS' | 'AZURE_AD' | 'OKTA' | 'COGNITO'
export type IdPStatus = 'Connected' | 'Pending' | 'Failed'
export type IdPProtocol = 'OIDC' | 'SAML'

export interface IdentityProvider {
  id: string
  kind: IdPKind
  display_name: string
  status: IdPStatus
  protocol: IdPProtocol
  last_sync: string
  user_count: number
  endpoint?: string
}

export const IDP_KIND_LABELS: Record<IdPKind, string> = {
  SAP_IAS: 'SAP IAS',
  AZURE_AD: 'Azure AD / Entra',
  OKTA: 'Okta',
  COGNITO: 'AWS Cognito',
}

export const MOCK_IDENTITY_PROVIDERS: IdentityProvider[] = [
  { id: 'idp_1', kind: 'COGNITO', display_name: 'Star Cement Cognito', status: 'Connected', protocol: 'OIDC', last_sync: '2026-05-07T14:00:00+05:30', user_count: 45, endpoint: 'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_xxxxx' },
  { id: 'idp_2', kind: 'SAP_IAS', display_name: 'SAP Workforce Identity', status: 'Connected', protocol: 'SAML', last_sync: '2026-05-07T13:30:00+05:30', user_count: 120, endpoint: 'starcement.accounts.ondemand.com' },
  { id: 'idp_3', kind: 'AZURE_AD', display_name: 'Star Cement Azure AD', status: 'Pending', protocol: 'OIDC', last_sync: '', user_count: 0, endpoint: 'login.microsoftonline.com/tenant-id' },
]

// ============================================================================
// RUNNER POOLS
// ============================================================================

export type RunnerKind = 'sap_gui_windows' | 'fiori_browser' | 'api_runner' | 'hybrid'

export interface RunnerPool {
  id: string
  name: string
  kind: RunnerKind
  capacity: number
  min_scale: number
  max_scale: number
  os_image?: string
  tags: string[]
  restricted_systems: string[]
  current_utilization: number
}

export const RUNNER_KIND_LABELS: Record<RunnerKind, string> = {
  sap_gui_windows: 'SAP GUI Windows',
  fiori_browser: 'Fiori Browser',
  api_runner: 'API Runner',
  hybrid: 'Hybrid',
}

export const MOCK_RUNNER_POOLS: RunnerPool[] = [
  { id: 'pool_1', name: 'SAP GUI Windows Pool A', kind: 'sap_gui_windows', capacity: 30, min_scale: 5, max_scale: 50, os_image: 'Windows Server 2022 + SAP GUI 8.00', tags: ['general', 'high-capacity'], restricted_systems: [], current_utilization: 67 },
  { id: 'pool_2', name: 'SAP GUI Windows Pool B - Star Cement Dedicated', kind: 'sap_gui_windows', capacity: 20, min_scale: 5, max_scale: 30, os_image: 'Windows Server 2022 + SAP GUI 8.00', tags: ['dedicated', 'star-cement'], restricted_systems: ['sys_1', 'sys_6'], current_utilization: 45 },
  { id: 'pool_3', name: 'API Runner Pool', kind: 'api_runner', capacity: 100, min_scale: 10, max_scale: 200, tags: ['api', 'high-throughput'], restricted_systems: [], current_utilization: 23 },
  { id: 'pool_4', name: 'Fiori Browser Pool', kind: 'fiori_browser', capacity: 15, min_scale: 3, max_scale: 25, os_image: 'Ubuntu 22.04 + Chrome 120', tags: ['fiori', 'v1-deferred'], restricted_systems: [], current_utilization: 0 },
]

// ============================================================================
// ACTIVE RUNNERS
// ============================================================================

export type RunnerState = 'executing' | 'idle' | 'draining' | 'failed'

export interface ActiveRunner {
  id: string
  pool_id: string
  host_id: string
  state: RunnerState
  current_execution?: { id: string; name: string }
  lease_until: string
  cpu_utilization: number
  memory_utilization: number
  health: HealthStatus
}

export const MOCK_ACTIVE_RUNNERS: ActiveRunner[] = [
  { id: 'run_1', pool_id: 'pool_1', host_id: 'i-0a1b2c3d4e5f', state: 'executing', current_execution: { id: 'exec_001', name: 'TC_OTC_001 Create Sales Order' }, lease_until: '2026-05-07T15:00:00+05:30', cpu_utilization: 78, memory_utilization: 65, health: 'healthy' },
  { id: 'run_2', pool_id: 'pool_1', host_id: 'i-1b2c3d4e5f6g', state: 'executing', current_execution: { id: 'exec_002', name: 'TC_OTC_002 Create Delivery' }, lease_until: '2026-05-07T15:05:00+05:30', cpu_utilization: 82, memory_utilization: 71, health: 'healthy' },
  { id: 'run_3', pool_id: 'pool_1', host_id: 'i-2c3d4e5f6g7h', state: 'idle', lease_until: '2026-05-07T14:45:00+05:30', cpu_utilization: 5, memory_utilization: 32, health: 'healthy' },
  { id: 'run_4', pool_id: 'pool_1', host_id: 'i-3d4e5f6g7h8i', state: 'executing', current_execution: { id: 'exec_003', name: 'TC_PTP_001 Create PO' }, lease_until: '2026-05-07T15:10:00+05:30', cpu_utilization: 75, memory_utilization: 68, health: 'healthy' },
  { id: 'run_5', pool_id: 'pool_2', host_id: 'i-4e5f6g7h8i9j', state: 'executing', current_execution: { id: 'exec_004', name: 'TC_FI_001 Post GL Document' }, lease_until: '2026-05-07T15:15:00+05:30', cpu_utilization: 68, memory_utilization: 55, health: 'healthy' },
  { id: 'run_6', pool_id: 'pool_2', host_id: 'i-5f6g7h8i9j0k', state: 'idle', lease_until: '2026-05-07T14:50:00+05:30', cpu_utilization: 3, memory_utilization: 28, health: 'healthy' },
  { id: 'run_7', pool_id: 'pool_3', host_id: 'i-6g7h8i9j0k1l', state: 'executing', current_execution: { id: 'exec_005', name: 'API_TEST_001 BAPI Call' }, lease_until: '2026-05-07T14:55:00+05:30', cpu_utilization: 45, memory_utilization: 40, health: 'healthy' },
  { id: 'run_8', pool_id: 'pool_3', host_id: 'i-7h8i9j0k1l2m', state: 'executing', current_execution: { id: 'exec_006', name: 'API_TEST_002 OData Read' }, lease_until: '2026-05-07T14:58:00+05:30', cpu_utilization: 42, memory_utilization: 38, health: 'healthy' },
  { id: 'run_9', pool_id: 'pool_3', host_id: 'i-8i9j0k1l2m3n', state: 'idle', lease_until: '2026-05-07T14:40:00+05:30', cpu_utilization: 2, memory_utilization: 25, health: 'healthy' },
  { id: 'run_10', pool_id: 'pool_1', host_id: 'i-9j0k1l2m3n4o', state: 'draining', lease_until: '2026-05-07T14:35:00+05:30', cpu_utilization: 0, memory_utilization: 20, health: 'healthy' },
  { id: 'run_11', pool_id: 'pool_1', host_id: 'i-0k1l2m3n4o5p', state: 'failed', lease_until: '2026-05-07T14:30:00+05:30', cpu_utilization: 0, memory_utilization: 0, health: 'unhealthy' },
  { id: 'run_12', pool_id: 'pool_2', host_id: 'i-1l2m3n4o5p6q', state: 'executing', current_execution: { id: 'exec_007', name: 'TC_MM_001 Create PR' }, lease_until: '2026-05-07T15:20:00+05:30', cpu_utilization: 72, memory_utilization: 62, health: 'healthy' },
]

// ============================================================================
// INTEGRATIONS
// ============================================================================

export type IntegrationStatus = 'Connected' | 'Disconnected' | 'Error' | 'Pending'

export interface Integration {
  id: string
  name: string
  kind: string
  status: IntegrationStatus
  last_health_check?: string
  config: Record<string, string>
}

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'int_1', name: 'SAP Joule', kind: 'joule', status: 'Connected', last_health_check: '2026-05-07T14:30:00+05:30', config: { btp_subaccount: 'starcement-dev', oauth_status: 'Valid' } },
  { id: 'int_2', name: 'SAP ATC Remote', kind: 'atc', status: 'Connected', last_health_check: '2026-05-07T14:25:00+05:30', config: { target_system: 'S4H', ruleset: 'VOLTUS_STANDARD' } },
  { id: 'int_3', name: 'ServiceNow', kind: 'itsm', status: 'Connected', last_health_check: '2026-05-07T14:20:00+05:30', config: { instance: 'starcement.service-now.com', sync_mode: 'Bi-directional' } },
  { id: 'int_4', name: 'SAP STMS', kind: 'stms', status: 'Connected', last_health_check: '2026-05-07T14:30:00+05:30', config: { system: 'STA', poll_interval: '60s' } },
  { id: 'int_5', name: 'SAP Readiness Check', kind: 'readiness', status: 'Connected', last_health_check: '2026-05-07T10:00:00+05:30', config: { last_import: '2026-05-01' } },
]

// ============================================================================
// POLICIES
// ============================================================================

export interface RetentionPolicy {
  id: string
  entity_class: string
  default_retention: string
  active_retention: string
  has_override: boolean
  configurable_range: string
  migration_overrides: number
}

export const MOCK_RETENTION_POLICIES: RetentionPolicy[] = [
  { id: 'ret_1', entity_class: 'Cutover Window Evidence', default_retention: '7 years', active_retention: '7 years', has_override: false, configurable_range: '1-10 years', migration_overrides: 0 },
  { id: 'ret_2', entity_class: 'Regression Evidence', default_retention: '90 days', active_retention: '90 days', has_override: false, configurable_range: '30-365 days', migration_overrides: 2 },
  { id: 'ret_3', entity_class: 'Defect-Linked Evidence', default_retention: 'Infinite (Regulatory Hold)', active_retention: 'Infinite', has_override: false, configurable_range: 'N/A', migration_overrides: 0 },
  { id: 'ret_4', entity_class: 'Decision Log Entries', default_retention: '7 years', active_retention: '7 years', has_override: false, configurable_range: '5-10 years', migration_overrides: 0 },
  { id: 'ret_5', entity_class: 'Audit Exports', default_retention: '7 years', active_retention: '7 years', has_override: false, configurable_range: '5-10 years', migration_overrides: 0 },
  { id: 'ret_6', entity_class: 'Approvals', default_retention: '10 years', active_retention: '10 years', has_override: false, configurable_range: '7-15 years', migration_overrides: 1 },
]

// ============================================================================
// CONFIGURATION AUDIT TRAIL
// ============================================================================

export interface ConfigAuditEvent {
  id: string
  timestamp: string
  actor: { id: string; name: string; role: string }
  entity_class: string
  entity_id: string
  entity_name: string
  action: string
  field_changed?: string
  old_value?: string
  new_value?: string
  is_sensitive: boolean
}

export const MOCK_CONFIG_AUDIT: ConfigAuditEvent[] = [
  { id: 'ca_1', timestamp: '2026-05-07T14:30:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager' }, entity_class: 'System', entity_id: 'sys_1', entity_name: 'STA-ECC', action: 'health_check_completed', is_sensitive: false },
  { id: 'ca_2', timestamp: '2026-05-07T12:00:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', role: 'Basis Lead' }, entity_class: 'NTU', entity_id: 'ntu_2', entity_name: 'VOLTUS_S4H_EXEC', action: 'credential_rotated', is_sensitive: true },
  { id: 'ca_3', timestamp: '2026-05-07T10:15:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager' }, entity_class: 'Pairing Rule', entity_id: 'pr_1', entity_name: 'SD QA Lead Assignment', action: 'rule_modified', field_changed: 'assignee', old_value: 'M.Reddy', new_value: 'J.Rao', is_sensitive: false },
  { id: 'ca_4', timestamp: '2026-05-06T16:45:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', role: 'Basis Lead' }, entity_class: 'Pool', entity_id: 'pool_1', entity_name: 'SAP GUI Windows Pool A', action: 'capacity_changed', field_changed: 'max_scale', old_value: '40', new_value: '50', is_sensitive: false },
  { id: 'ca_5', timestamp: '2026-05-06T14:30:00+05:30', actor: { id: 'u_6', name: 'R.Menon', role: 'CIO' }, entity_class: 'System', entity_id: 'sys_6', entity_name: 'PS4-PROD', action: 'productive_flag_changed', field_changed: 'is_productive', old_value: 'false', new_value: 'true', is_sensitive: true },
  { id: 'ca_6', timestamp: '2026-05-06T11:00:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager' }, entity_class: 'IdP', entity_id: 'idp_3', entity_name: 'Azure AD', action: 'connection_initiated', is_sensitive: false },
  { id: 'ca_7', timestamp: '2026-05-05T15:20:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', role: 'Basis Lead' }, entity_class: 'Integration', entity_id: 'int_1', entity_name: 'SAP Joule', action: 'oauth_refreshed', is_sensitive: true },
  { id: 'ca_8', timestamp: '2026-05-05T10:00:00+05:30', actor: { id: 'u_7', name: 'A.Patel', role: 'Internal Audit' }, entity_class: 'Policy', entity_id: 'ret_2', entity_name: 'Regression Evidence Retention', action: 'override_added', field_changed: 'migration_overrides', old_value: '1', new_value: '2', is_sensitive: false },
  { id: 'ca_9', timestamp: '2026-05-04T14:45:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', role: 'Basis Lead' }, entity_class: 'System', entity_id: 'sys_7', entity_name: 'TRN', action: 'system_registered', is_sensitive: false },
  { id: 'ca_10', timestamp: '2026-05-04T09:30:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager' }, entity_class: 'NTU', entity_id: 'ntu_6', entity_name: 'VOLTUS_MIG_DATA', action: 'ntu_created', is_sensitive: true },
  // More entries for a realistic 30-entry log...
  { id: 'ca_11', timestamp: '2026-05-03T16:00:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', role: 'Basis Lead' }, entity_class: 'Pool', entity_id: 'pool_2', entity_name: 'SAP GUI Windows Pool B', action: 'restriction_added', field_changed: 'restricted_systems', old_value: '[]', new_value: '[sys_1, sys_6]', is_sensitive: false },
  { id: 'ca_12', timestamp: '2026-05-03T11:30:00+05:30', actor: { id: 'u_1', name: 'P.Sharma', role: 'Migration Manager' }, entity_class: 'Pairing Rule', entity_id: 'pr_6', entity_name: 'Low Confidence Healing', action: 'rule_deactivated', field_changed: 'is_active', old_value: 'true', new_value: 'false', is_sensitive: false },
  { id: 'ca_13', timestamp: '2026-05-02T14:20:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', role: 'Basis Lead' }, entity_class: 'Integration', entity_id: 'int_3', entity_name: 'ServiceNow', action: 'sync_mode_changed', field_changed: 'sync_mode', old_value: 'Voltus Source', new_value: 'Bi-directional', is_sensitive: false },
  { id: 'ca_14', timestamp: '2026-05-02T09:00:00+05:30', actor: { id: 'u_6', name: 'R.Menon', role: 'CIO' }, entity_class: 'Policy', entity_id: 'prod_exec', entity_name: 'Productive Execution Rules', action: 'exception_granted', is_sensitive: true },
  { id: 'ca_15', timestamp: '2026-05-01T15:45:00+05:30', actor: { id: 'u_5', name: 'K.Iyer', role: 'Basis Lead' }, entity_class: 'NTU', entity_id: 'ntu_3', entity_name: 'VOLTUS_Q01_EXEC', action: 'authority_profile_changed', field_changed: 'authority_profile', old_value: 'READ_ONLY', new_value: 'TEST_EXECUTION', is_sensitive: true },
]
