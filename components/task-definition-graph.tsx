'use client'

import * as React from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  MarkerType,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { 
  User, 
  Bot,
  Copy, 
  Trash2, 
  Pencil, 
  Link2,
  GitBranch,
  CheckCircle2,
  Database,
  Play,
  FileSignature,
  Camera,
  Settings2,
  Layers,
  AlertTriangle,
} from 'lucide-react'
import type { ScenarioTask, TaskType, AssigneeClass, Criticality } from '@/lib/mock-data'

// Task type icons
const taskTypeIcons: Record<TaskType, React.ElementType> = {
  verify_master_data_exists: Database,
  run_transaction: Play,
  assert_data_state: CheckCircle2,
  release_document: GitBranch,
  sign_off_scenario: FileSignature,
  capture_evidence: Camera,
  set_test_data: Settings2,
}

// Criticality colors
const criticalityColors: Record<Criticality, string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-blue-500',
  low: 'bg-slate-400',
}

// Custom Task Node Component
function TaskNodeComponent({ data, selected }: NodeProps) {
  const task = data.task as ScenarioTask
  const TaskIcon = taskTypeIcons[task.task_type] || Play
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            'w-56 p-3 rounded-lg border-2 bg-card transition-all shadow-sm',
            'hover:shadow-md',
            selected 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'border-border hover:border-primary/50',
            task.parallel_group && 'border-dashed'
          )}
        >
          <Handle
            type="target"
            position={Position.Left}
            className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
          />
          
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono px-1.5">
                #{task.order}
              </Badge>
              <div className={cn('w-2 h-2 rounded-full', criticalityColors[task.criticality])} 
                   title={`${task.criticality} criticality`} />
            </div>
            
            {/* Assignee indicator */}
            {task.default_assignee_class === 'agent' ? (
              <AgentTaskIndicator 
                state="idle" 
                size="sm"
                className="scale-75"
              />
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="text-[10px]">{task.default_service_role || 'Human'}</span>
              </div>
            )}
          </div>
          
          {/* Task Type Icon & Name */}
          <div className="flex items-start gap-2">
            <div className="p-1.5 rounded bg-muted">
              <TaskIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm leading-tight line-clamp-2">{task.name}</p>
              {task.tcode && (
                <Badge variant="secondary" className="text-[9px] mt-1 font-mono">
                  {task.tcode}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Footer indicators */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            {task.healing_enabled && (
              <Badge variant="outline" className="text-[9px] gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
                <Bot className="h-2.5 w-2.5" />
                Healable
              </Badge>
            )}
            {task.evidence_capture_profile === 'full' && (
              <Badge variant="outline" className="text-[9px] gap-1">
                <Camera className="h-2.5 w-2.5" />
                Evidence
              </Badge>
            )}
          </div>
          
          {/* Parallel group indicator */}
          {task.parallel_group && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] rounded-full font-medium">
              {task.parallel_group}
            </div>
          )}
          
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !bg-primary !border-2 !border-background"
          />
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-52">
        <ContextMenuItem onClick={() => data.onEdit?.(task.id)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Task
        </ContextMenuItem>
        <ContextMenuItem onClick={() => data.onDuplicate?.(task.id)}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => data.onSetPredecessors?.(task.id)}>
          <Link2 className="h-4 w-4 mr-2" />
          Set Predecessors
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Layers className="h-4 w-4 mr-2" />
            Parallel Group
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Add to New Group</ContextMenuItem>
            <ContextMenuItem>Add to Existing Group</ContextMenuItem>
            <ContextMenuItem>Remove from Group</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <GitBranch className="h-4 w-4 mr-2" />
            Branch Condition
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Add Condition</ContextMenuItem>
            <ContextMenuItem>Edit Condition</ContextMenuItem>
            <ContextMenuItem>Remove Condition</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => data.onRemove?.(task.id)} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const nodeTypes = {
  taskNode: TaskNodeComponent,
}

interface TaskDefinitionGraphProps {
  tasks: ScenarioTask[]
  onEditTask?: (taskId: string) => void
  onDuplicateTask?: (taskId: string) => void
  onRemoveTask?: (taskId: string) => void
  onSetPredecessors?: (taskId: string) => void
  onSelectTask?: (taskId: string | null) => void
  selectedTaskId?: string | null
  className?: string
}

export function TaskDefinitionGraph({ 
  tasks,
  onEditTask,
  onDuplicateTask,
  onRemoveTask,
  onSetPredecessors,
  onSelectTask,
  selectedTaskId,
  className 
}: TaskDefinitionGraphProps) {
  // Convert tasks to ReactFlow nodes
  const initialNodes: Node[] = React.useMemo(() => {
    // Build layers based on predecessors
    const taskMap = new Map(tasks.map(t => [t.id, t]))
    const layers: ScenarioTask[][] = []
    const placed = new Set<string>()
    
    // First layer: tasks with no predecessors
    const layer0 = tasks.filter(t => t.predecessors.length === 0)
    if (layer0.length > 0) {
      layers.push(layer0)
      layer0.forEach(t => placed.add(t.id))
    }
    
    // Subsequent layers
    let maxIterations = 100
    while (placed.size < tasks.length && maxIterations > 0) {
      maxIterations--
      const nextLayer: ScenarioTask[] = []
      
      for (const task of tasks) {
        if (placed.has(task.id)) continue
        const allPredecessorsPlaced = task.predecessors.every(p => placed.has(p))
        if (allPredecessorsPlaced) {
          nextLayer.push(task)
        }
      }
      
      if (nextLayer.length === 0) break
      layers.push(nextLayer)
      nextLayer.forEach(t => placed.add(t.id))
    }
    
    // Position nodes
    const nodes: Node[] = []
    const nodeWidth = 240
    const nodeHeight = 140
    const horizontalGap = 100
    const verticalGap = 40
    
    layers.forEach((layer, layerIndex) => {
      const layerHeight = layer.length * (nodeHeight + verticalGap)
      const startY = -layerHeight / 2
      
      layer.forEach((task, taskIndex) => {
        nodes.push({
          id: task.id,
          type: 'taskNode',
          position: {
            x: layerIndex * (nodeWidth + horizontalGap),
            y: startY + taskIndex * (nodeHeight + verticalGap),
          },
          data: {
            task,
            onEdit: onEditTask,
            onDuplicate: onDuplicateTask,
            onRemove: onRemoveTask,
            onSetPredecessors,
          },
          selected: task.id === selectedTaskId,
        })
      })
    })
    
    return nodes
  }, [tasks, onEditTask, onDuplicateTask, onRemoveTask, onSetPredecessors, selectedTaskId])
  
  // Convert predecessors to edges
  const initialEdges: Edge[] = React.useMemo(() => {
    const edges: Edge[] = []
    
    tasks.forEach(task => {
      task.predecessors.forEach(predId => {
        edges.push({
          id: `${predId}-${task.id}`,
          source: predId,
          target: task.id,
          type: 'smoothstep',
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: '#94a3b8',
          },
          style: {
            stroke: '#94a3b8',
            strokeWidth: 2,
          },
        })
      })
    })
    
    return edges
  }, [tasks])
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Update nodes when tasks change
  React.useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])
  
  React.useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])
  
  const handleNodeClick = React.useCallback((event: React.MouseEvent, node: Node) => {
    onSelectTask?.(node.id)
  }, [onSelectTask])
  
  const handlePaneClick = React.useCallback(() => {
    onSelectTask?.(null)
  }, [onSelectTask])
  
  return (
    <div className={cn('w-full h-full min-h-[500px] bg-muted/30 rounded-lg border', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls className="!bg-background !border !shadow-sm" />
        <MiniMap 
          className="!bg-background !border !shadow-sm"
          nodeColor={(node) => {
            const task = node.data?.task as ScenarioTask
            if (!task) return '#94a3b8'
            if (task.criticality === 'critical') return '#ef4444'
            if (task.criticality === 'high') return '#f59e0b'
            return '#3b82f6'
          }}
          maskColor="rgba(0,0,0,0.1)"
        />
        
        {/* Legend Panel */}
        <Panel position="bottom-left" className="!m-4">
          <div className="bg-background border rounded-lg p-3 shadow-sm space-y-2 text-xs">
            <p className="page-description">Legend</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bot className="h-3 w-3 text-primary" />
                <span>Agent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-muted-foreground" />
                <span>Human</span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

// Validation Panel Component
interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  taskId?: string
}

interface ValidationPanelProps {
  tasks: ScenarioTask[]
  className?: string
  compact?: boolean
}

export function ValidationPanel({ tasks, className, compact = false }: ValidationPanelProps) {
  const issues = React.useMemo(() => {
    const result: ValidationIssue[] = []
    
    // Check for predecessor cycles (simple cycle detection)
    const visited = new Set<string>()
    const inStack = new Set<string>()
    
    function hasCycle(taskId: string, path: string[] = []): boolean {
      if (inStack.has(taskId)) {
        result.push({
          type: 'error',
          message: `Predecessor cycle detected: ${[...path, taskId].join(' → ')}`,
          taskId,
        })
        return true
      }
      if (visited.has(taskId)) return false
      
      visited.add(taskId)
      inStack.add(taskId)
      
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        for (const pred of task.predecessors) {
          if (hasCycle(pred, [...path, taskId])) return true
        }
      }
      
      inStack.delete(taskId)
      return false
    }
    
    tasks.forEach(t => hasCycle(t.id))
    
    // Check for contiguous order
    const orders = tasks.map(t => t.order).sort((a, b) => a - b)
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] !== orders[i-1] + 1) {
        result.push({
          type: 'warning',
          message: `Non-contiguous order numbers: gap between ${orders[i-1]} and ${orders[i]}`,
        })
        break
      }
    }
    
    // Check for undefined IR references
    tasks.forEach(task => {
      if (task.task_type !== 'sign_off_scenario' && !task.ir_id) {
        result.push({
          type: 'warning',
          message: `Task #${task.order} "${task.name}" has no IR reference`,
          taskId: task.id,
        })
      }
    })
    
    // Check for human tasks without service role
    tasks.forEach(task => {
      if (task.default_assignee_class === 'human' && !task.default_service_role) {
        result.push({
          type: 'info',
          message: `Human task #${task.order} "${task.name}" has no service role assigned`,
          taskId: task.id,
        })
      }
    })
    
    return result
  }, [tasks])
  
  if (issues.length === 0) {
    return (
      <div className={cn(
        'bg-emerald-50 border border-emerald-200 rounded-lg',
        compact ? 'p-3' : 'p-4',
        className
      )}>
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          <span className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
            All validations passed
          </span>
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn(
      'border rounded-lg space-y-2',
      compact ? 'p-0 border-0' : 'p-4',
      className
    )}>
      {!compact && (
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
          <AlertTriangle className="h-4 w-4" />
          <span>{issues.length} validation issue{issues.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      
      {compact && (
        <div className="text-xs text-muted-foreground mb-2">
          {issues.length} issue{issues.length !== 1 ? 's' : ''} found
        </div>
      )}
      
      {issues.map((issue, index) => (
        <div
          key={index}
          className={cn(
            'flex items-start gap-2 rounded',
            compact ? 'p-2 text-xs' : 'p-2 text-sm',
            issue.type === 'error' && 'bg-red-50 text-red-700',
            issue.type === 'warning' && 'bg-amber-50 text-amber-700',
            issue.type === 'info' && 'bg-blue-50 text-blue-700'
          )}
        >
          <AlertTriangle className={cn('mt-0.5 shrink-0', compact ? 'h-3 w-3' : 'h-4 w-4')} />
          <span className={compact ? 'line-clamp-2' : ''}>{issue.message}</span>
        </div>
      ))}
    </div>
  )
}
