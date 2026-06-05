'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Check, X, Clock } from 'lucide-react'

export interface Cosigner {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export interface SignatureState {
  cosignerId: string
  status: 'pending' | 'signed' | 'rejected'
  signedAt?: string
  signature?: string
}

export interface Approval {
  id: string
  title: string
  cosigners: Cosigner[]
  signatures: SignatureState[]
  requiredCount: number
  createdAt: string
}

interface ApprovalSignatureChainProps {
  approval: Approval
  className?: string
  compact?: boolean
}

export function ApprovalSignatureChain({ approval, className, compact = false }: ApprovalSignatureChainProps) {
  const signatureMap = new Map(approval.signatures.map(s => [s.cosignerId, s]))
  
  const signedCount = approval.signatures.filter(s => s.status === 'signed').length
  const rejectedCount = approval.signatures.filter(s => s.status === 'rejected').length
  
  return (
    <div className={cn('space-y-3', className)}>
      {!compact && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Signatures: {signedCount}/{approval.requiredCount} required
          </span>
          {rejectedCount > 0 && (
            <span className="text-red-600 font-medium">{rejectedCount} rejected</span>
          )}
        </div>
      )}
      
      <div className="flex items-center">
        {approval.cosigners.map((cosigner, index) => {
          const signature = signatureMap.get(cosigner.id)
          const status = signature?.status || 'pending'
          
          return (
            <React.Fragment key={cosigner.id}>
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Avatar className={cn(
                        'border-2 transition-all',
                        status === 'pending' && 'border-slate-300 grayscale',
                        status === 'signed' && 'border-emerald-500',
                        status === 'rejected' && 'border-red-500',
                        compact ? 'h-8 w-8' : 'h-10 w-10'
                      )}>
                        <AvatarImage src={cosigner.avatar} alt={cosigner.name} />
                        <AvatarFallback className={cn(
                          'text-xs font-medium',
                          status === 'pending' && 'bg-slate-100 text-slate-500',
                          status === 'signed' && 'bg-emerald-100 text-emerald-700',
                          status === 'rejected' && 'bg-red-100 text-red-700'
                        )}>
                          {cosigner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Status badge */}
                      <div className={cn(
                        'absolute -bottom-1 -right-1 rounded-full flex items-center justify-center',
                        compact ? 'h-4 w-4' : 'h-5 w-5',
                        status === 'pending' && 'bg-slate-200 text-slate-500',
                        status === 'signed' && 'bg-emerald-500 text-white',
                        status === 'rejected' && 'bg-red-500 text-white'
                      )}>
                        {status === 'pending' && <Clock className={cn(compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} />}
                        {status === 'signed' && <Check className={cn(compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} />}
                        {status === 'rejected' && <X className={cn(compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} />}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-1.5">
                      <div>
                        <p className="font-medium">{cosigner.name}</p>
                        <p className="caption-text">{cosigner.role}</p>
                      </div>
                      <div className="pt-1 border-t">
                        {status === 'pending' && (
                          <p className="text-xs text-amber-600">Awaiting signature</p>
                        )}
                        {status === 'signed' && signature?.signedAt && (
                          <p className="text-xs text-emerald-600">
                            Signed {new Date(signature.signedAt).toLocaleString()}
                          </p>
                        )}
                        {status === 'rejected' && signature?.signedAt && (
                          <p className="text-xs text-red-600">
                            Rejected {new Date(signature.signedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Connector line */}
              {index < approval.cosigners.length - 1 && (
                <div className={cn(
                  'h-0.5 flex-shrink-0',
                  compact ? 'w-4' : 'w-6',
                  status === 'signed' ? 'bg-emerald-300' : 'bg-slate-200'
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
