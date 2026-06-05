'use client'

import { motion } from 'framer-motion'
import { ArrowLeftRight, CheckCircle2, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import { MOCK_FIELD_MAPPINGS } from '@/lib/calm-mock-data'

export function CalmFieldMappingPanel() {
  const activeVersion = 'v2.1'
  const mappings = MOCK_FIELD_MAPPINGS

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="section-title">Field Mapping</h2>
            <p className="section-description mt-0.5">
              Versioned CALM ↔ SATIP attribute map — evolves without code changes
            </p>
          </div>
          <Badge variant="outline" className="w-fit gap-1.5 font-mono">
            <ArrowLeftRight className="h-3 w-3" />
            Active: {activeVersion}
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>CALM Field</TableHead>
              <TableHead className="hidden sm:table-cell">SATIP Field</TableHead>
              <TableHead className="text-center">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((m) => (
              <TableRow key={m.id} className={cn(!m.active && 'opacity-60')}>
                <TableCell className="font-mono text-xs">{m.version}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] h-5 font-mono">
                    {m.entity_kind}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{m.calm_field}</TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                  {m.satip_field}
                </TableCell>
                <TableCell className="text-center">
                  {m.active ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border/60 bg-muted/10">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Mappings reference bindings at runtime. A CALM test case maps to a SATIP test scenario; a
          CALM test step maps to a SATIP test case. Only bindings in BOUND/READY with write-back
          enabled project to CALM.
        </p>
      </div>
    </motion.div>
  )
}
