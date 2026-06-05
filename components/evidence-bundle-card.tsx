'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Archive, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Image, 
  Video, 
  Code, 
  Terminal,
  Shield,
  Calendar,
  ExternalLink
} from 'lucide-react'

export type EvidenceItemKind = 'screenshot' | 'video' | 'api_trace' | 'action_log' | 'document'

export interface EvidenceBundle {
  id: string
  name: string
  manifest: {
    totalItems: number
    itemsByKind: Record<EvidenceItemKind, number>
  }
  signatureState: 'unsigned' | 'signed' | 'verified'
  signedBy?: string
  signedAt?: string
  retentionUntil: string
  createdAt: string
  sizeBytes: number
}

interface EvidenceBundleCardProps {
  bundle: EvidenceBundle
  onOpen?: () => void
  onVerify?: () => void
  className?: string
}

const kindIcons: Record<EvidenceItemKind, React.ElementType> = {
  screenshot: Image,
  video: Video,
  api_trace: Code,
  action_log: Terminal,
  document: FileText,
}

const kindLabels: Record<EvidenceItemKind, string> = {
  screenshot: 'Screenshots',
  video: 'Videos',
  api_trace: 'API Traces',
  action_log: 'Action Logs',
  document: 'Documents',
}

export function EvidenceBundleCard({ bundle, onOpen, onVerify, className }: EvidenceBundleCardProps) {
  const signatureConfig = {
    unsigned: { icon: Clock, color: 'text-slate-500 bg-slate-100', label: 'Unsigned' },
    signed: { icon: CheckCircle2, color: 'text-blue-600 bg-blue-100', label: 'Signed' },
    verified: { icon: Shield, color: 'text-emerald-600 bg-emerald-100', label: 'Verified' },
  }[bundle.signatureState]
  
  const SignatureIcon = signatureConfig.icon
  
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Archive className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-base">{bundle.name}</CardTitle>
              <p className="caption-text mt-0.5">
                {bundle.id}
              </p>
            </div>
          </div>
          
          <Badge 
            variant="secondary" 
            className={cn('flex items-center gap-1', signatureConfig.color)}
          >
            <SignatureIcon className="h-3 w-3" />
            {signatureConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Items by kind */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(bundle.manifest.itemsByKind).map(([kind, count]) => {
            if (count === 0) return null
            const Icon = kindIcons[kind as EvidenceItemKind]
            
            return (
              <div 
                key={kind}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{count}</p>
                  <p className="page-description text-[10px]">
                    {kindLabels[kind as EvidenceItemKind]}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Metadata */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Items</span>
            <span className="font-medium">{bundle.manifest.totalItems}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Size</span>
            <span className="font-mono text-xs">
              {formatBytes(bundle.sizeBytes)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Retention Until</span>
            </div>
            <span className="text-xs">
              {new Date(bundle.retentionUntil).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Signature info */}
        {bundle.signatureState !== 'unsigned' && bundle.signedBy && (
          <div className="p-2 bg-muted/30 rounded-lg text-xs">
            <p className="page-description">
              Signed by <span className="font-medium text-foreground">{bundle.signedBy}</span>
            </p>
            {bundle.signedAt && (
              <p className="section-description mt-0.5">
                {new Date(bundle.signedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onOpen}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
          
          {bundle.signatureState === 'signed' && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onVerify}>
              <Shield className="h-4 w-4 mr-1" />
              Verify
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
