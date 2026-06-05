'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { 
  Users,
  Building2,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Award,
  BarChart3,
  Download,
} from 'lucide-react'

// Mock partner data
const MOCK_PARTNERS = [
  { id: 'p1', name: 'Accenture India', activeMigrations: 2, totalMigrations: 5, passRate: 96.2, slaCompliance: 98, healthScore: 94 },
  { id: 'p2', name: 'Deloitte Consulting', activeMigrations: 1, totalMigrations: 3, passRate: 94.8, slaCompliance: 95, healthScore: 91 },
  { id: 'p3', name: 'IBM India', activeMigrations: 1, totalMigrations: 2, passRate: 92.5, slaCompliance: 92, healthScore: 88 },
]

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Star Cement', partner: 'Accenture India', phase: 'UAT', progress: 78, passRate: 97.2, status: 'on-track' },
  { id: 'c2', name: 'Dalmia Bharat', partner: 'Accenture India', phase: 'SIT', progress: 45, passRate: 94.8, status: 'on-track' },
  { id: 'c3', name: 'ACC Limited', partner: 'Deloitte Consulting', phase: 'Build', progress: 32, passRate: 88.5, status: 'at-risk' },
  { id: 'c4', name: 'Ambuja Cement', partner: 'IBM India', phase: 'Discover', progress: 15, passRate: 0, status: 'on-track' },
]

export default function PartnerViewPage() {
  const [selectedPartner, setSelectedPartner] = React.useState<string>('all')

  const filteredCustomers = selectedPartner === 'all' 
    ? MOCK_CUSTOMERS 
    : MOCK_CUSTOMERS.filter(c => c.partner === selectedPartner)

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Partner View</h1>
            <p className="page-description">Multi-tenant overview for SI partners and customer rollups</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPartner} onValueChange={setSelectedPartner}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                {MOCK_PARTNERS.map(p => (
                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Partner Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {MOCK_PARTNERS.map((partner) => (
            <Card key={partner.id} className={cn(
              'cursor-pointer transition-all',
              selectedPartner === partner.name && 'ring-2 ring-primary'
            )} onClick={() => setSelectedPartner(partner.name)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{partner.name}</CardTitle>
                    <CardDescription>{partner.activeMigrations} active / {partner.totalMigrations} total</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StaggerGrid columns="grid-cols-3" className="gap-4 text-center" fast>
                  <div>
                    <p className="stat-value">{partner.passRate}%</p>
                    <p className="caption-text">Pass Rate</p>
                  </div>
                  <div>
                    <p className="stat-value">{partner.slaCompliance}%</p>
                    <p className="caption-text">SLA</p>
                  </div>
                  <div>
                    <p className="stat-value">{partner.healthScore}</p>
                    <p className="caption-text">Health</p>
                  </div>
                </StaggerGrid>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Rollup */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Migrations</CardTitle>
                <CardDescription>
                  {selectedPartner === 'all' ? 'All customers across partners' : `Customers for ${selectedPartner}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {filteredCustomers.filter(c => c.status === 'on-track').length} On Track
                </Badge>
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  {filteredCustomers.filter(c => c.status === 'at-risk').length} At Risk
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{customer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="caption-text">{customer.partner}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{customer.phase}</Badge>
                      <div className={cn(
                        'flex items-center gap-1 text-sm',
                        customer.status === 'on-track' ? 'text-green-600' : 'text-amber-600'
                      )}>
                        {customer.status === 'on-track' ? (
                          <><CheckCircle className="h-4 w-4" /> On Track</>
                        ) : (
                          <><AlertTriangle className="h-4 w-4" /> At Risk</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{customer.progress}%</span>
                      </div>
                      <Progress value={customer.progress} />
                    </div>
                    <div className="w-24 text-right">
                      <p className="page-description">Pass Rate</p>
                      <p className="font-medium">{customer.passRate > 0 ? `${customer.passRate}%` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="stat-value">{MOCK_PARTNERS.length}</p>
                  <p className="page-description">Active Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="stat-value">{MOCK_CUSTOMERS.length}</p>
                  <p className="page-description">Customer Migrations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="stat-value">95.1%</p>
                  <p className="page-description">Avg Pass Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="stat-value">95%</p>
                  <p className="page-description">SLA Compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
