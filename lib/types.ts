// SAP Test Assurance - Shared TypeScript Types

export type SAPModule = 'SD' | 'MM' | 'FI' | 'CO' | 'PP' | 'WM' | 'HCM' | 'PM' | 'QM' | 'PS'
export type BusinessProcess = 'OTC' | 'PTP' | 'RTR' | 'HTR' | 'ATR'

// Task states
export type TaskState = 'ToDo' | 'InProgress' | 'Pass' | 'Healed' | 'Fail' | 'Defected'

// Suite states
export type SuiteState = 
  | 'Scheduled' 
  | 'InProgress' 
  | 'Completed_Passed' 
  | 'Completed_Passed_With_Healing' 
  | 'Completed_Partial' 
  | 'Completed_Failed' 
  | 'Signed_Off'

// Severity and Priority
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'informational'
export type Priority = 'p1' | 'p2' | 'p3' | 'p4'

// Defect states
export type DefectState = 
  | 'Open' 
  | 'Triaged' 
  | 'Assigned' 
  | 'In_Fix' 
  | 'Retest_Pending' 
  | 'Retest_In_Progress' 
  | 'Closed' 
  | 'Re_Opened' 
  | 'Cannot_Reproduce' 
  | 'Duplicate' 
  | 'Deferred' 
  | 'Withdrawn'

// Migration types
export type MigrationKind = 'brownfield' | 'greenfield' | 'bluefield' | 'upgrade' | 'rollout'
export type MigrationState = 
  | 'Initiation' 
  | 'Design' 
  | 'Realization' 
  | 'Test_Prep' 
  | 'Cutover' 
  | 'Hypercare' 
  | 'Closed' 
  | 'Cutover_Aborted'

// Transport states
export type TransportState = 
  | 'Captured' 
  | 'Classified' 
  | 'Analyzed' 
  | 'Test_Plan_Ready' 
  | 'In_Test' 
  | 'Test_Passed' 
  | 'Test_Failed' 
  | 'Released_QAS' 
  | 'Released_PROD'

// Impact analysis
export type ImpactVerdict = 'safe' | 'needs_healing' | 'regenerate' | 'broken'

// Assignee types
export type AssigneeClass = 'human' | 'agent'

// Entity interfaces
export interface SAPSystem {
  sid: string
  client: string
  description: string
  isProductive: boolean
  environment: 'DEV' | 'QAS' | 'PRD'
}

export interface TestSuite {
  id: string
  name: string
  state: SuiteState
  module: SAPModule
  businessProcess: BusinessProcess
  totalScenarios: number
  passedScenarios: number
  failedScenarios: number
  healedScenarios: number
  createdAt: string
  updatedAt: string
  assignee?: Assignee
}

export interface TestScenario {
  id: string
  name: string
  state: TaskState
  suiteId: string
  totalCases: number
  passedCases: number
  failedCases: number
  healedCases: number
}

export interface TestCase {
  id: string
  name: string
  state: TaskState
  scenarioId: string
  description: string
  expectedResult: string
  actualResult?: string
  steps: TestStep[]
}

export interface TestStep {
  id: string
  sequence: number
  action: string
  expectedResult: string
  actualResult?: string
  state: TaskState
  screenshot?: string
}

export interface Defect {
  id: string
  title: string
  state: DefectState
  severity: Severity
  priority: Priority
  module: SAPModule
  tcode?: string
  description: string
  stepsToReproduce: string
  assignee?: Assignee
  linkedTestCase?: string
  createdAt: string
  updatedAt: string
}

export interface TransportRequest {
  number: string // Format: <SID>K<6 digits>
  description: string
  state: TransportState
  owner: string
  objects: TransportObject[]
  linkedTestCases: string[]
  createdAt: string
}

export interface TransportObject {
  type: 'PROG' | 'FUGR' | 'FUNC' | 'TABL' | 'VIEW' | 'DTEL' | 'DOMA' | 'CLAS' | 'INTF' | 'MSAG' | 'TRAN' | 'CUS0' | 'CUS1' | 'CUS2'
  name: string
}

export interface SimplificationItem {
  code: string // Format: SAP_NOTE_<7 digits>
  title: string
  category: string
  impact: ImpactVerdict
  affectedObjects: number
  remediationStatus: 'Pending' | 'InProgress' | 'Completed' | 'Deferred'
}

export interface Assignee {
  id: string
  name: string
  email: string
  avatar?: string
  class: AssigneeClass
}

export interface Activity {
  id: string
  action: string
  actor: Assignee
  timestamp: string
  details?: string
}

export interface Comment {
  id: string
  author: Assignee
  content: string
  mentions: string[]
  timestamp: string
}

// Navigation types
export interface AppModule {
  id: string
  name: string
  icon: string
  description: string
  href: string
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
  children?: NavigationItem[]
}
