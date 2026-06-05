'use client'

import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

import { BPCoverageMatrix } from '@/components/bp-coverage-matrix'
import { staggerItem } from '@/lib/animations'
import { BP_SCOPE } from '@/lib/process-mining-mock-data'

export function CoverageAnalysisPanel() {
  return (
    <motion.div
      className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
      variants={staggerItem}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-4 border-b border-border/60">
          <div className="h-8 w-8 rounded-lg bg-brand/10 ring-1 ring-inset ring-brand/20 flex items-center justify-center shrink-0">
            <Target className="h-4 w-4 text-brand" />
          </div>
          <div>
            <h2 className="section-title">Coverage Analysis</h2>
            <p className="section-description mt-0.5">
              Map discovered processes to S/4HANA Best Practice scope items
            </p>
          </div>
        </div>
        <BPCoverageMatrix scope={BP_SCOPE} />
      </div>
    </motion.div>
  )
}
