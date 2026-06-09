'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Search,
  Target,
  FileText,
  GitBranch,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Filter,
  X,
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

import { MOCK_BP_SCOPE_ITEMS, MOCK_BP_ARTICLES } from '@/lib/kb-mock-data'

type ResultType = 'scope_item' | 'article' | 'flow'

interface SearchResult {
  id: string
  type: ResultType
  title: string
  subtitle: string
  process?: string
  matchContext?: string
  href: string
}

export default function BPKBSearchPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [processFilter, setProcessFilter] = React.useState<string>('all')
  const [isSearching, setIsSearching] = React.useState(false)
  
  // Build search results from scope items and articles
  const allResults: SearchResult[] = React.useMemo(() => {
    const results: SearchResult[] = []
    
    // Add scope items
    MOCK_BP_SCOPE_ITEMS.forEach(item => {
      results.push({
        id: item.id,
        type: 'scope_item',
        title: item.title,
        subtitle: `${item.code} - ${item.businessProcess}`,
        process: item.businessProcess,
        matchContext: item.description,
        href: `/knowledge-center/bp/${item.id}`,
      })
    })
    
    // Add articles
    MOCK_BP_ARTICLES.forEach(article => {
      results.push({
        id: article.id,
        type: 'article',
        title: article.title,
        subtitle: `Article - ${article.scopeItemId}`,
        process: 'OTC',
        matchContext: article.description.substring(0, 200),
        href: `/knowledge-center/bp/${article.scopeItemId}/articles/${article.id}`,
      })
    })
    
    return results
  }, [])
  
  // Filter results
  const filteredResults = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    
    return allResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (result.matchContext?.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = typeFilter === 'all' || result.type === typeFilter
      const matchesProcess = processFilter === 'all' || result.process === processFilter
      return matchesQuery && matchesType && matchesProcess
    })
  }, [searchQuery, typeFilter, processFilter, allResults])
  
  // Simulate search delay
  React.useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 300)
      return () => clearTimeout(timer)
    }
  }, [searchQuery])
  
  const getTypeIcon = (type: ResultType) => {
    switch (type) {
      case 'scope_item': return Target
      case 'article': return FileText
      case 'flow': return GitBranch
    }
  }
  
  const getTypeColor = (type: ResultType) => {
    switch (type) {
      case 'scope_item': return 'bg-blue-500'
      case 'article': return 'bg-emerald-500'
      case 'flow': return 'bg-violet-500'
    }
  }
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="page-breadcrumb mb-2">
              <Link href="/knowledge-center/bp" className="hover:text-foreground">BP KB</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Search</span>
            </div>
            
            <h1 className="page-title">Search BP Knowledge Base</h1>
            <p className="page-description mt-1">
              Search across scope items, articles, and process flows
            </p>
            
            {/* Search Input */}
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for scope items, articles, processes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="scope_item">Scope Items</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="flow">Flows</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={processFilter} onValueChange={setProcessFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Processes</SelectItem>
                    <SelectItem value="OTC">OTC</SelectItem>
                    <SelectItem value="PTP">PTP</SelectItem>
                    <SelectItem value="RTR">RTR</SelectItem>
                  </SelectContent>
                </Select>
                
                {(typeFilter !== 'all' || processFilter !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setTypeFilter('all')
                      setProcessFilter('all')
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {!searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">AI-Powered Search</h3>
              <p className="page-description mt-1 max-w-md">
                Search across BP Scope Items, articles, and process flows. 
                Try searching for &quot;sales order&quot; or &quot;credit management&quot;.
              </p>
            </div>
          ) : isSearching ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No results found</h3>
              <p className="page-description mt-1">
                Try different keywords or adjust your filters
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground mb-4">
                {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
              </div>
              
              {filteredResults.map(result => {
                const Icon = getTypeIcon(result.type)
                
                return (
                  <Link key={result.id} href={result.href}>
                    <Card className="hover:border-primary/50 transition-colors">
                      <CardContent>
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                            getTypeColor(result.type)
                          )}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium">{result.title}</h3>
                              <Badge variant="outline" className="text-xs capitalize">
                                {result.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="section-description mt-0.5">
                              {result.subtitle}
                            </p>
                            {result.matchContext && (
                              <p className="page-description mt-2 line-clamp-2">
                                {result.matchContext}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
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
