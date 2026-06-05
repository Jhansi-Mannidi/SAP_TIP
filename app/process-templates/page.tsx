'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Workflow, 
  Plus, 
  MoreHorizontal,
  Eye,
  Copy,
  Archive,
  Search,
  Filter,
  Layers,
  Clock,
  Flag,
  Rocket,
  LifeBuoy,
  UserPlus,
  RefreshCw,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { MOCK_PROCESS_TEMPLATES, type TemplateType } from '@/lib/mock-data'

const templateTypeIcons: Record<TemplateType, React.ElementType> = {
  cutover: Rocket,
  migration: RefreshCw,
  hypercare: LifeBuoy,
  onboarding: UserPlus,
  regression: RefreshCw,
}

const templateTypeLabels: Record<TemplateType, string> = {
  cutover: 'Cutover',
  migration: 'Migration',
  hypercare: 'Hypercare',
  onboarding: 'Onboarding',
  regression: 'Regression',
}

export default function ProcessTemplatesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  
  const filteredTemplates = MOCK_PROCESS_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || template.template_type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Process Templates</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Design and manage generic process templates for Cutover, Migration, Hypercare, and Onboarding workflows.
                </p>
              </div>
              <Button className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Template</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cutover">Cutover</SelectItem>
                  <SelectItem value="migration">Migration</SelectItem>
                  <SelectItem value="hypercare">Hypercare</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="regression">Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Grid */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <StaggerGrid columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" className="gap-4" fast>
            {filteredTemplates.map((template) => {
              const TypeIcon = templateTypeIcons[template.template_type]
              const taskCount = template.tasks.length
              const milestones = template.tasks.filter(t => t.is_milestone).length
              const totalDuration = template.tasks.reduce((sum, t) => sum + (t.duration_estimate_mins || 0), 0)
              
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-xs font-mono">{template.code}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/process-templates/${template.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Open Designer
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="page-description line-clamp-2 mb-4">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <Badge variant="secondary" className="capitalize">
                        {templateTypeLabels[template.template_type]}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        {template.version}
                      </Badge>
                      <StatusBadge 
                        status={template.state === 'Published' ? 'Completed_Passed' : template.state === 'Draft' ? 'Pending' : 'Failed'} 
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{taskCount} tasks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag className="h-3.5 w-3.5" />
                        <span>{milestones} milestones</span>
                      </div>
                      {totalDuration > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{Math.round(totalDuration / 60)}h</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t">
                      <Link href={`/process-templates/${template.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Open Designer
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </StaggerGrid>
          
          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Workflow className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No templates found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
