export type PipelineStageState = 'pending' | 'in_progress' | 'done' | 'failed' | 'skipped'

export interface PipelineStageMeta {
  label: string
  description: string
  inputLabel: string
  outputLabel: string
  defaultInput: string
  defaultOutput: string
  details: Record<string, string>
  pendingHint: string
}

export const SATIP_STAGE_METADATA: PipelineStageMeta[] = [
  {
    label: 'Transport Extraction',
    description:
      'Pull transport objects and metadata from the connected SAP system via RFC and STMS connectors.',
    inputLabel: 'Source transport',
    outputLabel: 'Extracted objects',
    defaultInput: 'TRKORR DEVK900123 · STMS queue entry',
    defaultOutput: 'E070/E071/E071K · 47 objects indexed',
    details: { connector: 'RFC', avg_duration: '2m 14s', objects: '47' },
    pendingHint: 'Waiting for STMS capture or manual TR import to begin extraction.',
  },
  {
    label: 'Object Classification',
    description:
      'Classify each object by type, module, and change category using the Classification Agent.',
    inputLabel: 'Object list',
    outputLabel: 'Per-object classification',
    defaultInput: '47 transport objects · raw ABAP metadata',
    defaultOutput: 'Z-programs: 12 · Dialog TX: 8 · Customizing: 27',
    details: { agent: 'Classification', confidence: '94%', z_objects: '12' },
    pendingHint: 'Runs after extraction completes. Objects are queued for agent classification.',
  },
  {
    label: 'Impact Analysis',
    description:
      'Correlate changed objects with ScreenModels and linked tests to produce per-test verdicts.',
    inputLabel: 'ScreenModels + objects',
    outputLabel: 'Per-test verdicts',
    defaultInput: 'Classified objects · 156 linked test cases',
    defaultOutput: 'Safe: 98 · Regenerate: 42 · Broken: 16',
    details: { linked_tests: '156', safe: '98', regenerate: '42' },
    pendingHint: 'Impact Analysis Agent will map object changes to affected test scenarios.',
  },
  {
    label: 'Test Plan Generation',
    description:
      'Build a regeneration and execution plan from impact verdicts with human-review gates.',
    inputLabel: 'Impact verdicts',
    outputLabel: 'Regeneration list',
    defaultInput: '42 regenerate · 16 broken verdicts',
    defaultOutput: 'Test plan v3 · 58 cases scheduled',
    details: { regen_cases: '42', review_required: '8', plan_version: 'v3' },
    pendingHint: 'Test Plan Generator creates the execution scope once impact analysis finishes.',
  },
  {
    label: 'Test Generation / Regeneration',
    description:
      'Regenerate or create Test IRs for affected scenarios using the Test Generation Agent.',
    inputLabel: 'Regeneration list',
    outputLabel: 'New Test IRs',
    defaultInput: '58 cases in regeneration queue',
    defaultOutput: '42 IRs promoted · 16 pending review',
    details: { generated: '42', pending_review: '16', agent: 'Test Generation' },
    pendingHint: 'IR drafts are created from the approved test plan and queued for promotion.',
  },
  {
    label: 'Test Execution',
    description:
      'Execute linked test suites on runner pools against the target SAP landscape.',
    inputLabel: 'Test suite + IRs',
    outputLabel: 'Execution results',
    defaultInput: 'SUITE_OTC_REGRESSION · 58 cases · QAS',
    defaultOutput: 'Passed: 51 · Failed: 5 · In progress: 2',
    details: { runners: '6', pass_rate: '91%', landscape: 'QAS' },
    pendingHint: 'Queue execution once IRs are approved and runners are available.',
  },
  {
    label: 'Self-Healing Loop',
    description:
      'Apply AI healing proposals for failed steps within configured confidence thresholds.',
    inputLabel: 'Execution failures',
    outputLabel: 'Heal events',
    defaultInput: '5 failed steps · 12 healing candidates',
    defaultOutput: '8 auto-healed · 2 escalated to human',
    details: { auto_healed: '8', escalated: '2', min_confidence: '85%' },
    pendingHint: 'Healing Agent activates when failures are detected during execution.',
  },
  {
    label: 'Delta Scoring',
    description:
      'Score transport risk and test readiness from execution, healing, and coverage signals.',
    inputLabel: 'Execution + heal results',
    outputLabel: 'Scorecard',
    defaultInput: 'Run results · heal events · coverage map',
    defaultOutput: 'Risk score: 23 · Readiness: 87%',
    details: { risk_score: '23', readiness: '87%', blockers: '1' },
    pendingHint: 'Scorecard is computed after execution and healing stages complete.',
  },
  {
    label: 'Live Dashboard Projection',
    description:
      'Project final assurance state to transport dashboard tiles and CALM bindings.',
    inputLabel: 'Scorecard',
    outputLabel: 'Dashboard tiles',
    defaultInput: 'Assurance scorecard · binding refs',
    defaultOutput: 'Tiles updated · CALM sync queued',
    details: { tiles_updated: '12', calm_sync: 'queued', latency: '< 30s' },
    pendingHint: 'Dashboard projection runs once the scorecard is finalized.',
  },
]

const STATUS_LABELS: Record<PipelineStageState, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  done: 'Completed',
  failed: 'Failed',
  skipped: 'Skipped',
}

export function getStageStatusLabel(state: PipelineStageState): string {
  return STATUS_LABELS[state]
}
