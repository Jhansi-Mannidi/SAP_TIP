'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Link2, ToggleLeft, ToggleRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import {
  MOCK_SCENARIO_BINDINGS,
  MOCK_CASE_BINDINGS,
  BINDING_STATE_LABELS,
  type BindingState,
} from '@/lib/calm-mock-data'

const BINDING_PILLS: Record<BindingState, string> = {
  PRE_GENERATED: 'pill pill-neutral',
  CALM_REQUESTED: 'pill pill-info',
  BOUND: 'pill pill-brand',
  READY: 'pill pill-success',
  STALE: 'pill pill-warning',
  RETIRED: 'pill pill-neutral',
}

export function CalmBindingsPanel() {
  const [search, setSearch] = React.useState('')
  const [stateFilter, setStateFilter] = React.useState('all')

  const filteredScenarios = MOCK_SCENARIO_BINDINGS.filter((b) => {
    if (
      search &&
      !b.scenario_name.toLowerCase().includes(search.toLowerCase()) &&
      !b.calm_test_case_ref.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    if (stateFilter !== 'all' && b.binding_state !== stateFilter) return false
    return true
  })

  const filteredCases = MOCK_CASE_BINDINGS.filter((b) => {
    if (
      search &&
      !b.case_name.toLowerCase().includes(search.toLowerCase()) &&
      !b.calm_test_step_ref.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    if (stateFilter !== 'all' && b.binding_state !== stateFilter) return false
    return true
  })

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-border/60 space-y-4">
        <div>
          <h2 className="section-title">Binding & Reconciliation</h2>
          <p className="section-description mt-0.5">
            Maps SATIP scenarios to CALM test cases and test cases to CALM test steps via canonical
            keys
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bindings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 bg-background">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {(Object.keys(BINDING_STATE_LABELS) as BindingState[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {BINDING_STATE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="scenarios" className="p-4 sm:p-5 pt-0 sm:pt-0">
        <TabsList className="w-full sm:w-auto h-auto flex-wrap justify-start gap-1 bg-muted/30 p-1 mt-4">
          <TabsTrigger value="scenarios" className="text-xs sm:text-sm gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            Scenario Bindings
            <Badge variant="secondary" className="h-4 text-[10px] ml-1">
              {filteredScenarios.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cases" className="text-xs sm:text-sm gap-1.5">
            Case Bindings
            <Badge variant="secondary" className="h-4 text-[10px] ml-1">
              {filteredCases.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="mt-4">
          <div className="overflow-x-auto -mx-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead className="hidden md:table-cell">CALM Test Case</TableHead>
                  <TableHead className="hidden lg:table-cell">Project</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="hidden sm:table-cell">Match</TableHead>
                  <TableHead className="text-center">Write-back</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScenarios.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{b.scenario_name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{b.scenario_code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">
                      {b.calm_test_case_ref}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {b.project_name}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('h-5 text-[10px] border-0', BINDING_PILLS[b.binding_state])}>
                        {BINDING_STATE_LABELS[b.binding_state]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-[10px] h-5 font-mono">
                        {b.match_method}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {b.write_back_enabled ? (
                        <ToggleRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="mt-4">
          <div className="overflow-x-auto -mx-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Case</TableHead>
                  <TableHead className="hidden md:table-cell">CALM Test Step</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-center">Write-back</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{b.case_name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{b.case_code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">
                      {b.calm_test_step_ref}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('h-5 text-[10px] border-0', BINDING_PILLS[b.binding_state])}>
                        {BINDING_STATE_LABELS[b.binding_state]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {b.write_back_enabled ? (
                        <ToggleRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
