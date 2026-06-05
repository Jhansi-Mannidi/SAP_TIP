'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown,
  Bug,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { AnimatedNumber, staggerContainer, staggerItem, fadeInUp } from '@/lib/animations'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Mock trend data
const defectTrendData = [
  { week: 'W1', opened: 24, closed: 18, net: 6 },
  { week: 'W2', opened: 31, closed: 28, net: 3 },
  { week: 'W3', opened: 19, closed: 25, net: -6 },
  { week: 'W4', opened: 27, closed: 32, net: -5 },
  { week: 'W5', opened: 22, closed: 29, net: -7 },
  { week: 'W6', opened: 18, closed: 24, net: -6 },
]

const severityDistribution = [
  { name: 'Critical', value: 8, color: '#dc2626' },
  { name: 'High', value: 24, color: '#ea580c' },
  { name: 'Medium', value: 45, color: '#d97706' },
  { name: 'Low', value: 32, color: '#16a34a' },
]

const sourceDistribution = [
  { source: 'Test Execution', count: 45 },
  { source: 'Manual Entry', count: 28 },
  { source: 'ITSM Import', count: 18 },
  { source: 'Transport Analysis', count: 12 },
  { source: 'Migration Check', count: 6 },
]

const mttrByPriority = [
  { priority: 'Critical', mttr: 4.2 },
  { priority: 'High', mttr: 12.5 },
  { priority: 'Medium', mttr: 28.3 },
  { priority: 'Low', mttr: 72.1 },
]

const agingBuckets = [
  { bucket: '0-7 days', count: 32 },
  { bucket: '8-14 days', count: 24 },
  { bucket: '15-30 days', count: 18 },
  { bucket: '31-60 days', count: 12 },
  { bucket: '60+ days', count: 8 },
]

export default function DefectTrendsPage() {
  const [timeRange, setTimeRange] = React.useState('6weeks')
  const [migrationFilter, setMigrationFilter] = React.useState('all')

  // KPI calculations
  const totalOpen = 109
  const closedThisWeek = 24
  const avgMTTR = 18.5
  const slaCompliance = 87

  return (
    <AppShell currentApp="defect-manager">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Animated Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="page-title">Defect Trends</h1>
            <p className="page-description mt-1">
              Analytics and insights on defect patterns and resolution metrics.
            </p>
          </div>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2weeks">Last 2 Weeks</SelectItem>
                <SelectItem value="4weeks">Last 4 Weeks</SelectItem>
                <SelectItem value="6weeks">Last 6 Weeks</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
            <Select value={migrationFilter} onValueChange={setMigrationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Migrations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Migrations</SelectItem>
                <SelectItem value="star-cement">Star Cement S/4HANA</SelectItem>
                <SelectItem value="vertex">Vertex Industries</SelectItem>
                <SelectItem value="northwind">Northwind Manufacturing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
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
            <Card>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Total Open</span>
                </div>
                <p className="stat-value mt-1">
                  <AnimatedNumber value={totalOpen} />
                </p>
                <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5 from last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Closed This Week</span>
                </div>
                <p className="stat-value mt-1">
                  <AnimatedNumber value={closedThisWeek} />
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8 vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Avg MTTR</span>
                </div>
                <p className="stat-value mt-1">
                  <AnimatedNumber value={avgMTTR} suffix="h" decimals={1} />
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                  <TrendingDown className="h-3 w-3" />
                  <span>-2.3h improvement</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">SLA Compliance</span>
                </div>
                <p className="stat-value mt-1">
                  <AnimatedNumber value={slaCompliance} suffix="%" />
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3% from target</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Defect Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Defect Trend</CardTitle>
              <CardDescription>Opened vs Closed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={defectTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Opened"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="closed" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Closed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Severity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Severity Distribution</CardTitle>
              <CardDescription>Open defects by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Defects by Source</CardTitle>
              <CardDescription>Where defects originate from</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis type="category" dataKey="source" className="text-xs" width={120} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Aging Buckets */}
          <Card>
            <CardHeader>
              <CardTitle>Defect Aging</CardTitle>
              <CardDescription>Open defects by age bucket</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agingBuckets}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="bucket" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[4, 4, 0, 0]}
                  >
                    {agingBuckets.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index < 2 ? '#22c55e' : index < 4 ? '#f59e0b' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* MTTR by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Mean Time to Resolution by Priority</CardTitle>
            <CardDescription>Average resolution time in hours</CardDescription>
          </CardHeader>
          <CardContent>
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4" fast>
              {mttrByPriority.map((item) => (
                <div key={item.priority} className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="page-description">{item.priority}</p>
                  <p className="text-3xl font-bold mt-2">{item.mttr}h</p>
                </div>
              ))}
            </StaggerGrid>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
