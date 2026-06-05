'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Play, Image as ImageIcon, FileCode, Terminal, Boxes } from 'lucide-react'

export type EvidenceKind = 'screenshot' | 'video' | 'screen_model_snapshot' | 'api_request_response' | 'action_log'

interface EvidenceThumbnailProps {
  evidenceKind: EvidenceKind
  storageUri: string
  title?: string
  className?: string
  onClick?: () => void
}

export function EvidenceThumbnail({ 
  evidenceKind, 
  storageUri, 
  title,
  className,
  onClick 
}: EvidenceThumbnailProps) {
  const handleClick = () => {
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden rounded-lg border border-border',
        'transition-all duration-200 hover:border-indigo-300 hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        'group cursor-pointer',
        className
      )}
    >
      {evidenceKind === 'screenshot' && (
        <ScreenshotThumbnail storageUri={storageUri} title={title} />
      )}
      {evidenceKind === 'video' && (
        <VideoThumbnail storageUri={storageUri} title={title} />
      )}
      {evidenceKind === 'screen_model_snapshot' && (
        <ScreenModelThumbnail title={title} />
      )}
      {evidenceKind === 'api_request_response' && (
        <ApiTraceThumbnail title={title} />
      )}
      {evidenceKind === 'action_log' && (
        <ActionLogThumbnail title={title} />
      )}
    </button>
  )
}

function ScreenshotThumbnail({ storageUri, title }: { storageUri: string; title?: string }) {
  return (
    <div className="aspect-[4/3] bg-slate-100">
      <div className="w-full h-full flex items-center justify-center">
        <ImageIcon className="h-8 w-8 text-slate-400" />
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <span className="text-xs text-white truncate block">{title}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors" />
    </div>
  )
}

function VideoThumbnail({ storageUri, title }: { storageUri: string; title?: string }) {
  return (
    <div className="aspect-[4/3] bg-slate-900 relative">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <Play className="h-6 w-6 text-white ml-0.5" />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span className="text-xs text-white truncate block">{title}</span>
        </div>
      )}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
        VIDEO
      </div>
    </div>
  )
}

function ScreenModelThumbnail({ title }: { title?: string }) {
  return (
    <div className="aspect-[4/3] bg-slate-50 p-3">
      {/* Mini wireframe diagram */}
      <div className="w-full h-full border border-slate-200 rounded bg-white p-2 space-y-1.5">
        <div className="h-2 w-1/2 bg-slate-200 rounded" />
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          <div className="h-3 bg-slate-100 rounded border border-slate-200" />
          <div className="h-3 bg-slate-100 rounded border border-slate-200" />
          <div className="h-3 bg-slate-100 rounded border border-slate-200" />
          <div className="h-3 bg-slate-100 rounded border border-slate-200" />
        </div>
        <div className="flex gap-1.5 justify-end pt-1">
          <div className="h-2 w-6 bg-indigo-200 rounded" />
          <div className="h-2 w-6 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="absolute top-2 right-2 bg-slate-200 text-slate-600 text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
        <Boxes className="h-3 w-3" />
        MODEL
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-200 to-transparent p-2">
          <span className="text-xs text-slate-700 truncate block">{title}</span>
        </div>
      )}
    </div>
  )
}

function ApiTraceThumbnail({ title }: { title?: string }) {
  return (
    <div className="aspect-[4/3] bg-slate-900 p-2 font-mono text-[8px] text-emerald-400 overflow-hidden">
      <div className="space-y-0.5">
        <div className="text-slate-500">{'{'}</div>
        <div className="pl-2">
          <span className="text-amber-400">"method"</span>: <span className="text-emerald-400">"POST"</span>,
        </div>
        <div className="pl-2">
          <span className="text-amber-400">"url"</span>: <span className="text-emerald-400">"/sap/..."</span>,
        </div>
        <div className="pl-2">
          <span className="text-amber-400">"status"</span>: <span className="text-blue-400">200</span>
        </div>
        <div className="text-slate-500">{'}'}</div>
      </div>
      <div className="absolute top-2 right-2 bg-emerald-900/80 text-emerald-300 text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
        <FileCode className="h-3 w-3" />
        API
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-2">
          <span className="text-xs text-slate-300 truncate block">{title}</span>
        </div>
      )}
    </div>
  )
}

function ActionLogThumbnail({ title }: { title?: string }) {
  return (
    <div className="aspect-[4/3] bg-slate-900 p-2 font-mono text-[8px] overflow-hidden">
      <div className="space-y-0.5">
        <div className="flex gap-1">
          <span className="text-slate-500">$</span>
          <span className="text-slate-300">navigate_to</span>
          <span className="text-cyan-400">VA01</span>
        </div>
        <div className="flex gap-1">
          <span className="text-slate-500">$</span>
          <span className="text-slate-300">set_field</span>
          <span className="text-amber-400">ORDER_TYPE</span>
        </div>
        <div className="flex gap-1">
          <span className="text-slate-500">$</span>
          <span className="text-slate-300">click</span>
          <span className="text-emerald-400">SAVE</span>
        </div>
        <div className="flex gap-1">
          <span className="text-emerald-500">✓</span>
          <span className="text-emerald-400">Created: 1234567</span>
        </div>
      </div>
      <div className="absolute top-2 right-2 bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
        <Terminal className="h-3 w-3" />
        LOG
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-2">
          <span className="text-xs text-slate-300 truncate block">{title}</span>
        </div>
      )}
    </div>
  )
}
