'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Plus, Search } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import {
  INTEGRATION_CATALOG,
  MOCK_INTEGRATIONS,
  getCategoryMeta,
} from '@/lib/integrations-mock-data'

export default function AddIntegrationPage() {
  const [search, setSearch] = React.useState('')
  const connectedSlugs = new Set(MOCK_INTEGRATIONS.map((i) => i.slug))

  const filtered = INTEGRATION_CATALOG.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AppShell currentApp="system-admin">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            <div className="page-breadcrumb">
              <Link href="/system-admin/integrations" className="hover:text-foreground transition-colors">
                Integrations Hub
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">Add Integration</span>
            </div>
            <PageHeader
              title="Add Integration"
              description="Choose a connector to set up. Popular integrations are ready in minutes."
            />
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search connectors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((entry) => {
                const category = getCategoryMeta(entry.category)
                const CategoryIcon = category.icon
                const existing = MOCK_INTEGRATIONS.find((i) => i.slug === entry.slug)
                const isConnected = existing && existing.status !== 'disconnected'

                return (
                  <motion.article
                    key={entry.slug}
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      'rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-xs)] flex flex-col',
                      entry.popular && 'ring-1 ring-brand/20',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center">
                          <CategoryIcon className="h-4 w-4 text-brand" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">{entry.name}</h3>
                          <Badge variant="secondary" className="h-4 text-[9px] mt-0.5">
                            {category.label}
                          </Badge>
                        </div>
                      </div>
                      {entry.popular && (
                        <Badge className="pill pill-brand h-5 text-[9px] border-0">Popular</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 flex-1 leading-relaxed">
                      {entry.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-border/60">
                      {isConnected && existing ? (
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs" asChild>
                          <Link href={`/system-admin/integrations/${existing.id}/configure`}>
                            Manage
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full h-8 text-xs bg-brand text-brand-foreground hover:bg-brand/90"
                          asChild
                        >
                          <Link href={`/system-admin/integrations/add/${entry.slug}`}>
                            <Plus className="h-3 w-3 mr-1" />
                            {existing ? 'Reconnect' : 'Set up'}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              No connectors match your search.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
