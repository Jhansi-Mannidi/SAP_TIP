'use client'

import { motion } from 'framer-motion'

import { BPCoverageMatrix } from '@/components/bp-coverage-matrix'
import { staggerItem } from '@/lib/animations'
import { BP_SCOPE } from '@/lib/process-mining-mock-data'

export function CoverageAnalysisPanel() {
  return (
    <motion.div variants={staggerItem} initial="hidden" animate="visible">
      <BPCoverageMatrix scope={BP_SCOPE} variant="expanded" />
    </motion.div>
  )
}
