'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Workflow,
  ArrowRight,
  Eye,
  BookOpen,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { MOCK_KB_ARTICLES, type ArticleSource } from '@/lib/kb-mock-data'

// Business Process definitions
const BUSINESS_PROCESSES = [
  { code: 'OTC', name: 'Order-to-Cash', description: 'Sales order processing from quotation to cash receipt', color: 'bg-blue-500' },
  { code: 'PTP', name: 'Procure-to-Pay', description: 'Procurement cycle from requisition to payment', color: 'bg-emerald-500' },
  { code: 'RTR', name: 'Record-to-Report', description: 'Financial accounting and reporting processes', color: 'bg-violet-500' },
  { code: 'HTR', name: 'Hire-to-Retire', description: 'Human capital management lifecycle', color: 'bg-pink-500' },
  { code: 'ATR', name: 'Acquire-to-Retire', description: 'Asset lifecycle management', color: 'bg-amber-500' },
]

// Mock BP-specific articles
const BP_ARTICLES = {
  'OTC': [
    { id: 'bp_art_1', title: 'Order-to-Cash End-to-End Flow', description: 'Complete walkthrough of the OTC process from sales order creation to payment receipt.', viewCount: 1245 },
    { id: 'bp_art_2', title: 'Credit Hold and Release Patterns', description: 'Managing credit blocks and automatic release procedures in the sales process.', viewCount: 892 },
    { id: 'bp_art_3', title: 'ATP and Confirmed Quantities', description: 'Available-to-Promise checking and schedule line confirmation in sales orders.', viewCount: 756 },
    { id: 'bp_art_4', title: 'Pricing Procedure Determination in OTC', description: 'How pricing procedures are determined and applied in the sales process.', viewCount: 623 },
    { id: 'bp_art_5', title: 'Document Flow VBAK → LIKP → VBRK', description: 'Understanding document flow from sales order through delivery to billing.', viewCount: 534 },
  ],
  'PTP': [
    { id: 'bp_art_6', title: 'Procure-to-Pay Process Overview', description: 'End-to-end procurement process from requisition to vendor payment.', viewCount: 1123 },
    { id: 'bp_art_7', title: 'Three-Way Match in Invoice Verification', description: 'PO, GR, and invoice matching procedures in MIRO.', viewCount: 845 },
    { id: 'bp_art_8', title: 'Automatic Payment Program (F110)', description: 'Configuration and execution of the automatic payment run.', viewCount: 678 },
    { id: 'bp_art_9', title: 'Vendor Evaluation Scoring', description: 'Setting up and maintaining vendor evaluation criteria and scores.', viewCount: 456 },
  ],
  'RTR': [
    { id: 'bp_art_10', title: 'Period-End Close Checklist', description: 'Comprehensive checklist for month-end and year-end closing activities.', viewCount: 987 },
    { id: 'bp_art_11', title: 'Foreign Currency Valuation (FAGLF101)', description: 'Running foreign currency valuation for open items and GL accounts.', viewCount: 654 },
    { id: 'bp_art_12', title: 'GR/IR Clearing Process', description: 'Clearing GR/IR differences during period-end close.', viewCount: 523 },
  ],
  'HTR': [
    { id: 'bp_art_13', title: 'Employee Lifecycle in SAP HCM', description: 'From hiring to retirement - the complete employee journey.', viewCount: 456 },
    { id: 'bp_art_14', title: 'Payroll Processing Overview', description: 'Running payroll and handling payroll variants.', viewCount: 345 },
  ],
  'ATR': [
    { id: 'bp_art_15', title: 'Asset Acquisition and Capitalization', description: 'Creating assets and capitalizing from various sources.', viewCount: 345 },
    { id: 'bp_art_16', title: 'Depreciation Run and Year-End', description: 'Running depreciation and closing assets at year-end.', viewCount: 287 },
  ],
}

function ArticleCard({ article }: { article: { id: string; title: string; description: string; viewCount: number } }) {
  return (
    <Link href={`/knowledge-center/domain/processes/${article.id}`}>
      <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
        <CardHeader>
          <CardTitle className="text-base font-medium group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="page-description line-clamp-2 mb-3">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewCount} views
            </span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function BusinessProcessesPage() {
  const [activeTab, setActiveTab] = React.useState('OTC')

  const activeBP = BUSINESS_PROCESSES.find(bp => bp.code === activeTab)
  const articles = BP_ARTICLES[activeTab as keyof typeof BP_ARTICLES] || []

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="page-title">Business Processes</h1>
                <p className="page-description mt-1">
                  Knowledge articles organized by end-to-end business process (OTC, PTP, RTR, HTR, ATR).
                </p>
              </div>
            </div>
          </div>

          {/* Process Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 md:px-6">
              <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0 mb-4">
                {BUSINESS_PROCESSES.map((bp) => (
                  <TabsTrigger
                    key={bp.code}
                    value={bp.code}
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      "px-4 py-2 rounded-md border"
                    )}
                  >
                    <span className="font-mono font-bold mr-2">{bp.code}</span>
                    <span className="hidden sm:inline text-sm">{bp.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeBP && (
            <>
              {/* Process Narrative Card */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center text-white font-mono font-bold",
                      activeBP.color
                    )}>
                      {activeBP.code}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{activeBP.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {activeBP.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {articles.length} articles
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Workflow className="h-4 w-4" />
                      Process flow documentation
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Articles Grid */}
              <StaggerGrid columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" className="gap-4" fast>
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </StaggerGrid>

              {articles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">No articles available</h3>
                  <p className="page-description mt-1">
                    Articles for this business process are being curated.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  )
}
