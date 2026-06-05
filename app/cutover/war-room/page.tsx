'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Radio,
  Users,
  Bot,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Play,
  Milestone,
  Timer,
  MessageSquare,
  Bell,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

import {
  MOCK_ACTIVE_WINDOW,
  MOCK_WAR_ROOM_PARTICIPANTS,
  MOCK_WAR_ROOM_MESSAGES,
  MOCK_DECISIONS,
} from '@/lib/cutover-mock-data'

const statusColors = {
  Online: 'bg-emerald-500',
  Away: 'bg-amber-500',
  Offline: 'bg-gray-400',
}

export default function WarRoomPage() {
  const [message, setMessage] = React.useState('')
  const window = MOCK_ACTIVE_WINDOW
  const participants = MOCK_WAR_ROOM_PARTICIPANTS
  const messages = MOCK_WAR_ROOM_MESSAGES
  const pendingDecisions = MOCK_DECISIONS.filter(d => d.status === 'Pending')
  
  const progress = Math.round((window.completed_tasks / window.total_tasks) * 100)
  const currentTask = window.tasks.find(t => t.status === 'In Progress')
  const onlineCount = participants.filter(p => p.status === 'Online').length

  return (
    <AppShell currentApp="cutover-command">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* War Room Header */}
          <div className="border-b px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="font-semibold">WAR ROOM</span>
                </div>
                <div className="text-slate-300">|</div>
                <div>
                  <h1 className="page-title">{window.name}</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="stat-value">{progress}%</div>
                  <Progress value={progress} className="w-24 h-1.5 bg-slate-700" />
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{onlineCount} online</span>
                </div>
                {window.war_room_url && (
                  <Button size="sm" variant="secondary" asChild>
                    <a href={window.war_room_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Teams
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Alerts Banner */}
          {pendingDecisions.length > 0 && (
            <div className="bg-red-50 border-b border-red-200 px-6 py-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {pendingDecisions.length} critical decision{pendingDecisions.length > 1 ? 's' : ''} awaiting response
                </span>
                <Button variant="destructive" size="sm" asChild>
                  <Link href="/cutover/decisions">Review Now</Link>
                </Button>
              </div>
            </div>
          )}
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {msg.message}
                        <span className="text-muted-foreground ml-2">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </Badge>
                    </div>
                  )
                }
                
                if (msg.type === 'alert') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 bg-amber-50">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {msg.message}
                        <span className="text-amber-600/70 ml-2">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </Badge>
                    </div>
                  )
                }
                
                if (msg.type === 'decision') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <Badge variant="outline" className="text-xs text-red-700 border-red-300 bg-red-50">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {msg.message}
                        <span className="text-red-600/70 ml-2">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </Badge>
                    </div>
                  )
                }
                
                const participant = participants.find(p => p.id === msg.participant_id)
                
                return (
                  <div key={msg.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{participant?.avatar_initials || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{msg.participant_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="section-description mt-0.5">{msg.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-80 border-l bg-muted/30 flex flex-col">
          {/* Current Task */}
          {currentTask && (
            <div className="p-4 border-b bg-blue-50">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-medium uppercase">Current Task</span>
              </div>
              <p className="font-medium text-sm">{currentTask.name}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {currentTask.assignee.type === 'agent' ? (
                  <Bot className="h-3 w-3" />
                ) : (
                  <Users className="h-3 w-3" />
                )}
                <span>{currentTask.assignee.name}</span>
              </div>
            </div>
          )}
          
          {/* Participants */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Participants ({participants.length})</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{participant.avatar_initials}</AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background',
                        statusColors[participant.status]
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{participant.name}</p>
                      <p className="caption-text truncate">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Quick Stats */}
          <div className="p-4 border-t bg-muted/50">
            <StaggerGrid columns="grid-cols-2" className="gap-3" fast>
              <div className="text-center p-2 rounded-lg bg-background">
                <p className="text-lg font-bold text-emerald-600">{window.completed_tasks}</p>
                <p className="caption-text">Completed</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-background">
                <p className="text-lg font-bold text-red-600">{window.failed_tasks}</p>
                <p className="caption-text">Failed</p>
              </div>
            </StaggerGrid>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
