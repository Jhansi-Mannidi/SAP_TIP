'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, PenLine, Shield } from 'lucide-react'

export interface SignOffRole {
  role: string
  required: boolean
  signed: boolean
  signedBy?: {
    id: string
    name: string
    avatar?: string
  }
  signedAt?: string
}

export interface SignOffEntity {
  id: string
  type: 'suite' | 'scenario'
  name: string
  roles: SignOffRole[]
  status: 'pending' | 'partial' | 'complete'
}

interface SignOffPanelProps {
  entity: SignOffEntity
  currentUserRole?: string
  onSign?: (rationale: string) => void
  className?: string
}

export function SignOffPanel({ entity, currentUserRole, onSign, className }: SignOffPanelProps) {
  const [rationale, setRationale] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const signedCount = entity.roles.filter(r => r.signed).length
  const requiredCount = entity.roles.filter(r => r.required).length
  const canSign = currentUserRole && entity.roles.some(r => r.role === currentUserRole && !r.signed)
  
  const handleSign = async () => {
    if (!rationale.trim()) return
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onSign?.(rationale)
    setIsSubmitting(false)
    setRationale('')
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg">Sign-Off</CardTitle>
          </div>
          <Badge 
            variant="secondary"
            className={cn(
              entity.status === 'pending' && 'bg-slate-100 text-slate-700',
              entity.status === 'partial' && 'bg-amber-100 text-amber-700',
              entity.status === 'complete' && 'bg-emerald-100 text-emerald-700'
            )}
          >
            {signedCount}/{requiredCount} signed
          </Badge>
        </div>
        <p className="page-description">
          {entity.type === 'suite' ? 'Test Suite' : 'Test Scenario'}: {entity.name}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Role signatures */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Required Signatures</Label>
          
          <div className="space-y-2">
            {entity.roles.map((role, idx) => (
              <div 
                key={idx}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  role.signed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-muted/30 border-border'
                )}
              >
                <div className="flex items-center gap-3">
                  {role.signed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{role.role}</span>
                      {role.required && (
                        <Badge variant="outline" className="text-[10px]">Required</Badge>
                      )}
                    </div>
                    
                    {role.signed && role.signedBy && (
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={role.signedBy.avatar} />
                          <AvatarFallback className="text-[8px]">
                            {role.signedBy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {role.signedBy.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {role.signed && role.signedAt && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(role.signedAt).toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Sign-off form */}
        {canSign && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <PenLine className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">Sign as {currentUserRole}</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rationale">Sign-off Rationale</Label>
              <Textarea
                id="rationale"
                placeholder="Enter your rationale for signing off..."
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                rows={3}
              />
              <p className="caption-text">
                Your signature will be cryptographically recorded
              </p>
            </div>
            
            <Button 
              onClick={handleSign}
              disabled={!rationale.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4 mr-2" />
                  Sign Off
                </>
              )}
            </Button>
          </div>
        )}
        
        {entity.status === 'complete' && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-emerald-700 font-medium">
              All required signatures collected
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
