'use client'

import * as React from 'react'
import {
  Webhook,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Play,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Event types
const EVENT_TYPES = [
  { id: 'execution.started', label: 'Execution Started', category: 'Execution' },
  { id: 'execution.completed', label: 'Execution Completed', category: 'Execution' },
  { id: 'execution.failed', label: 'Execution Failed', category: 'Execution' },
  { id: 'test.passed', label: 'Test Passed', category: 'Test' },
  { id: 'test.failed', label: 'Test Failed', category: 'Test' },
  { id: 'defect.created', label: 'Defect Created', category: 'Defect' },
  { id: 'defect.resolved', label: 'Defect Resolved', category: 'Defect' },
  { id: 'healing.applied', label: 'Healing Applied', category: 'Healing' },
  { id: 'promotion.pending', label: 'Promotion Pending', category: 'Healing' },
]

// Mock webhooks
const MOCK_WEBHOOKS = [
  {
    id: 'wh_1',
    name: 'CI/CD Pipeline Trigger',
    url: 'https://dev.azure.com/starcement/_apis/webhooks/sap-test',
    events: ['execution.completed', 'execution.failed'],
    status: 'active',
    secret: 'whsec_abc123...',
    created_at: '2026-03-15T10:00:00+05:30',
    last_triggered: '2026-05-07T10:30:00+05:30',
    stats: { total_deliveries: 456, success_rate: 99.1 },
  },
  {
    id: 'wh_2',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/T00/B00/xxx',
    events: ['test.failed', 'defect.created'],
    status: 'active',
    secret: 'whsec_def456...',
    created_at: '2026-02-20T14:00:00+05:30',
    last_triggered: '2026-05-07T09:15:00+05:30',
    stats: { total_deliveries: 234, success_rate: 100 },
  },
  {
    id: 'wh_3',
    name: 'ServiceNow Integration',
    url: 'https://starcement.service-now.com/api/webhook',
    events: ['defect.created', 'defect.resolved', 'healing.applied'],
    status: 'active',
    secret: 'whsec_ghi789...',
    created_at: '2026-01-10T09:00:00+05:30',
    last_triggered: '2026-05-06T16:45:00+05:30',
    stats: { total_deliveries: 189, success_rate: 97.8 },
  },
  {
    id: 'wh_4',
    name: 'Analytics Export',
    url: 'https://analytics.starcement.com/ingest',
    events: ['execution.started', 'execution.completed', 'test.passed', 'test.failed'],
    status: 'paused',
    secret: 'whsec_jkl012...',
    created_at: '2026-04-01T11:00:00+05:30',
    stats: { total_deliveries: 78, success_rate: 95.2 },
  },
]

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function WebhooksPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [showSecrets, setShowSecrets] = React.useState<Record<string, boolean>>({})

  const filteredWebhooks = MOCK_WEBHOOKS.filter(wh =>
    wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wh.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Webhook Configuration</h1>
                <p className="page-description mt-1">
                  Configure outbound webhooks for test events. Webhooks are signed with HMAC-SHA256.
                </p>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Webhook</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Webhook</DialogTitle>
                    <DialogDescription>
                      Configure a new webhook endpoint for test events.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="My Webhook" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">Endpoint URL</Label>
                      <Input id="url" placeholder="https://example.com/webhook" />
                    </div>
                    <div className="space-y-2">
                      <Label>Events</Label>
                      <div className="border rounded-lg p-3 max-h-48 overflow-auto space-y-3">
                        {['Execution', 'Test', 'Defect', 'Healing'].map(category => (
                          <div key={category}>
                            <p className="text-xs font-medium text-muted-foreground mb-2">{category}</p>
                            <div className="space-y-2">
                              {EVENT_TYPES.filter(e => e.category === category).map(event => (
                                <div key={event.id} className="flex items-center gap-2">
                                  <Checkbox id={event.id} />
                                  <Label htmlFor={event.id} className="text-sm font-normal">{event.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsCreateOpen(false)}>Create Webhook</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <div className="mt-4 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search webhooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Deliveries</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Triggered</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{webhook.name}</p>
                        <div className="flex items-center gap-1">
                          <code className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {webhook.url}
                          </code>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">Secret:</span>
                          <code className="text-xs">
                            {showSecrets[webhook.id] ? webhook.secret : '••••••••••••'}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => toggleSecret(webhook.id)}
                          >
                            {showSecrets[webhook.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 2).map(event => (
                          <Badge key={event} variant="secondary" className="text-xs">
                            {event.split('.')[1]}
                          </Badge>
                        ))}
                        {webhook.events.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{webhook.events.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {webhook.status === 'active' ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted">
                          <Clock className="h-3 w-3 mr-1" />
                          Paused
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">
                        <span className="font-medium">{webhook.stats.total_deliveries}</span>
                        <span className="text-muted-foreground ml-1">
                          ({webhook.stats.success_rate}% success)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {webhook.last_triggered ? (
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(webhook.last_triggered)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Test Webhook
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Regenerate Secret
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {filteredWebhooks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Webhook className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No webhooks found</h3>
              <p className="page-description mt-1">
                Create a webhook to receive test events
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
