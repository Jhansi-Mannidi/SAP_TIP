'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Search,
  FileText,
  Code2,
  Sparkles,
  ChevronRight,
  X,
  Lock,
  Filter,
  Clock,
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

import { MOCK_ORG_ARTICLES, MOCK_ORG_ZOBJECTS } from '@/lib/kb-mock-data'

type ResultType = 'article' | 'zobject' | 'runbook'

interface SearchResult {
  id: string
  type: ResultType
  title: string
  subtitle: string
  matchContext?: string
  href: string
  visibility?: string
}

export default function OrgKBSearchPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [isSearching, setIsSearching] = React.useState(false)
  
  // Build search results
  const allResults: SearchResult[] = React.useMemo(() => {
    const results: SearchResult[] = []
    
    MOCK_ORG_ARTICLES.forEach(article => {
      results.push({
        id: article.id,
        type: 'article',
        title: article.title,
        subtitle: `Article by ${article.author}`,
        matchContext: article.summary,
        href: `/knowledge-center/org/articles/${article.id}`,
        visibility: article.visibility,
      })
    })
    
    MOCK_ORG_ZOBJECTS.forEach(zobj => {
      results.push({
        id: zobj.id,
        type: 'zobject',
        title: zobj.name,
        subtitle: `${zobj.object_type} - ${zobj.module}`,
        matchContext: zobj.description,
        href: `/knowledge-center/org/zobjects/${zobj.id}`,
      })
    })
    
    // Add sample runbooks
    results.push({
      id: 'rb_1',
      type: 'runbook',
      title: 'Month-End Close Runbook',
      subtitle: 'Finance closing procedures',
      matchContext: 'Step-by-step guide for month-end closing activities',
      href: '/knowledge-center/org/runbooks/rb_1',
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
      return matchesQuery && matchesType
    })
  }, [searchQuery, typeFilter, allResults])
  
  React.useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      const timer = setTimeout(() => setIsSearching(false), 300)
      return () => clearTimeout(timer)
    }
  }, [searchQuery])
  
  const getTypeIcon = (type: ResultType) => {
    switch (type) {
      case 'article': return FileText
      case 'zobject': return Code2
      case 'runbook': return Sparkles
    }
  }
  
  const getTypeColor = (type: ResultType) => {
    switch (type) {
      case 'article': return 'bg-emerald-500'
      case 'zobject': return 'bg-violet-500'
      case 'runbook': return 'bg-amber-500'
    }
  }
  
  // Recent searches
  const recentSearches = ['pricing', 'Z_SD_PRICING', 'month-end', 'material master']
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/knowledge-center/org" className="hover:text-foreground">Org KB</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Search</span>
            </div>
            
            <h1 className="page-title">Search Organization KB</h1>
            <p className="page-description mt-1">
              Search your organization&apos;s private knowledge base
            </p>
            
            {/* Search Input */}
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles, Z-objects, runbooks..."
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
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="zobject">Z-Objects</SelectItem>
                    <SelectItem value="runbook">Runbooks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {!searchQuery.trim() ? (
            <div className="max-w-xl mx-auto">
              {/* Recent Searches */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(term => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Search Tips */}
              <Card>
                <CardContent>
                  <h3 className="font-medium mb-3">Search Tips</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Search for Z-object names like &quot;Z_SD_PRICING&quot;</li>
                    <li>Find articles by topic like &quot;month-end close&quot;</li>
                    <li>Search by module like &quot;SD&quot; or &quot;FI&quot;</li>
                    <li>Look for runbooks by process name</li>
                  </ul>
                </CardContent>
              </Card>
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
                Try different keywords or check your filters
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-3">
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
                              <h3 className={cn(
                                'font-medium',
                                result.type === 'zobject' && 'font-mono'
                              )}>
                                {result.title}
                              </h3>
                              <Badge variant="outline" className="text-xs capitalize">
                                {result.type === 'zobject' ? 'Z-Object' : result.type}
                              </Badge>
                              {result.visibility === 'org' && (
                                <Badge variant="outline" className="text-xs gap-1">
                                  <Lock className="h-3 w-3" />
                                  Org
                                </Badge>
                              )}
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
