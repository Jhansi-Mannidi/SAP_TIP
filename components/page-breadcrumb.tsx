import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface PageBreadcrumbItem {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  items: PageBreadcrumbItem[]
  className?: string
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('page-breadcrumb', className)}>
      <ol className="page-breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li
              key={`${item.label}-${index}`}
              className={cn(
                'page-breadcrumb-item',
                !isLast && index > 0 && 'page-breadcrumb-item--truncate',
              )}
            >
              {index > 0 && (
                <ChevronRight className="page-breadcrumb-sep" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link href={item.href} className="page-breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast ? 'page-breadcrumb-current' : 'page-breadcrumb-link')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
