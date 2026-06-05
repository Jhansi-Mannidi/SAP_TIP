'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Search, 
  Command,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  X,
  Loader2,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { MOCK_KB_ARTICLES, MOCK_SAP_MODULES, type ArticleSource } from '@/lib/kb-mock-data'

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

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 rounded px-0.5">{part}</mark>
    ) : part
  )
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = React.useState(initialQuery)
  const [activeQuery, setActiveQuery] = React.useState(initialQuery)
  const [moduleFilter, setModuleFilter] = React.useState<string>('all')
  const [sourceFilter, setSourceFilter] = React.useState<string>('all')
  const [timeFilter, setTimeFilter] = React.useState<string>('all')
  const [showFilters, setShowFilters] = React.useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveQuery(searchQuery)
  }

  const searchResults = React.useMemo(() => {
    if (!activeQuery) return []
    
    return MOCK_KB_ARTICLES
      .filter(article => {
        const matchesQuery = 
          article.title.toLowerCase().includes(activeQuery.toLowerCase()) ||
          article.snippet.toLowerCase().includes(activeQuery.toLowerCase()) ||
          article.tags.some(t => t.toLowerCase().includes(activeQuery.toLowerCase()))
        const matchesModule = moduleFilter === 'all' || article.module === moduleFilter
        const matchesSource = sourceFilter === 'all' || article.source === sourceFilter
        
        // Time filter
        let matchesTime = true
        if (timeFilter !== 'all') {
          const date = new Date(article.lastUpdated)
          const now = new Date()
          const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
          matchesTime = timeFilter === '7d' ? diffInDays <= 7 :
                       timeFilter === '30d' ? diffInDays <= 30 :
                       timeFilter === '90d' ? diffInDays <= 90 : true
        }
        
        return matchesQuery && matchesModule && matchesSource && matchesTime
      })
      .map(article => {
        // Calculate a simple relevance score based on where the match occurs
        let score = 0
        if (article.title.toLowerCase().includes(activeQuery.toLowerCase())) score += 10
        if (article.snippet.toLowerCase().includes(activeQuery.toLowerCase())) score += 5
        if (article.tags.some(t => t.toLowerCase().includes(activeQuery.toLowerCase()))) score += 3
        return { ...article, relevanceScore: score }
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
  }, [activeQuery, moduleFilter, sourceFilter, timeFilter])

  const sourceColors: Record<ArticleSource, string> = {
    'SAP Help': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'SAP Press': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Authored': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Community': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  }

  const moduleColors: Record<string, string> = {
    'SD': 'bg-blue-500',
    'MM': 'bg-emerald-500',
    'FI': 'bg-violet-500',
    'CO': 'bg-amber-500',
    'PP': 'bg-rose-500',
  }

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="page-title">Search Domain Knowledge Base</h1>
                <p className="page-description mt-1">
                  Full-text and semantic search across all domain knowledge articles.
                </p>
              </div>
              
              {/* Search */}
              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-24 h-12 text-base"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 text-xs text-muted-foreground">
                    <Command className="h-3 w-3" />K
                  </kbd>
                  <Button type="submit" size="sm">Search</Button>
                </div>
              </form>

              {/* Filter Toggle */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {(moduleFilter !== 'all' || sourceFilter !== 'all' || timeFilter !== 'all') && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {[moduleFilter !== 'all', sourceFilter !== 'all', timeFilter !== 'all'].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
                {activeQuery && (
                  <span className="text-sm text-muted-foreground">
                    {searchResults.length} results for &quot;{activeQuery}&quot;
                  </span>
                )}
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Select value={moduleFilter} onValueChange={setModuleFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {MOCK_SAP_MODULES.map(m => (
                        <SelectItem key={m.code} value={m.code}>{m.code} - {m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="SAP Help">SAP Help</SelectItem>
                      <SelectItem value="SAP Press">SAP Press</SelectItem>
                      <SelectItem value="Authored">Authored</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="7d">Past Week</SelectItem>
                      <SelectItem value="30d">Past Month</SelectItem>
                      <SelectItem value="90d">Past 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  {(moduleFilter !== 'all' || sourceFilter !== 'all' || timeFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setModuleFilter('all')
                        setSourceFilter('all')
                        setTimeFilter('all')
                      }}
                      className="gap-1 text-muted-foreground"
                    >
                      <X className="h-3 w-3" />
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {!activeQuery ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">Search the Domain Knowledge Base</h3>
              <p className="page-description mt-1 max-w-md">
                Enter a search term to find articles across SAP modules, transaction codes, and configuration guides.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery('credit hold release'); setActiveQuery('credit hold release') }}>
                  credit hold release
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery('pricing procedure'); setActiveQuery('pricing procedure') }}>
                  pricing procedure
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery('goods receipt'); setActiveQuery('goods receipt') }}>
                  goods receipt
                </Button>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No results found</h3>
              <p className="page-description mt-1">
                Try different keywords or adjust your filters
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {searchResults.map((result) => {
                const module = MOCK_SAP_MODULES.find(m => m.code === result.module)
                return (
                  <Link 
                    key={result.id}
                    href={`/knowledge-center/domain/${result.module.toLowerCase()}/articles/${result.id}`}
                  >
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                      <CardContent>
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded flex items-center justify-center text-white font-mono font-bold text-sm shrink-0",
                            moduleColors[result.module] || 'bg-slate-500'
                          )}>
                            {result.module}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-medium text-base">
                                {highlightMatch(result.title, activeQuery)}
                              </h3>
                              <Badge className={cn("text-xs shrink-0", sourceColors[result.source])}>
                                {result.source}
                              </Badge>
                            </div>
                            <p className="page-description line-clamp-2 mb-2">
                              {highlightMatch(result.snippet, activeQuery)}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ChevronRight className="h-3 w-3" />
                                {module?.name} / {result.subArea}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {result.viewCount}
                              </span>
                              <span>•</span>
                              <span>{formatRelativeTime(result.lastUpdated)}</span>
                              <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">
                                Score: {result.relevanceScore}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="shrink-0">
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

export default function DomainKBSearchPage() {
  return (
    <Suspense fallback={
      <AppShell currentApp="knowledge-center">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
