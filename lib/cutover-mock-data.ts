// Cutover Command Center Mock Data

export type CutoverWindowStatus = 'Active' | 'Scheduled' | 'Completed' | 'Cancelled' | 'On Hold'
export type CutoverTaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Failed' | 'Blocked' | 'Skipped'
export type CutoverPhase = 'Pre-Cutover' | 'Cutover' | 'Post-Cutover' | 'Hypercare'

export interface CutoverTask {
  id: string
  order: number
  name: string
  description: string
  phase: CutoverPhase
  status: CutoverTaskStatus
  assignee: {
    type: 'human' | 'agent'
    name: string
    role?: string
  }
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  duration_mins: number
  predecessors: string[]
  is_critical_path: boolean
  is_milestone: boolean
  blockers?: string[]
  notes?: string
}

export interface CutoverWindow {
  id: string
  name: string
  migration_id: string
  migration_name: string
  status: CutoverWindowStatus
  phase: CutoverPhase
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  tasks: CutoverTask[]
  total_tasks: number
  completed_tasks: number
  failed_tasks: number
  blocked_tasks: number
  war_room_url?: string
  decision_count: number
}

export interface Decision {
  id: string
  window_id: string
  title: string
  description: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'Approved' | 'Rejected' | 'Deferred'
  raised_by: {
    name: string
    role: string
  }
  raised_at: string
  decided_by?: {
    name: string
    role: string
  }
  decided_at?: string
  rationale?: string
  impact: string
  options: {
    label: string
    description: string
    recommended?: boolean
  }[]
  selected_option?: string
}

// Active Cutover Window - Star Cement Go-Live
export const MOCK_ACTIVE_WINDOW: CutoverWindow = {
  id: 'cw_1',
  name: 'Star Cement S/4HANA Go-Live',
  migration_id: 'mig_1',
  migration_name: 'Star Cement S/4HANA Migration',
  status: 'Active',
  phase: 'Cutover',
  planned_start: '2026-05-07T06:00:00+05:30',
  planned_end: '2026-05-08T18:00:00+05:30',
  actual_start: '2026-05-07T06:15:00+05:30',
  total_tasks: 42,
  completed_tasks: 18,
  failed_tasks: 1,
  blocked_tasks: 2,
  war_room_url: 'https://teams.microsoft.com/l/meetup-join/...',
  decision_count: 3,
  tasks: [
    // Pre-Cutover Phase (completed)
    { id: 'ct_1', order: 1, name: 'Freeze ECC Transports', description: 'Stop all transport releases to ECC', phase: 'Pre-Cutover', status: 'Completed', assignee: { type: 'human', name: 'R.Kumar', role: 'Basis Admin' }, planned_start: '2026-05-07T06:00:00+05:30', planned_end: '2026-05-07T06:15:00+05:30', actual_start: '2026-05-07T06:00:00+05:30', actual_end: '2026-05-07T06:12:00+05:30', duration_mins: 15, predecessors: [], is_critical_path: true, is_milestone: true },
    { id: 'ct_2', order: 2, name: 'Export Customer Masters', description: 'Extract KNA1/KNVV from ECC', phase: 'Pre-Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T06:15:00+05:30', planned_end: '2026-05-07T07:15:00+05:30', actual_start: '2026-05-07T06:15:00+05:30', actual_end: '2026-05-07T07:10:00+05:30', duration_mins: 60, predecessors: ['ct_1'], is_critical_path: true, is_milestone: false },
    { id: 'ct_3', order: 3, name: 'Export Vendor Masters', description: 'Extract LFA1/LFB1 from ECC', phase: 'Pre-Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T06:15:00+05:30', planned_end: '2026-05-07T07:00:00+05:30', actual_start: '2026-05-07T06:15:00+05:30', actual_end: '2026-05-07T06:55:00+05:30', duration_mins: 45, predecessors: ['ct_1'], is_critical_path: false, is_milestone: false },
    { id: 'ct_4', order: 4, name: 'Export Material Masters', description: 'Extract MARA/MARC from ECC', phase: 'Pre-Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T06:15:00+05:30', planned_end: '2026-05-07T08:15:00+05:30', actual_start: '2026-05-07T06:15:00+05:30', actual_end: '2026-05-07T08:20:00+05:30', duration_mins: 120, predecessors: ['ct_1'], is_critical_path: true, is_milestone: false },
    { id: 'ct_5', order: 5, name: 'Validate Export Counts', description: 'Compare source record counts', phase: 'Pre-Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Validation Agent' }, planned_start: '2026-05-07T08:15:00+05:30', planned_end: '2026-05-07T08:30:00+05:30', actual_start: '2026-05-07T08:20:00+05:30', actual_end: '2026-05-07T08:35:00+05:30', duration_mins: 15, predecessors: ['ct_2', 'ct_3', 'ct_4'], is_critical_path: true, is_milestone: true },
    
    // Cutover Phase (in progress)
    { id: 'ct_6', order: 6, name: 'Create Pre-Load Snapshot', description: 'S/4 system snapshot before data load', phase: 'Cutover', status: 'Completed', assignee: { type: 'human', name: 'S.Patel', role: 'Basis Admin' }, planned_start: '2026-05-07T08:30:00+05:30', planned_end: '2026-05-07T09:00:00+05:30', actual_start: '2026-05-07T08:35:00+05:30', actual_end: '2026-05-07T09:05:00+05:30', duration_mins: 30, predecessors: ['ct_5'], is_critical_path: true, is_milestone: true },
    { id: 'ct_7', order: 7, name: 'Load Customer Masters', description: 'LTMC load of customer BPs', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T09:00:00+05:30', planned_end: '2026-05-07T09:45:00+05:30', actual_start: '2026-05-07T09:05:00+05:30', actual_end: '2026-05-07T09:50:00+05:30', duration_mins: 45, predecessors: ['ct_6'], is_critical_path: true, is_milestone: false },
    { id: 'ct_8', order: 8, name: 'Load Vendor Masters', description: 'LTMC load of vendor BPs', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T09:00:00+05:30', planned_end: '2026-05-07T09:30:00+05:30', actual_start: '2026-05-07T09:05:00+05:30', actual_end: '2026-05-07T09:32:00+05:30', duration_mins: 30, predecessors: ['ct_6'], is_critical_path: false, is_milestone: false },
    { id: 'ct_9', order: 9, name: 'Load Material Masters', description: 'LTMC load of materials', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T09:00:00+05:30', planned_end: '2026-05-07T10:00:00+05:30', actual_start: '2026-05-07T09:05:00+05:30', actual_end: '2026-05-07T10:08:00+05:30', duration_mins: 60, predecessors: ['ct_6'], is_critical_path: true, is_milestone: false },
    { id: 'ct_10', order: 10, name: 'Validate Load Counts', description: 'Compare target record counts', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Validation Agent' }, planned_start: '2026-05-07T10:00:00+05:30', planned_end: '2026-05-07T10:15:00+05:30', actual_start: '2026-05-07T10:08:00+05:30', actual_end: '2026-05-07T10:22:00+05:30', duration_mins: 15, predecessors: ['ct_7', 'ct_8', 'ct_9'], is_critical_path: true, is_milestone: true },
    { id: 'ct_11', order: 11, name: 'Load Open Sales Orders', description: 'Migrate open SO documents', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T10:15:00+05:30', planned_end: '2026-05-07T11:15:00+05:30', actual_start: '2026-05-07T10:22:00+05:30', actual_end: '2026-05-07T11:28:00+05:30', duration_mins: 60, predecessors: ['ct_10'], is_critical_path: true, is_milestone: false },
    { id: 'ct_12', order: 12, name: 'Load Open Purchase Orders', description: 'Migrate open PO documents', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T10:15:00+05:30', planned_end: '2026-05-07T11:00:00+05:30', actual_start: '2026-05-07T10:22:00+05:30', actual_end: '2026-05-07T11:10:00+05:30', duration_mins: 45, predecessors: ['ct_10'], is_critical_path: false, is_milestone: false },
    { id: 'ct_13', order: 13, name: 'Load GL Balances', description: 'Migrate FI account balances', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Data Migration Agent' }, planned_start: '2026-05-07T11:15:00+05:30', planned_end: '2026-05-07T12:15:00+05:30', actual_start: '2026-05-07T11:28:00+05:30', actual_end: '2026-05-07T12:35:00+05:30', duration_mins: 60, predecessors: ['ct_11'], is_critical_path: true, is_milestone: false },
    { id: 'ct_14', order: 14, name: 'Reconcile FI Balances', description: 'Compare ECC vs S/4 balances', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Validation Agent' }, planned_start: '2026-05-07T12:15:00+05:30', planned_end: '2026-05-07T12:45:00+05:30', actual_start: '2026-05-07T12:35:00+05:30', actual_end: '2026-05-07T13:10:00+05:30', duration_mins: 30, predecessors: ['ct_13'], is_critical_path: true, is_milestone: true },
    { id: 'ct_15', order: 15, name: 'Data Migration Sign-Off', description: 'Data team approval', phase: 'Cutover', status: 'Completed', assignee: { type: 'human', name: 'P.Sharma', role: 'Data Lead' }, planned_start: '2026-05-07T12:45:00+05:30', planned_end: '2026-05-07T13:15:00+05:30', actual_start: '2026-05-07T13:10:00+05:30', actual_end: '2026-05-07T13:25:00+05:30', duration_mins: 30, predecessors: ['ct_14'], is_critical_path: true, is_milestone: true },
    
    // Functional Testing (current)
    { id: 'ct_16', order: 16, name: 'Execute OTC Happy Path', description: 'Critical OTC test scenario', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Executor Agent' }, planned_start: '2026-05-07T13:15:00+05:30', planned_end: '2026-05-07T14:00:00+05:30', actual_start: '2026-05-07T13:25:00+05:30', actual_end: '2026-05-07T14:15:00+05:30', duration_mins: 45, predecessors: ['ct_15'], is_critical_path: true, is_milestone: false },
    { id: 'ct_17', order: 17, name: 'Execute PTP Happy Path', description: 'Critical PTP test scenario', phase: 'Cutover', status: 'Completed', assignee: { type: 'agent', name: 'Executor Agent' }, planned_start: '2026-05-07T14:00:00+05:30', planned_end: '2026-05-07T14:40:00+05:30', actual_start: '2026-05-07T14:15:00+05:30', actual_end: '2026-05-07T14:58:00+05:30', duration_mins: 40, predecessors: ['ct_16'], is_critical_path: true, is_milestone: false },
    { id: 'ct_18', order: 18, name: 'Execute RTR Period Close', description: 'Critical RTR test scenario', phase: 'Cutover', status: 'In Progress', assignee: { type: 'agent', name: 'Executor Agent' }, planned_start: '2026-05-07T14:40:00+05:30', planned_end: '2026-05-07T15:30:00+05:30', actual_start: '2026-05-07T14:58:00+05:30', duration_mins: 50, predecessors: ['ct_17'], is_critical_path: true, is_milestone: false },
    
    // Blocked/Failed tasks
    { id: 'ct_19', order: 19, name: 'Execute Intercompany Billing', description: 'IC billing test scenario', phase: 'Cutover', status: 'Failed', assignee: { type: 'agent', name: 'Executor Agent' }, planned_start: '2026-05-07T15:30:00+05:30', planned_end: '2026-05-07T16:15:00+05:30', duration_mins: 45, predecessors: ['ct_18'], is_critical_path: false, is_milestone: false, notes: 'Tax calculation error - Decision pending' },
    { id: 'ct_20', order: 20, name: 'Functional Testing Sign-Off', description: 'QA team approval', phase: 'Cutover', status: 'Blocked', assignee: { type: 'human', name: 'J.Rao', role: 'QA Lead' }, planned_start: '2026-05-07T16:15:00+05:30', planned_end: '2026-05-07T16:45:00+05:30', duration_mins: 30, predecessors: ['ct_18', 'ct_19'], is_critical_path: true, is_milestone: true, blockers: ['ct_19'] },
    
    // Remaining tasks
    { id: 'ct_21', order: 21, name: 'Configure Interfaces', description: 'Enable outbound interfaces', phase: 'Cutover', status: 'Not Started', assignee: { type: 'human', name: 'A.Singh', role: 'Integration Lead' }, planned_start: '2026-05-07T16:45:00+05:30', planned_end: '2026-05-07T17:30:00+05:30', duration_mins: 45, predecessors: ['ct_20'], is_critical_path: true, is_milestone: false },
    { id: 'ct_22', order: 22, name: 'Test Outbound Interfaces', description: 'Verify interface connectivity', phase: 'Cutover', status: 'Not Started', assignee: { type: 'agent', name: 'Executor Agent' }, planned_start: '2026-05-07T17:30:00+05:30', planned_end: '2026-05-07T18:30:00+05:30', duration_mins: 60, predecessors: ['ct_21'], is_critical_path: true, is_milestone: false },
    { id: 'ct_23', order: 23, name: 'Business Go-Live Sign-Off', description: 'Business owner approval', phase: 'Cutover', status: 'Blocked', assignee: { type: 'human', name: 'V.Mehta', role: 'Business Owner' }, planned_start: '2026-05-07T18:30:00+05:30', planned_end: '2026-05-07T19:00:00+05:30', duration_mins: 30, predecessors: ['ct_22'], is_critical_path: true, is_milestone: true, blockers: ['ct_20'] },
    { id: 'ct_24', order: 24, name: 'Enable User Access', description: 'Activate end user accounts', phase: 'Cutover', status: 'Not Started', assignee: { type: 'human', name: 'R.Kumar', role: 'Security Admin' }, planned_start: '2026-05-07T19:00:00+05:30', planned_end: '2026-05-07T19:30:00+05:30', duration_mins: 30, predecessors: ['ct_23'], is_critical_path: true, is_milestone: false },
    { id: 'ct_25', order: 25, name: 'Go-Live Announcement', description: 'Send go-live communication', phase: 'Cutover', status: 'Not Started', assignee: { type: 'human', name: 'P.Sharma', role: 'Project Manager' }, planned_start: '2026-05-07T19:30:00+05:30', planned_end: '2026-05-07T20:00:00+05:30', duration_mins: 30, predecessors: ['ct_24'], is_critical_path: true, is_milestone: true },
  ],
}

// Upcoming Windows
export const MOCK_UPCOMING_WINDOWS: CutoverWindow[] = [
  {
    id: 'cw_2',
    name: 'Star Cement HR Go-Live',
    migration_id: 'mig_2',
    migration_name: 'Star Cement SuccessFactors Migration',
    status: 'Scheduled',
    phase: 'Pre-Cutover',
    planned_start: '2026-05-15T06:00:00+05:30',
    planned_end: '2026-05-16T18:00:00+05:30',
    total_tasks: 28,
    completed_tasks: 0,
    failed_tasks: 0,
    blocked_tasks: 0,
    decision_count: 0,
    tasks: [],
  },
  {
    id: 'cw_3',
    name: 'Star Cement Ariba Go-Live',
    migration_id: 'mig_3',
    migration_name: 'Star Cement Ariba Migration',
    status: 'Scheduled',
    phase: 'Pre-Cutover',
    planned_start: '2026-06-01T06:00:00+05:30',
    planned_end: '2026-06-02T18:00:00+05:30',
    total_tasks: 35,
    completed_tasks: 0,
    failed_tasks: 0,
    blocked_tasks: 0,
    decision_count: 0,
    tasks: [],
  },
]

// Past Windows
export const MOCK_PAST_WINDOWS: CutoverWindow[] = [
  {
    id: 'cw_0',
    name: 'Star Cement Dress Rehearsal 2',
    migration_id: 'mig_1',
    migration_name: 'Star Cement S/4HANA Migration',
    status: 'Completed',
    phase: 'Post-Cutover',
    planned_start: '2026-04-20T06:00:00+05:30',
    planned_end: '2026-04-21T18:00:00+05:30',
    actual_start: '2026-04-20T06:00:00+05:30',
    actual_end: '2026-04-21T16:45:00+05:30',
    total_tasks: 42,
    completed_tasks: 42,
    failed_tasks: 0,
    blocked_tasks: 0,
    decision_count: 2,
    tasks: [],
  },
  {
    id: 'cw_-1',
    name: 'Star Cement Dress Rehearsal 1',
    migration_id: 'mig_1',
    migration_name: 'Star Cement S/4HANA Migration',
    status: 'Completed',
    phase: 'Post-Cutover',
    planned_start: '2026-04-01T06:00:00+05:30',
    planned_end: '2026-04-02T18:00:00+05:30',
    actual_start: '2026-04-01T06:00:00+05:30',
    actual_end: '2026-04-02T20:30:00+05:30',
    total_tasks: 40,
    completed_tasks: 38,
    failed_tasks: 2,
    blocked_tasks: 0,
    decision_count: 5,
    tasks: [],
  },
]

// Decisions for active window
export const MOCK_DECISIONS: Decision[] = [
  {
    id: 'dec_1',
    window_id: 'cw_1',
    title: 'Proceed with IC Billing Workaround',
    description: 'Intercompany billing test failed due to tax calculation error in new tax engine. Need to decide whether to proceed with workaround or delay go-live.',
    severity: 'Critical',
    status: 'Pending',
    raised_by: { name: 'J.Rao', role: 'QA Lead' },
    raised_at: '2026-05-07T15:45:00+05:30',
    impact: 'Blocking functional testing sign-off and downstream go-live tasks',
    options: [
      { label: 'Apply Workaround', description: 'Use manual tax override for IC billing until fix deployed in FPS02', recommended: true },
      { label: 'Delay Go-Live', description: 'Postpone go-live by 1 week to implement proper fix' },
      { label: 'Exclude IC Billing', description: 'Go-live without IC billing, enable post-go-live' },
    ],
  },
  {
    id: 'dec_2',
    window_id: 'cw_1',
    title: 'Material Load Delay Mitigation',
    description: 'Material master load took 8 minutes longer than planned. Subsequent tasks started late.',
    severity: 'Medium',
    status: 'Approved',
    raised_by: { name: 'Data Migration Agent', role: 'Agent' },
    raised_at: '2026-05-07T10:08:00+05:30',
    decided_by: { name: 'P.Sharma', role: 'Project Manager' },
    decided_at: '2026-05-07T10:15:00+05:30',
    rationale: 'Absorbed delay in subsequent parallel tasks, no impact to critical path',
    impact: 'Potential cascading delay to downstream tasks',
    options: [
      { label: 'Absorb Delay', description: 'Continue with adjusted timeline', recommended: true },
      { label: 'Parallel Load', description: 'Split remaining materials into parallel streams' },
    ],
    selected_option: 'Absorb Delay',
  },
  {
    id: 'dec_3',
    window_id: 'cw_1',
    title: 'FI Balance Reconciliation Variance',
    description: 'GL balance reconciliation shows 0.02% variance in AP subledger accounts.',
    severity: 'Low',
    status: 'Approved',
    raised_by: { name: 'Validation Agent', role: 'Agent' },
    raised_at: '2026-05-07T13:05:00+05:30',
    decided_by: { name: 'P.Sharma', role: 'Data Lead' },
    decided_at: '2026-05-07T13:10:00+05:30',
    rationale: 'Variance within acceptable tolerance (0.05%), documented for post-go-live reconciliation',
    impact: 'Minor variance in AP balances',
    options: [
      { label: 'Accept Variance', description: 'Proceed with documented variance', recommended: true },
      { label: 'Investigate', description: 'Pause for root cause analysis' },
    ],
    selected_option: 'Accept Variance',
  },
]

// War Room Participants
export interface WarRoomParticipant {
  id: string
  name: string
  role: string
  status: 'Online' | 'Away' | 'Offline'
  current_task?: string
  avatar_initials: string
}

export const MOCK_WAR_ROOM_PARTICIPANTS: WarRoomParticipant[] = [
  { id: 'u_1', name: 'P.Sharma', role: 'Project Manager', status: 'Online', current_task: 'Monitoring overall progress', avatar_initials: 'PS' },
  { id: 'u_2', name: 'J.Rao', role: 'QA Lead', status: 'Online', current_task: 'Reviewing IC billing failure', avatar_initials: 'JR' },
  { id: 'u_3', name: 'R.Kumar', role: 'Basis Admin', status: 'Online', current_task: 'Standby for snapshot', avatar_initials: 'RK' },
  { id: 'u_4', name: 'S.Patel', role: 'Basis Admin', status: 'Away', avatar_initials: 'SP' },
  { id: 'u_5', name: 'A.Singh', role: 'Integration Lead', status: 'Online', current_task: 'Preparing interface config', avatar_initials: 'AS' },
  { id: 'u_6', name: 'V.Mehta', role: 'Business Owner', status: 'Online', current_task: 'Awaiting sign-off request', avatar_initials: 'VM' },
  { id: 'u_7', name: 'M.Reddy', role: 'Test Engineer', status: 'Online', current_task: 'Monitoring test execution', avatar_initials: 'MR' },
  { id: 'u_8', name: 'K.Iyer', role: 'Data Lead', status: 'Offline', avatar_initials: 'KI' },
]

// War Room Messages
export interface WarRoomMessage {
  id: string
  participant_id: string
  participant_name: string
  message: string
  timestamp: string
  type: 'message' | 'system' | 'alert' | 'decision'
  related_task_id?: string
}

export const MOCK_WAR_ROOM_MESSAGES: WarRoomMessage[] = [
  { id: 'msg_1', participant_id: 'system', participant_name: 'System', message: 'Cutover window started', timestamp: '2026-05-07T06:15:00+05:30', type: 'system' },
  { id: 'msg_2', participant_id: 'u_1', participant_name: 'P.Sharma', message: 'Good morning team. All stations report ready status.', timestamp: '2026-05-07T06:16:00+05:30', type: 'message' },
  { id: 'msg_3', participant_id: 'u_3', participant_name: 'R.Kumar', message: 'Basis ready. ECC transport freeze complete.', timestamp: '2026-05-07T06:17:00+05:30', type: 'message' },
  { id: 'msg_4', participant_id: 'system', participant_name: 'System', message: 'Task "Freeze ECC Transports" completed', timestamp: '2026-05-07T06:12:00+05:30', type: 'system', related_task_id: 'ct_1' },
  { id: 'msg_5', participant_id: 'system', participant_name: 'System', message: 'Data export phase started', timestamp: '2026-05-07T06:15:00+05:30', type: 'system' },
  { id: 'msg_6', participant_id: 'system', participant_name: 'System', message: 'Task "Export Material Masters" completed (5 mins over estimate)', timestamp: '2026-05-07T08:20:00+05:30', type: 'alert', related_task_id: 'ct_4' },
  { id: 'msg_7', participant_id: 'u_1', participant_name: 'P.Sharma', message: 'Noted. Absorbing delay in parallel tasks.', timestamp: '2026-05-07T08:22:00+05:30', type: 'message' },
  { id: 'msg_8', participant_id: 'system', participant_name: 'System', message: 'Decision "Material Load Delay Mitigation" approved', timestamp: '2026-05-07T10:15:00+05:30', type: 'decision' },
  { id: 'msg_9', participant_id: 'u_2', participant_name: 'J.Rao', message: 'Data load validation complete. All counts match.', timestamp: '2026-05-07T10:25:00+05:30', type: 'message' },
  { id: 'msg_10', participant_id: 'system', participant_name: 'System', message: 'Milestone "Validate Load Counts" achieved', timestamp: '2026-05-07T10:22:00+05:30', type: 'system', related_task_id: 'ct_10' },
  { id: 'msg_11', participant_id: 'u_1', participant_name: 'P.Sharma', message: 'Excellent progress team. Moving to functional testing phase.', timestamp: '2026-05-07T13:30:00+05:30', type: 'message' },
  { id: 'msg_12', participant_id: 'system', participant_name: 'System', message: 'Task "Execute Intercompany Billing" FAILED', timestamp: '2026-05-07T15:42:00+05:30', type: 'alert', related_task_id: 'ct_19' },
  { id: 'msg_13', participant_id: 'u_2', participant_name: 'J.Rao', message: 'IC billing failed with tax calculation error. Raising decision request.', timestamp: '2026-05-07T15:45:00+05:30', type: 'message' },
  { id: 'msg_14', participant_id: 'system', participant_name: 'System', message: 'CRITICAL Decision raised: "Proceed with IC Billing Workaround"', timestamp: '2026-05-07T15:46:00+05:30', type: 'decision' },
  { id: 'msg_15', participant_id: 'u_6', participant_name: 'V.Mehta', message: 'What is the business impact of using the workaround?', timestamp: '2026-05-07T15:50:00+05:30', type: 'message' },
]
