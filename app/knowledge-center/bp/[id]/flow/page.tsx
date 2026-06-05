'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Save,
  Play,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  MousePointer2,
  Hand,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Plus,
  Settings,
  Eye,
  Download,
  ChevronRight,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { MOCK_BP_SCOPE_ITEMS } from '@/lib/kb-mock-data'

// Flow node types for BPMN-style editing
const NODE_TYPES = [
  { id: 'start', label: 'Start Event', icon: Circle, color: 'bg-emerald-500' },
  { id: 'end', label: 'End Event', icon: Circle, color: 'bg-rose-500' },
  { id: 'task', label: 'Task', icon: Square, color: 'bg-blue-500' },
  { id: 'gateway', label: 'Gateway', icon: Diamond, color: 'bg-amber-500' },
  { id: 'subprocess', label: 'Sub-Process', icon: Square, color: 'bg-violet-500' },
]

// Sample flow nodes for BD9 Sales Order
const SAMPLE_FLOW_NODES = [
  { id: 'n1', type: 'start', label: 'Start', x: 50, y: 150 },
  { id: 'n2', type: 'task', label: 'Create Sales Order (VA01)', x: 180, y: 150, tcode: 'VA01' },
  { id: 'n3', type: 'gateway', label: 'Credit Check', x: 350, y: 150 },
  { id: 'n4', type: 'task', label: 'Release Credit Block', x: 480, y: 80, tcode: 'VKM1' },
  { id: 'n5', type: 'task', label: 'Create Delivery (VL01N)', x: 480, y: 220, tcode: 'VL01N' },
  { id: 'n6', type: 'task', label: 'Post Goods Issue (VL02N)', x: 650, y: 150, tcode: 'VL02N' },
  { id: 'n7', type: 'task', label: 'Create Invoice (VF01)', x: 820, y: 150, tcode: 'VF01' },
  { id: 'n8', type: 'end', label: 'End', x: 950, y: 150 },
]

const SAMPLE_FLOW_EDGES = [
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3' },
  { from: 'n3', to: 'n4', label: 'Blocked' },
  { from: 'n3', to: 'n5', label: 'OK' },
  { from: 'n4', to: 'n5' },
  { from: 'n5', to: 'n6' },
  { from: 'n6', to: 'n7' },
  { from: 'n7', to: 'n8' },
]

export default function BPFlowEditorPage() {
  const params = useParams()
  const scopeItemId = params.id as string
  
  const scopeItem = MOCK_BP_SCOPE_ITEMS.find(s => s.id === scopeItemId) || MOCK_BP_SCOPE_ITEMS[0]
  
  const [selectedTool, setSelectedTool] = React.useState<'select' | 'pan'>('select')
  const [selectedNode, setSelectedNode] = React.useState<string | null>('n2')
  const [zoom, setZoom] = React.useState(100)
  
  const selectedNodeData = SAMPLE_FLOW_NODES.find(n => n.id === selectedNode)
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/knowledge-center/bp" className="hover:text-foreground">BP KB</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/knowledge-center/bp/${scopeItemId}`} className="hover:text-foreground">{scopeItem.code}</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Flow Editor</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link href={`/knowledge-center/bp/${scopeItemId}`}>
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="page-title">{scopeItem.name} - Process Flow</h1>
                  <p className="page-description">BPMN-style flow editor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Palette */}
          <div className="w-56 border-r bg-muted/30 p-3 hidden md:block">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Flow Elements
            </div>
            <div className="space-y-2">
              {NODE_TYPES.map(nodeType => {
                const Icon = nodeType.icon
                return (
                  <div
                    key={nodeType.id}
                    className="flex items-center gap-3 p-2 rounded-md border bg-background hover:border-primary cursor-grab active:cursor-grabbing transition-colors"
                    draggable
                  >
                    <div className={cn('w-6 h-6 rounded flex items-center justify-center', nodeType.color)}>
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm">{nodeType.label}</span>
                  </div>
                )
              })}
            </div>
            
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-6 mb-3">
              Connectors
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-md border bg-background hover:border-primary cursor-grab">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Sequence Flow</span>
              </div>
            </div>
          </div>
          
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="border-b p-2 flex items-center justify-between gap-4 bg-background">
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={selectedTool === 'select' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setSelectedTool('select')}
                      >
                        <MousePointer2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Select (V)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={selectedTool === 'pan' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setSelectedTool('pan')}
                      >
                        <Hand className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Pan (H)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Canvas */}
            <div className="flex-1 bg-[repeating-linear-gradient(0deg,transparent,transparent_19px,hsl(var(--border))_19px,hsl(var(--border))_20px),repeating-linear-gradient(90deg,transparent,transparent_19px,hsl(var(--border))_19px,hsl(var(--border))_20px)] overflow-auto">
              <svg 
                width="1200" 
                height="400" 
                className="min-w-full"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
              >
                {/* Edges */}
                {SAMPLE_FLOW_EDGES.map((edge, i) => {
                  const fromNode = SAMPLE_FLOW_NODES.find(n => n.id === edge.from)
                  const toNode = SAMPLE_FLOW_NODES.find(n => n.id === edge.to)
                  if (!fromNode || !toNode) return null
                  
                  const fromX = fromNode.x + 60
                  const fromY = fromNode.y + 20
                  const toX = toNode.x
                  const toY = toNode.y + 20
                  
                  return (
                    <g key={i}>
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        className="stroke-muted-foreground"
                        strokeWidth={2}
                        markerEnd="url(#arrowhead)"
                      />
                      {edge.label && (
                        <text
                          x={(fromX + toX) / 2}
                          y={(fromY + toY) / 2 - 8}
                          className="fill-muted-foreground text-xs"
                          textAnchor="middle"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  )
                })}
                
                {/* Arrow marker */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      className="fill-muted-foreground"
                    />
                  </marker>
                </defs>
                
                {/* Nodes */}
                {SAMPLE_FLOW_NODES.map(node => {
                  const isSelected = selectedNode === node.id
                  const nodeType = NODE_TYPES.find(t => t.id === node.type)
                  
                  if (node.type === 'start' || node.type === 'end') {
                    return (
                      <g key={node.id} onClick={() => setSelectedNode(node.id)} className="cursor-pointer">
                        <circle
                          cx={node.x + 20}
                          cy={node.y + 20}
                          r={18}
                          className={cn(
                            node.type === 'start' ? 'fill-emerald-500' : 'fill-rose-500',
                            isSelected && 'stroke-primary stroke-2'
                          )}
                        />
                        <text
                          x={node.x + 20}
                          y={node.y + 55}
                          className="fill-foreground text-xs"
                          textAnchor="middle"
                        >
                          {node.label}
                        </text>
                      </g>
                    )
                  }
                  
                  if (node.type === 'gateway') {
                    return (
                      <g key={node.id} onClick={() => setSelectedNode(node.id)} className="cursor-pointer">
                        <polygon
                          points={`${node.x + 40},${node.y} ${node.x + 80},${node.y + 20} ${node.x + 40},${node.y + 40} ${node.x},${node.y + 20}`}
                          className={cn('fill-amber-500', isSelected && 'stroke-primary stroke-2')}
                        />
                        <text
                          x={node.x + 40}
                          y={node.y + 60}
                          className="fill-foreground text-xs"
                          textAnchor="middle"
                        >
                          {node.label}
                        </text>
                      </g>
                    )
                  }
                  
                  return (
                    <g key={node.id} onClick={() => setSelectedNode(node.id)} className="cursor-pointer">
                      <rect
                        x={node.x}
                        y={node.y}
                        width={120}
                        height={40}
                        rx={4}
                        className={cn(
                          'fill-background stroke-border',
                          isSelected && 'stroke-primary stroke-2'
                        )}
                      />
                      <text
                        x={node.x + 60}
                        y={node.y + 18}
                        className="fill-foreground text-xs font-medium"
                        textAnchor="middle"
                      >
                        {node.label.split('(')[0].trim()}
                      </text>
                      {node.tcode && (
                        <text
                          x={node.x + 60}
                          y={node.y + 32}
                          className="fill-muted-foreground text-[10px]"
                          textAnchor="middle"
                        >
                          {node.tcode}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
          
          {/* Right Properties Panel */}
          <div className="w-72 border-l bg-muted/30 hidden lg:block">
            <Tabs defaultValue="properties" className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="properties" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Properties
                </TabsTrigger>
                <TabsTrigger value="data" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                  Data
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="properties" className="flex-1 p-4 space-y-4 overflow-auto">
                {selectedNodeData ? (
                  <>
                    <div>
                      <Label className="text-xs text-muted-foreground">Node Type</Label>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {selectedNodeData.type}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label htmlFor="node-label">Label</Label>
                      <Input 
                        id="node-label" 
                        defaultValue={selectedNodeData.label}
                        className="mt-1"
                      />
                    </div>
                    
                    {selectedNodeData.tcode && (
                      <div>
                        <Label htmlFor="node-tcode">Transaction Code</Label>
                        <Input 
                          id="node-tcode" 
                          defaultValue={selectedNodeData.tcode}
                          className="mt-1"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="node-desc">Description</Label>
                      <Textarea 
                        id="node-desc" 
                        placeholder="Enter description..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label>Assignee Class</Label>
                      <Select defaultValue="agent">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="human">Human</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a node to view properties</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="data" className="flex-1 p-4 overflow-auto">
                <div className="text-sm text-muted-foreground">
                  Data bindings and variable mappings for the selected node.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
