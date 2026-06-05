'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Calendar,
  CheckSquare,
  ListFilter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'text' | 'daterange' | 'checkbox'
  options?: FilterOption[]
  placeholder?: string
}

interface FilterDrawerProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onReset: () => void
  activeCount?: number
  title?: string
  trigger?: React.ReactNode
}

/* ---------------------------- helpers ---------------------------- */

function getFilterIcon(type: FilterConfig['type']) {
  switch (type) {
    case 'multiselect':
      return CheckSquare
    case 'daterange':
      return Calendar
    case 'checkbox':
      return SlidersHorizontal
    default:
      return ListFilter
  }
}

function isFilterActive(filter: FilterConfig, value: any): boolean {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value !== '' && value !== 'all' && value !== '__all__'
  if (typeof value === 'boolean') return value
  return value !== null && value !== undefined
}

/* ---------------------------- component ---------------------------- */

export function FilterDrawer({
  filters,
  values,
  onChange,
  onReset,
  activeCount = 0,
  title = 'Filters',
  trigger,
}: FilterDrawerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-5 px-1.5 bg-brand text-brand-foreground hover:bg-brand"
              >
                {activeCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className={cn(
          'w-full sm:max-w-md p-0 gap-0',
          'flex flex-col bg-background',
          // hide the default top-right close button (we render a styled one in the header)
          '[&>button.absolute]:hidden',
        )}
      >
        <motion.div
          className="flex flex-col h-full"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <SheetDescription className="sr-only">
          Refine the displayed results by selecting one or more filter values.
        </SheetDescription>

        {/* Header */}
        <div className="shrink-0 border-b border-border bg-gradient-to-br from-brand-soft/40 via-background to-background">
          <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <SheetTitle className="text-base font-semibold tracking-tight leading-tight">
                  {title}
                </SheetTitle>
                <p className="caption-text mt-0.5">
                  {activeCount > 0 ? (
                    <>
                      <span className="font-mono tabular-nums font-semibold text-foreground">
                        {activeCount}
                      </span>{' '}
                      {activeCount === 1 ? 'filter' : 'filters'} applied
                    </>
                  ) : (
                    'Refine your results'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {activeCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 sm:px-6 py-5 space-y-5">
            {filters.map((filter, index) => {
              const FilterIcon = getFilterIcon(filter.type)
              const active = isFilterActive(filter, values[filter.key])
              const activeChipLabel = (() => {
                if (filter.type === 'multiselect' && Array.isArray(values[filter.key])) {
                  return `${values[filter.key].length} selected`
                }
                return null
              })()

              return (
                <div
                  key={filter.key}
                  className={cn(
                    'space-y-2.5',
                    index !== filters.length - 1 && 'pb-5 border-b border-border/70',
                  )}
                >
                  {/* Section label */}
                  <div className="flex items-center justify-between gap-2">
                    <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <FilterIcon
                        className={cn(
                          'h-3.5 w-3.5',
                          active ? 'text-brand' : 'text-muted-foreground/70',
                        )}
                      />
                      {filter.label}
                    </Label>
                    {active && activeChipLabel && (
                      <span className="pill pill-brand">{activeChipLabel}</span>
                    )}
                  </div>

                  {/* Control */}
                  {filter.type === 'select' && filter.options && (
                    <Select
                      value={values[filter.key] ? values[filter.key] : '__all__'}
                      onValueChange={value =>
                        onChange(filter.key, value === '__all__' ? '' : value)
                      }
                    >
                      <SelectTrigger className="h-10 focus:ring-brand/40">
                        <SelectValue
                          placeholder={
                            filter.placeholder ||
                            `Select ${filter.label.toLowerCase()}`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All</SelectItem>
                        {filter.options.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center justify-between w-full gap-3">
                              <span className="truncate">{option.label}</span>
                              {option.count !== undefined && (
                                <span className="text-muted-foreground text-xs font-mono tabular-nums">
                                  ({option.count})
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {filter.type === 'multiselect' && filter.options && (
                    <div className="rounded-xl border border-border bg-card/40 p-1 max-h-64 overflow-y-auto">
                      <div className="flex flex-col">
                        {filter.options.map(option => {
                          const selected = (values[filter.key] || []) as string[]
                          const isChecked = selected.includes(option.value)

                          return (
                            <label
                              key={option.value}
                              htmlFor={`${filter.key}-${option.value}`}
                              className={cn(
                                'group flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-colors',
                                isChecked
                                  ? 'bg-brand-soft/60'
                                  : 'hover:bg-muted/60',
                              )}
                            >
                              <Checkbox
                                id={`${filter.key}-${option.value}`}
                                checked={isChecked}
                                onCheckedChange={checked => {
                                  const newValue = checked
                                    ? [...selected, option.value]
                                    : selected.filter(v => v !== option.value)
                                  onChange(filter.key, newValue)
                                }}
                                className={cn(
                                  'data-[state=checked]:bg-brand data-[state=checked]:border-brand data-[state=checked]:text-brand-foreground',
                                )}
                              />
                              <span
                                className={cn(
                                  'flex-1 flex items-center justify-between text-sm font-medium leading-none',
                                  isChecked
                                    ? 'text-foreground'
                                    : 'text-foreground/80',
                                )}
                              >
                                <span className="truncate">{option.label}</span>
                                {option.count !== undefined && (
                                  <span
                                    className={cn(
                                      'ml-3 text-xs font-mono tabular-nums shrink-0',
                                      isChecked
                                        ? 'text-brand'
                                        : 'text-muted-foreground',
                                    )}
                                  >
                                    ({option.count})
                                  </span>
                                )}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {filter.type === 'text' && (
                    <Input
                      value={values[filter.key] || ''}
                      onChange={e => onChange(filter.key, e.target.value)}
                      placeholder={filter.placeholder}
                      className="h-10 focus-visible:ring-brand/40"
                    />
                  )}

                  {filter.type === 'daterange' && (
                    <Select
                      value={values[filter.key] || 'all'}
                      onValueChange={value => onChange(filter.key, value)}
                    >
                      <SelectTrigger className="h-10 focus:ring-brand/40">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="14d">Last 14 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {filter.type === 'checkbox' && (
                    <label
                      htmlFor={filter.key}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors',
                        values[filter.key]
                          ? 'border-brand/40 bg-brand-soft/60'
                          : 'border-border bg-card/40 hover:bg-muted/60',
                      )}
                    >
                      <Checkbox
                        id={filter.key}
                        checked={values[filter.key] || false}
                        onCheckedChange={checked => onChange(filter.key, checked)}
                        className="data-[state=checked]:bg-brand data-[state=checked]:border-brand data-[state=checked]:text-brand-foreground"
                      />
                      <span className="flex-1 text-sm font-medium text-foreground leading-none">
                        {filter.placeholder || filter.label}
                      </span>
                    </label>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border bg-muted/30 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-10"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onReset()
                setOpen(false)
              }}
              variant="ghost"
              disabled={activeCount === 0}
              className={cn(
                'flex-1 h-10 gap-1.5',
                activeCount > 0
                  ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                  : '',
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset all
            </Button>
          </div>
        </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}

/* ---------------------- Active filter chips (unchanged behavior) ---------------------- */

interface ActiveFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onClear: (key: string) => void
  onClearAll: () => void
}

export function ActiveFilters({
  filters,
  values,
  onClear,
  onClearAll,
}: ActiveFiltersProps) {
  const activeFilters = filters.filter(filter => isFilterActive(filter, values[filter.key]))

  if (activeFilters.length === 0) return null

  const getFilterLabel = (filter: FilterConfig, value: any): string => {
    if (filter.type === 'multiselect' && Array.isArray(value)) {
      return `${filter.label}: ${value.length} selected`
    }
    if (filter.type === 'select' && filter.options) {
      const option = filter.options.find(o => o.value === value)
      return `${filter.label}: ${option?.label || value}`
    }
    if (filter.type === 'daterange') {
      const labels: Record<string, string> = {
        '7d': 'Last 7 days',
        '14d': 'Last 14 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
      }
      return `${filter.label}: ${labels[value] || value}`
    }
    return `${filter.label}: ${value}`
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map(filter => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onClear(filter.key)}
          className={cn(
            'inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium',
            'bg-brand-soft text-brand-soft-foreground border border-brand/20',
            'hover:bg-brand-soft/80 transition-colors',
          )}
        >
          {getFilterLabel(filter, values[filter.key])}
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-brand/20">
            <X className="h-3 w-3" />
          </span>
        </button>
      ))}
      {activeFilters.length > 1 && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 text-xs">
          Clear all
        </Button>
      )}
    </div>
  )
}
