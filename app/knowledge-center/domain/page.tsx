'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Search, 
  BookOpen,
  ArrowRight,
  Clock,
  Eye,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { MOCK_SAP_MODULES, MOCK_KB_ARTICLES } from '@/lib/kb-mock-data'

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
  return `${Math.floor(diffInDays / 30)}mo ago`
}

export default function DomainKBModulesPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredModules = MOCK_SAP_MODULES.filter(module => 
    module.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get recently updated articles
  const recentArticles = [...MOCK_KB_ARTICLES]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5)

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="page-title">Domain Knowledge Base — SAP Modules</h1>
                <p className="page-description mt-1">
                  Module-level reference content powering AI agent retrieval and human research.
                </p>
              </div>
              
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search across all modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* Module Cards Grid */}
          <StaggerGrid columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" className="gap-4 mb-8" fast>
            {filteredModules.map((module) => (
              <Link key={module.code} href={`/knowledge-center/domain/${module.code.toLowerCase()}`}>
                <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center text-white font-mono font-bold text-lg",
                        module.color
                      )}>
                        {module.code}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {module.articleCount} articles
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                      {module.name}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {module.topConcepts.map((concept) => (
                        <Badge key={concept} variant="outline" className="text-xs font-normal">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </StaggerGrid>

          {filteredModules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No modules found</h3>
              <p className="page-description mt-1">
                Try adjusting your search query
              </p>
            </div>
          )}

          {/* Recently Updated Section */}
          {searchQuery === '' && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="section-title">Recently Updated</h2>
              </div>
              <div className="space-y-3">
                {recentArticles.map((article) => {
                  const module = MOCK_SAP_MODULES.find(m => m.code === article.module)
                  return (
                    <Link 
                      key={article.id} 
                      href={`/knowledge-center/domain/${article.module.toLowerCase()}/articles/${article.id}`}
                    >
                      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                        <CardContent>
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded flex items-center justify-center text-white font-mono font-bold text-sm shrink-0",
                              module?.color || 'bg-slate-500'
                            )}>
                              {article.module}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-sm truncate">{article.title}</h3>
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {article.source}
                                </Badge>
                              </div>
                              <p className="caption-text line-clamp-1">
                                {article.snippet}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span>{article.subArea}</span>
                                <span>•</span>
                                <span>{formatRelativeTime(article.lastUpdated)}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {article.viewCount}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
