'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Plus,
  MoreHorizontal,
  Code2,
  ExternalLink,
  Copy,
  Trash2,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

// Mock IR data
const MOCK_IRS = [
  {
    id: 'ir_va01_create',
    name: 'Create Sales Order VA01',
    tcode: 'VA01',
    test_case_id: 'tc_1',
    test_case_name: 'Create Sales Order via VA01',
    version: '2.3.0',
    step_count: 14,
    is_valid: true,
    last_modified: '2026-05-07T10:00:00+05:30',
    modified_by: 'P.Sharma',
  },
  {
    id: 'ir_me21n_create',
    name: 'Create Purchase Order ME21N',
    tcode: 'ME21N',
    test_case_id: 'tc_2',
    test_case_name: 'Create Purchase Order via ME21N',
    version: '3.1.0',
    step_count: 12,
    is_valid: true,
    last_modified: '2026-05-06T14:30:00+05:30',
    modified_by: 'J.Rao',
  },
  {
    id: 'ir_fb01_post',
    name: 'Post Journal Entry FB01',
    tcode: 'FB01',
    test_case_id: 'tc_3',
    test_case_name: 'Post Journal Entry via FB01',
    version: '1.5.0',
    step_count: 8,
    is_valid: true,
    last_modified: '2026-05-05T09:00:00+05:30',
    modified_by: 'A.Mehta',
  },
  {
    id: 'ir_migo_gr',
    name: 'Goods Receipt MIGO',
    tcode: 'MIGO',
    test_case_id: 'tc_4',
    test_case_name: 'Goods Receipt via MIGO',
    version: '2.0.0',
    step_count: 9,
    is_valid: false, // Has validation issues
    last_modified: '2026-05-04T16:00:00+05:30',
    modified_by: 'M.Reddy',
  },
  {
    id: 'ir_miro_iv',
    name: 'Invoice Verification MIRO',
    tcode: 'MIRO',
    test_case_id: 'tc_5',
    test_case_name: 'Invoice Verification via MIRO',
    version: '1.8.0',
    step_count: 11,
    is_valid: true,
    last_modified: '2026-05-03T11:00:00+05:30',
    modified_by: 'S.Kumar',
  },
]

export default function IRBrowserPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  const filteredIRs = MOCK_IRS.filter(ir => 
    ir.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ir.tcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ir.id.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }
  
  if (isLoading) {
    return (
      <AppShell currentApp="test-repository">
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AppShell>
    )
  }
  
  return (
    <AppShell currentApp="test-repository">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">IR Browser</h1>
            <p className="page-description">
              Browse and edit Intermediate Representations for test cases
            </p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New IR
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, T-code, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IR ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>T-Code</TableHead>
                <TableHead>Test Case</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIRs.map(ir => (
                <TableRow key={ir.id}>
                  <TableCell>
                    <Link 
                      href={`/test-repository/ir/${ir.id}`}
                      className="font-mono text-sm text-primary hover:underline"
                    >
                      {ir.id}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">{ir.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {ir.tcode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/test-repository/tasks/${ir.test_case_id}`}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {ir.test_case_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      v{ir.version}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileCode2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{ir.step_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ir.is_valid ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">Valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs">Issues</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatRelativeTime(ir.last_modified)}</div>
                      <div className="text-xs text-muted-foreground">{ir.modified_by}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/test-repository/ir/${ir.id}`}>
                            <Code2 className="h-4 w-4 mr-2" />
                            Edit IR
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Test Case
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  )
}
