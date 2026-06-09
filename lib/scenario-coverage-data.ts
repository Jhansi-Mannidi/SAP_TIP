import type { BPScope, CoverageState, ScopeItem } from '@/components/bp-coverage-matrix'
import type { SAPModule } from '@/lib/types'
import type { ScenarioTask } from '@/lib/mock-data'

const BP_CATALOG: Record<string, { name: string; module: SAPModule }> = {
  BD9: { name: 'Standard Sales Order Processing', module: 'SD' },
  BD3: { name: 'Domestic Delivery Processing', module: 'SD' },
  BD4: { name: 'Export Sales Processing', module: 'SD' },
  BD5: { name: 'Intercompany Sales', module: 'SD' },
  BFK: { name: 'Procurement Processing', module: 'MM' },
  BFL: { name: 'Warehouse Management', module: 'MM' },
  BFM: { name: 'Inventory Management', module: 'MM' },
  BCA: { name: 'General Ledger Accounting', module: 'FI' },
  BCB: { name: 'Asset Accounting', module: 'FI' },
  BCC: { name: 'Cash Management', module: 'FI' },
}

const LANDSCAPE_SCOPE_ITEMS: { code: string; coverageState: CoverageState; scenarioCount: number }[] = [
  { code: 'BD9', coverageState: 'covered_passing', scenarioCount: 4 },
  { code: 'BD3', coverageState: 'covered_passing', scenarioCount: 2 },
  { code: 'BD4', coverageState: 'covered_healing', scenarioCount: 1 },
  { code: 'BD5', coverageState: 'covered_failing', scenarioCount: 1 },
  { code: 'BFK', coverageState: 'covered_passing', scenarioCount: 4 },
  { code: 'BFL', coverageState: 'covered_passing', scenarioCount: 1 },
  { code: 'BFM', coverageState: 'not_covered', scenarioCount: 0 },
  { code: 'BCA', coverageState: 'covered_passing', scenarioCount: 3 },
  { code: 'BCB', coverageState: 'covered_passing', scenarioCount: 2 },
  { code: 'BCC', coverageState: 'not_covered', scenarioCount: 0 },
]

const TASK_SCOPE_MAP: Record<string, string[]> = {
  XD03: ['BD9'],
  MM03: ['BD9', 'BFK'],
  VA01: ['BD9'],
  VA03: ['BD9'],
  VL10A: ['BD3'],
  VL02N: ['BD3'],
}

export interface ScenarioCoverageSummary {
  linkedScopeCount: number
  transactionCount: number
  modulesCovered: string[]
  coveragePercent: number
  gapCount: number
}

export interface TransactionCoverageRow {
  tcode: string
  taskName: string
  taskId: string
  scopeItems: string[]
  state: 'covered' | 'partial' | 'gap'
}

function catalogItem(code: string): ScopeItem {
  const meta = BP_CATALOG[code] ?? { name: code, module: 'SD' as SAPModule }
  return {
    id: code,
    code,
    name: meta.name,
    module: meta.module,
    coverageState: 'not_covered',
    scenarioCount: 0,
  }
}

export function buildScenarioCoverageScope(
  scenarioCode: string,
  scenarioName: string,
  linkedCodes: string[],
): BPScope {
  const linkedSet = new Set(linkedCodes)

  const items: ScopeItem[] = LANDSCAPE_SCOPE_ITEMS.map((row) => {
    const meta = BP_CATALOG[row.code] ?? { name: row.code, module: 'SD' as SAPModule }
    const isLinked = linkedSet.has(row.code)

    return {
      id: row.code,
      code: row.code,
      name: meta.name,
      module: meta.module,
      coverageState: isLinked ? 'covered_passing' : row.coverageState,
      scenarioCount: isLinked ? row.scenarioCount + 1 : row.scenarioCount,
      scenarios: isLinked
        ? [{ id: scenarioCode, name: scenarioName, state: 'passing' }]
        : undefined,
    }
  })

  return {
    id: `bp_${scenarioCode.toLowerCase()}`,
    name: 'SAP Best Practice Scope — Scenario Context',
    items,
  }
}

export function getLinkedScopeItems(codes: string[]): ScopeItem[] {
  return codes.map((code) => {
    const base = catalogItem(code)
    const landscape = LANDSCAPE_SCOPE_ITEMS.find((r) => r.code === code)
    return {
      ...base,
      coverageState: 'covered_passing' as CoverageState,
      scenarioCount: landscape?.scenarioCount ?? 1,
    }
  })
}

export function buildTransactionCoverage(
  tasks: ScenarioTask[],
  linkedCodes: string[],
): TransactionCoverageRow[] {
  const linkedSet = new Set(linkedCodes)

  return tasks
    .filter((t) => t.tcode)
    .map((task) => {
      const scopeItems = TASK_SCOPE_MAP[task.tcode!] ?? linkedCodes.slice(0, 1)
      const coveredCount = scopeItems.filter((c) => linkedSet.has(c)).length
      const state: TransactionCoverageRow['state'] =
        coveredCount === scopeItems.length
          ? 'covered'
          : coveredCount > 0
            ? 'partial'
            : 'gap'

      return {
        tcode: task.tcode!,
        taskName: task.name,
        taskId: task.id,
        scopeItems,
        state,
      }
    })
}

export function getScenarioCoverageSummary(
  linkedCodes: string[],
  tasks: ScenarioTask[],
): ScenarioCoverageSummary {
  const linkedItems = getLinkedScopeItems(linkedCodes)
  const modulesCovered = [...new Set(linkedItems.map((i) => i.module))]
  const transactions = buildTransactionCoverage(tasks, linkedCodes)
  const gapCount = transactions.filter((t) => t.state === 'gap').length
  const coveredTx = transactions.filter((t) => t.state === 'covered').length
  const coveragePercent =
    transactions.length > 0 ? Math.round((coveredTx / transactions.length) * 100) : 0

  return {
    linkedScopeCount: linkedCodes.length,
    transactionCount: transactions.length,
    modulesCovered,
    coveragePercent,
    gapCount,
  }
}

export function getCoverageGaps(
  linkedCodes: string[],
  businessProcess: string,
): { title: string; detail: string; priority: 'high' | 'medium' | 'low' }[] {
  const gaps: { title: string; detail: string; priority: 'high' | 'medium' | 'low' }[] = []

  if (!linkedCodes.includes('BD4') && businessProcess === 'OTC') {
    gaps.push({
      title: 'Export sales path not covered',
      detail: 'BD4 Export Sales Processing has no linked scenario. Consider adding an export variant.',
      priority: 'medium',
    })
  }

  if (!linkedCodes.includes('BCC')) {
    gaps.push({
      title: 'Cash management scope gap',
      detail: 'BCC Cash Management is uncovered in the active regression suite for this process area.',
      priority: 'low',
    })
  }

  if (linkedCodes.length < 2) {
    gaps.push({
      title: 'Limited BP scope linkage',
      detail: 'Only one scope item is linked. Map additional scope items to improve traceability.',
      priority: 'medium',
    })
  }

  return gaps
}
