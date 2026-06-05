'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ScrollText,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Lock,
  Eye,
  FileText,
  Settings,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
  Database,
  Workflow,
  Layers,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Policy categories
const POLICY_CATEGORIES = [
  { id: 'execution', label: 'Execution', icon: Workflow, description: 'Control test execution behavior' },
  { id: 'data', label: 'Data', icon: Database, description: 'Data handling and retention policies' },
  { id: 'access', label: 'Access Control', icon: Lock, description: 'Permissions and authorization' },
  { id: 'healing', label: 'Healing', icon: Shield, description: 'Auto-healing behavior rules' },
  { id: 'promotion', label: 'Promotion', icon: Layers, description: 'IR promotion governance' },
]

// Mock policies
const MOCK_POLICIES = [
  // Execution Policies
  {
    id: 'pol_1',
    category: 'execution',
    name: 'Max Concurrent Executions',
    description: 'Limit concurrent test executions per system to prevent resource exhaustion.',
    enabled: true,
    config: { limit: 10, scope: 'per_system' },
    last_modified: '2026-04-15T10:00:00+05:30',
    modified_by: 'P.Sharma',
  },
  {
    id: 'pol_2',
    category: 'execution',
    name: 'Execution Timeout',
    description: 'Maximum duration for a single test execution before automatic termination.',
    enabled: true,
    config: { timeout_mins: 120, warning_at: 100 },
    last_modified: '2026-03-20T14:00:00+05:30',
    modified_by: 'J.Rao',
  },
  {
    id: 'pol_3',
    category: 'execution',
    name: 'Business Hours Only',
    description: 'Restrict production system testing to business hours only.',
    enabled: false,
    config: { hours: '09:00-18:00', timezone: 'Asia/Kolkata', days: 'Mon-Fri' },
    last_modified: '2026-02-10T09:00:00+05:30',
    modified_by: 'M.Reddy',
  },
  // Data Policies
  {
    id: 'pol_4',
    category: 'data',
    name: 'Evidence Retention',
    description: 'Automatic cleanup of test evidence older than retention period.',
    enabled: true,
    config: { retention_days: 90, archive_before_delete: true },
    last_modified: '2026-04-01T11:00:00+05:30',
    modified_by: 'P.Sharma',
  },
  {
    id: 'pol_5',
    category: 'data',
    name: 'PII Data Masking',
    description: 'Automatically mask PII data in screenshots and logs.',
    enabled: true,
    config: { mask_fields: ['email', 'phone', 'ssn', 'credit_card'], mask_char: '*' },
    last_modified: '2026-03-15T16:00:00+05:30',
    modified_by: 'J.Rao',
  },
  {
    id: 'pol_6',
    category: 'data',
    name: 'Fixture Expiration',
    description: 'Automatically expire test fixtures after configured period.',
    enabled: true,
    config: { default_expiry_days: 180, warn_before_days: 14 },
    last_modified: '2026-02-28T10:00:00+05:30',
    modified_by: 'S.Kumar',
  },
  // Access Control Policies
  {
    id: 'pol_7',
    category: 'access',
    name: 'Production System Access',
    description: 'Require additional approval for production system test execution.',
    enabled: true,
    config: { require_approval: true, approvers: ['P.Sharma', 'J.Rao'], min_approvals: 1 },
    last_modified: '2026-04-20T09:00:00+05:30',
    modified_by: 'P.Sharma',
  },
  {
    id: 'pol_8',
    category: 'access',
    name: 'IP Boundary Enforcement',
    description: 'Prevent distribution of org-scoped content to global tenant.',
    enabled: true,
    config: { enforce: true, warn_only: false },
    last_modified: '2026-03-10T14:00:00+05:30',
    modified_by: 'M.Reddy',
  },
  // Healing Policies
  {
    id: 'pol_9',
    category: 'healing',
    name: 'Auto-Heal Confidence Threshold',
    description: 'Minimum confidence score required for automatic healing application.',
    enabled: true,
    config: { min_confidence: 85, require_human_review_below: 70 },
    last_modified: '2026-04-25T11:00:00+05:30',
    modified_by: 'J.Rao',
  },
  {
    id: 'pol_10',
    category: 'healing',
    name: 'Healing Rate Limit',
    description: 'Limit number of healing attempts per execution to prevent loops.',
    enabled: true,
    config: { max_heals_per_execution: 5, max_heals_per_step: 2 },
    last_modified: '2026-03-25T10:00:00+05:30',
    modified_by: 'S.Kumar',
  },
  // Promotion Policies
  {
    id: 'pol_11',
    category: 'promotion',
    name: 'Auto-Promotion Threshold',
    description: 'Automatically promote IR changes that meet confidence and occurrence thresholds.',
    enabled: false,
    config: { min_confidence: 95, min_occurrences: 10, min_success_rate: 100 },
    last_modified: '2026-05-01T09:00:00+05:30',
    modified_by: 'P.Sharma',
  },
  {
    id: 'pol_12',
    category: 'promotion',
    name: 'Published IR Protection',
    description: 'Require review for changes to published IRs affecting multiple scenarios.',
    enabled: true,
    config: { scenario_threshold: 5, require_lead_approval: true },
    last_modified: '2026-04-18T14:00:00+05:30',
    modified_by: 'J.Rao',
  },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [policies, setPolicies] = React.useState(MOCK_POLICIES)

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const enabledCount = policies.filter(p => p.enabled).length

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Policies</h1>
                <p className="page-description mt-1">
                  Configure governance policies for execution, data handling, access control, and healing behavior.
                </p>
              </div>
              <Button className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Policy</span>
              </Button>
            </div>

            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              <Card>
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <p className="stat-value mt-1">{policies.length}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Enabled</span>
                </div>
                <p className="stat-value mt-1">{enabledCount}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Disabled</span>
                </div>
                <p className="stat-value mt-1">{policies.length - enabledCount}</p>
              </Card>
              <Card>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">Categories</span>
                </div>
                <p className="stat-value mt-1">{POLICY_CATEGORIES.length}</p>
              </Card>
            </StaggerGrid>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {POLICY_CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Policies Grid */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              {POLICY_CATEGORIES.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs gap-1">
                  <cat.icon className="h-3 w-3" />
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {POLICY_CATEGORIES.map(category => {
                const categoryPolicies = filteredPolicies.filter(p => p.category === category.id)
                if (categoryPolicies.length === 0) return null
                
                return (
                  <div key={category.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <category.icon className="h-4 w-4 text-muted-foreground" />
                      <h2 className="font-semibold">{category.label}</h2>
                      <Badge variant="secondary" className="text-xs">{categoryPolicies.length}</Badge>
                    </div>
                    <div className="grid gap-3">
                      {categoryPolicies.map(policy => (
                        <PolicyCard 
                          key={policy.id} 
                          policy={policy} 
                          onToggle={() => togglePolicy(policy.id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </TabsContent>

            {POLICY_CATEGORIES.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-3">
                {filteredPolicies
                  .filter(p => p.category === category.id)
                  .map(policy => (
                    <PolicyCard 
                      key={policy.id} 
                      policy={policy} 
                      onToggle={() => togglePolicy(policy.id)}
                    />
                  ))}
              </TabsContent>
            ))}
          </Tabs>

          {filteredPolicies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ScrollText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No policies found</h3>
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

interface PolicyCardProps {
  policy: typeof MOCK_POLICIES[0]
  onToggle: () => void
}

function PolicyCard({ policy, onToggle }: PolicyCardProps) {
  return (
    <Card className={cn(
      "transition-all",
      !policy.enabled && "opacity-60"
    )}>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{policy.name}</h3>
              {policy.enabled ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                  Enabled
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Disabled</Badge>
              )}
            </div>
            <p className="page-description">{policy.description}</p>
            
            {/* Config preview */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(policy.config).slice(0, 3).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs font-mono">
                  {key}: {typeof value === 'boolean' ? (value ? 'true' : 'false') : 
                    Array.isArray(value) ? `[${value.length}]` : String(value)}
                </Badge>
              ))}
            </div>

            <p className="caption-text mt-2">
              Modified by {policy.modified_by} on {formatDate(policy.last_modified)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Switch 
              checked={policy.enabled} 
              onCheckedChange={onToggle}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View History
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
