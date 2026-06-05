'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ShieldAlert, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface ProductiveGuardBannerProps {
  systemId: string
  className?: string
}

export function ProductiveGuardBanner({ systemId, className }: ProductiveGuardBannerProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between px-4 py-2',
        'bg-red-600 text-white',
        'border-b border-red-700',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">
          PRODUCTIVE SYSTEM — actions are restricted; cosigned approval required for any write.
        </span>
        <span className="text-xs font-mono bg-red-700/50 px-2 py-0.5 rounded">
          {systemId}
        </span>
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-red-700 hover:text-white"
          >
            Learn More
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              Productive System Restrictions
            </SheetTitle>
            <SheetDescription>
              System {systemId} is marked as a productive environment
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">What This Means</h4>
              <p className="page-description">
                This system contains live business data and is used by end users for 
                daily operations. All modifications require additional approval to 
                prevent accidental disruption to business processes.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Restricted Actions</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Test execution requires dual-signature approval from authorized personnel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Data modifications are logged with full audit trail</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Transport imports require change advisory board sign-off</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Automated healing is disabled; manual review required</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Required Approvers</h4>
              <p className="page-description">
                At minimum, the following roles must co-sign any write operation:
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Test Lead or Test Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Basis Administrator or System Owner</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These restrictions are enforced at the platform 
                level and cannot be bypassed. All approval signatures are recorded 
                with cryptographic verification.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
