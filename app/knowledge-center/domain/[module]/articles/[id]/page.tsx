'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ChevronRight,
  Edit,
  MessageSquare,
  Lightbulb,
  Flag,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  TestTube2,
  BookOpen,
  Clock,
  User,
  Send,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
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

// Sample article content (markdown-like)
const ARTICLE_CONTENT = `
## Overview

Sales document types are fundamental configuration objects in SAP SD that control the behavior and characteristics of sales transactions. Each document type defines how the system processes sales orders, quotations, contracts, and other sales-related documents.

## Key Configuration Elements

### Document Type Settings

The following settings are controlled by the document type:

- **Number Range Assignment** - Determines the document number range for internal and external numbering
- **Item Categories Allowed** - Controls which item categories can be used within documents of this type
- **Schedule Line Categories** - Defines the default schedule line category for availability check and delivery scheduling
- **Pricing Procedure Determination** - Influences which pricing procedure is used through the document pricing procedure field

### Important Fields

| Field | Description | Typical Values |
|-------|-------------|----------------|
| SD Document Category | Categorizes the document | A (Inquiry), B (Quotation), C (Order) |
| Document Pricing Procedure | Used in pricing determination | A (Standard), B (Rebate) |
| Billing Relevance | Controls billing document creation | A (Delivery-related), B (Order-related) |

## Configuration Path

Navigate to: **SPRO → Sales and Distribution → Sales → Sales Documents → Sales Document Header → Define Sales Document Types**

Transaction: **VOV8**

## Best Practices

1. **Naming Convention** - Use a consistent naming convention that identifies the document purpose (e.g., ZORD for custom sales orders)
2. **Copy Control** - Always configure copy control to enable document flow between related documents
3. **Number Ranges** - Assign separate number ranges for different document types to aid in reporting
4. **Testing** - Thoroughly test new document types in a non-production environment

## Related Configuration

- Pricing Procedure Determination (V/08)
- Item Category Determination
- Schedule Line Category Determination
- Partner Determination Procedure

## SAP Notes

- **SAP Note 203354** - Document type configuration checklist
- **SAP Note 1680992** - Performance optimization for high-volume sales documents
`

// Sample comments
const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: 'J.Rao',
    role: 'QA Lead',
    content: 'Great article! Should we add a section about the interaction with incompletion procedures? @P.Sharma',
    timestamp: '2026-05-05T14:30:00+05:30',
  },
  {
    id: 'c2',
    author: 'P.Sharma',
    role: 'Migration Manager',
    content: 'Good suggestion @J.Rao. I\'ll add that in the next revision. Also noting that the billing relevance table could use more examples.',
    timestamp: '2026-05-05T16:00:00+05:30',
  },
]

export default function ArticleDetailPage() {
  const params = useParams()
  const moduleCode = (params.module as string).toUpperCase()
  const articleId = params.id as string
  
  const module = MOCK_SAP_MODULES.find(m => m.code === moduleCode)
  const article = MOCK_KB_ARTICLES.find(a => a.id === articleId)
  const [newComment, setNewComment] = React.useState('')

  if (!module || !article) {
    return (
      <AppShell currentApp="knowledge-center">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="section-title mb-2">Article not found</h2>
            <Link href="/knowledge-center/domain">
              <Button variant="outline">Back to Domain KB</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  const sourceColors: Record<ArticleSource, string> = {
    'SAP Help': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'SAP Press': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Authored': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Community': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  }

  // Get related articles
  const relatedArticles = MOCK_KB_ARTICLES.filter(a => 
    article.relatedArticleIds.includes(a.id)
  )

  // TOC items (simulated from content)
  const tocItems = [
    'Overview',
    'Key Configuration Elements',
    'Configuration Path',
    'Best Practices',
    'Related Configuration',
    'SAP Notes',
  ]

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
              <Link href="/knowledge-center/domain" className="hover:text-foreground transition-colors">
                Domain KB
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/knowledge-center/domain/${moduleCode.toLowerCase()}`} className="hover:text-foreground transition-colors">
                {module.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-muted-foreground">{article.subArea}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium truncate max-w-[200px]">{article.title}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={cn("text-xs", sourceColors[article.source])}>
                    {article.source}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {article.version}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Updated {formatRelativeTime(article.lastUpdated)}
                  </span>
                </div>
                <h1 className="page-title">{article.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Comment</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Suggest</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Flag className="h-4 w-4" />
                  <span className="hidden sm:inline">Review</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex">
              {/* TOC Sidebar (desktop) */}
              <div className="w-48 shrink-0 hidden lg:block border-r">
                <div className="p-4 sticky top-0">
                  <h3 className="font-semibold text-sm mb-3">On This Page</h3>
                  <nav className="space-y-1">
                    {tocItems.map((item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                      >
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Article Body */}
              <div className="flex-1 p-4 md:p-6 max-w-3xl">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {/* Render markdown-like content */}
                  <div className="space-y-6">
                    <section id="overview">
                      <h2 className="section-title mb-3">Overview</h2>
                      <p className="page-description">
                        Sales document types are fundamental configuration objects in SAP SD that control the behavior and characteristics of sales transactions. Each document type defines how the system processes sales orders, quotations, contracts, and other sales-related documents.
                      </p>
                    </section>

                    <section id="key-configuration-elements">
                      <h2 className="section-title mb-3">Key Configuration Elements</h2>
                      <h3 className="text-base font-medium mb-2">Document Type Settings</h3>
                      <p className="page-description mb-3">The following settings are controlled by the document type:</p>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li><strong>Number Range Assignment</strong> - Determines the document number range for internal and external numbering</li>
                        <li><strong>Item Categories Allowed</strong> - Controls which item categories can be used within documents of this type</li>
                        <li><strong>Schedule Line Categories</strong> - Defines the default schedule line category for availability check and delivery scheduling</li>
                        <li><strong>Pricing Procedure Determination</strong> - Influences which pricing procedure is used through the document pricing procedure field</li>
                      </ul>

                      <h3 className="text-base font-medium mt-4 mb-2">Important Fields</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left p-2 border-b">Field</th>
                              <th className="text-left p-2 border-b">Description</th>
                              <th className="text-left p-2 border-b">Typical Values</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 border-b">SD Document Category</td>
                              <td className="p-2 border-b text-muted-foreground">Categorizes the document</td>
                              <td className="p-2 border-b text-muted-foreground">A (Inquiry), B (Quotation), C (Order)</td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b">Document Pricing Procedure</td>
                              <td className="p-2 border-b text-muted-foreground">Used in pricing determination</td>
                              <td className="p-2 border-b text-muted-foreground">A (Standard), B (Rebate)</td>
                            </tr>
                            <tr>
                              <td className="p-2 border-b">Billing Relevance</td>
                              <td className="p-2 border-b text-muted-foreground">Controls billing document creation</td>
                              <td className="p-2 border-b text-muted-foreground">A (Delivery-related), B (Order-related)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section id="configuration-path">
                      <h2 className="section-title mb-3">Configuration Path</h2>
                      <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                        <p>SPRO → Sales and Distribution → Sales → Sales Documents → Sales Document Header → Define Sales Document Types</p>
                        <p className="page-description mt-2">Transaction: <strong>VOV8</strong></p>
                      </div>
                    </section>

                    <section id="best-practices">
                      <h2 className="section-title mb-3">Best Practices</h2>
                      <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                        <li><strong>Naming Convention</strong> - Use a consistent naming convention that identifies the document purpose (e.g., ZORD for custom sales orders)</li>
                        <li><strong>Copy Control</strong> - Always configure copy control to enable document flow between related documents</li>
                        <li><strong>Number Ranges</strong> - Assign separate number ranges for different document types to aid in reporting</li>
                        <li><strong>Testing</strong> - Thoroughly test new document types in a non-production environment</li>
                      </ol>
                    </section>

                    <section id="related-configuration">
                      <h2 className="section-title mb-3">Related Configuration</h2>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Pricing Procedure Determination (V/08)</li>
                        <li>Item Category Determination</li>
                        <li>Schedule Line Category Determination</li>
                        <li>Partner Determination Procedure</li>
                      </ul>
                    </section>

                    <section id="sap-notes">
                      <h2 className="section-title mb-3">SAP Notes</h2>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">203354</Badge>
                          <span className="text-muted-foreground">Document type configuration checklist</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">1680992</Badge>
                          <span className="text-muted-foreground">Performance optimization for high-volume sales documents</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </li>
                      </ul>
                    </section>
                  </div>
                </div>

                {/* Comments Section */}
                <Separator className="my-8" />
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments ({MOCK_COMMENTS.length})
                  </h3>
                  <div className="space-y-4 mb-6">
                    {MOCK_COMMENTS.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {comment.author.split('.').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.role}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.timestamp)}</span>
                          </div>
                          <p className="page-description">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">PS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment... Use @mentions to notify others"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" className="gap-2">
                          <Send className="h-4 w-4" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-72 border-l bg-muted/30 overflow-y-auto hidden xl:block">
            <div className="p-4 space-y-6">
              {/* Related Articles */}
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Related Articles
                </h3>
                <div className="space-y-2">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/knowledge-center/domain/${related.module.toLowerCase()}/articles/${related.id}`}
                      className="block p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <p className="text-sm font-medium line-clamp-2">{related.title}</p>
                      <p className="caption-text mt-1">{related.module} · {related.subArea}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Referenced By */}
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <TestTube2 className="h-4 w-4" />
                  Referenced By
                </h3>
                <p className="page-description mb-2">
                  {article.referencedByTestCases} Test Cases cite this article
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Test Cases
                </Button>
              </div>

              {/* Source Detail */}
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Source Detail
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source</span>
                    <span>{article.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>{article.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views</span>
                    <span>{article.viewCount.toLocaleString()}</span>
                  </div>
                </div>
                {article.source === 'SAP Help' && (
                  <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
                    <ExternalLink className="h-3 w-3" />
                    View on SAP Help
                  </Button>
                )}
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-sm mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
