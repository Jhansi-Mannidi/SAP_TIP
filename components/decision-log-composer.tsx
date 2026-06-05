'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ApprovalSignatureChain, type Cosigner, type Approval } from '@/components/approval-signature-chain'
import { FileText, Bug, Play, AlertTriangle, X, Check, Clock } from 'lucide-react'

export type DecisionKind = 'go_no_go' | 'escalation' | 'deviation_acceptance' | 'scope_change' | 'rollback' | 'other'

export interface EvidenceItem {
  id: string
  type: 'defect' | 'suite_execution' | 'si_item' | 'document'
  title: string
  code?: string
}

interface DecisionLogComposerProps {
  cutoverWindowId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  availableEvidence: EvidenceItem[]
  availableCosigners: Cosigner[]
  onSubmit: (data: DecisionLogData) => void
}

export interface DecisionLogData {
  kind: DecisionKind
  title: string
  description: string
  evidenceIds: string[]
  cosignerIds: string[]
}

const decisionKindConfig: Record<DecisionKind, { label: string; description: string }> = {
  go_no_go: { label: 'Go / No-Go', description: 'Major milestone decision to proceed or halt' },
  escalation: { label: 'Escalation', description: 'Issue escalated to higher authority' },
  deviation_acceptance: { label: 'Deviation Acceptance', description: 'Accepting a deviation from plan' },
  scope_change: { label: 'Scope Change', description: 'Change to cutover scope' },
  rollback: { label: 'Rollback Decision', description: 'Decision to rollback changes' },
  other: { label: 'Other', description: 'Other decision type' },
}

const evidenceIcons: Record<EvidenceItem['type'], React.ElementType> = {
  defect: Bug,
  suite_execution: Play,
  si_item: AlertTriangle,
  document: FileText,
}

export function DecisionLogComposer({
  cutoverWindowId,
  open,
  onOpenChange,
  availableEvidence,
  availableCosigners,
  onSubmit,
}: DecisionLogComposerProps) {
  const [kind, setKind] = React.useState<DecisionKind>('go_no_go')
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [selectedEvidence, setSelectedEvidence] = React.useState<string[]>([])
  const [selectedCosigners, setSelectedCosigners] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showApprovalFlow, setShowApprovalFlow] = React.useState(false)
  
  const handleSubmit = async () => {
    if (!title || selectedCosigners.length === 0) return
    
    setIsSubmitting(true)
    setShowApprovalFlow(true)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSubmit({
      kind,
      title,
      description,
      evidenceIds: selectedEvidence,
      cosignerIds: selectedCosigners,
    })
    
    setIsSubmitting(false)
  }
  
  const resetForm = () => {
    setKind('go_no_go')
    setTitle('')
    setDescription('')
    setSelectedEvidence([])
    setSelectedCosigners([])
    setShowApprovalFlow(false)
  }
  
  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm()
    onOpenChange(open)
  }
  
  // Build approval object for display
  const pendingApproval: Approval | null = showApprovalFlow ? {
    id: 'pending',
    title,
    cosigners: availableCosigners.filter(c => selectedCosigners.includes(c.id)),
    signatures: selectedCosigners.map(id => ({ cosignerId: id, status: 'pending' as const })),
    requiredCount: selectedCosigners.length,
    createdAt: new Date().toISOString(),
  } : null
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Log Decision</DialogTitle>
          <DialogDescription>
            Record a decision for cutover window. All decisions require cosigner approval.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Decision Kind */}
            <div className="space-y-2">
              <Label>Decision Type</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as DecisionKind)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(decisionKindConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <p className="font-medium">{config.label}</p>
                        <p className="caption-text">{config.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter decision title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the decision and rationale..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            {/* Evidence Picker */}
            <div className="space-y-2">
              <Label>Supporting Evidence</Label>
              <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-auto">
                {availableEvidence.length === 0 ? (
                  <p className="page-description">No evidence available</p>
                ) : (
                  availableEvidence.map(item => {
                    const Icon = evidenceIcons[item.type]
                    const isSelected = selectedEvidence.includes(item.id)
                    
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                          isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-muted/50'
                        )}
                        onClick={() => {
                          setSelectedEvidence(prev => 
                            isSelected 
                              ? prev.filter(id => id !== item.id)
                              : [...prev, item.id]
                          )
                        }}
                      >
                        <Checkbox checked={isSelected} />
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          {item.code && (
                            <p className="caption-text">{item.code}</p>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              {selectedEvidence.length > 0 && (
                <p className="caption-text">
                  {selectedEvidence.length} item{selectedEvidence.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            
            {/* Cosigner Selector */}
            <div className="space-y-2">
              <Label>Required Cosigners</Label>
              <div className="border rounded-lg p-3 space-y-2">
                {availableCosigners.map(cosigner => {
                  const isSelected = selectedCosigners.includes(cosigner.id)
                  
                  return (
                    <div
                      key={cosigner.id}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                        isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-muted/50'
                      )}
                      onClick={() => {
                        setSelectedCosigners(prev => 
                          isSelected 
                            ? prev.filter(id => id !== cosigner.id)
                            : [...prev, cosigner.id]
                        )
                      }}
                    >
                      <Checkbox checked={isSelected} />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={cosigner.avatar} />
                        <AvatarFallback>
                          {cosigner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{cosigner.name}</p>
                        <p className="caption-text">{cosigner.role}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              {selectedCosigners.length === 0 && (
                <p className="text-xs text-red-500">At least one cosigner is required</p>
              )}
            </div>
            
            {/* Approval Flow Display */}
            {showApprovalFlow && pendingApproval && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium text-sm">Approval Status</h4>
                <ApprovalSignatureChain approval={pendingApproval} />
                <p className="caption-text">
                  Waiting for {selectedCosigners.length} signature{selectedCosigners.length !== 1 ? 's' : ''}...
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title || selectedCosigners.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Approval'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
