'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, BookOpen, FileText, Building2, HelpCircle } from 'lucide-react'

export type KBSource = 'sap_help' | 'sap_note' | 'customer_doc' | 'internal' | 'community'

export interface KBArticle {
  id: string
  title: string
  source: KBSource
  snippet: string
  lastUpdated: string
  tags: string[]
  url?: string
  noteNumber?: string
}

interface KBArticleCardProps {
  article: KBArticle
  className?: string
  onClick?: () => void
}

const sourceConfig: Record<KBSource, { label: string; icon: React.ElementType; color: string }> = {
  sap_help: { label: 'SAP Help', icon: HelpCircle, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  sap_note: { label: 'SAP Note', icon: FileText, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  customer_doc: { label: 'Customer Doc', icon: Building2, color: 'bg-violet-100 text-violet-700 border-violet-200' },
  internal: { label: 'Internal', icon: BookOpen, color: 'bg-slate-100 text-slate-700 border-slate-200' },
  community: { label: 'Community', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}

const FALLBACK_SOURCE_CONFIG = {
  label: 'Article',
  icon: BookOpen,
  color: 'bg-slate-100 text-slate-700 border-slate-200',
} as const

export function KBArticleCard({ article, className, onClick }: KBArticleCardProps) {
  if (!article) return null

  const config = sourceConfig[article.source] ?? FALLBACK_SOURCE_CONFIG
  const SourceIcon = config.icon ?? BookOpen
  const tags = Array.isArray(article.tags) ? article.tags : []
  
  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md hover:border-indigo-200 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn('text-xs border', config.color)}>
                <SourceIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
              {article.noteNumber && (
                <span className="text-xs font-mono text-muted-foreground">
                  {article.noteNumber}
                </span>
              )}
            </div>
            <h4 className="font-medium text-sm leading-snug line-clamp-2">
              {article.title}
            </h4>
          </div>
          {article.url && (
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="caption-text line-clamp-2 mb-3">
          {article.snippet}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-[10px] px-1.5 py-0 h-5"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
          
          {article.lastUpdated && (
            <span className="text-[10px] text-muted-foreground">
              {(() => {
                const d = new Date(article.lastUpdated)
                return isNaN(d.getTime()) ? article.lastUpdated : d.toLocaleDateString()
              })()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
