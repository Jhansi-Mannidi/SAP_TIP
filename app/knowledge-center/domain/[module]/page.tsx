'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Search, 
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Download,
  Eye,
  ArrowLeft,
  FileText,
  ExternalLink,
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
import { cn } from '@/lib/utils'

import { MOCK_SAP_MODULES, MOCK_KB_ARTICLES, type ArticleSource } from '@/lib/kb-mock-data'

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

interface NavItemProps {
  name: string
  articleCount: number
  children?: { name: string; articleCount: number }[]
  isSelected: boolean
  onSelect: () => void
  level?: number
}

function NavItem({ name, articleCount, children, isSelected, onSelect, level = 0 }: NavItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasChildren = children && children.length > 0

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setIsExpanded(!isExpanded)
          onSelect()
        }}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left",
          isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent",
          level > 0 && "ml-4"
        )}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )
        ) : (
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="flex-1 truncate">{name}</span>
        <Badge variant="secondary" className="text-xs shrink-0">
          {articleCount}
        </Badge>
      </button>
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {children.map((child) => (
            <NavItem
              key={child.name}
              name={child.name}
              articleCount={child.articleCount}
              isSelected={false}
              onSelect={() => {}}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// KBArticleCard component
function KBArticleCard({ article, moduleColor }: { article: typeof MOCK_KB_ARTICLES[0], moduleColor: string }) {
  const sourceColors: Record<ArticleSource, string> = {
    'SAP Help': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'SAP Press': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Authored': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Community': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  }

  return (
    <Link href={`/knowledge-center/domain/${article.module.toLowerCase()}/articles/${article.id}`}>
      <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-medium group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </CardTitle>
            <Badge className={cn("text-xs shrink-0", sourceColors[article.source])}>
              {article.source}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="page-description line-clamp-2 mb-3">
            {article.snippet}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatRelativeTime(article.lastUpdated)}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.viewCount}
              </span>
              <span>{article.referencedByTestCases} test refs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ModuleDetailPage() {
  const params = useParams()
  const moduleCode = (params.module as string).toUpperCase()
  
  const module = MOCK_SAP_MODULES.find(m => m.code === moduleCode)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sourceFilter, setSourceFilter] = React.useState<string>('all')
  const [selectedSubArea, setSelectedSubArea] = React.useState<string | null>(null)

  if (!module) {
    return (
      <AppShell currentApp="knowledge-center">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="section-title mb-2">Module not found</h2>
            <Link href="/knowledge-center/domain">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Modules
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  // Filter articles for this module
  const moduleArticles = MOCK_KB_ARTICLES.filter(a => a.module === moduleCode)
  const filteredArticles = moduleArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.snippet.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = sourceFilter === 'all' || article.source === sourceFilter
    const matchesSubArea = !selectedSubArea || article.subArea === selectedSubArea
    return matchesSearch && matchesSource && matchesSubArea
  })

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="page-breadcrumb mb-4">
              <Link href="/knowledge-center/domain" className="hover:text-foreground transition-colors">
                Domain KB
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{module.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-lg flex items-center justify-center text-white font-mono font-bold text-xl shrink-0",
                  module.color
                )}>
                  {module.code}
                </div>
                <div>
                  <h1 className="page-title">{module.name}</h1>
                  <p className="page-description mt-1">
                    {module.articleCount} articles · Last refresh: 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Refresh from SAP Help</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar - Navigation Tree */}
          <div className="w-64 border-r bg-muted/30 overflow-y-auto hidden md:block">
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-3">Sub-Areas</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubArea(null)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left",
                    !selectedSubArea ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent"
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1">All Articles</span>
                  <Badge variant="secondary" className="text-xs">
                    {moduleArticles.length}
                  </Badge>
                </button>
                {module.subAreas.map((subArea) => (
                  <NavItem
                    key={subArea.name}
                    name={subArea.name}
                    articleCount={subArea.articleCount}
                    children={subArea.children}
                    isSelected={selectedSubArea === subArea.name}
                    onSelect={() => setSelectedSubArea(subArea.name)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Article List */}
          <div className="flex-1 overflow-auto">
            {/* Filters */}
            <div className="p-4 border-b bg-background sticky top-0 z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search within module..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
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
                {/* Mobile sub-area selector */}
                <Select 
                  value={selectedSubArea || 'all'} 
                  onValueChange={(v) => setSelectedSubArea(v === 'all' ? null : v)}
                >
                  <SelectTrigger className="w-full sm:w-[180px] md:hidden">
                    <SelectValue placeholder="Sub-Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub-Areas</SelectItem>
                    {module.subAreas.map((subArea) => (
                      <SelectItem key={subArea.name} value={subArea.name}>
                        {subArea.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Article Grid */}
            <div className="p-4 md:p-6">
              {filteredArticles.length > 0 ? (
                <StaggerGrid columns="grid-cols-1 lg:grid-cols-2" className="gap-4" fast>
                  {filteredArticles.map((article) => (
                    <KBArticleCard key={article.id} article={article} moduleColor={module.color} />
                  ))}
                </StaggerGrid>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">No articles found</h3>
                  <p className="page-description mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
