'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Building2,
  FileText,
  Code2,
  Users,
  Clock,
  ChevronRight,
  Search,
  Plus,
  Filter,
  FolderOpen,
  Sparkles,
  Lock,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { MOCK_ORG_ARTICLES, MOCK_ORG_ZOBJECTS, type OrgArticle, type OrgZObject } from '@/lib/kb-mock-data'

// Org KB categories
const ORG_CATEGORIES = [
  { id: 'all', label: 'All Content', icon: FolderOpen, count: MOCK_ORG_ARTICLES.length + MOCK_ORG_ZOBJECTS.length },
  { id: 'articles', label: 'Articles', icon: FileText, count: MOCK_ORG_ARTICLES.length },
  { id: 'zobjects', label: 'Z-Objects', icon: Code2, count: MOCK_ORG_ZOBJECTS.length },
  { id: 'runbooks', label: 'Runbooks', icon: Sparkles, count: 3 },
]

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export default function OrgKBPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [visibilityFilter, setVisibilityFilter] = React.useState<string>('all')
  
  // Filter articles
  const filteredArticles = MOCK_ORG_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesVisibility = visibilityFilter === 'all' || article.visibility === visibilityFilter
    return matchesSearch && matchesVisibility
  })
  
  // Filter Z-objects
  const filteredZObjects = MOCK_ORG_ZOBJECTS.filter(zobj => {
    const matchesSearch = zobj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          zobj.object_type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })
  
  const showArticles = categoryFilter === 'all' || categoryFilter === 'articles'
  const showZObjects = categoryFilter === 'all' || categoryFilter === 'zobjects'
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Organization Knowledge Base</h1>
                <p className="page-description mt-1">
                  Customer-specific articles, Z-object documentation, and runbooks. Content is private to your organization.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link href="/knowledge-center/org/search">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                  </Link>
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Article</span>
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              {ORG_CATEGORIES.map(category => {
                const Icon = category.icon
                return (
                  <Card 
                    key={category.id}
                    className={cn(
                      'cursor-pointer hover:border-primary/50 transition-colors',
                      categoryFilter === category.id && 'border-primary bg-primary/5'
                    )}
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-xl font-bold">{category.count}</div>
                          <div className="text-xs text-muted-foreground">{category.label}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </StaggerGrid>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles, Z-objects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="org">Organization Only</SelectItem>
                  <SelectItem value="workspace">Workspace Only</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Articles Section */}
            {showArticles && filteredArticles.length > 0 && (
              <div>
                <h2 className="section-title mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Articles
                  <Badge variant="secondary">{filteredArticles.length}</Badge>
                </h2>
                <div className="grid gap-3">
                  {filteredArticles.map(article => (
                    <Card key={article.id} className="hover:border-primary/50 transition-colors">
                      <CardContent>
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Link 
                                href={`/knowledge-center/org/articles/${article.id}`}
                                className="font-medium hover:underline"
                              >
                                {article.title}
                              </Link>
                              {article.visibility === 'org' && (
                                <Badge variant="outline" className="text-xs gap-1">
                                  <Lock className="h-3 w-3" />
                                  Org Only
                                </Badge>
                              )}
                            </div>
                            <p className="page-description line-clamp-2">
                              {article.summary}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {article.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(article.updated_at)}
                              </span>
                              <div className="flex gap-1">
                                {article.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-[10px]">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Z-Objects Section */}
            {showZObjects && filteredZObjects.length > 0 && (
              <div>
                <h2 className="section-title mb-3 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-muted-foreground" />
                  Z-Objects
                  <Badge variant="secondary">{filteredZObjects.length}</Badge>
                </h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filteredZObjects.map(zobj => (
                    <Card key={zobj.id} className="hover:border-primary/50 transition-colors">
                      <CardContent>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link 
                              href={`/knowledge-center/org/zobjects/${zobj.id}`}
                              className="font-mono text-sm font-medium hover:underline"
                            >
                              {zobj.name}
                            </Link>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {zobj.object_type}
                            </Badge>
                          </div>
                          {zobj.has_test_coverage && (
                            <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="page-description mt-2 line-clamp-2">
                          {zobj.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Badge variant="secondary">{zobj.module}</Badge>
                          <span>{zobj.lines_of_code} LOC</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {!showArticles && !showZObjects && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg">No content found</h3>
                <p className="page-description mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
