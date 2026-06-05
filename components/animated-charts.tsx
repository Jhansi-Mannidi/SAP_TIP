'use client'

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ============================================================================
// ANIMATED BAR CHART
// ============================================================================

interface BarData {
  label: string
  value: number
  color?: string
}

interface AnimatedBarChartProps {
  data: BarData[]
  title?: string
  description?: string
  height?: number
  showValues?: boolean
  className?: string
  horizontal?: boolean
}

export function AnimatedBarChart({
  data,
  title,
  description,
  height = 200,
  showValues = true,
  className = '',
  horizontal = false
}: AnimatedBarChartProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const maxValue = Math.max(...data.map(d => d.value))

  if (horizontal) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle className="text-base">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <div ref={ref} className="space-y-3">
            {data.map((item, index) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  {showValues && (
                    <motion.span
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {item.value}
                    </motion.span>
                  )}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full', item.color || 'bg-primary')}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(item.value / maxValue) * 100}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div ref={ref} className="flex items-end justify-between gap-2" style={{ height }}>
          {data.map((item, index) => (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className={cn('w-full rounded-t', item.color || 'bg-primary')}
                initial={{ height: 0 }}
                animate={isInView ? { height: `${(item.value / maxValue) * (height - 30)}px` } : { height: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
              />
              {showValues && (
                <motion.span
                  className="text-xs font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {item.value}
                </motion.span>
              )}
              <span className="text-xs text-muted-foreground truncate max-w-full">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ANIMATED LINE CHART (simplified SVG)
// ============================================================================

interface LineData {
  label: string
  value: number
}

interface AnimatedLineChartProps {
  data: LineData[]
  title?: string
  description?: string
  height?: number
  className?: string
  color?: string
  showDots?: boolean
  showArea?: boolean
}

export function AnimatedLineChart({
  data,
  title,
  description,
  height = 200,
  className = '',
  color = 'hsl(var(--primary))',
  showDots = true,
  showArea = true
}: AnimatedLineChartProps) {
  const ref = React.useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartWidth = 400
  const chartHeight = height - padding.top - padding.bottom

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * (chartWidth - padding.left - padding.right),
    y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight,
    value: d.value,
    label: d.label
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <svg ref={ref} viewBox={`0 0 ${chartWidth} ${height}`} className="w-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => {
            const y = padding.top + (chartHeight * (100 - percent)) / 100
            return (
              <g key={percent}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  {Math.round(minValue + (range * percent) / 100)}
                </text>
              </g>
            )
          })}

          {/* Area */}
          {showArea && (
            <motion.path
              d={areaD}
              fill={color}
              fillOpacity={0.1}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          )}

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Dots */}
          {showDots && points.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
            />
          ))}

          {/* X-axis labels */}
          {points.map((point, i) => (
            <text
              key={i}
              x={point.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ANIMATED DONUT CHART
// ============================================================================

interface DonutSegment {
  label: string
  value: number
  color: string
}

interface AnimatedDonutChartProps {
  data: DonutSegment[]
  title?: string
  description?: string
  size?: number
  strokeWidth?: number
  className?: string
  showLegend?: boolean
  centerLabel?: React.ReactNode
}

export function AnimatedDonutChart({
  data,
  title,
  description,
  size = 160,
  strokeWidth = 24,
  className = '',
  showLegend = true,
  centerLabel
}: AnimatedDonutChartProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  
  let cumulativeOffset = 0

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div ref={ref} className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-muted/20"
              />
              
              {/* Segments */}
              {data.map((segment, i) => {
                const segmentLength = (segment.value / total) * circumference
                const offset = cumulativeOffset
                cumulativeOffset += segmentLength
                
                return (
                  <motion.circle
                    key={segment.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={-offset}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={isInView ? { strokeDasharray: `${segmentLength} ${circumference - segmentLength}` } : { strokeDasharray: `0 ${circumference}` }}
                    transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
                  />
                )
              })}
            </svg>
            
            {centerLabel && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {centerLabel}
              </motion.div>
            )}
          </div>
          
          {showLegend && (
            <div className="flex flex-col gap-2">
              {data.map((segment, i) => (
                <motion.div
                  key={segment.label}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: segment.color }} />
                  <span className="text-sm">{segment.label}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {segment.value} ({Math.round((segment.value / total) * 100)}%)
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ANIMATED STAT CARD GRID
// ============================================================================

interface StatItem {
  label: string
  value: number | string
  suffix?: string
  prefix?: string
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}

interface AnimatedStatGridProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  className?: string
}

export function AnimatedStatGrid({ stats, columns = 4, className = '' }: AnimatedStatGridProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div 
      ref={ref}
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-3',
        columns === 4 && 'grid-cols-2 md:grid-cols-4',
        className
      )}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="p-4 rounded-lg border bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            {stat.icon}
          </div>
          <div className="mt-2">
            <motion.span
              className="stat-value"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {stat.prefix}{stat.value}{stat.suffix}
            </motion.span>
          </div>
          {stat.change !== undefined && (
            <motion.div
              className={cn(
                'text-sm mt-1',
                stat.changeType === 'positive' && 'text-green-600 dark:text-green-400',
                stat.changeType === 'negative' && 'text-red-600 dark:text-red-400',
                stat.changeType === 'neutral' && 'text-muted-foreground'
              )}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ============================================================================
// ANIMATED TABLE WITH PROGRESS
// ============================================================================

interface TableRowData {
  id: string
  cells: (string | number | React.ReactNode)[]
  progress?: number
}

interface AnimatedTableProps {
  headers: string[]
  rows: TableRowData[]
  title?: string
  description?: string
  className?: string
}

export function AnimatedTable({ headers, rows, title, description, className = '' }: AnimatedTableProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div ref={ref} className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {headers.map((header, i) => (
                  <th key={i} className="text-left text-sm font-medium text-muted-foreground py-2 px-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <motion.tr
                  key={row.id}
                  className="border-b last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-3 px-3 text-sm">
                      {cell}
                    </td>
                  ))}
                  {row.progress !== undefined && (
                    <td className="py-3 px-3">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${row.progress}%` } : { width: 0 }}
                          transition={{ duration: 0.8, delay: rowIndex * 0.05 + 0.3 }}
                        />
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ANIMATED BURNDOWN CHART
// ============================================================================

interface BurndownData {
  date: string
  actual: number
  ideal: number
}

interface AnimatedBurndownChartProps {
  data: BurndownData[]
  title?: string
  description?: string
  height?: number
  className?: string
}

export function AnimatedBurndownChart({
  data,
  title,
  description,
  height = 200,
  className = ''
}: AnimatedBurndownChartProps) {
  const ref = React.useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  const maxValue = Math.max(...data.flatMap(d => [d.actual, d.ideal]))
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartWidth = 400
  const chartHeight = height - padding.top - padding.bottom

  const getPoint = (value: number, index: number) => ({
    x: padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right),
    y: padding.top + chartHeight - (value / maxValue) * chartHeight
  })

  const actualPath = data.map((d, i) => {
    const point = getPoint(d.actual, i)
    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  }).join(' ')

  const idealPath = data.map((d, i) => {
    const point = getPoint(d.ideal, i)
    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  }).join(' ')

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <svg ref={ref} viewBox={`0 0 ${chartWidth} ${height}`} className="w-full">
          {/* Grid */}
          {[0, 25, 50, 75, 100].map(percent => {
            const y = padding.top + (chartHeight * (100 - percent)) / 100
            return (
              <line
                key={percent}
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
              />
            )
          })}

          {/* Ideal line (dashed) */}
          <motion.path
            d={idealPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeDasharray="4 4"
            className="text-muted-foreground"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          {/* Actual line */}
          <motion.path
            d={actualPath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
          />

          {/* X-axis labels */}
          {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i, arr) => {
            const index = data.indexOf(d)
            const point = getPoint(d.actual, index)
            return (
              <text
                key={i}
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {d.date}
              </text>
            )
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary" />
            <span className="text-sm text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ideal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
