'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Clock,
  Users,
  Lock,
  Eye,
  ChevronRight,
  FileText,
  Share2,
  Trash2,
  History,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  ExternalLink,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { MOCK_ORG_ARTICLES } from '@/lib/kb-mock-data'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function OrgArticleDetailPage() {
  const params = useParams()
  const articleId = params.id as string
  
  const article = MOCK_ORG_ARTICLES.find(a => a.id === articleId) || MOCK_ORG_ARTICLES[0]
  
  // Sample related articles
  const relatedArticles = MOCK_ORG_ARTICLES.filter(a => a.id !== articleId).slice(0, 3)
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/knowledge-center/org" className="hover:text-foreground">Org KB</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/knowledge-center/org" className="hover:text-foreground">Articles</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground truncate">{article.title}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Link href="/knowledge-center/org">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="page-title">{article.title}</h1>
                    {article.visibility === 'org' && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Org Only
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Updated {formatDate(article.updated_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.view_count} views
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <History className="h-4 w-4 mr-2" />
                      View History
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              {/* Main Content */}
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardContent className="md:">
                    <p className="page-description italic">
                      {article.summary}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Article Body */}
                <Card>
                  <CardContent className="md: prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
                  </CardContent>
                </Card>
                
                {/* Linked Resources */}
                {article.linked_zobjects && article.linked_zobjects.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Linked Z-Objects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {article.linked_zobjects.map(zobj => (
                          <Link key={zobj} href={`/knowledge-center/org/zobjects/${zobj}`}>
                            <Badge variant="outline" className="font-mono hover:bg-muted">
                              {zobj}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Feedback */}
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Was this article helpful?</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          Yes ({article.helpful_count})
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <MessageSquare className="h-4 w-4" />
                          Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-4 hidden lg:block">
                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Article Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Article Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated</span>
                      <span>{formatDate(article.updated_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version</span>
                      <span>{article.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views</span>
                      <span>{article.view_count}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Author */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {article.author.split('.').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{article.author}</div>
                        <div className="text-xs text-muted-foreground">Star Cement</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Related Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedArticles.map(related => (
                      <Link 
                        key={related.id}
                        href={`/knowledge-center/org/articles/${related.id}`}
                        className="block hover:underline"
                      >
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-sm line-clamp-2">{related.title}</span>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
