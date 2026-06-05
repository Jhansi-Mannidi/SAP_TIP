// ============================================================================
// KNOWLEDGE BASE MOCK DATA
// ============================================================================

// SAP Module definitions for Domain KB
export interface SAPModule {
  code: string
  name: string
  description: string
  articleCount: number
  topConcepts: string[]
  color: string
  subAreas: { name: string; articleCount: number; children?: { name: string; articleCount: number }[] }[]
}

export const MOCK_SAP_MODULES: SAPModule[] = [
  {
    code: 'SD',
    name: 'Sales & Distribution',
    description: 'Sales order processing, pricing, billing, shipping, and customer master data management.',
    articleCount: 184,
    topConcepts: ['Pricing Procedure', 'Document Flow', 'ATP Check'],
    color: 'bg-blue-500',
    subAreas: [
      { name: 'Sales Documents', articleCount: 42, children: [
        { name: 'Sales Order Types', articleCount: 18 },
        { name: 'Quotations', articleCount: 12 },
        { name: 'Contracts', articleCount: 12 },
      ]},
      { name: 'Pricing', articleCount: 38, children: [
        { name: 'Condition Types', articleCount: 15 },
        { name: 'Pricing Procedures', articleCount: 13 },
        { name: 'Condition Records', articleCount: 10 },
      ]},
      { name: 'Billing', articleCount: 28 },
      { name: 'Credit Management', articleCount: 22 },
      { name: 'Output Determination', articleCount: 18 },
      { name: 'Shipping', articleCount: 24 },
      { name: 'Sales Org Structure', articleCount: 12 },
    ],
  },
  {
    code: 'MM',
    name: 'Materials Management',
    description: 'Procurement, inventory management, invoice verification, and material master data.',
    articleCount: 217,
    topConcepts: ['Procurement Cycle', 'Inventory Valuation', 'Goods Movement'],
    color: 'bg-emerald-500',
    subAreas: [
      { name: 'Purchasing', articleCount: 52 },
      { name: 'Inventory Management', articleCount: 45 },
      { name: 'Invoice Verification', articleCount: 32 },
      { name: 'Material Master', articleCount: 38 },
      { name: 'Vendor Master', articleCount: 28 },
      { name: 'Source Determination', articleCount: 22 },
    ],
  },
  {
    code: 'FI',
    name: 'Financial Accounting',
    description: 'General ledger, accounts payable/receivable, asset accounting, and financial close.',
    articleCount: 152,
    topConcepts: ['Document Posting', 'Period Close', 'Reconciliation'],
    color: 'bg-violet-500',
    subAreas: [
      { name: 'General Ledger', articleCount: 42 },
      { name: 'Accounts Payable', articleCount: 28 },
      { name: 'Accounts Receivable', articleCount: 26 },
      { name: 'Asset Accounting', articleCount: 24 },
      { name: 'Bank Accounting', articleCount: 18 },
      { name: 'Financial Close', articleCount: 14 },
    ],
  },
  {
    code: 'CO',
    name: 'Controlling',
    description: 'Cost center accounting, profit center accounting, internal orders, and profitability analysis.',
    articleCount: 96,
    topConcepts: ['Cost Allocation', 'Profit Center', 'Activity Types'],
    color: 'bg-amber-500',
    subAreas: [
      { name: 'Cost Center Accounting', articleCount: 28 },
      { name: 'Profit Center Accounting', articleCount: 24 },
      { name: 'Internal Orders', articleCount: 22 },
      { name: 'Profitability Analysis', articleCount: 22 },
    ],
  },
  {
    code: 'PP',
    name: 'Production Planning',
    description: 'Demand management, MRP, production orders, and shop floor control.',
    articleCount: 108,
    topConcepts: ['MRP', 'Production Order', 'BOM'],
    color: 'bg-rose-500',
    subAreas: [
      { name: 'Demand Management', articleCount: 18 },
      { name: 'MRP', articleCount: 32 },
      { name: 'Production Orders', articleCount: 28 },
      { name: 'Shop Floor Control', articleCount: 18 },
      { name: 'Capacity Planning', articleCount: 12 },
    ],
  },
  {
    code: 'WM',
    name: 'Warehouse Management',
    description: 'Storage bin management, transfer orders, picking strategies, and inventory counting.',
    articleCount: 67,
    topConcepts: ['Storage Bin', 'Transfer Order', 'Putaway Strategy'],
    color: 'bg-cyan-500',
    subAreas: [
      { name: 'Storage Management', articleCount: 22 },
      { name: 'Transfer Orders', articleCount: 18 },
      { name: 'Picking Strategies', articleCount: 15 },
      { name: 'Inventory Counting', articleCount: 12 },
    ],
  },
  {
    code: 'HCM',
    name: 'Human Capital Management',
    description: 'Personnel administration, organizational management, time management, and payroll.',
    articleCount: 73,
    topConcepts: ['Infotypes', 'Org Units', 'Payroll Schema'],
    color: 'bg-pink-500',
    subAreas: [
      { name: 'Personnel Administration', articleCount: 24 },
      { name: 'Organizational Management', articleCount: 18 },
      { name: 'Time Management', articleCount: 16 },
      { name: 'Payroll', articleCount: 15 },
    ],
  },
  {
    code: 'PM',
    name: 'Plant Maintenance',
    description: 'Equipment management, preventive maintenance, work orders, and maintenance planning.',
    articleCount: 42,
    topConcepts: ['Functional Location', 'Work Order', 'Maintenance Plan'],
    color: 'bg-orange-500',
    subAreas: [
      { name: 'Equipment Management', articleCount: 14 },
      { name: 'Preventive Maintenance', articleCount: 12 },
      { name: 'Work Orders', articleCount: 10 },
      { name: 'Maintenance Planning', articleCount: 6 },
    ],
  },
  {
    code: 'QM',
    name: 'Quality Management',
    description: 'Quality planning, inspection lots, results recording, and quality notifications.',
    articleCount: 38,
    topConcepts: ['Inspection Lot', 'Quality Certificate', 'Sampling'],
    color: 'bg-teal-500',
    subAreas: [
      { name: 'Quality Planning', articleCount: 12 },
      { name: 'Quality Inspection', articleCount: 14 },
      { name: 'Quality Notifications', articleCount: 8 },
      { name: 'Quality Certificates', articleCount: 4 },
    ],
  },
  {
    code: 'PS',
    name: 'Project System',
    description: 'Project planning, work breakdown structures, network activities, and project billing.',
    articleCount: 24,
    topConcepts: ['WBS Element', 'Network', 'Milestone Billing'],
    color: 'bg-indigo-500',
    subAreas: [
      { name: 'Project Planning', articleCount: 8 },
      { name: 'Work Breakdown Structure', articleCount: 6 },
      { name: 'Network Activities', articleCount: 6 },
      { name: 'Project Billing', articleCount: 4 },
    ],
  },
]

// KB Articles
export type ArticleSource = 'SAP Help' | 'SAP Press' | 'Authored' | 'Community'

export interface KBArticle {
  id: string
  title: string
  source: ArticleSource
  module: string
  subArea: string
  snippet: string
  lastUpdated: string
  version: string
  tags: string[]
  viewCount: number
  relatedArticleIds: string[]
  referencedByTestCases: number
}

export const MOCK_KB_ARTICLES: KBArticle[] = [
  // SD Articles
  { id: 'kb_1', title: 'Sales Document Type Configuration', source: 'SAP Help', module: 'SD', subArea: 'Sales Documents', snippet: 'Sales document types control the behavior of sales transactions. Configure document types in SPRO under Sales and Distribution > Sales > Sales Documents > Sales Document Header.', lastUpdated: '2026-05-01T10:00:00+05:30', version: 'v3.2', tags: ['config', 'document-type', 'SPRO'], viewCount: 1247, relatedArticleIds: ['kb_2', 'kb_3'], referencedByTestCases: 23 },
  { id: 'kb_2', title: 'Pricing Procedure Determination', source: 'SAP Help', module: 'SD', subArea: 'Pricing', snippet: 'The pricing procedure is determined through a combination of sales area, document pricing procedure, and customer pricing procedure. This lookup is configured in T683V.', lastUpdated: '2026-04-28T14:30:00+05:30', version: 'v2.8', tags: ['pricing', 'procedure', 'condition'], viewCount: 892, relatedArticleIds: ['kb_1', 'kb_4'], referencedByTestCases: 18 },
  { id: 'kb_3', title: 'Credit Management Workflow in SD', source: 'SAP Press', module: 'SD', subArea: 'Credit Management', snippet: 'Credit management in SD involves automatic credit checks, credit limits, and release procedures. Configure credit control areas in OB45 and assign to company codes.', lastUpdated: '2026-04-25T09:15:00+05:30', version: 'v1.5', tags: ['credit', 'workflow', 'risk'], viewCount: 654, relatedArticleIds: ['kb_1'], referencedByTestCases: 12 },
  { id: 'kb_4', title: 'Schedule Line Categories Explained', source: 'SAP Help', module: 'SD', subArea: 'Sales Documents', snippet: 'Schedule line categories control inventory management, requirements generation, and movement types. Key categories include CP for standard orders and CN for no availability check.', lastUpdated: '2026-04-20T11:00:00+05:30', version: 'v2.1', tags: ['schedule-line', 'inventory', 'atp'], viewCount: 521, relatedArticleIds: ['kb_1', 'kb_5'], referencedByTestCases: 8 },
  { id: 'kb_5', title: 'Output Determination via NACE', source: 'SAP Help', module: 'SD', subArea: 'Output Determination', snippet: 'Output determination uses condition technique to determine output types, media, and timing. Configure output procedures and assign to document types via NACE.', lastUpdated: '2026-04-18T16:45:00+05:30', version: 'v1.9', tags: ['output', 'NACE', 'printing'], viewCount: 478, relatedArticleIds: ['kb_2'], referencedByTestCases: 6 },
  { id: 'kb_6', title: 'ATP and Confirmed Quantities', source: 'SAP Help', module: 'SD', subArea: 'Sales Documents', snippet: 'Available-to-Promise (ATP) check verifies product availability against inventory, receipts, and issues. Configure ATP checking rules in OVZ2.', lastUpdated: '2026-04-15T10:30:00+05:30', version: 'v2.4', tags: ['atp', 'availability', 'confirmation'], viewCount: 823, relatedArticleIds: ['kb_4', 'kb_7'], referencedByTestCases: 15 },
  { id: 'kb_7', title: 'Delivery Document Processing', source: 'SAP Help', module: 'SD', subArea: 'Shipping', snippet: 'Delivery documents are created from sales orders via VL01N. Configure delivery types, item categories, and picking relevance in shipping customizing.', lastUpdated: '2026-04-12T14:00:00+05:30', version: 'v2.0', tags: ['delivery', 'shipping', 'picking'], viewCount: 692, relatedArticleIds: ['kb_1', 'kb_8'], referencedByTestCases: 14 },
  { id: 'kb_8', title: 'Billing Document Creation and Release', source: 'SAP Help', module: 'SD', subArea: 'Billing', snippet: 'Billing documents are created from deliveries or orders via VF01. Configure billing types, account determination, and output for invoice printing.', lastUpdated: '2026-04-10T09:00:00+05:30', version: 'v2.2', tags: ['billing', 'invoice', 'revenue'], viewCount: 745, relatedArticleIds: ['kb_7'], referencedByTestCases: 16 },
  { id: 'kb_9', title: 'Partner Determination in Sales', source: 'SAP Help', module: 'SD', subArea: 'Sales Documents', snippet: 'Partner functions define roles like sold-to, ship-to, bill-to, and payer. Configure partner determination procedures and assign to account groups.', lastUpdated: '2026-04-08T11:30:00+05:30', version: 'v1.7', tags: ['partner', 'customer', 'ship-to'], viewCount: 412, relatedArticleIds: ['kb_1'], referencedByTestCases: 9 },
  { id: 'kb_10', title: 'Sales Organization Assignment', source: 'SAP Help', module: 'SD', subArea: 'Sales Org Structure', snippet: 'Sales organizations represent legal selling entities. Assign sales organizations to company codes, distribution channels, and divisions in enterprise structure.', lastUpdated: '2026-04-05T15:00:00+05:30', version: 'v1.3', tags: ['org-structure', 'sales-org', 'assignment'], viewCount: 356, relatedArticleIds: ['kb_11'], referencedByTestCases: 5 },
  { id: 'kb_11', title: 'Condition Type Configuration', source: 'SAP Help', module: 'SD', subArea: 'Pricing', snippet: 'Condition types define pricing elements like base price, discounts, surcharges, and taxes. Configure in V/06 with calculation type, scale basis, and condition class.', lastUpdated: '2026-04-02T10:00:00+05:30', version: 'v2.5', tags: ['condition', 'pricing', 'discount'], viewCount: 687, relatedArticleIds: ['kb_2', 'kb_4'], referencedByTestCases: 11 },
  { id: 'kb_12', title: 'Third-Party Order Processing', source: 'SAP Press', module: 'SD', subArea: 'Sales Documents', snippet: 'Third-party orders involve direct shipment from vendor to customer. Configure item categories for third-party processing with special procurement type.', lastUpdated: '2026-03-28T14:30:00+05:30', version: 'v1.2', tags: ['third-party', 'drop-ship', 'procurement'], viewCount: 298, relatedArticleIds: ['kb_1', 'kb_7'], referencedByTestCases: 4 },
  
  // MM Articles
  { id: 'kb_13', title: 'Purchase Order Processing Overview', source: 'SAP Help', module: 'MM', subArea: 'Purchasing', snippet: 'Purchase orders can be created manually via ME21N, from requisitions, or from contracts. Configure PO types, item categories, and release strategies.', lastUpdated: '2026-05-02T09:00:00+05:30', version: 'v3.1', tags: ['purchase-order', 'procurement', 'ME21N'], viewCount: 1456, relatedArticleIds: ['kb_14', 'kb_15'], referencedByTestCases: 28 },
  { id: 'kb_14', title: 'Goods Receipt Processing', source: 'SAP Help', module: 'MM', subArea: 'Inventory Management', snippet: 'Goods receipts are posted via MIGO with movement type 101. Configure GR processing with automatic determination of storage location and batch.', lastUpdated: '2026-04-30T11:15:00+05:30', version: 'v2.6', tags: ['goods-receipt', 'MIGO', 'movement-type'], viewCount: 1123, relatedArticleIds: ['kb_13', 'kb_16'], referencedByTestCases: 22 },
  { id: 'kb_15', title: 'Invoice Verification with MIRO', source: 'SAP Help', module: 'MM', subArea: 'Invoice Verification', snippet: 'Logistics invoice verification in MIRO matches invoices against POs and GRs. Configure tolerance limits, blocking reasons, and workflow for discrepancies.', lastUpdated: '2026-04-27T14:00:00+05:30', version: 'v2.3', tags: ['invoice', 'MIRO', 'three-way-match'], viewCount: 867, relatedArticleIds: ['kb_13', 'kb_14'], referencedByTestCases: 19 },
  { id: 'kb_16', title: 'Material Master Data Management', source: 'SAP Help', module: 'MM', subArea: 'Material Master', snippet: 'Material master contains all data needed to manage a material. Organizational levels include plant, storage location, and sales organization views.', lastUpdated: '2026-04-24T10:30:00+05:30', version: 'v2.8', tags: ['material', 'master-data', 'views'], viewCount: 945, relatedArticleIds: ['kb_17'], referencedByTestCases: 17 },
  { id: 'kb_17', title: 'Vendor Evaluation', source: 'SAP Press', module: 'MM', subArea: 'Vendor Master', snippet: 'Vendor evaluation scores suppliers based on price, quality, delivery, and service criteria. Configure main and sub-criteria with weighting factors.', lastUpdated: '2026-04-21T09:45:00+05:30', version: 'v1.4', tags: ['vendor', 'evaluation', 'scoring'], viewCount: 423, relatedArticleIds: ['kb_13'], referencedByTestCases: 7 },
  
  // FI Articles
  { id: 'kb_18', title: 'General Ledger Document Posting', source: 'SAP Help', module: 'FI', subArea: 'General Ledger', snippet: 'GL documents are posted via FB01 or FB50. Configure document types, posting keys, and field status variants for different transaction types.', lastUpdated: '2026-05-03T10:00:00+05:30', version: 'v3.0', tags: ['gl', 'posting', 'FB01'], viewCount: 1087, relatedArticleIds: ['kb_19', 'kb_20'], referencedByTestCases: 24 },
  { id: 'kb_19', title: 'Accounts Payable Processing', source: 'SAP Help', module: 'FI', subArea: 'Accounts Payable', snippet: 'AP processes include invoice posting, payment proposal, and automatic payment program. Configure vendor accounts, payment methods, and house banks.', lastUpdated: '2026-04-29T14:30:00+05:30', version: 'v2.5', tags: ['ap', 'vendor', 'payment'], viewCount: 823, relatedArticleIds: ['kb_15', 'kb_18'], referencedByTestCases: 18 },
  { id: 'kb_20', title: 'Period-End Close Activities', source: 'SAP Help', module: 'FI', subArea: 'Financial Close', snippet: 'Period-end close includes foreign currency valuation, GR/IR clearing, provisions, and balance carryforward. Execute via FAGLF101 and related transactions.', lastUpdated: '2026-04-26T11:00:00+05:30', version: 'v2.1', tags: ['close', 'period-end', 'valuation'], viewCount: 654, relatedArticleIds: ['kb_18'], referencedByTestCases: 14 },
]

// Transaction Codes
export interface TransactionCode {
  tcode: string
  description: string
  module: string
  objectType: 'Dialog Transaction' | 'Report Transaction' | 'Variant Transaction' | 'Parameter Transaction'
  testCoverage: number
  lastTested: string
  kbArticleCount: number
}

export const MOCK_TRANSACTION_CODES: TransactionCode[] = [
  // SD
  { tcode: 'VA01', description: 'Create Sales Order', module: 'SD', objectType: 'Dialog Transaction', testCoverage: 47, lastTested: '2026-05-07T08:00:00+05:30', kbArticleCount: 12 },
  { tcode: 'VA02', description: 'Change Sales Order', module: 'SD', objectType: 'Dialog Transaction', testCoverage: 38, lastTested: '2026-05-07T08:15:00+05:30', kbArticleCount: 8 },
  { tcode: 'VA03', description: 'Display Sales Order', module: 'SD', objectType: 'Dialog Transaction', testCoverage: 22, lastTested: '2026-05-06T14:00:00+05:30', kbArticleCount: 5 },
  { tcode: 'VL01N', description: 'Create Outbound Delivery', module: 'SD', objectType: 'Dialog Transaction', testCoverage: 35, lastTested: '2026-05-07T09:30:00+05:30', kbArticleCount: 9 },
  { tcode: 'VF01', description: 'Create Billing Document', module: 'SD', objectType: 'Dialog Transaction', testCoverage: 28, lastTested: '2026-05-07T10:00:00+05:30', kbArticleCount: 11 },
  { tcode: 'VK11', description: 'Create Condition Records', module: 'SD', objectType: 'Dialog Transaction', testCoverage: 15, lastTested: '2026-05-05T11:00:00+05:30', kbArticleCount: 7 },
  // MM
  { tcode: 'ME21N', description: 'Create Purchase Order', module: 'MM', objectType: 'Dialog Transaction', testCoverage: 42, lastTested: '2026-05-07T07:45:00+05:30', kbArticleCount: 14 },
  { tcode: 'ME22N', description: 'Change Purchase Order', module: 'MM', objectType: 'Dialog Transaction', testCoverage: 31, lastTested: '2026-05-06T16:00:00+05:30', kbArticleCount: 8 },
  { tcode: 'ME23N', description: 'Display Purchase Order', module: 'MM', objectType: 'Dialog Transaction', testCoverage: 18, lastTested: '2026-05-06T14:30:00+05:30', kbArticleCount: 4 },
  { tcode: 'MIRO', description: 'Enter Incoming Invoice', module: 'MM', objectType: 'Dialog Transaction', testCoverage: 25, lastTested: '2026-05-07T11:00:00+05:30', kbArticleCount: 10 },
  { tcode: 'MIGO', description: 'Goods Movement', module: 'MM', objectType: 'Dialog Transaction', testCoverage: 38, lastTested: '2026-05-07T08:30:00+05:30', kbArticleCount: 12 },
  { tcode: 'MM01', description: 'Create Material', module: 'MM', objectType: 'Dialog Transaction', testCoverage: 12, lastTested: '2026-05-04T09:00:00+05:30', kbArticleCount: 8 },
  { tcode: 'MM03', description: 'Display Material', module: 'MM', objectType: 'Dialog Transaction', testCoverage: 28, lastTested: '2026-05-06T10:00:00+05:30', kbArticleCount: 5 },
  { tcode: 'MD04', description: 'Stock/Requirements List', module: 'MM', objectType: 'Report Transaction', testCoverage: 15, lastTested: '2026-05-05T15:00:00+05:30', kbArticleCount: 6 },
  // FI
  { tcode: 'FB01', description: 'Post Document', module: 'FI', objectType: 'Dialog Transaction', testCoverage: 32, lastTested: '2026-05-07T09:00:00+05:30', kbArticleCount: 15 },
  { tcode: 'FB02', description: 'Change Document', module: 'FI', objectType: 'Dialog Transaction', testCoverage: 18, lastTested: '2026-05-06T11:00:00+05:30', kbArticleCount: 6 },
  { tcode: 'FB03', description: 'Display Document', module: 'FI', objectType: 'Dialog Transaction', testCoverage: 24, lastTested: '2026-05-06T14:00:00+05:30', kbArticleCount: 4 },
  { tcode: 'F-02', description: 'Enter G/L Account Posting', module: 'FI', objectType: 'Dialog Transaction', testCoverage: 14, lastTested: '2026-05-05T10:00:00+05:30', kbArticleCount: 8 },
  { tcode: 'FBL5N', description: 'Customer Line Items', module: 'FI', objectType: 'Report Transaction', testCoverage: 21, lastTested: '2026-05-06T16:30:00+05:30', kbArticleCount: 5 },
  // CO
  { tcode: 'KSB1', description: 'Cost Centers: Actual Line Items', module: 'CO', objectType: 'Report Transaction', testCoverage: 8, lastTested: '2026-05-03T14:00:00+05:30', kbArticleCount: 4 },
  { tcode: 'KSV5', description: 'Display Actual Distribution Cycles', module: 'CO', objectType: 'Report Transaction', testCoverage: 5, lastTested: '2026-05-02T11:00:00+05:30', kbArticleCount: 3 },
]

// BP Scope Items
export interface BPScopeItem {
  id: string
  code: string
  title: string
  businessProcess: 'OTC' | 'PTP' | 'RTR' | 'HTR' | 'ATR'
  module: string
  description: string
  tcodesCovered: string[]
  countryVariants: string[]
  industryVariants: string[]
  coverageStatus: 'covered' | 'partial' | 'not-covered'
  processSteps: { order: number; name: string; tcode?: string }[]
}

export const MOCK_BP_SCOPE_ITEMS: BPScopeItem[] = [
  {
    id: 'bp_1',
    code: 'BD9',
    title: 'Sell from Stock',
    businessProcess: 'OTC',
    module: 'SD',
    description: 'Standard sales order processing with inventory fulfillment, delivery, and billing.',
    tcodesCovered: ['VA01', 'VA02', 'VL01N', 'VL02N', 'VF01', 'VF31'],
    countryVariants: ['US', 'DE', 'IN', 'GB'],
    industryVariants: ['Retail', 'Manufacturing', 'Wholesale'],
    coverageStatus: 'covered',
    processSteps: [
      { order: 1, name: 'Create Sales Order', tcode: 'VA01' },
      { order: 2, name: 'Schedule Line Confirmation (ATP)', tcode: 'VA02' },
      { order: 3, name: 'Create Outbound Delivery', tcode: 'VL01N' },
      { order: 4, name: 'Goods Issue', tcode: 'VL02N' },
      { order: 5, name: 'Create Billing Document', tcode: 'VF01' },
      { order: 6, name: 'Invoice Output', tcode: 'VF31' },
      { order: 7, name: 'FI Posting (automatic)' },
    ],
  },
  {
    id: 'bp_2',
    code: 'BD3',
    title: 'Sales Order Processing',
    businessProcess: 'OTC',
    module: 'SD',
    description: 'Core sales order processing including quotations and contracts.',
    tcodesCovered: ['VA01', 'VA02', 'VA21', 'VA41'],
    countryVariants: ['US', 'DE', 'IN'],
    industryVariants: ['Manufacturing'],
    coverageStatus: 'covered',
    processSteps: [
      { order: 1, name: 'Create Quotation', tcode: 'VA21' },
      { order: 2, name: 'Create Sales Order from Quotation', tcode: 'VA01' },
      { order: 3, name: 'Order Confirmation' },
      { order: 4, name: 'Delivery Processing' },
    ],
  },
  {
    id: 'bp_3',
    code: 'BFK',
    title: 'Procurement of Direct Materials',
    businessProcess: 'PTP',
    module: 'MM',
    description: 'Procurement process for direct materials used in production.',
    tcodesCovered: ['ME21N', 'ME22N', 'MIGO', 'MIRO'],
    countryVariants: ['US', 'DE', 'IN', 'CN'],
    industryVariants: ['Manufacturing', 'Automotive'],
    coverageStatus: 'covered',
    processSteps: [
      { order: 1, name: 'Create Purchase Requisition', tcode: 'ME51N' },
      { order: 2, name: 'Create Purchase Order', tcode: 'ME21N' },
      { order: 3, name: 'Goods Receipt', tcode: 'MIGO' },
      { order: 4, name: 'Invoice Verification', tcode: 'MIRO' },
      { order: 5, name: 'Payment Processing' },
    ],
  },
  {
    id: 'bp_4',
    code: 'BD7',
    title: 'Sales Quotation',
    businessProcess: 'OTC',
    module: 'SD',
    description: 'Create and manage sales quotations for customers.',
    tcodesCovered: ['VA21', 'VA22', 'VA23'],
    countryVariants: ['US', 'DE', 'IN'],
    industryVariants: ['Manufacturing', 'Services'],
    coverageStatus: 'partial',
    processSteps: [
      { order: 1, name: 'Create Quotation', tcode: 'VA21' },
      { order: 2, name: 'Send to Customer' },
      { order: 3, name: 'Convert to Sales Order' },
    ],
  },
  {
    id: 'bp_5',
    code: 'BLG',
    title: 'Returns Processing',
    businessProcess: 'OTC',
    module: 'SD',
    description: 'Handle customer returns and credit memo processing.',
    tcodesCovered: ['VA01', 'VL01N', 'VF01'],
    countryVariants: ['US', 'DE', 'IN'],
    industryVariants: ['Retail', 'Manufacturing'],
    coverageStatus: 'covered',
    processSteps: [
      { order: 1, name: 'Create Returns Order', tcode: 'VA01' },
      { order: 2, name: 'Returns Delivery', tcode: 'VL01N' },
      { order: 3, name: 'Credit Memo', tcode: 'VF01' },
    ],
  },
  {
    id: 'bp_6',
    code: 'BLI',
    title: 'Sales with Customer Down Payment',
    businessProcess: 'OTC',
    module: 'SD',
    description: 'Sales order processing with down payment request and clearing.',
    tcodesCovered: ['VA01', 'VF01', 'F-29', 'F-39'],
    countryVariants: ['DE', 'IN'],
    industryVariants: ['Manufacturing', 'Construction'],
    coverageStatus: 'partial',
    processSteps: [
      { order: 1, name: 'Create Sales Order', tcode: 'VA01' },
      { order: 2, name: 'Down Payment Request', tcode: 'VF01' },
      { order: 3, name: 'Down Payment Receipt', tcode: 'F-29' },
      { order: 4, name: 'Final Invoice' },
      { order: 5, name: 'Down Payment Clearing', tcode: 'F-39' },
    ],
  },
  {
    id: 'bp_7',
    code: 'J62',
    title: 'Plan-to-Produce',
    businessProcess: 'RTR',
    module: 'PP',
    description: 'Production planning and execution from demand to finished goods.',
    tcodesCovered: ['MD01', 'CO01', 'CO11N', 'MIGO'],
    countryVariants: ['US', 'DE', 'IN'],
    industryVariants: ['Manufacturing', 'Process'],
    coverageStatus: 'not-covered',
    processSteps: [
      { order: 1, name: 'MRP Run', tcode: 'MD01' },
      { order: 2, name: 'Create Production Order', tcode: 'CO01' },
      { order: 3, name: 'Order Confirmation', tcode: 'CO11N' },
      { order: 4, name: 'Goods Receipt', tcode: 'MIGO' },
    ],
  },
  {
    id: 'bp_8',
    code: '1V8',
    title: 'Make-to-Order',
    businessProcess: 'OTC',
    module: 'PP',
    description: 'Customer-specific production triggered by sales orders.',
    tcodesCovered: ['VA01', 'MD50', 'CO01', 'VL01N'],
    countryVariants: ['US', 'DE'],
    industryVariants: ['Manufacturing', 'Automotive'],
    coverageStatus: 'not-covered',
    processSteps: [
      { order: 1, name: 'Create MTO Sales Order', tcode: 'VA01' },
      { order: 2, name: 'Run MRP for Order', tcode: 'MD50' },
      { order: 3, name: 'Create Production Order', tcode: 'CO01' },
      { order: 4, name: 'Deliver to Customer', tcode: 'VL01N' },
    ],
  },
  // Additional scope items
  { id: 'bp_9', code: 'BN3', title: 'Intercompany Sales Processing', businessProcess: 'OTC', module: 'SD', description: 'Sales between company codes within the same corporate group.', tcodesCovered: ['VA01', 'VL01N', 'VF01', 'ME21N'], countryVariants: ['US', 'DE'], industryVariants: ['Manufacturing'], coverageStatus: 'partial', processSteps: [] },
  { id: 'bp_10', code: 'BNX', title: 'Third Party Order Processing', businessProcess: 'OTC', module: 'SD', description: 'Drop shipment from vendor directly to customer.', tcodesCovered: ['VA01', 'ME21N', 'MIRO', 'VF01'], countryVariants: ['US', 'DE', 'IN'], industryVariants: ['Wholesale', 'Retail'], coverageStatus: 'not-covered', processSteps: [] },
  { id: 'bp_11', code: '2NM', title: 'Period End Close - General Ledger', businessProcess: 'RTR', module: 'FI', description: 'Month-end and year-end closing activities for general ledger.', tcodesCovered: ['FAGLF101', 'F.05', 'ASKB'], countryVariants: ['US', 'DE', 'IN'], industryVariants: [], coverageStatus: 'covered', processSteps: [] },
  { id: 'bp_12', code: '1EF', title: 'Accounts Payable Processing', businessProcess: 'PTP', module: 'FI', description: 'Complete AP process from invoice to payment.', tcodesCovered: ['FB60', 'F110', 'FBL1N'], countryVariants: ['US', 'DE', 'IN', 'GB'], industryVariants: [], coverageStatus: 'covered', processSteps: [] },
  { id: 'bp_13', code: '2V4', title: 'Accounts Receivable Processing', businessProcess: 'OTC', module: 'FI', description: 'AR process including dunning and payment receipt.', tcodesCovered: ['FB70', 'F-28', 'FBL5N'], countryVariants: ['US', 'DE', 'IN'], industryVariants: [], coverageStatus: 'covered', processSteps: [] },
  { id: 'bp_14', code: 'BFX', title: 'Subcontracting', businessProcess: 'PTP', module: 'MM', description: 'Send components to vendor for processing and receive finished goods.', tcodesCovered: ['ME21N', 'MB1B', 'MIGO'], countryVariants: ['DE', 'IN', 'CN'], industryVariants: ['Manufacturing'], coverageStatus: 'not-covered', processSteps: [] },
  { id: 'bp_15', code: '1MJ', title: 'Service Procurement', businessProcess: 'PTP', module: 'MM', description: 'Procurement of services with service entry sheets.', tcodesCovered: ['ME21N', 'ML81N', 'MIRO'], countryVariants: ['US', 'DE', 'IN'], industryVariants: ['Services'], coverageStatus: 'partial', processSteps: [] },
  { id: 'bp_16', code: 'J45', title: 'Physical Inventory', businessProcess: 'RTR', module: 'MM', description: 'Annual physical inventory count and adjustment.', tcodesCovered: ['MI01', 'MI04', 'MI07'], countryVariants: ['US', 'DE', 'IN'], industryVariants: [], coverageStatus: 'covered', processSteps: [] },
  { id: 'bp_17', code: '4G0', title: 'Cost Center Accounting', businessProcess: 'RTR', module: 'CO', description: 'Cost center planning, posting, and reporting.', tcodesCovered: ['KS01', 'KSB1', 'KSPI'], countryVariants: ['US', 'DE', 'IN'], industryVariants: [], coverageStatus: 'partial', processSteps: [] },
  { id: 'bp_18', code: 'BFD', title: 'Free Goods Processing', businessProcess: 'OTC', module: 'SD', description: 'Handle free goods and promotional items in sales.', tcodesCovered: ['VA01', 'VBN1', 'VL01N'], countryVariants: ['US', 'DE', 'IN'], industryVariants: ['Retail', 'FMCG'], coverageStatus: 'covered', processSteps: [] },
]

// Simplification Items
export type SICategory = 'data_dictionary' | 'business_object' | 'transaction' | 'ui' | 'integration' | 'custom_code'
export type SISeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface SimplificationItem {
  id: string
  siCode: string
  title: string
  category: SICategory
  severity: SISeverity
  sapReleaseIntroduced: string
  description: string
  affectedObjectCount: number
  inScopeForActiveMigration: boolean
  sapNoteRefs: string[]
  affectedObjects: { type: string; name: string }[]
  remediationGuidance: string
}

export const MOCK_SIMPLIFICATION_ITEMS: SimplificationItem[] = [
  {
    id: 'si_1',
    siCode: 'SAP_NOTE_2622437',
    title: 'Material Number Length Change to 40 Characters',
    category: 'data_dictionary',
    severity: 'high',
    sapReleaseIntroduced: 'S/4HANA 1809',
    description: 'The material number field MATNR has been extended from 18 to 40 characters. All custom developments referencing MATNR need to be adjusted.',
    affectedObjectCount: 47,
    inScopeForActiveMigration: true,
    sapNoteRefs: ['2622437', '2196980', '2258769'],
    affectedObjects: [
      { type: 'Table', name: 'ZTAB_MATERIAL' },
      { type: 'Program', name: 'Z_MATERIAL_UPLOAD' },
      { type: 'Function Module', name: 'Z_GET_MATERIAL_INFO' },
    ],
    remediationGuidance: '1. Identify all custom objects using MATNR field\n2. Adjust field lengths in tables and structures\n3. Update hardcoded length checks in ABAP code\n4. Test data migration with extended material numbers',
  },
  {
    id: 'si_2',
    siCode: 'SAP_NOTE_2933229',
    title: 'Business Partner Approach Mandatory',
    category: 'business_object',
    severity: 'critical',
    sapReleaseIntroduced: 'S/4HANA 1809',
    description: 'Customer and vendor master data must use Business Partner (BP) approach. Classic customer (KNA1) and vendor (LFA1) transactions are obsolete.',
    affectedObjectCount: 156,
    inScopeForActiveMigration: true,
    sapNoteRefs: ['2933229', '2265093', '2336466'],
    affectedObjects: [
      { type: 'Program', name: 'Z_CUSTOMER_CREATE' },
      { type: 'Program', name: 'Z_VENDOR_REPORT' },
      { type: 'Function Module', name: 'Z_READ_CUSTOMER' },
    ],
    remediationGuidance: '1. Map existing customer/vendor processes to BP\n2. Replace KNA1/LFA1 access with BP APIs\n3. Update custom reports to use BP tables\n4. Migrate master data using MDG or custom migration',
  },
  {
    id: 'si_3',
    siCode: 'SAP_NOTE_2270333',
    title: 'New Cash Management',
    category: 'business_object',
    severity: 'high',
    sapReleaseIntroduced: 'S/4HANA 1610',
    description: 'Classic Cash Management (F111, FF7A, FF7B) is replaced by new SAP Cash Management powered by Bank Communication Management.',
    affectedObjectCount: 23,
    inScopeForActiveMigration: true,
    sapNoteRefs: ['2270333', '2502757'],
    affectedObjects: [
      { type: 'Program', name: 'Z_CASH_POSITION' },
      { type: 'Transaction', name: 'Z_LIQUIDITY' },
    ],
    remediationGuidance: '1. Evaluate new Cash Management features\n2. Map existing custom cash reports\n3. Migrate planning levels and payment program settings\n4. Retrain users on new UI',
  },
  {
    id: 'si_4',
    siCode: 'SAP_NOTE_2442023',
    title: 'Material Ledger Always Active',
    category: 'business_object',
    severity: 'medium',
    sapReleaseIntroduced: 'S/4HANA 1610',
    description: 'Material Ledger is always active in S/4HANA. Actual costing is mandatory and price determination must be configured for all valuation areas.',
    affectedObjectCount: 18,
    inScopeForActiveMigration: true,
    sapNoteRefs: ['2442023', '2364082'],
    affectedObjects: [
      { type: 'Program', name: 'Z_COST_REPORT' },
      { type: 'Table', name: 'ZTAB_COSTING' },
    ],
    remediationGuidance: '1. Analyze current costing settings\n2. Configure material ledger for all plants\n3. Set up actual costing parameters\n4. Migrate historical cost data',
  },
  {
    id: 'si_5',
    siCode: 'SAP_NOTE_2340562',
    title: 'Classic GL to Universal Journal',
    category: 'data_dictionary',
    severity: 'critical',
    sapReleaseIntroduced: 'S/4HANA 1503',
    description: 'All financial postings are stored in ACDOCA (Universal Journal). Classic GL tables (GLT0, BSEG totals) are eliminated.',
    affectedObjectCount: 89,
    inScopeForActiveMigration: true,
    sapNoteRefs: ['2340562', '2230487', '2364362'],
    affectedObjects: [
      { type: 'Program', name: 'Z_GL_BALANCE' },
      { type: 'Program', name: 'Z_ACCOUNT_ANALYSIS' },
      { type: 'Report', name: 'Z_FINANCIAL_STMT' },
    ],
    remediationGuidance: '1. Identify all reports accessing classic GL tables\n2. Rewrite reports to use ACDOCA\n3. Leverage CDS views for reporting\n4. Test all financial reconciliation',
  },
  // Additional SI items
  { id: 'si_6', siCode: 'SAP_NOTE_2267308', title: 'Output Management Migration', category: 'ui', severity: 'medium', sapReleaseIntroduced: 'S/4HANA 1610', description: 'Classic output management (NACE) can be replaced with new Output Management based on BRF+.', affectedObjectCount: 34, inScopeForActiveMigration: false, sapNoteRefs: ['2267308'], affectedObjects: [], remediationGuidance: 'Evaluate new Output Management and migrate forms progressively.' },
  { id: 'si_7', siCode: 'SAP_NOTE_2315290', title: 'Batch Management Simplification', category: 'business_object', severity: 'low', sapReleaseIntroduced: 'S/4HANA 1709', description: 'Batch management at plant level is simplified with improved search and classification.', affectedObjectCount: 12, inScopeForActiveMigration: false, sapNoteRefs: ['2315290'], affectedObjects: [], remediationGuidance: 'Review batch determination logic and update custom batch handling.' },
  { id: 'si_8', siCode: 'SAP_NOTE_2206791', title: 'Credit Management S/4', category: 'business_object', severity: 'medium', sapReleaseIntroduced: 'S/4HANA 1511', description: 'Classic Credit Management (FD32) is replaced by SAP Credit Management integrated with SAP S/4HANA.', affectedObjectCount: 15, inScopeForActiveMigration: true, sapNoteRefs: ['2206791', '2326305'], affectedObjects: [], remediationGuidance: 'Migrate credit master data and configure new credit management.' },
  { id: 'si_9', siCode: 'SAP_NOTE_2498437', title: 'Predictive Material Availability', category: 'integration', severity: 'low', sapReleaseIntroduced: 'S/4HANA 1809', description: 'New ATP logic with predictive analytics for material availability check.', affectedObjectCount: 8, inScopeForActiveMigration: false, sapNoteRefs: ['2498437'], affectedObjects: [], remediationGuidance: 'Enable pMRP and configure predictive ATP settings.' },
  { id: 'si_10', siCode: 'SAP_NOTE_2220005', title: 'Fiori Launchpad Mandatory', category: 'ui', severity: 'info', sapReleaseIntroduced: 'S/4HANA 1610', description: 'SAP Fiori Launchpad is the primary entry point for S/4HANA applications.', affectedObjectCount: 0, inScopeForActiveMigration: true, sapNoteRefs: ['2220005'], affectedObjects: [], remediationGuidance: 'Configure Fiori Launchpad and migrate custom tiles.' },
  { id: 'si_11', siCode: 'SAP_NOTE_2364362', title: 'Profitability Analysis Transition', category: 'business_object', severity: 'high', sapReleaseIntroduced: 'S/4HANA 1709', description: 'Account-based CO-PA is the strategic direction. Costing-based CO-PA has limited support.', affectedObjectCount: 28, inScopeForActiveMigration: true, sapNoteRefs: ['2364362', '2617721'], affectedObjects: [], remediationGuidance: 'Evaluate account-based CO-PA and plan transition from costing-based.' },
  { id: 'si_12', siCode: 'SAP_NOTE_2281981', title: 'Asset Accounting New', category: 'business_object', severity: 'high', sapReleaseIntroduced: 'S/4HANA 1503', description: 'New Asset Accounting posts in real-time to Universal Journal. Parallel valuation is simplified.', affectedObjectCount: 22, inScopeForActiveMigration: true, sapNoteRefs: ['2281981', '2593003'], affectedObjects: [], remediationGuidance: 'Migrate depreciation areas and configure new asset accounting.' },
  { id: 'si_13', siCode: 'SAP_NOTE_2469725', title: 'Extended Warehouse Management Embedded', category: 'business_object', severity: 'medium', sapReleaseIntroduced: 'S/4HANA 1809', description: 'EWM can run embedded in S/4HANA or as decentralized system.', affectedObjectCount: 45, inScopeForActiveMigration: false, sapNoteRefs: ['2469725'], affectedObjects: [], remediationGuidance: 'Decide on EWM deployment model and plan migration from classic WM.' },
  { id: 'si_14', siCode: 'SAP_NOTE_2517054', title: 'Production Planning Simplification', category: 'business_object', severity: 'medium', sapReleaseIntroduced: 'S/4HANA 1709', description: 'Simplified MRP with enhanced performance and new Fiori apps for production planning.', affectedObjectCount: 16, inScopeForActiveMigration: false, sapNoteRefs: ['2517054'], affectedObjects: [], remediationGuidance: 'Enable simplified MRP and test planning scenarios.' },
  { id: 'si_15', siCode: 'SAP_NOTE_2332054', title: 'Custom Code Adaptation', category: 'custom_code', severity: 'critical', sapReleaseIntroduced: 'S/4HANA 1503', description: 'Custom ABAP code must be checked and adapted for S/4HANA compatibility using ATC and custom code migration tools.', affectedObjectCount: 1247, inScopeForActiveMigration: true, sapNoteRefs: ['2332054', '2313884'], affectedObjects: [], remediationGuidance: 'Run ATC checks, prioritize findings, and systematically adapt custom code.' },
]

// Org KB: Organization Structure
export interface OrgStructureNode {
  id: string
  type: 'client' | 'company_code' | 'sales_org' | 'dist_channel' | 'division' | 'plant' | 'storage_location' | 'sales_office' | 'sales_group' | 'purch_org' | 'purch_group'
  code: string
  name: string
  tcodeSource?: string
  lastUpdated: string
  children?: OrgStructureNode[]
  customFields?: { name: string; value: string }[]
}

export const MOCK_ORG_STRUCTURE: OrgStructureNode = {
  id: 'org_1',
  type: 'client',
  code: '100',
  name: 'Star Cement India',
  tcodeSource: 'SCC4',
  lastUpdated: '2026-05-01T10:00:00+05:30',
  children: [
    {
      id: 'org_2',
      type: 'company_code',
      code: 'CC1000',
      name: 'Star Cement Manufacturing',
      tcodeSource: 'T001',
      lastUpdated: '2026-05-01T10:00:00+05:30',
      customFields: [{ name: 'Z_LEGAL_ENTITY', value: 'SCMFG_IN' }],
      children: [
        {
          id: 'org_3',
          type: 'plant',
          code: '1000',
          name: 'Hyderabad Plant',
          tcodeSource: 'T001W',
          lastUpdated: '2026-05-01T10:00:00+05:30',
          children: [
            { id: 'org_4', type: 'storage_location', code: '0001', name: 'Raw Materials', tcodeSource: 'T001L', lastUpdated: '2026-04-15T10:00:00+05:30' },
            { id: 'org_5', type: 'storage_location', code: '0002', name: 'Finished Goods', tcodeSource: 'T001L', lastUpdated: '2026-04-15T10:00:00+05:30' },
            { id: 'org_6', type: 'storage_location', code: '0003', name: 'Spare Parts', tcodeSource: 'T001L', lastUpdated: '2026-04-15T10:00:00+05:30' },
          ],
        },
        {
          id: 'org_7',
          type: 'plant',
          code: '2000',
          name: 'Chennai Plant',
          tcodeSource: 'T001W',
          lastUpdated: '2026-05-01T10:00:00+05:30',
          children: [
            { id: 'org_8', type: 'storage_location', code: '0001', name: 'Raw Materials', tcodeSource: 'T001L', lastUpdated: '2026-04-15T10:00:00+05:30' },
            { id: 'org_9', type: 'storage_location', code: '0002', name: 'Finished Goods', tcodeSource: 'T001L', lastUpdated: '2026-04-15T10:00:00+05:30' },
          ],
        },
        {
          id: 'org_10',
          type: 'plant',
          code: '3000',
          name: 'Pune Plant',
          tcodeSource: 'T001W',
          lastUpdated: '2026-05-01T10:00:00+05:30',
          children: [
            { id: 'org_11', type: 'storage_location', code: '0001', name: 'Raw Materials', tcodeSource: 'T001L', lastUpdated: '2026-04-15T10:00:00+05:30' },
            { id: 'org_12', type: 'storage_location', code: '0002', name: 'Finished Goods', tcodeSource: 'T001L', lastUpdated: '2026-04-15T10:00:00+05:30' },
          ],
        },
      ],
    },
    {
      id: 'org_13',
      type: 'company_code',
      code: 'CC2000',
      name: 'Star Cement Logistics',
      tcodeSource: 'T001',
      lastUpdated: '2026-05-01T10:00:00+05:30',
    },
    {
      id: 'org_14',
      type: 'sales_org',
      code: '1000',
      name: 'Domestic Sales',
      tcodeSource: 'TVKO',
      lastUpdated: '2026-04-20T10:00:00+05:30',
      children: [
        {
          id: 'org_15',
          type: 'dist_channel',
          code: '10',
          name: 'Direct Sales',
          tcodeSource: 'TVTW',
          lastUpdated: '2026-04-20T10:00:00+05:30',
          children: [
            { id: 'org_16', type: 'division', code: '00', name: 'Common Division', tcodeSource: 'TSPA', lastUpdated: '2026-04-20T10:00:00+05:30' },
            { id: 'org_17', type: 'division', code: '01', name: 'Cement Bags', tcodeSource: 'TSPA', lastUpdated: '2026-04-20T10:00:00+05:30' },
            { id: 'org_18', type: 'division', code: '02', name: 'Bulk Cement', tcodeSource: 'TSPA', lastUpdated: '2026-04-20T10:00:00+05:30' },
          ],
        },
        {
          id: 'org_19',
          type: 'dist_channel',
          code: '20',
          name: 'Wholesale',
          tcodeSource: 'TVTW',
          lastUpdated: '2026-04-20T10:00:00+05:30',
        },
      ],
    },
    {
      id: 'org_20',
      type: 'sales_org',
      code: '2000',
      name: 'Export Sales',
      tcodeSource: 'TVKO',
      lastUpdated: '2026-04-20T10:00:00+05:30',
    },
    {
      id: 'org_21',
      type: 'sales_office',
      code: '1001',
      name: 'Hyderabad Sales Office',
      tcodeSource: 'TVBUR',
      lastUpdated: '2026-04-15T10:00:00+05:30',
      children: [
        { id: 'org_22', type: 'sales_group', code: 'G01', name: 'Enterprise Accounts', tcodeSource: 'TVKGR', lastUpdated: '2026-04-15T10:00:00+05:30' },
        { id: 'org_23', type: 'sales_group', code: 'G02', name: 'SMB Accounts', tcodeSource: 'TVKGR', lastUpdated: '2026-04-15T10:00:00+05:30' },
      ],
    },
    {
      id: 'org_24',
      type: 'purch_org',
      code: '1000',
      name: 'Central Procurement',
      tcodeSource: 'T024E',
      lastUpdated: '2026-04-25T10:00:00+05:30',
      children: [
        { id: 'org_25', type: 'purch_group', code: 'G01', name: 'Raw Materials', tcodeSource: 'T024', lastUpdated: '2026-04-25T10:00:00+05:30' },
        { id: 'org_26', type: 'purch_group', code: 'G02', name: 'Packaging', tcodeSource: 'T024', lastUpdated: '2026-04-25T10:00:00+05:30' },
        { id: 'org_27', type: 'purch_group', code: 'G03', name: 'Services', tcodeSource: 'T024', lastUpdated: '2026-04-25T10:00:00+05:30' },
      ],
    },
  ],
}

// Z-Objects Inventory
export type ZObjectKind = 'program' | 'table' | 'class' | 'function_module' | 'interface' | 'cds_view'

export interface ZObject {
  id: string
  name: string
  kind: ZObjectKind
  namespace: string
  description: string
  package: string
  owner: string
  lastModified: string
  state: 'Active' | 'Inactive'
  hasFindings: boolean
  findingsCount: number
  hasTestCoverage: boolean
  testCaseCount: number
  callers: string[]
  callees: string[]
  codeExcerpt?: string
}

export const MOCK_Z_OBJECTS: ZObject[] = [
  {
    id: 'zo_1',
    name: 'Z_INVOICE_AGGREGATOR',
    kind: 'program',
    namespace: 'Z',
    description: 'Custom invoice aggregation report for month-end billing summary',
    package: 'ZFINANCE',
    owner: 'SAPUSER01',
    lastModified: '2026-04-15T14:30:00+05:30',
    state: 'Active',
    hasFindings: true,
    findingsCount: 3,
    hasTestCoverage: true,
    testCaseCount: 2,
    callers: ['Z_MONTHEND_CLOSE', 'Z_FI_REPORTS'],
    callees: ['BAPI_BILLINGDOC_GETLIST', 'Z_GET_TAX_DETAILS'],
    codeExcerpt: `REPORT z_invoice_aggregator.

TABLES: vbrk, vbrp.

DATA: lt_billing TYPE TABLE OF vbrk,
      ls_billing TYPE vbrk,
      lv_total   TYPE netwr.

SELECT * FROM vbrk INTO TABLE lt_billing
  WHERE fkdat BETWEEN p_from AND p_to
    AND bukrs = p_bukrs.

LOOP AT lt_billing INTO ls_billing.
  lv_total = lv_total + ls_billing-netwr.
ENDLOOP.

WRITE: / 'Total Billing:', lv_total.`,
  },
  {
    id: 'zo_2',
    name: 'Z_PRICING_CALC',
    kind: 'function_module',
    namespace: 'Z',
    description: 'Custom pricing calculation with Star Cement-specific discounts',
    package: 'ZSD_PRICING',
    owner: 'SAPUSER02',
    lastModified: '2026-04-20T10:00:00+05:30',
    state: 'Active',
    hasFindings: true,
    findingsCount: 2,
    hasTestCoverage: false,
    testCaseCount: 0,
    callers: ['SAPMV45A', 'Z_ORDER_VALIDATE'],
    callees: ['PRICING_GET_CONDITION', 'Z_DISCOUNT_MATRIX'],
    codeExcerpt: `FUNCTION z_pricing_calc.
*"----------------------------------------------------------------------
*"  IMPORTING
*"     VALUE(IV_MATNR) TYPE MATNR
*"     VALUE(IV_KUNNR) TYPE KUNNR
*"     VALUE(IV_QTY) TYPE KWMENG
*"  EXPORTING
*"     VALUE(EV_PRICE) TYPE NETPR
*"----------------------------------------------------------------------

  DATA: lv_base_price TYPE netpr,
        lv_discount   TYPE p DECIMALS 2.

  " Get base price from condition
  CALL FUNCTION 'PRICING_GET_CONDITION'
    EXPORTING
      i_matnr = iv_matnr
    IMPORTING
      e_price = lv_base_price.

  " Apply Star Cement discount matrix
  CALL FUNCTION 'Z_DISCOUNT_MATRIX'
    EXPORTING
      i_kunnr   = iv_kunnr
      i_qty     = iv_qty
    IMPORTING
      e_discount = lv_discount.

  ev_price = lv_base_price * ( 1 - lv_discount / 100 ).

ENDFUNCTION.`,
  },
  {
    id: 'zo_3',
    name: 'Z_ORDER_VALIDATE',
    kind: 'program',
    namespace: 'Z',
    description: 'Sales order validation exit for Star Cement business rules',
    package: 'ZSD_ORDERS',
    owner: 'SAPUSER01',
    lastModified: '2026-04-25T16:00:00+05:30',
    state: 'Active',
    hasFindings: true,
    findingsCount: 1,
    hasTestCoverage: true,
    testCaseCount: 5,
    callers: ['SAPMV45A'],
    callees: ['Z_PRICING_CALC', 'Z_CREDIT_CHECK', 'BAPI_CUSTOMER_GETDETAIL'],
  },
  {
    id: 'zo_4',
    name: 'ZTAB_MATERIAL',
    kind: 'table',
    namespace: 'Z',
    description: 'Custom material extension table for cement-specific attributes',
    package: 'ZMM_MASTER',
    owner: 'SAPUSER03',
    lastModified: '2026-03-10T09:00:00+05:30',
    state: 'Active',
    hasFindings: false,
    findingsCount: 0,
    hasTestCoverage: false,
    testCaseCount: 0,
    callers: ['Z_MATERIAL_REPORT', 'Z_BATCH_UPDATE'],
    callees: [],
  },
  {
    id: 'zo_5',
    name: 'ZCL_SD_HELPER',
    kind: 'class',
    namespace: 'Z',
    description: 'Helper class for SD document processing',
    package: 'ZSD_UTILS',
    owner: 'SAPUSER02',
    lastModified: '2026-04-28T11:30:00+05:30',
    state: 'Active',
    hasFindings: false,
    findingsCount: 0,
    hasTestCoverage: true,
    testCaseCount: 3,
    callers: ['Z_ORDER_VALIDATE', 'Z_DELIVERY_PROCESS'],
    callees: ['CL_GUI_ALV_GRID'],
  },
  { id: 'zo_6', name: 'Z_CUSTOMER_CREATE', kind: 'program', namespace: 'Z', description: 'Custom customer creation with validation', package: 'ZSD_CUSTOMER', owner: 'SAPUSER01', lastModified: '2026-02-20T14:00:00+05:30', state: 'Active', hasFindings: false, findingsCount: 0, hasTestCoverage: false, testCaseCount: 0, callers: [], callees: ['BAPI_CUSTOMER_CREATE'] },
  { id: 'zo_7', name: 'Z_VENDOR_REPORT', kind: 'program', namespace: 'Z', description: 'Vendor master data report', package: 'ZMM_VENDOR', owner: 'SAPUSER03', lastModified: '2026-03-15T10:00:00+05:30', state: 'Active', hasFindings: false, findingsCount: 0, hasTestCoverage: false, testCaseCount: 0, callers: [], callees: ['LFA1'] },
  { id: 'zo_8', name: 'ZTAB_COSTING', kind: 'table', namespace: 'Z', description: 'Custom costing extension table', package: 'ZCO_COST', owner: 'SAPUSER04', lastModified: '2026-01-10T09:00:00+05:30', state: 'Active', hasFindings: false, findingsCount: 0, hasTestCoverage: false, testCaseCount: 0, callers: ['Z_COST_REPORT'], callees: [] },
  { id: 'zo_9', name: 'Z_READ_CUSTOMER', kind: 'function_module', namespace: 'Z', description: 'Read customer master data wrapper', package: 'ZSD_CUSTOMER', owner: 'SAPUSER01', lastModified: '2026-02-28T16:30:00+05:30', state: 'Active', hasFindings: false, findingsCount: 0, hasTestCoverage: false, testCaseCount: 0, callers: ['Z_ORDER_VALIDATE'], callees: ['KNA1'] },
  { id: 'zo_10', name: 'Z_GL_BALANCE', kind: 'program', namespace: 'Z', description: 'GL account balance report', package: 'ZFI_GL', owner: 'SAPUSER04', lastModified: '2026-04-01T11:00:00+05:30', state: 'Active', hasFindings: false, findingsCount: 0, hasTestCoverage: false, testCaseCount: 0, callers: [], callees: ['GLT0', 'BSEG'] },
  { id: 'zo_11', name: 'Z_COST_REPORT', kind: 'program', namespace: 'Z', description: 'Cost center report', package: 'ZCO_COST', owner: 'SAPUSER04', lastModified: '2026-03-20T14:00:00+05:30', state: 'Active', hasFindings: false, findingsCount: 0, hasTestCoverage: false, testCaseCount: 0, callers: [], callees: ['ZTAB_COSTING', 'CSKS'] },
  { id: 'zo_12', name: 'ZIF_SD_DOCUMENT', kind: 'interface', namespace: 'Z', description: 'Interface for SD document handling', package: 'ZSD_UTILS', owner: 'SAPUSER02', lastModified: '2026-04-10T09:00:00+05:30', state: 'Active', hasFindings: false, findingsCount: 0, hasTestCoverage: false, testCaseCount: 0, callers: ['ZCL_SD_HELPER'], callees: [] },
]

// Ingested Documents
export type IngestState = 'Queued' | 'Processing' | 'Embedded' | 'Indexed' | 'Failed'
export type DocClassification = 'Process Doc' | 'Work Instruction' | 'Training Material' | 'Other'
export type PIILevel = 'none' | 'low' | 'medium' | 'high'

export interface IngestedDocument {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string
  ingestState: IngestState
  failureReason?: string
  embeddingStatus: string
  pageCount: number
  classification: DocClassification
  piiLevel: PIILevel
  uploadedBy: string
}

export const MOCK_INGESTED_DOCUMENTS: IngestedDocument[] = [
  { id: 'doc_1', fileName: 'Star_Cement_OTC_Process_Flow.pdf', fileType: 'pdf', fileSize: 2450000, uploadedAt: '2026-05-05T10:00:00+05:30', ingestState: 'Indexed', embeddingStatus: '156 chunks embedded', pageCount: 24, classification: 'Process Doc', piiLevel: 'none', uploadedBy: 'P.Sharma' },
  { id: 'doc_2', fileName: 'MM_Work_Instructions_v2.docx', fileType: 'docx', fileSize: 1820000, uploadedAt: '2026-05-04T14:30:00+05:30', ingestState: 'Indexed', embeddingStatus: '89 chunks embedded', pageCount: 18, classification: 'Work Instruction', piiLevel: 'low', uploadedBy: 'J.Rao' },
  { id: 'doc_3', fileName: 'FI_Month_End_Close_Procedure.pdf', fileType: 'pdf', fileSize: 3200000, uploadedAt: '2026-05-03T09:15:00+05:30', ingestState: 'Processing', embeddingStatus: 'Embedding in progress...', pageCount: 32, classification: 'Process Doc', piiLevel: 'none', uploadedBy: 'M.Reddy' },
  { id: 'doc_4', fileName: 'SD_Training_Guide_2026.pdf', fileType: 'pdf', fileSize: 5600000, uploadedAt: '2026-05-02T11:00:00+05:30', ingestState: 'Indexed', embeddingStatus: '312 chunks embedded', pageCount: 68, classification: 'Training Material', piiLevel: 'none', uploadedBy: 'K.Iyer' },
  { id: 'doc_5', fileName: 'Vendor_Approval_Matrix.xlsx', fileType: 'xlsx', fileSize: 450000, uploadedAt: '2026-05-01T15:45:00+05:30', ingestState: 'Indexed', embeddingStatus: '23 chunks embedded', pageCount: 5, classification: 'Other', piiLevel: 'low', uploadedBy: 'S.Kumar' },
  { id: 'doc_6', fileName: 'Customer_Master_Export.pdf', fileType: 'pdf', fileSize: 8900000, uploadedAt: '2026-04-30T10:00:00+05:30', ingestState: 'Indexed', embeddingStatus: '445 chunks embedded', pageCount: 120, classification: 'Other', piiLevel: 'high', uploadedBy: 'P.Sharma' },
  { id: 'doc_7', fileName: 'Confidential_HR_Data.pdf', fileType: 'pdf', fileSize: 1200000, uploadedAt: '2026-04-29T09:00:00+05:30', ingestState: 'Failed', failureReason: 'Encrypted PDF — password required', embeddingStatus: 'Failed', pageCount: 0, classification: 'Other', piiLevel: 'high', uploadedBy: 'Admin' },
  { id: 'doc_8', fileName: 'Production_Planning_BPMN.xml', fileType: 'xml', fileSize: 180000, uploadedAt: '2026-04-28T14:00:00+05:30', ingestState: 'Processing', embeddingStatus: 'Parsing BPMN...', pageCount: 1, classification: 'Process Doc', piiLevel: 'none', uploadedBy: 'M.Reddy' },
]

// KB Admin: Embedding Collections
export interface EmbeddingCollection {
  id: string
  name: string
  layer: 'Domain' | 'BP' | 'Org'
  itemCount: number
  embeddingCount: number
  embeddingModel: string
  lastReindex: string
  health: 'healthy' | 'degraded' | 'unhealthy'
}

export const MOCK_EMBEDDING_COLLECTIONS: EmbeddingCollection[] = [
  { id: 'col_1', name: 'domain_sap_modules', layer: 'Domain', itemCount: 1001, embeddingCount: 8945, embeddingModel: 'voltus-embed-large', lastReindex: '2026-05-06T02:00:00+05:30', health: 'healthy' },
  { id: 'col_2', name: 'domain_transactions', layer: 'Domain', itemCount: 856, embeddingCount: 3424, embeddingModel: 'voltus-embed-large', lastReindex: '2026-05-06T02:00:00+05:30', health: 'healthy' },
  { id: 'col_3', name: 'bp_scope_items', layer: 'BP', itemCount: 412, embeddingCount: 2884, embeddingModel: 'voltus-embed-large', lastReindex: '2026-05-05T02:00:00+05:30', health: 'healthy' },
  { id: 'col_4', name: 'bp_simplification_items', layer: 'BP', itemCount: 287, embeddingCount: 1722, embeddingModel: 'voltus-embed-large', lastReindex: '2026-05-05T02:00:00+05:30', health: 'healthy' },
  { id: 'col_5', name: 'org_structure', layer: 'Org', itemCount: 156, embeddingCount: 624, embeddingModel: 'voltus-embed-large', lastReindex: '2026-05-07T02:00:00+05:30', health: 'healthy' },
  { id: 'col_6', name: 'org_zobjects', layer: 'Org', itemCount: 1247, embeddingCount: 4988, embeddingModel: 'voltus-embed-large', lastReindex: '2026-05-04T02:00:00+05:30', health: 'degraded' },
  { id: 'col_7', name: 'org_documents', layer: 'Org', itemCount: 89, embeddingCount: 1423, embeddingModel: 'voltus-embed-large', lastReindex: '2026-05-07T06:00:00+05:30', health: 'healthy' },
]

// KB Admin: Ingestion Pipelines
export interface IngestionPipeline {
  id: string
  name: string
  source: string
  lastRun: string
  schedule: string
  itemsProcessed: number
  errorCount: number
  state: 'Active' | 'Paused' | 'Failed'
}

export const MOCK_INGESTION_PIPELINES: IngestionPipeline[] = [
  { id: 'pipe_1', name: 'SAP Help Sync', source: 'help.sap.com', lastRun: '2026-05-07T02:00:00+05:30', schedule: 'Daily at 02:00', itemsProcessed: 156, errorCount: 0, state: 'Active' },
  { id: 'pipe_2', name: 'BP Catalog Refresh', source: 'SAP Best Practice Explorer', lastRun: '2026-05-06T03:00:00+05:30', schedule: 'Weekly on Sunday', itemsProcessed: 412, errorCount: 2, state: 'Active' },
  { id: 'pipe_3', name: 'Customer Doc Ingest', source: 'Upload Queue', lastRun: '2026-05-07T10:30:00+05:30', schedule: 'On-demand', itemsProcessed: 8, errorCount: 1, state: 'Active' },
  { id: 'pipe_4', name: 'ATC Rule Sync', source: 'SAP ATC Rules', lastRun: '2026-05-05T04:00:00+05:30', schedule: 'Weekly on Monday', itemsProcessed: 187, errorCount: 0, state: 'Active' },
  { id: 'pipe_5', name: 'SAP Config Sync', source: 'iHub (STA-100)', lastRun: '2026-05-07T06:00:00+05:30', schedule: 'Daily at 06:00', itemsProcessed: 892, errorCount: 0, state: 'Active' },
  { id: 'pipe_6', name: 'Transport History', source: 'iHub (STA-100)', lastRun: '2026-05-01T02:00:00+05:30', schedule: 'Paused', itemsProcessed: 0, errorCount: 0, state: 'Paused' },
]

// Organization KB: Articles
export interface OrgArticle {
  id: string
  title: string
  type: 'runbook' | 'sop' | 'guideline' | 'policy'
  description: string
  module: string
  author: string
  lastUpdated: string
  visibility: 'private' | 'team' | 'org'
  tags: string[]
}

export const MOCK_ORG_ARTICLES: OrgArticle[] = [
  { id: 'org_art_1', title: 'Sales Order Creation Runbook', type: 'runbook', description: 'Step-by-step guide for creating sales orders in the Star Cement SAP environment', module: 'SD', author: 'Priya Sharma', lastUpdated: '2026-05-05T10:00:00+05:30', visibility: 'org', tags: ['sales', 'order', 'VA01'] },
  { id: 'org_art_2', title: 'Month-End Close Procedure', type: 'sop', description: 'Standard operating procedure for financial month-end close activities', module: 'FI', author: 'Rajesh Kumar', lastUpdated: '2026-05-01T14:00:00+05:30', visibility: 'org', tags: ['close', 'period-end', 'finance'] },
  { id: 'org_art_3', title: 'Vendor Master Data Guidelines', type: 'guideline', description: 'Guidelines for creating and maintaining vendor master data', module: 'MM', author: 'Anita Patel', lastUpdated: '2026-04-28T09:00:00+05:30', visibility: 'team', tags: ['vendor', 'master-data', 'procurement'] },
  { id: 'org_art_4', title: 'Credit Check Override Policy', type: 'policy', description: 'Policy document for handling credit check overrides in sales orders', module: 'SD', author: 'Vikram Singh', lastUpdated: '2026-04-25T11:00:00+05:30', visibility: 'org', tags: ['credit', 'policy', 'approval'] },
  { id: 'org_art_5', title: 'Material Master Extension Guide', type: 'runbook', description: 'How to extend materials to new plants and storage locations', module: 'MM', author: 'Deepak Mehta', lastUpdated: '2026-04-20T16:00:00+05:30', visibility: 'org', tags: ['material', 'extension', 'plant'] },
  { id: 'org_art_6', title: 'Goods Receipt Tolerance Settings', type: 'guideline', description: 'Configuration guidelines for GR tolerance in procurement', module: 'MM', author: 'Priya Sharma', lastUpdated: '2026-04-18T10:00:00+05:30', visibility: 'team', tags: ['tolerance', 'goods-receipt', 'config'] },
]

// Organization KB: Z-Objects (Custom ABAP objects)
export interface OrgZObject {
  id: string
  name: string
  type: 'report' | 'function' | 'class' | 'table' | 'enhancement' | 'badi'
  description: string
  package: string
  module: string
  testCoverage: number
  lastModified: string
  author: string
  usedBy: string[]
}

export const MOCK_ORG_ZOBJECTS: OrgZObject[] = [
  { id: 'zobj_1', name: 'ZSALES_ORDER_REPORT', type: 'report', description: 'Custom sales order report with enhanced filtering', package: 'ZSD_REPORTS', module: 'SD', testCoverage: 78, lastModified: '2026-05-03T14:00:00+05:30', author: 'Rajesh Kumar', usedBy: ['TC_SD_001', 'TC_SD_015'] },
  { id: 'zobj_2', name: 'ZCL_PRICING_HELPER', type: 'class', description: 'Helper class for custom pricing calculations', package: 'ZSD_PRICING', module: 'SD', testCoverage: 85, lastModified: '2026-04-28T10:00:00+05:30', author: 'Priya Sharma', usedBy: ['TC_SD_010', 'TC_SD_011', 'TC_SD_012'] },
  { id: 'zobj_3', name: 'Z_PO_APPROVAL_BADI', type: 'badi', description: 'BAdI implementation for PO approval workflow', package: 'ZMM_WORKFLOW', module: 'MM', testCoverage: 62, lastModified: '2026-04-25T16:00:00+05:30', author: 'Vikram Singh', usedBy: ['TC_MM_005'] },
  { id: 'zobj_4', name: 'ZVENDOR_MASTER_TABLE', type: 'table', description: 'Extension table for vendor master custom fields', package: 'ZMM_MASTER', module: 'MM', testCoverage: 45, lastModified: '2026-04-20T09:00:00+05:30', author: 'Anita Patel', usedBy: [] },
  { id: 'zobj_5', name: 'ZFI_POSTING_ENH', type: 'enhancement', description: 'Enhancement for FI document posting validations', package: 'ZFI_POSTING', module: 'FI', testCoverage: 92, lastModified: '2026-05-01T11:00:00+05:30', author: 'Deepak Mehta', usedBy: ['TC_FI_001', 'TC_FI_002', 'TC_FI_003'] },
  { id: 'zobj_6', name: 'ZFM_MATERIAL_CHECK', type: 'function', description: 'Function module for material availability check', package: 'ZMM_AVAIL', module: 'MM', testCoverage: 71, lastModified: '2026-04-18T14:00:00+05:30', author: 'Rajesh Kumar', usedBy: ['TC_MM_010', 'TC_MM_011'] },
  { id: 'zobj_7', name: 'ZINVOICE_PRINT_REPORT', type: 'report', description: 'Custom invoice printing with company logo', package: 'ZSD_OUTPUT', module: 'SD', testCoverage: 56, lastModified: '2026-04-15T10:00:00+05:30', author: 'Priya Sharma', usedBy: ['TC_SD_020'] },
  { id: 'zobj_8', name: 'ZCL_DELIVERY_HANDLER', type: 'class', description: 'Class for custom delivery processing logic', package: 'ZSD_DELIVERY', module: 'SD', testCoverage: 88, lastModified: '2026-05-05T09:00:00+05:30', author: 'Vikram Singh', usedBy: ['TC_SD_025', 'TC_SD_026'] },
]

// Best Practice KB: Articles
export interface BPArticle {
  id: string
  title: string
  type: 'guide' | 'tutorial' | 'reference' | 'whitepaper'
  scopeItemId: string
  description: string
  module: string
  author: string
  lastUpdated: string
  tags: string[]
}

export const MOCK_BP_ARTICLES: BPArticle[] = [
  { id: 'bp_art_1', title: 'Order-to-Cash Process Guide', type: 'guide', scopeItemId: 'si_1', description: 'Complete guide for implementing O2C process in S/4HANA', module: 'SD', author: 'SAP Best Practices', lastUpdated: '2026-04-15T10:00:00+05:30', tags: ['o2c', 'sales', 'implementation'] },
  { id: 'bp_art_2', title: 'Procure-to-Pay Tutorial', type: 'tutorial', scopeItemId: 'si_2', description: 'Step-by-step tutorial for P2P process configuration', module: 'MM', author: 'SAP Best Practices', lastUpdated: '2026-04-10T14:00:00+05:30', tags: ['p2p', 'procurement', 'tutorial'] },
  { id: 'bp_art_3', title: 'Financial Close Reference', type: 'reference', scopeItemId: 'si_3', description: 'Reference documentation for financial close activities', module: 'FI', author: 'SAP Best Practices', lastUpdated: '2026-04-08T09:00:00+05:30', tags: ['close', 'finance', 'reference'] },
  { id: 'bp_art_4', title: 'Inventory Management Whitepaper', type: 'whitepaper', scopeItemId: 'si_4', description: 'Best practices for inventory management in S/4HANA', module: 'MM', author: 'SAP Best Practices', lastUpdated: '2026-04-05T11:00:00+05:30', tags: ['inventory', 'warehouse', 'whitepaper'] },
  { id: 'bp_art_5', title: 'Billing Process Guide', type: 'guide', scopeItemId: 'si_5', description: 'Comprehensive guide for billing document processing', module: 'SD', author: 'SAP Best Practices', lastUpdated: '2026-04-01T16:00:00+05:30', tags: ['billing', 'invoice', 'revenue'] },
]
