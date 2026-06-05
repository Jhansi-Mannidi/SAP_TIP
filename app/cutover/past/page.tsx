'use client'

import * as React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ChevronRight, Rocket, CheckCircle, XCircle, FileText } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import { MOCK_PAST_WINDOWS } from '@/lib/cutover-mock-data'

export default function PastWindowsPage() {
  const windows = MOCK_PAST_WINDOWS

  return (
    <AppShell currentApp="cutover-command">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="page-title">Past Cutover Windows</h1>
            <p className="page-description mt-1">Historical cutover sessions and dress rehearsals</p>
          </div>

          {/* Windows List */}
          <div className="space-y-4">
            {windows.map((window) => {
              const plannedStart = new Date(window.planned_start)
              const actualEnd = window.actual_end ? new Date(window.actual_end) : null
              const successRate = Math.round((window.completed_tasks / window.total_tasks) * 100)
              
              return (
                <Card key={window.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{window.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Rocket className="h-3.5 w-3.5" />
                          {window.migration_name}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={window.failed_tasks === 0 ? 'default' : 'destructive'}
                        className={window.failed_tasks === 0 ? 'bg-emerald-500' : ''}
                      >
                        {window.failed_tasks === 0 ? 'Success' : `${window.failed_tasks} Failed`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <StaggerGrid columns="grid-cols-2 md:grid-cols-5" className="gap-4 mb-4" fast>
                      <div>
                        <p className="caption-text">Date</p>
                        <p className="font-medium text-sm flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {plannedStart.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="caption-text">Duration</p>
                        <p className="font-medium text-sm flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {actualEnd ? `${Math.round((actualEnd.getTime() - new Date(window.actual_start!).getTime()) / (1000 * 60 * 60))}h` : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="caption-text">Tasks</p>
                        <p className="font-medium text-sm flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          {window.completed_tasks}/{window.total_tasks}
                        </p>
                      </div>
                      <div>
                        <p className="caption-text">Decisions</p>
                        <p className="font-medium text-sm flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          {window.decision_count}
                        </p>
                      </div>
                      <div>
                        <p className="caption-text">Success Rate</p>
                        <div className="flex items-center gap-2">
                          <Progress value={successRate} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{successRate}%</span>
                        </div>
                      </div>
                    </StaggerGrid>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cutover/windows/${window.id}`}>
                          View Report
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cutover/windows/${window.id}/decisions`}>
                          Decision Log
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
