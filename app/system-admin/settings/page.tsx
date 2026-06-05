'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Save, 
  RefreshCw,
  Globe,
  Clock,
  Shield,
  Bell,
  Database,
  Mail,
  Key,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  Trash2,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem, fadeInUp, AnimatedNumber } from '@/lib/animations'

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general')
  const [hasChanges, setHasChanges] = React.useState(false)
  const [showApiKey, setShowApiKey] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  
  // General Settings State
  const [instanceName, setInstanceName] = React.useState('VoltusWave Production')
  const [instanceUrl, setInstanceUrl] = React.useState('https://voltuswave.example.com')
  const [defaultTimezone, setDefaultTimezone] = React.useState('UTC')
  const [dateFormat, setDateFormat] = React.useState('DD/MM/YYYY')
  const [language, setLanguage] = React.useState('en')
  
  // Security Settings State
  const [mfaEnabled, setMfaEnabled] = React.useState(true)
  const [sessionTimeout, setSessionTimeout] = React.useState('30')
  const [passwordExpiry, setPasswordExpiry] = React.useState('90')
  const [ipWhitelist, setIpWhitelist] = React.useState('')
  const [auditLogRetention, setAuditLogRetention] = React.useState('365')
  
  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [slackIntegration, setSlackIntegration] = React.useState(false)
  const [criticalAlerts, setCriticalAlerts] = React.useState(true)
  const [dailyDigest, setDailyDigest] = React.useState(true)
  const [smtpHost, setSmtpHost] = React.useState('smtp.example.com')
  const [smtpPort, setSmtpPort] = React.useState('587')
  
  // Data Settings State
  const [dataRetention, setDataRetention] = React.useState('730')
  const [backupFrequency, setBackupFrequency] = React.useState('daily')
  const [compressionEnabled, setCompressionEnabled] = React.useState(true)
  const [encryptionEnabled, setEncryptionEnabled] = React.useState(true)
  
  // API Settings
  const [apiKey] = React.useState('vw_live_sk_1234567890abcdef')
  const [rateLimitPerMinute, setRateLimitPerMinute] = React.useState('1000')
  const [webhookUrl, setWebhookUrl] = React.useState('')
  
  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setHasChanges(false)
  }
  
  const handleChange = () => {
    setHasChanges(true)
  }
  
  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Animated Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="page-title">System Settings</h1>
            <p className="page-description mt-1">
              Configure global system settings, security policies, and integrations.
            </p>
          </div>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {hasChanges && (
              <Badge variant="outline" className="text-amber-600 border-amber-600">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </motion.div>
        </motion.div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1">
              <TabsTrigger value="general" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instance Configuration</CardTitle>
                    <CardDescription>Configure the basic settings for your VoltusWave instance.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="instanceName">Instance Name</Label>
                        <Input 
                          id="instanceName" 
                          value={instanceName}
                          onChange={(e) => { setInstanceName(e.target.value); handleChange(); }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instanceUrl">Instance URL</Label>
                        <Input 
                          id="instanceUrl" 
                          value={instanceUrl}
                          onChange={(e) => { setInstanceUrl(e.target.value); handleChange(); }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Regional Settings</CardTitle>
                    <CardDescription>Set timezone, date format, and language preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Default Timezone</Label>
                        <Select value={defaultTimezone} onValueChange={(v) => { setDefaultTimezone(v); handleChange(); }}>
                          <SelectTrigger>
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={dateFormat} onValueChange={(v) => { setDateFormat(v); handleChange(); }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={(v) => { setLanguage(v); handleChange(); }}>
                          <SelectTrigger>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={staggerItem}>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Security Best Practices</AlertTitle>
                  <AlertDescription>
                    We recommend enabling MFA, setting session timeouts, and regularly rotating passwords for enhanced security.
                  </AlertDescription>
                </Alert>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Authentication</CardTitle>
                    <CardDescription>Configure authentication and session management.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Multi-Factor Authentication (MFA)</Label>
                        <p className="page-description">Require MFA for all user logins</p>
                      </div>
                      <Switch 
                        checked={mfaEnabled} 
                        onCheckedChange={(v) => { setMfaEnabled(v); handleChange(); }} 
                      />
                    </div>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input 
                          id="sessionTimeout" 
                          type="number"
                          value={sessionTimeout}
                          onChange={(e) => { setSessionTimeout(e.target.value); handleChange(); }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                        <Input 
                          id="passwordExpiry" 
                          type="number"
                          value={passwordExpiry}
                          onChange={(e) => { setPasswordExpiry(e.target.value); handleChange(); }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Access Control</CardTitle>
                    <CardDescription>Manage IP restrictions and audit settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ipWhitelist">IP Whitelist (comma-separated)</Label>
                      <Textarea 
                        id="ipWhitelist"
                        placeholder="e.g., 192.168.1.0/24, 10.0.0.1"
                        value={ipWhitelist}
                        onChange={(e) => { setIpWhitelist(e.target.value); handleChange(); }}
                        rows={3}
                      />
                      <p className="caption-text">Leave empty to allow all IPs</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auditRetention">Audit Log Retention (days)</Label>
                      <Input 
                        id="auditRetention" 
                        type="number"
                        value={auditLogRetention}
                        onChange={(e) => { setAuditLogRetention(e.target.value); handleChange(); }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notification Preferences</CardTitle>
                    <CardDescription>Configure how and when you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="page-description">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={(v) => { setEmailNotifications(v); handleChange(); }} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Slack Integration</Label>
                        <p className="page-description">Send alerts to Slack channels</p>
                      </div>
                      <Switch 
                        checked={slackIntegration} 
                        onCheckedChange={(v) => { setSlackIntegration(v); handleChange(); }} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Critical Alerts</Label>
                        <p className="page-description">Immediate alerts for critical issues</p>
                      </div>
                      <Switch 
                        checked={criticalAlerts} 
                        onCheckedChange={(v) => { setCriticalAlerts(v); handleChange(); }} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Digest</Label>
                        <p className="page-description">Receive daily summary emails</p>
                      </div>
                      <Switch 
                        checked={dailyDigest} 
                        onCheckedChange={(v) => { setDailyDigest(v); handleChange(); }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Configuration (SMTP)</CardTitle>
                    <CardDescription>Configure outgoing email settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input 
                          id="smtpHost" 
                          value={smtpHost}
                          onChange={(e) => { setSmtpHost(e.target.value); handleChange(); }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input 
                          id="smtpPort" 
                          value={smtpPort}
                          onChange={(e) => { setSmtpPort(e.target.value); handleChange(); }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Test Email
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Data Settings */}
          <TabsContent value="data">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Retention</CardTitle>
                    <CardDescription>Configure how long data is retained in the system.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                      <Input 
                        id="dataRetention" 
                        type="number"
                        value={dataRetention}
                        onChange={(e) => { setDataRetention(e.target.value); handleChange(); }}
                      />
                      <p className="caption-text">Test results and evidence older than this will be archived</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <Select value={backupFrequency} onValueChange={(v) => { setBackupFrequency(v); handleChange(); }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Storage Options</CardTitle>
                    <CardDescription>Configure data compression and encryption.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Compression</Label>
                        <p className="page-description">Compress stored data to save space</p>
                      </div>
                      <Switch 
                        checked={compressionEnabled} 
                        onCheckedChange={(v) => { setCompressionEnabled(v); handleChange(); }} 
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Encryption at Rest</Label>
                        <p className="page-description">Encrypt all stored data</p>
                      </div>
                      <Switch 
                        checked={encryptionEnabled} 
                        onCheckedChange={(v) => { setEncryptionEnabled(v); handleChange(); }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions that affect your data.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Purge Old Data</p>
                        <p className="page-description">Delete all data older than retention period</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Purge
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              This will permanently delete all data older than {dataRetention} days. This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive">Confirm Purge</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">API Key</CardTitle>
                    <CardDescription>Your API key for external integrations.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Live API Key</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input 
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            readOnly
                            className="pr-20 font-mono"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button variant="outline" size="icon" onClick={copyApiKey}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="caption-text">Keep this key secret. Do not share it publicly.</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Key
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rate Limiting</CardTitle>
                    <CardDescription>Configure API rate limits.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rateLimit">Requests per Minute</Label>
                      <Input 
                        id="rateLimit" 
                        type="number"
                        value={rateLimitPerMinute}
                        onChange={(e) => { setRateLimitPerMinute(e.target.value); handleChange(); }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Webhooks</CardTitle>
                    <CardDescription>Configure webhook endpoints for real-time events.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input 
                        id="webhookUrl"
                        placeholder="https://your-server.com/webhook"
                        value={webhookUrl}
                        onChange={(e) => { setWebhookUrl(e.target.value); handleChange(); }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Test Webhook
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
