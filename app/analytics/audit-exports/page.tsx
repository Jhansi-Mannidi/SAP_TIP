'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  Download,
  FileArchive,
  FileJson,
  FileSpreadsheet,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react'

// Mock export history
const MOCK_EXPORTS = [
  { id: 'exp_1', name: 'SOX Compliance Package - Q1 2026', template: 'SOX Compliance Package', format: 'ZIP', size: '24.5 MB', status: 'completed', created_at: '2026-05-07T10:30:00+05:30', created_by: 'P.Sharma' },
  { id: 'exp_2', name: 'Star Cement Migration Evidence', template: 'Migration Go-Live Evidence', format: 'ZIP', size: '156.2 MB', status: 'completed', created_at: '2026-05-06T14:00:00+05:30', created_by: 'P.Sharma' },
  { id: 'exp_3', name: 'UAT Phase 2 Sign-Off Pack', template: 'UAT Sign-Off Package', format: 'PDF', size: '8.3 MB', status: 'completed', created_at: '2026-05-05T11:00:00+05:30', created_by: 'J.Rao' },
  { id: 'exp_4', name: 'Weekly Test Summary - W18', template: 'Custom', format: 'XLSX', size: '2.1 MB', status: 'completed', created_at: '2026-05-04T09:00:00+05:30', created_by: 'M.Reddy' },
]

export default function AuditExportsPage() {
  const [step, setStep] = React.useState(1)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('')
  const [dateRange, setDateRange] = React.useState<string>('last_30')
  const [format, setFormat] = React.useState<string>('zip')
  const [isExporting, setIsExporting] = React.useState(false)
  const [exportProgress, setExportProgress] = React.useState(0)

  const startExport = () => {
    setIsExporting(true)
    setExportProgress(0)
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="page-title">Audit Export Wizard</h1>
          <p className="page-description">Generate comprehensive audit evidence packages</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Wizard Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={cn('flex-1 h-1 rounded', step > s ? 'bg-primary' : 'bg-muted')} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Select Template */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Template</CardTitle>
                  <CardDescription>Choose an audit template or create a custom export</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {['SOX Compliance Package', 'Migration Go-Live Evidence', 'UAT Sign-Off Package', 'ISO 27001 Test Evidence', 'Custom Export'].map((template) => (
                      <div
                        key={template}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors',
                          selectedTemplate === template ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        )}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-center gap-3">
                          <FileArchive className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{template}</span>
                        </div>
                        {selectedTemplate === template && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} disabled={!selectedTemplate}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Configure Options */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Configure Export</CardTitle>
                  <CardDescription>Set date range and output options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last_7">Last 7 Days</SelectItem>
                          <SelectItem value="last_30">Last 30 Days</SelectItem>
                          <SelectItem value="last_90">Last 90 Days</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Output Format</Label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zip">ZIP Archive</SelectItem>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="xlsx">Excel Workbook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Include Sections</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {['Run Records', 'Sign-Off Trail', 'Defect Summary', 'Screenshots', 'Change Log', 'Audit Log'].map((section) => (
                        <label key={section} className="flex items-center gap-2 text-sm">
                          <Checkbox defaultChecked />
                          {section}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={() => setStep(3)}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Generate */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generate Export</CardTitle>
                  <CardDescription>Review and generate your audit package</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Template</span>
                      <span className="font-medium">{selectedTemplate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date Range</span>
                      <span className="font-medium">Last 30 Days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">{format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Size</span>
                      <span className="font-medium">~45 MB</span>
                    </div>
                  </div>

                  {isExporting && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Generating export...</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <Progress value={exportProgress} />
                    </div>
                  )}

                  {exportProgress === 100 && !isExporting && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span>Export complete! Ready for download.</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    {exportProgress === 100 ? (
                      <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Download Package
                      </Button>
                    ) : (
                      <Button onClick={startExport} disabled={isExporting} className="gap-2">
                        {isExporting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileArchive className="h-4 w-4" />
                            Generate Export
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Export History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Exports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_EXPORTS.map((exp) => (
                  <div key={exp.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="p-2 rounded bg-muted">
                      {exp.format === 'ZIP' && <FileArchive className="h-4 w-4" />}
                      {exp.format === 'PDF' && <FileText className="h-4 w-4" />}
                      {exp.format === 'XLSX' && <FileSpreadsheet className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{exp.name}</p>
                      <p className="caption-text">{exp.size} - {exp.created_by}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
