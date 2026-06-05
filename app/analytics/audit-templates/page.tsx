'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { 
  FileCheck,
  Search,
  Plus,
  Download,
  Eye,
  Copy,
  Edit,
  Trash2,
  CheckCircle,
  Shield,
  FileText,
  Building2,
} from 'lucide-react'

// Mock audit templates
const MOCK_TEMPLATES = [
  { 
    id: 'tpl_1', 
    name: 'SOX Compliance Package', 
    description: 'Complete evidence package for SOX audit requirements including run records, sign-off trail, and defect closure documentation.',
    sections: ['Run Records', 'Sign-Off Trail', 'Defect Closures', 'Change Log'],
    usage_count: 24,
    last_used: '2026-05-06',
    compliance: 'SOX',
    created_by: 'System',
  },
  { 
    id: 'tpl_2', 
    name: 'Migration Go-Live Evidence', 
    description: 'Evidence package for S/4HANA migration go-live approval including all phase gate sign-offs and test results.',
    sections: ['Phase Gate Sign-Offs', 'Final Test Results', 'Defect Summary', 'Risk Assessment'],
    usage_count: 8,
    last_used: '2026-05-04',
    compliance: 'Internal',
    created_by: 'P.Sharma',
  },
  { 
    id: 'tpl_3', 
    name: 'ISO 27001 Test Evidence', 
    description: 'Security testing evidence for ISO 27001 certification including access control validation and data handling tests.',
    sections: ['Security Test Results', 'Access Control Validation', 'Data Handling Tests', 'Audit Log'],
    usage_count: 12,
    last_used: '2026-04-28',
    compliance: 'ISO 27001',
    created_by: 'System',
  },
  { 
    id: 'tpl_4', 
    name: 'UAT Sign-Off Package', 
    description: 'User acceptance testing evidence for business stakeholder sign-off.',
    sections: ['UAT Test Results', 'Business Sign-Offs', 'Open Issues', 'Screenshots'],
    usage_count: 31,
    last_used: '2026-05-07',
    compliance: 'Internal',
    created_by: 'J.Rao',
  },
  { 
    id: 'tpl_5', 
    name: 'Cutover Completion Report', 
    description: 'Complete cutover window documentation including task completion, decisions, and incident log.',
    sections: ['Task Completion', 'Decision Log', 'Incident Summary', 'Timing Analysis'],
    usage_count: 6,
    last_used: '2026-05-01',
    compliance: 'Internal',
    created_by: 'R.Gupta',
  },
  { 
    id: 'tpl_6', 
    name: 'GxP Validation Package', 
    description: 'Good Practice validation evidence for pharmaceutical and life sciences compliance.',
    sections: ['IQ/OQ/PQ Results', 'Traceability Matrix', 'Deviation Reports', 'Validation Summary'],
    usage_count: 3,
    last_used: '2026-04-15',
    compliance: 'GxP',
    created_by: 'System',
  },
]

const COMPLIANCE_COLORS: Record<string, string> = {
  'SOX': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'ISO 27001': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'GxP': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Internal': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
}

export default function AuditTemplatesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  const filteredTemplates = MOCK_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.compliance.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Audit Template Gallery</h1>
            <p className="page-description">Pre-configured templates for compliance and audit evidence packages</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Audit Template</DialogTitle>
                <DialogDescription>
                  Define a new template for generating audit evidence packages.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input id="name" placeholder="e.g., Quarterly Compliance Report" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the purpose and contents of this template..." />
                </div>
                <div className="space-y-2">
                  <Label>Sections to Include</Label>
                  <StaggerGrid columns="grid-cols-2" className="gap-2" fast>
                    {['Run Records', 'Sign-Off Trail', 'Defect Summary', 'Change Log', 'Screenshots', 'Audit Log'].map((section) => (
                      <label key={section} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        {section}
                      </label>
                    ))}
                  </StaggerGrid>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCreateOpen(false)}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileCheck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge className={cn('mt-1', COMPLIANCE_COLORS[template.compliance])}>
                        {template.compliance}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Sections Included</p>
                    <div className="flex flex-wrap gap-1">
                      {template.sections.map((section) => (
                        <Badge key={section} variant="outline" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Used {template.usage_count} times</span>
                    <span>Last: {template.last_used}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 gap-1">
                    <Download className="h-3 w-3" />
                    Generate
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
