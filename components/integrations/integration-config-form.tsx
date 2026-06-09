'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Save, RefreshCw, Trash2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IntegrationItem } from '@/lib/integrations-mock-data'

interface IntegrationConfigFormProps {
  integration: IntegrationItem
}

export function IntegrationConfigForm({ integration }: IntegrationConfigFormProps) {
  const router = useRouter()
  const config = integration.config
  const [instanceUrl, setInstanceUrl] = React.useState(config?.instance_url ?? '')
  const [clientId, setClientId] = React.useState(config?.client_id ?? '')
  const [syncInterval, setSyncInterval] = React.useState(String(config?.sync_interval_minutes ?? 15))
  const [autoSync, setAutoSync] = React.useState(config?.auto_sync ?? true)
  const [mappings, setMappings] = React.useState(config?.field_mappings ?? [])
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Tabs defaultValue="connection" className="space-y-4">
      <TabsList className="w-full sm:w-auto h-auto flex-wrap justify-start gap-1 bg-muted/30 p-1">
        <TabsTrigger value="connection" className="text-xs sm:text-sm">
          Connection
        </TabsTrigger>
        <TabsTrigger value="mapping" className="text-xs sm:text-sm">
          Field Mapping
        </TabsTrigger>
        <TabsTrigger value="schedule" className="text-xs sm:text-sm">
          Sync Schedule
        </TabsTrigger>
      </TabsList>

      <TabsContent value="connection" className="space-y-4 mt-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cfgUrl">Instance URL</Label>
            <Input
              id="cfgUrl"
              value={instanceUrl}
              onChange={(e) => setInstanceUrl(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          {config?.auth_type === 'oauth' && (
            <div className="space-y-2">
              <Label htmlFor="cfgClient">Client ID</Label>
              <Input
                id="cfgClient"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Auth Type</Label>
            <Badge variant="outline" className="capitalize font-mono text-xs">
              {config?.auth_type?.replace('_', ' ') ?? 'oauth'}
            </Badge>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="mapping" className="space-y-4 mt-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
          {mappings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom field mappings configured.</p>
          ) : (
            mappings.map((m, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={m.satip_field}
                  onChange={(e) => {
                    const next = [...mappings]
                    next[i] = { ...next[i], satip_field: e.target.value }
                    setMappings(next)
                  }}
                  className="font-mono text-xs"
                />
                <Input
                  value={m.external_field}
                  onChange={(e) => {
                    const next = [...mappings]
                    next[i] = { ...next[i], external_field: e.target.value }
                    setMappings(next)
                  }}
                  className="font-mono text-xs"
                />
              </div>
            ))
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() =>
              setMappings([...mappings, { satip_field: 'defect.summary', external_field: '' }])
            }
          >
            <Plus className="h-3.5 w-3.5" />
            Add Mapping
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="schedule" className="space-y-4 mt-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Sync</Label>
              <p className="caption-text mt-0.5">Pull and push changes on a schedule</p>
            </div>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
          <div className="space-y-2">
            <Label>Interval</Label>
            <Select value={syncInterval} onValueChange={setSyncInterval} disabled={!autoSync}>
              <SelectTrigger className="sm:max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every minute</SelectItem>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2">
              <Trash2 className="h-4 w-4" />
              Disconnect Integration
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect {integration.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Sync will stop and credentials will be removed. You can reconnect later from the
                Integrations Hub.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => router.push('/system-admin/integrations')}
              >
                Disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link href={`/system-admin/integrations/${integration.id}/logs`}>
              <RefreshCw className="h-4 w-4" />
              View Logs
            </Link>
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <Save className="h-4 w-4" />
            {saved ? 'Saved' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Tabs>
  )
}
