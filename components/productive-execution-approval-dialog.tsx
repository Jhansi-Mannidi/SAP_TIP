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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldAlert, Check, Clock, AlertTriangle, Lock } from 'lucide-react'

export interface RequiredCosigner {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  hasSigned: boolean
  signedAt?: string
  did?: string
}

interface ProductiveExecutionApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  systemId: string
  actionDescription: string
  requiredCosigners: RequiredCosigner[]
  currentUserId: string
  onApprove: (rationale: string) => void
}

export function ProductiveExecutionApprovalDialog({
  open,
  onOpenChange,
  systemId,
  actionDescription,
  requiredCosigners,
  currentUserId,
  onApprove,
}: ProductiveExecutionApprovalDialogProps) {
  const [rationale, setRationale] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const signedCount = requiredCosigners.filter(c => c.hasSigned).length
  const allSigned = signedCount === requiredCosigners.length
  const currentUserCosigner = requiredCosigners.find(c => c.id === currentUserId)
  const canSign = currentUserCosigner && !currentUserCosigner.hasSigned
  
  const handleSign = async () => {
    if (!rationale.trim() || !canSign) return
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onApprove(rationale)
    setIsSubmitting(false)
    setRationale('')
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Productive System Approval Required</DialogTitle>
              <DialogDescription>
                This action requires multi-signature approval
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* System warning */}
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to perform an action on productive system{' '}
              <strong className="font-mono">{systemId}</strong>. This requires approval 
              from all listed cosigners.
            </AlertDescription>
          </Alert>
          
          {/* Action description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Action to Approve</Label>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              {actionDescription}
            </div>
          </div>
          
          {/* Cosigners */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Required Cosigners</Label>
              <Badge variant="outline">
                {signedCount}/{requiredCosigners.length} signed
              </Badge>
            </div>
            
            <div className="space-y-2">
              {requiredCosigners.map(cosigner => (
                <div 
                  key={cosigner.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    cosigner.hasSigned 
                      ? 'bg-emerald-50/50 border-emerald-200' 
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={cosigner.avatar} />
                      <AvatarFallback>
                        {cosigner.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{cosigner.name}</p>
                      <p className="caption-text">{cosigner.role}</p>
                    </div>
                  </div>
                  
                  {cosigner.hasSigned ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs text-emerald-600">Signed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Signature form */}
          {canSign && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">Your Signature</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rationale">Rationale (required)</Label>
                <Textarea
                  id="rationale"
                  placeholder="Enter your rationale for approving this action..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  rows={3}
                />
              </div>
              
              <p className="caption-text">
                Your signature will be cryptographically captured with your DID.
              </p>
            </div>
          )}
          
          {allSigned && (
            <Alert className="bg-emerald-50 border-emerald-200">
              <Check className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-emerald-700">
                All required signatures have been collected. The action can now proceed.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {canSign && (
            <Button 
              onClick={handleSign}
              disabled={!rationale.trim() || isSubmitting}
              variant="destructive"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Sign & Approve
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
