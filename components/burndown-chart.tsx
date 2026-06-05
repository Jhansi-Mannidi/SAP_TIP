'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export interface BurndownDataPoint {
  date: string
  actual: number
  ideal?: number
  label?: string
}

interface BurndownChartProps {
  series: BurndownDataPoint[]
  targetLine?: number
  title?: string
  className?: string
  height?: number
}

export function BurndownChart({ 
  series, 
  targetLine,
  title,
  className,
  height = 200
}: BurndownChartProps) {
  // Calculate ideal line if not provided
  const dataWithIdeal = React.useMemo(() => {
    if (series.length === 0) return []
    
    const startValue = series[0].actual
    const endValue = targetLine ?? 0
    const totalPoints = series.length
    
    return series.map((point, index) => ({
      ...point,
      ideal: point.ideal ?? startValue - ((startValue - endValue) * (index / (totalPoints - 1)))
    }))
  }, [series, targetLine])
  
  const chartConfig = {
    actual: {
      label: 'Actual',
      color: 'hsl(var(--chart-1))',
    },
    ideal: {
      label: 'Ideal',
      color: 'hsl(var(--muted-foreground))',
    },
  }
  
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      )}
      
      <ChartContainer config={chartConfig} className={cn('w-full', `h-[${height}px]`)}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={dataWithIdeal} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            
            {/* Ideal line (dashed) */}
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Ideal"
            />
            
            {/* Actual line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5 }}
              name="Actual"
            />
            
            {/* Target reference line */}
            {targetLine !== undefined && (
              <ReferenceLine 
                y={targetLine} 
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
                label={{ 
                  value: 'Target', 
                  position: 'right',
                  fontSize: 10,
                  fill: 'hsl(var(--destructive))'
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 bg-[hsl(var(--chart-1))]" />
          <span className="text-muted-foreground">Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-t-2 border-dashed border-muted-foreground" />
          <span className="text-muted-foreground">Ideal</span>
        </div>
      </div>
    </div>
  )
}
