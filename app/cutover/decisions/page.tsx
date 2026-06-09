'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { MOCK_DECISIONS, type Decision } from '@/lib/cutover-mock-data'

const severityColors = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-amber-500',
  Low: 'bg-blue-500',
}

const statusConfig = {
  Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  Approved: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  Rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  Deferred: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
}

function DecisionCard({ decision, onSelect }: { decision: Decision; onSelect: () => void }) {
  const config = statusConfig[decision.status]
  const StatusIcon = config.icon
  
  return (
    <Card className={cn('cursor-pointer hover:shadow-md transition-shadow', config.bg)} onClick={onSelect}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge className={cn('text-white', severityColors[decision.severity])}>
              {decision.severity}
            </Badge>
            <Badge variant="outline" className={config.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {decision.status}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(decision.raised_at).toLocaleString()}
          </span>
        </div>
        <CardTitle className="text-base mt-2">{decision.title}</CardTitle>
        <CardDescription>{decision.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="page-breadcrumb">
            <Users className="h-4 w-4" />
            <span>Raised by {decision.raised_by.name}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

function DecisionDialog({ decision, open, onOpenChange }: { decision: Decision | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedOption, setSelectedOption] = React.useState<string>('')
  const [rationale, setRationale] = React.useState('')
  
  if (!decision) return null
  
  const config = statusConfig[decision.status]
  const StatusIcon = config.icon
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn('text-white', severityColors[decision.severity])}>
              {decision.severity}
            </Badge>
            <Badge variant="outline" className={config.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {decision.status}
            </Badge>
          </div>
          <DialogTitle>{decision.title}</DialogTitle>
          <DialogDescription>{decision.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Impact */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm font-medium text-amber-800">Impact</p>
            <p className="text-sm text-amber-700 mt-1">{decision.impact}</p>
          </div>
          
          {/* Raised By */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{decision.raised_by.name.split('.').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{decision.raised_by.name}</p>
              <p className="caption-text">{decision.raised_by.role}</p>
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {new Date(decision.raised_at).toLocaleString()}
            </span>
          </div>
          
          {/* Options */}
          {decision.status === 'Pending' ? (
            <>
              <div>
                <Label className="text-sm font-medium">Options</Label>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="mt-2 space-y-2">
                  {decision.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer',
                        selectedOption === option.label && 'border-primary bg-primary/5'
                      )}
                    >
                      <RadioGroupItem value={option.label} id={`option-${idx}`} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={`option-${idx}`} className="text-sm font-medium cursor-pointer">
                          {option.label}
                          {option.recommended && (
                            <Badge variant="secondary" className="ml-2 text-[10px]">Recommended</Badge>
                          )}
                        </Label>
                        <p className="caption-text mt-1">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Rationale</Label>
                <Textarea
                  placeholder="Enter your rationale for this decision..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-sm font-medium">Selected Option</Label>
                <p className="text-sm mt-1">{decision.selected_option}</p>
              </div>
              
              {decision.rationale && (
                <div>
                  <Label className="text-sm font-medium">Rationale</Label>
                  <p className="page-description mt-1">{decision.rationale}</p>
                </div>
              )}
              
              {decision.decided_by && (
                <div className="flex items-center gap-3 pt-2 border-t">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{decision.decided_by.name.split('.').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Decided by {decision.decided_by.name}</p>
                    <p className="caption-text">{decision.decided_by.role}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {decision.decided_at && new Date(decision.decided_at).toLocaleString()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        
        {decision.status === 'Pending' && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={!selectedOption}>
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button disabled={!selectedOption}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function DecisionLogPage() {
  const [selectedDecision, setSelectedDecision] = React.useState<Decision | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  
  const decisions = MOCK_DECISIONS
  const pendingDecisions = decisions.filter(d => d.status === 'Pending')
  const resolvedDecisions = decisions.filter(d => d.status !== 'Pending')

  return (
    <AppShell currentApp="cutover-command">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="page-title">Decision Log</h1>
            <p className="page-description mt-1">Track and manage cutover decisions</p>
          </div>
          
          {/* Stats */}
          <StaggerGrid columns="grid-cols-4" className="gap-4" fast>
            <Card>
              <CardContent>
                <p className="stat-value">{decisions.length}</p>
                <p className="caption-text">Total Decisions</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent>
                <p className="stat-value text-amber-600">{pendingDecisions.length}</p>
                <p className="caption-text">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="stat-value text-emerald-600">
                  {decisions.filter(d => d.status === 'Approved').length}
                </p>
                <p className="caption-text">Approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="stat-value text-red-600">
                  {decisions.filter(d => d.status === 'Rejected').length}
                </p>
                <p className="caption-text">Rejected</p>
              </CardContent>
            </Card>
          </StaggerGrid>
          
          {/* Decision Tabs */}
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                Pending
                {pendingDecisions.length > 0 && (
                  <Badge variant="destructive" className="text-[10px]">{pendingDecisions.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedDecisions.length})</TabsTrigger>
              <TabsTrigger value="all">All ({decisions.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-4">
              <div className="grid gap-4">
                {pendingDecisions.map((decision) => (
                  <DecisionCard
                    key={decision.id}
                    decision={decision}
                    onSelect={() => {
                      setSelectedDecision(decision)
                      setDialogOpen(true)
                    }}
                  />
                ))}
                {pendingDecisions.length === 0 && (
                  <Card>
                    <CardContent className="text-center">
                      <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                      <p className="page-description">No pending decisions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="resolved" className="mt-4">
              <div className="grid gap-4">
                {resolvedDecisions.map((decision) => (
                  <DecisionCard
                    key={decision.id}
                    decision={decision}
                    onSelect={() => {
                      setSelectedDecision(decision)
                      setDialogOpen(true)
                    }}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid gap-4">
                {decisions.map((decision) => (
                  <DecisionCard
                    key={decision.id}
                    decision={decision}
                    onSelect={() => {
                      setSelectedDecision(decision)
                      setDialogOpen(true)
                    }}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <DecisionDialog
        decision={selectedDecision}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </AppShell>
  )
}
