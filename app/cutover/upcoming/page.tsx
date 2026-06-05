'use client'

import * as React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ChevronRight, Rocket, ListChecks } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { MOCK_UPCOMING_WINDOWS } from '@/lib/cutover-mock-data'

export default function UpcomingWindowsPage() {
  const windows = MOCK_UPCOMING_WINDOWS

  return (
    <AppShell currentApp="cutover-command">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="page-title">Upcoming Cutover Windows</h1>
            <p className="page-description mt-1">Scheduled cutover sessions awaiting execution</p>
          </div>

          {/* Windows List */}
          <div className="space-y-4">
            {windows.map((window) => {
              const plannedStart = new Date(window.planned_start)
              const plannedEnd = new Date(window.planned_end)
              const daysUntil = Math.ceil((plannedStart.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              
              return (
                <Card key={window.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{window.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Rocket className="h-3.5 w-3.5" />
                          {window.migration_name}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4 mb-4" fast>
                      <div>
                        <p className="caption-text">Planned Start</p>
                        <p className="font-medium text-sm flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {plannedStart.toLocaleDateString()}
                        </p>
                        <p className="caption-text">
                          {plannedStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <p className="caption-text">Planned End</p>
                        <p className="font-medium text-sm flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          {plannedEnd.toLocaleDateString()}
                        </p>
                        <p className="caption-text">
                          {plannedEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div>
                        <p className="caption-text">Total Tasks</p>
                        <p className="font-medium text-sm flex items-center gap-1">
                          <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
                          {window.total_tasks}
                        </p>
                      </div>
                      <div>
                        <p className="caption-text">Status</p>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {window.status}
                        </Badge>
                      </div>
                    </StaggerGrid>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cutover/windows/${window.id}`}>
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/cutover/windows/${window.id}/plan`}>
                          View Plan
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
            {windows.length === 0 && (
              <Card>
                <CardContent className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="page-description">No upcoming cutover windows scheduled</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
