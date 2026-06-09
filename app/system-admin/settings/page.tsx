'use client'

import * as React from 'react'
import {
  Save,
  RefreshCw,
  Globe,
  Shield,
  Bell,
  Database,
  Mail,
  Key,
  FileText,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  Trash2,
  Server,
  MapPin,
  Lock,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  SettingsCallout,
  SettingsField,
  SettingsFieldGrid,
  SettingsNavItem,
  SettingsPanel,
  SettingsSection,
  SettingsSectionBlock,
  SettingsToggleRow,
} from '@/components/system-admin/settings-primitives'

const SETTINGS_NAV = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'api', label: 'API', icon: Key },
] as const

type SettingsTab = (typeof SETTINGS_NAV)[number]['id']

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('general')
  const [hasChanges, setHasChanges] = React.useState(false)
  const [showApiKey, setShowApiKey] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const [instanceName, setInstanceName] = React.useState('VoltusWave Production')
  const [instanceUrl, setInstanceUrl] = React.useState('https://voltuswave.example.com')
  const [defaultTimezone, setDefaultTimezone] = React.useState('UTC')
  const [dateFormat, setDateFormat] = React.useState('DD/MM/YYYY')
  const [language, setLanguage] = React.useState('en')

  const [mfaEnabled, setMfaEnabled] = React.useState(true)
  const [sessionTimeout, setSessionTimeout] = React.useState('30')
  const [passwordExpiry, setPasswordExpiry] = React.useState('90')
  const [ipWhitelist, setIpWhitelist] = React.useState('')
  const [auditLogRetention, setAuditLogRetention] = React.useState('365')

  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [slackIntegration, setSlackIntegration] = React.useState(false)
  const [criticalAlerts, setCriticalAlerts] = React.useState(true)
  const [dailyDigest, setDailyDigest] = React.useState(true)
  const [smtpHost, setSmtpHost] = React.useState('smtp.example.com')
  const [smtpPort, setSmtpPort] = React.useState('587')

  const [dataRetention, setDataRetention] = React.useState('730')
  const [backupFrequency, setBackupFrequency] = React.useState('daily')
  const [compressionEnabled, setCompressionEnabled] = React.useState(true)
  const [encryptionEnabled, setEncryptionEnabled] = React.useState(true)

  const [apiKey] = React.useState('vw_live_sk_1234567890abcdef')
  const [rateLimitPerMinute, setRateLimitPerMinute] = React.useState('1000')
  const [webhookUrl, setWebhookUrl] = React.useState('')

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setHasChanges(false)
    const { toast } = await import('sonner')
    toast.success('Settings saved', { description: 'Your changes have been applied to this tenant.' })
  }

  const markChanged = () => setHasChanges(true)

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    import('sonner').then(({ toast }) => toast.success('API key copied'))
  }

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full min-h-0">
        <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">System Settings</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Configure global instance settings, security policies, notifications, data retention, and
                  API access for your tenant.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {hasChanges && (
                  <Badge
                    variant="outline"
                    className="text-amber-700 dark:text-amber-400 border-amber-500/35 bg-amber-500/[0.06]"
                  >
                    Unsaved changes
                  </Badge>
                )}
                <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
                <Button size="sm" className="gap-2" onClick={handleSave} disabled={!hasChanges || isSaving}>
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          <aside className="hidden lg:flex w-52 shrink-0 border-r bg-muted/20 flex-col gap-0.5 p-3">
            <p className="micro-label px-3 py-2 mb-1">Sections</p>
            {SETTINGS_NAV.map((item) => (
              <SettingsNavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </aside>

          <div className="flex-1 overflow-auto bg-muted/10">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as SettingsTab)}
              className="max-w-3xl mx-auto w-full"
            >
              <div className="lg:hidden sticky top-0 z-10 border-b bg-background/95 backdrop-blur px-4 py-3">
                <TabsList className="flex-wrap h-auto gap-1 w-full justify-start bg-transparent p-0">
                  {SETTINGS_NAV.map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="gap-1.5 text-xs data-[state=active]:bg-brand/10 data-[state=active]:text-brand"
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-4 md:p-6 lg:p-8">

              <TabsContent value="general" className="mt-0 space-y-0">
                <SettingsPanel>
                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Server}
                      title="Instance configuration"
                      description="Identity and base URL for this VoltusWave tenant."
                    >
                      <SettingsFieldGrid>
                        <SettingsField label="Instance name" htmlFor="instanceName">
                          <Input
                            id="instanceName"
                            value={instanceName}
                            onChange={(e) => {
                              setInstanceName(e.target.value)
                              markChanged()
                            }}
                          />
                        </SettingsField>
                        <SettingsField label="Instance URL" htmlFor="instanceUrl">
                          <Input
                            id="instanceUrl"
                            value={instanceUrl}
                            onChange={(e) => {
                              setInstanceUrl(e.target.value)
                              markChanged()
                            }}
                            className="font-mono text-sm"
                          />
                        </SettingsField>
                      </SettingsFieldGrid>
                    </SettingsSection>
                  </SettingsSectionBlock>

                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={MapPin}
                      title="Regional preferences"
                      description="Default timezone, date format, and language for the admin UI and reports."
                    >
                      <SettingsFieldGrid columns={3}>
                        <SettingsField label="Default timezone" htmlFor="timezone">
                          <Select
                            value={defaultTimezone}
                            onValueChange={(v) => {
                              setDefaultTimezone(v)
                              markChanged()
                            }}
                          >
                            <SelectTrigger id="timezone">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT)</SelectItem>
                              <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                              <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingsField>
                        <SettingsField label="Date format" htmlFor="dateFormat">
                          <Select
                            value={dateFormat}
                            onValueChange={(v) => {
                              setDateFormat(v)
                              markChanged()
                            }}
                          >
                            <SelectTrigger id="dateFormat">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingsField>
                        <SettingsField label="Language" htmlFor="language">
                          <Select
                            value={language}
                            onValueChange={(v) => {
                              setLanguage(v)
                              markChanged()
                            }}
                          >
                            <SelectTrigger id="language">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="ja">Japanese</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingsField>
                      </SettingsFieldGrid>
                    </SettingsSection>
                  </SettingsSectionBlock>
                </SettingsPanel>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="space-y-4 mb-6">
                  <SettingsCallout icon={Shield} title="Security best practices" tone="info">
                    Enable MFA, enforce session timeouts, and restrict access by IP for production tenants.
                  </SettingsCallout>
                </div>
                <SettingsPanel>
                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Shield}
                      title="Authentication"
                      description="Session lifetime and password rotation for human users."
                    >
                      <div className="rounded-xl bg-background border border-border/60 px-4 mb-5 shadow-[var(--shadow-xs)]">
                        <SettingsToggleRow
                          label="Multi-factor authentication (MFA)"
                          description="Require MFA for all user logins"
                        >
                          <Switch
                            checked={mfaEnabled}
                            onCheckedChange={(v) => {
                              setMfaEnabled(v)
                              markChanged()
                            }}
                          />
                        </SettingsToggleRow>
                      </div>
                      <SettingsFieldGrid>
                        <SettingsField label="Session timeout (minutes)" htmlFor="sessionTimeout">
                          <Input
                            id="sessionTimeout"
                            type="number"
                            value={sessionTimeout}
                            onChange={(e) => {
                              setSessionTimeout(e.target.value)
                              markChanged()
                            }}
                            className="font-mono"
                          />
                        </SettingsField>
                        <SettingsField label="Password expiry (days)" htmlFor="passwordExpiry">
                          <Input
                            id="passwordExpiry"
                            type="number"
                            value={passwordExpiry}
                            onChange={(e) => {
                              setPasswordExpiry(e.target.value)
                              markChanged()
                            }}
                            className="font-mono"
                          />
                        </SettingsField>
                      </SettingsFieldGrid>
                    </SettingsSection>
                  </SettingsSectionBlock>

                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Lock}
                      title="Access control"
                      description="Network boundaries and audit log retention."
                    >
                      <SettingsField
                        label="IP whitelist"
                        htmlFor="ipWhitelist"
                        hint="Comma-separated CIDR ranges. Leave empty to allow all IPs."
                      >
                        <Textarea
                          id="ipWhitelist"
                          placeholder="192.168.1.0/24, 10.0.0.1"
                          value={ipWhitelist}
                          onChange={(e) => {
                            setIpWhitelist(e.target.value)
                            markChanged()
                          }}
                          rows={3}
                          className="font-mono text-sm resize-none"
                        />
                      </SettingsField>
                      <SettingsField
                        label="Audit log retention (days)"
                        htmlFor="auditRetention"
                        className="max-w-xs"
                      >
                        <Input
                          id="auditRetention"
                          type="number"
                          value={auditLogRetention}
                          onChange={(e) => {
                            setAuditLogRetention(e.target.value)
                            markChanged()
                          }}
                          className="font-mono"
                        />
                      </SettingsField>
                    </SettingsSection>
                  </SettingsSectionBlock>
                </SettingsPanel>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <SettingsPanel>
                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Bell}
                      title="Notification channels"
                      description="Choose how your team receives operational alerts."
                    >
                      <div className="rounded-xl bg-background border border-border/60 px-4 shadow-[var(--shadow-xs)]">
                        <SettingsToggleRow
                          label="Email notifications"
                          description="Receive notifications via email"
                        >
                          <Switch
                            checked={emailNotifications}
                            onCheckedChange={(v) => {
                              setEmailNotifications(v)
                              markChanged()
                            }}
                          />
                        </SettingsToggleRow>
                        <SettingsToggleRow
                          label="Slack integration"
                          description="Send alerts to Slack channels"
                        >
                          <Switch
                            checked={slackIntegration}
                            onCheckedChange={(v) => {
                              setSlackIntegration(v)
                              markChanged()
                            }}
                          />
                        </SettingsToggleRow>
                        <SettingsToggleRow
                          label="Critical alerts"
                          description="Immediate alerts for critical issues"
                        >
                          <Switch
                            checked={criticalAlerts}
                            onCheckedChange={(v) => {
                              setCriticalAlerts(v)
                              markChanged()
                            }}
                          />
                        </SettingsToggleRow>
                        <SettingsToggleRow
                          label="Daily digest"
                          description="Receive daily summary emails"
                        >
                          <Switch
                            checked={dailyDigest}
                            onCheckedChange={(v) => {
                              setDailyDigest(v)
                              markChanged()
                            }}
                          />
                        </SettingsToggleRow>
                      </div>
                    </SettingsSection>
                  </SettingsSectionBlock>

                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Mail}
                      title="SMTP configuration"
                      description="Outgoing mail server for system-generated emails."
                    >
                      <SettingsFieldGrid>
                        <SettingsField label="SMTP host" htmlFor="smtpHost">
                          <Input
                            id="smtpHost"
                            value={smtpHost}
                            onChange={(e) => {
                              setSmtpHost(e.target.value)
                              markChanged()
                            }}
                            className="font-mono text-sm"
                          />
                        </SettingsField>
                        <SettingsField label="SMTP port" htmlFor="smtpPort">
                          <Input
                            id="smtpPort"
                            value={smtpPort}
                            onChange={(e) => {
                              setSmtpPort(e.target.value)
                              markChanged()
                            }}
                            className="font-mono"
                          />
                        </SettingsField>
                      </SettingsFieldGrid>
                      <Button variant="outline" size="sm" className="gap-2 mt-2">
                        <Mail className="h-4 w-4" />
                        Send test email
                      </Button>
                    </SettingsSection>
                  </SettingsSectionBlock>
                </SettingsPanel>
              </TabsContent>

              <TabsContent value="data" className="mt-0">
                <SettingsPanel>
                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Database}
                      title="Retention & backups"
                      description="How long evidence and run data are kept before archival."
                    >
                      <SettingsFieldGrid>
                        <SettingsField
                          label="Data retention (days)"
                          htmlFor="dataRetention"
                          hint="Test results and evidence older than this will be archived."
                        >
                          <Input
                            id="dataRetention"
                            type="number"
                            value={dataRetention}
                            onChange={(e) => {
                              setDataRetention(e.target.value)
                              markChanged()
                            }}
                            className="font-mono"
                          />
                        </SettingsField>
                        <SettingsField label="Backup frequency" htmlFor="backupFrequency">
                          <Select
                            value={backupFrequency}
                            onValueChange={(v) => {
                              setBackupFrequency(v)
                              markChanged()
                            }}
                          >
                            <SelectTrigger id="backupFrequency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </SettingsField>
                      </SettingsFieldGrid>
                    </SettingsSection>
                  </SettingsSectionBlock>

                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Database}
                      title="Storage options"
                      description="Compression and encryption for stored artifacts."
                    >
                      <div className="rounded-xl bg-background border border-border/60 px-4 shadow-[var(--shadow-xs)]">
                        <SettingsToggleRow
                          label="Data compression"
                          description="Compress stored data to save space"
                        >
                          <Switch
                            checked={compressionEnabled}
                            onCheckedChange={(v) => {
                              setCompressionEnabled(v)
                              markChanged()
                            }}
                          />
                        </SettingsToggleRow>
                        <SettingsToggleRow
                          label="Encryption at rest"
                          description="Encrypt all stored data"
                        >
                          <Switch
                            checked={encryptionEnabled}
                            onCheckedChange={(v) => {
                              setEncryptionEnabled(v)
                              markChanged()
                            }}
                          />
                        </SettingsToggleRow>
                      </div>
                    </SettingsSection>
                  </SettingsSectionBlock>

                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Trash2}
                      title="Danger zone"
                      description="Irreversible actions that affect stored data."
                      tone="danger"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-red-500/25 bg-red-500/[0.04] px-4 py-4">
                        <div>
                          <p className="text-sm font-medium">Purge old data</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Delete all data older than {dataRetention} days. Cannot be undone.
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="gap-2 shrink-0">
                              <Trash2 className="h-4 w-4" />
                              Purge
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                This will permanently delete all data older than {dataRetention} days. This
                                action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button variant="destructive">Confirm purge</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </SettingsSection>
                  </SettingsSectionBlock>
                </SettingsPanel>
              </TabsContent>

              <TabsContent value="api" className="mt-0">
                <SettingsPanel>
                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={Key}
                      title="API credentials"
                      description="Live key for tenant integrations. Rotate if compromised."
                    >
                      <SettingsField label="Live API key">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              type={showApiKey ? 'text' : 'password'}
                              value={apiKey}
                              readOnly
                              className="pr-11 font-mono text-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                              onClick={() => setShowApiKey(!showApiKey)}
                            >
                              {showApiKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button type="button" variant="outline" size="icon" onClick={copyApiKey}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </SettingsField>
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Regenerate key
                      </Button>
                    </SettingsSection>
                  </SettingsSectionBlock>

                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={RefreshCw}
                      title="Rate limiting"
                      description="Throttle external API consumers to protect platform capacity."
                    >
                      <SettingsField
                        label="Requests per minute"
                        htmlFor="rateLimit"
                        className="max-w-xs"
                      >
                        <Input
                          id="rateLimit"
                          type="number"
                          value={rateLimitPerMinute}
                          onChange={(e) => {
                            setRateLimitPerMinute(e.target.value)
                            markChanged()
                          }}
                          className="font-mono"
                        />
                      </SettingsField>
                    </SettingsSection>
                  </SettingsSectionBlock>

                  <SettingsSectionBlock>
                    <SettingsSection
                      icon={FileText}
                      title="Webhooks"
                      description="Receive real-time events for executions, defects, and sign-offs."
                    >
                      <SettingsField label="Webhook URL" htmlFor="webhookUrl">
                        <Input
                          id="webhookUrl"
                          placeholder="https://your-server.com/webhook"
                          value={webhookUrl}
                          onChange={(e) => {
                            setWebhookUrl(e.target.value)
                            markChanged()
                          }}
                          className="font-mono text-sm"
                        />
                      </SettingsField>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          Test webhook
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="h-4 w-4" />
                          View logs
                        </Button>
                      </div>
                    </SettingsSection>
                  </SettingsSectionBlock>
                </SettingsPanel>
              </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {hasChanges && (
          <div className="shrink-0 border-t bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-3 sm:hidden">
            <p className="text-xs text-muted-foreground">You have unsaved changes</p>
            <Button size="sm" className="gap-2" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
