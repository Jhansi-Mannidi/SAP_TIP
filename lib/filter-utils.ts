// Global filter and action utilities for SAP Test Assurance

import * as React from 'react'

// Generic filter state hook
export function useFilters<T extends Record<string, any>>(
  initialFilters: T
): {
  filters: T
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void
  resetFilters: () => void
  clearFilter: <K extends keyof T>(key: K) => void
  hasActiveFilters: boolean
  activeFilterCount: number
} {
  const [filters, setFilters] = React.useState<T>(initialFilters)

  const setFilter = React.useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = React.useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const clearFilter = React.useCallback(<K extends keyof T>(key: K) => {
    setFilters(prev => ({ ...prev, [key]: initialFilters[key] }))
  }, [initialFilters])

  const activeFilterCount = React.useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      const initial = initialFilters[key as keyof T]
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'string') return value !== '' && value !== initial
      if (typeof value === 'boolean') return value !== initial
      return value !== initial && value !== null && value !== undefined
    }).length
  }, [filters, initialFilters])

  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    setFilter,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    activeFilterCount,
  }
}

// Search/filter data hook
export function useFilteredData<T>(
  data: T[],
  searchQuery: string,
  searchFields: (keyof T)[],
  additionalFilters?: (item: T) => boolean
): T[] {
  return React.useMemo(() => {
    let filtered = data

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query)
          }
          if (typeof value === 'number') {
            return value.toString().includes(query)
          }
          return false
        })
      )
    }

    // Apply additional filters
    if (additionalFilters) {
      filtered = filtered.filter(additionalFilters)
    }

    return filtered
  }, [data, searchQuery, searchFields, additionalFilters])
}

// Pagination hook
export function usePagination<T>(
  data: T[],
  pageSize: number = 10
): {
  currentPage: number
  totalPages: number
  paginatedData: T[]
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  hasNextPage: boolean
  hasPrevPage: boolean
} {
  const [currentPage, setCurrentPage] = React.useState(1)

  const totalPages = Math.ceil(data.length / pageSize)
  
  // Reset to page 1 when data changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [data.length])

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, currentPage, pageSize])

  const goToPage = React.useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const nextPage = React.useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const prevPage = React.useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }
}

// Sort hook
export function useSort<T>(
  data: T[],
  initialSortKey?: keyof T,
  initialSortDirection: 'asc' | 'desc' = 'asc'
): {
  sortedData: T[]
  sortKey: keyof T | null
  sortDirection: 'asc' | 'desc'
  setSortKey: (key: keyof T) => void
  toggleSort: (key: keyof T) => void
} {
  const [sortKey, setSortKeyState] = React.useState<keyof T | null>(initialSortKey || null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(initialSortDirection)

  const setSortKey = React.useCallback((key: keyof T) => {
    setSortKeyState(key)
    setSortDirection('asc')
  }, [])

  const toggleSort = React.useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKeyState(key)
      setSortDirection('asc')
    }
  }, [sortKey])

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (aVal === bVal) return 0

      let comparison = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime()
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortKey, sortDirection])

  return {
    sortedData,
    sortKey,
    sortDirection,
    setSortKey,
    toggleSort,
  }
}

// Selection hook for bulk actions
export function useSelection<T extends { id: string }>(
  data: T[]
): {
  selectedIds: Set<string>
  isSelected: (id: string) => boolean
  toggle: (id: string) => void
  select: (id: string) => void
  deselect: (id: string) => void
  selectAll: () => void
  deselectAll: () => void
  toggleAll: () => void
  selectedItems: T[]
  selectedCount: number
  isAllSelected: boolean
  isSomeSelected: boolean
} {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const isSelected = React.useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const toggle = React.useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const select = React.useCallback((id: string) => {
    setSelectedIds(prev => new Set(prev).add(id))
  }, [])

  const deselect = React.useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const selectAll = React.useCallback(() => {
    setSelectedIds(new Set(data.map(item => item.id)))
  }, [data])

  const deselectAll = React.useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const toggleAll = React.useCallback(() => {
    if (selectedIds.size === data.length) {
      deselectAll()
    } else {
      selectAll()
    }
  }, [selectedIds.size, data.length, selectAll, deselectAll])

  const selectedItems = React.useMemo(() => 
    data.filter(item => selectedIds.has(item.id)), 
    [data, selectedIds]
  )

  const isAllSelected = data.length > 0 && selectedIds.size === data.length
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < data.length

  return {
    selectedIds,
    isSelected,
    toggle,
    select,
    deselect,
    selectAll,
    deselectAll,
    toggleAll,
    selectedItems,
    selectedCount: selectedIds.size,
    isAllSelected,
    isSomeSelected,
  }
}

// Debounce hook for search
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Local storage persistence hook
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Ignore storage errors
    }
  }, [key, state])

  return [state, setState]
}

// Toast/notification utility
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

export function useToasts(): {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
} {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return { toasts, addToast, removeToast, clearToasts }
}

// Export/download utility
export function downloadAsJson(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadAsCsv(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Date range filter utility
export type DateRangeOption = '7d' | '14d' | '30d' | '90d' | 'all' | 'custom'

export function getDateRangeFilter(option: DateRangeOption): { start: Date | null; end: Date | null } {
  const now = new Date()
  const end = now
  
  switch (option) {
    case '7d':
      return { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end }
    case '14d':
      return { start: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), end }
    case '30d':
      return { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), end }
    case '90d':
      return { start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), end }
    case 'all':
    case 'custom':
    default:
      return { start: null, end: null }
  }
}

export function isWithinDateRange(
  dateString: string,
  range: { start: Date | null; end: Date | null }
): boolean {
  if (!range.start && !range.end) return true
  
  const date = new Date(dateString)
  if (range.start && date < range.start) return false
  if (range.end && date > range.end) return false
  return true
}
