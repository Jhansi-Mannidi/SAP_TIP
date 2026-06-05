'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn, formatRelativeTime } from '@/lib/utils'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, AnimatedNumber, fadeInUp } from '@/lib/animations'
import Link from 'next/link'
import {
  Search,
  Filter,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Send,
  History,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock sign-off requests
const MOCK_SIGNOFF_REQUESTS = [
  {
    id: 'SOR-001',
    title: 'Order to Cash Test Pack - UAT Sign-Off',
    type: 'Test Pack',
    migration: 'Star Cement S/4HANA',
    requestedBy: { name: 'Alex Chen', initials: 'AC' },
    requestedAt: '2024-01-15T10:30:00Z',
    dueDate: '2024-01-18',
    status: 'pending',
    priority: 'high',
    approvers: [
      { name: 'Sarah Johnson', initials: 'SJ', status: 'pending' },
      { name: 'Mike Peters', initials: 'MP', status: 'pending' },
    ],
    evidenceCount: 12,
    scenariosPassed: 24,
    scenariosTotal: 24,
    comments: 3,
  },
  {
    id: 'SOR-002',
    title: 'Procure to Pay - Integration Test Approval',
    type: 'Test Run',
    migration: 'Star Cement S/4HANA',
    requestedBy: { name: 'Maria Garcia', initials: 'MG' },
    requestedAt: '2024-01-14T14:00:00Z',
    dueDate: '2024-01-17',
    status: 'in-review',
    priority: 'medium',
    approvers: [
      { name: 'Sarah Johnson', initials: 'SJ', status: 'approved' },
      { name: 'David Kim', initials: 'DK', status: 'pending' },
    ],
    evidenceCount: 8,
    scenariosPassed: 16,
    scenariosTotal: 18,
    comments: 5,
  },
  {
    id: 'SOR-003',
    title: 'Finance Module - Regression Complete',
    type: 'Regression',
    migration: 'Vertex Industries',
    requestedBy: { name: 'Tom Wilson', initials: 'TW' },
    requestedAt: '2024-01-13T09:15:00Z',
    dueDate: '2024-01-16',
    status: 'approved',
    priority: 'low',
    approvers: [
      { name: 'Lisa Anderson', initials: 'LA', status: 'approved' },
    ],
    evidenceCount: 6,
    scenariosPassed: 12,
    scenariosTotal: 12,
    comments: 2,
  },
  {
    id: 'SOR-004',
    title: 'HR Module - Performance Test Sign-Off',
    type: 'Performance',
    migration: 'Northwind Manufacturing',
    requestedBy: { name: 'Emily Brown', initials: 'EB' },
    requestedAt: '2024-01-12T16:45:00Z',
    dueDate: '2024-01-15',
    status: 'rejected',
    priority: 'high',
    approvers: [
      { name: 'James Lee', initials: 'JL', status: 'rejected' },
    ],
    evidenceCount: 4,
    scenariosPassed: 8,
    scenariosTotal: 10,
    comments: 7,
    rejectionReason: 'Performance test results show response times above acceptable thresholds for payroll processing.',
  },
]

export default function SignOffRequestsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [selectedRequest, setSelectedRequest] = React.useState<typeof MOCK_SIGNOFF_REQUESTS[0] | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false)
  const [reviewComment, setReviewComment] = React.useState('')

  // Filter logic
  const filteredRequests = MOCK_SIGNOFF_REQUESTS.filter(req => {
    if (searchQuery && !req.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (statusFilter !== 'all' && req.status !== statusFilter) return false
    return true
  })

  const pendingCount = MOCK_SIGNOFF_REQUESTS.filter(r => r.status === 'pending').length
  const inReviewCount = MOCK_SIGNOFF_REQUESTS.filter(r => r.status === 'in-review').length
  const approvedCount = MOCK_SIGNOFF_REQUESTS.filter(r => r.status === 'approved').length
  const rejectedCount = MOCK_SIGNOFF_REQUESTS.filter(r => r.status === 'rejected').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'in-review':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30"><Eye className="h-3 w-3 mr-1" />In Review</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleReview = (action: 'approve' | 'reject') => {
    // In a real app, this would make an API call
    console.log(`${action} request ${selectedRequest?.id} with comment: ${reviewComment}`)
    setIsReviewDialogOpen(false)
    setReviewComment('')
    setSelectedRequest(null)
  }

  return (
    <AppShell currentApp="evidence-portal">
      <div className="space-y-6">
        {/* Animated Header */}
        <motion.div 
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="page-title">Sign-Off Requests</h1>
            <p className="page-description">
              Review and approve test completion sign-off requests
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </motion.div>
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card className="cursor-pointer hover:border-amber-500/50 transition-colors" onClick={() => setStatusFilter('pending')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="stat-value"><AnimatedNumber value={pendingCount} /></p>
                    <p className="caption-text">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setStatusFilter('in-review')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Eye className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="stat-value"><AnimatedNumber value={inReviewCount} /></p>
                    <p className="caption-text">In Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => setStatusFilter('approved')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="stat-value"><AnimatedNumber value={approvedCount} /></p>
                    <p className="caption-text">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="cursor-pointer hover:border-red-500/50 transition-colors" onClick={() => setStatusFilter('rejected')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="stat-value"><AnimatedNumber value={rejectedCount} /></p>
                    <p className="caption-text">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(request.status)}
                      <Badge variant="outline">{request.type}</Badge>
                      {request.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">High Priority</Badge>
                      )}
                    </div>
                    <h3 className="font-medium">{request.title}</h3>
                    <p className="page-description">{request.migration}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>By {request.requestedBy.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(request.requestedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due {request.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{request.evidenceCount} evidence files</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{request.comments} comments</span>
                      </div>
                    </div>
                    {request.rejectionReason && (
                      <div className="mt-2 p-2 rounded bg-red-500/10 text-sm text-red-600">
                        <strong>Rejection reason:</strong> {request.rejectionReason}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 lg:items-end">
                    {/* Approvers */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Approvers:</span>
                      <div className="flex -space-x-2">
                        {request.approvers.map((approver, idx) => (
                          <Avatar key={idx} className={cn(
                            'h-7 w-7 border-2 border-background',
                            approver.status === 'approved' && 'ring-2 ring-emerald-500',
                            approver.status === 'rejected' && 'ring-2 ring-red-500'
                          )}>
                            <AvatarFallback className="text-xs">{approver.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    {/* Pass rate */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Passed:</span>
                      <span className={cn(
                        'font-medium',
                        request.scenariosPassed === request.scenariosTotal ? 'text-emerald-600' : 'text-amber-600'
                      )}>
                        {request.scenariosPassed}/{request.scenariosTotal}
                      </span>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/evidence-portal/signoffs/${request.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {(request.status === 'pending' || request.status === 'in-review') && (
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsReviewDialogOpen(true)
                          }}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center">
              <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No sign-off requests found</h3>
              <p className="page-description mb-4">
                {statusFilter !== 'all' ? 'Try changing the filter or ' : ''}No requests match your criteria
              </p>
              {statusFilter !== 'all' && (
                <Button variant="outline" onClick={() => setStatusFilter('all')}>
                  Clear filter
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredRequests.length} of {MOCK_SIGNOFF_REQUESTS.length} requests
        </div>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Review Sign-Off Request</DialogTitle>
              <DialogDescription>
                {selectedRequest?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-sm">
                <p className="page-description mb-1">Test Results</p>
                <p className="font-medium">
                  {selectedRequest?.scenariosPassed}/{selectedRequest?.scenariosTotal} scenarios passed
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Review Comment
                </label>
                <Textarea
                  placeholder="Add your review comments..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleReview('reject')}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleReview('approve')}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
