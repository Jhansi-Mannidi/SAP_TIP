import type { LucideIcon } from 'lucide-react'
import {
  MessageSquare,
  GitBranch,
  FileText,
  AlertTriangle,
  BarChart3,
  Mail,
  Webhook,
  Database,
  Puzzle,
} from 'lucide-react'

export const INTEGRATION_CATEGORIES = [
  { id: 'itsm', label: 'ITSM', icon: MessageSquare },
  { id: 'cicd', label: 'CI/CD', icon: GitBranch },
  { id: 'docs', label: 'Documentation', icon: FileText },
  { id: 'alerts', label: 'Alerting', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'storage', label: 'Storage', icon: Database },
] as const

export type IntegrationCategory = (typeof INTEGRATION_CATEGORIES)[number]['id']
export type IntegrationStatus = 'connected' | 'warning' | 'disconnected'

export interface IntegrationItem {
  id: string
  slug: string
  name: string
  category: IntegrationCategory
  description: string
  status: IntegrationStatus
  last_sync?: string
  warning?: string
  stats?: Record<string, number>
  config?: IntegrationConfig
}

export interface IntegrationConfig {
  instance_url: string
  auth_type: 'oauth' | 'api_key' | 'basic' | 'webhook'
  client_id?: string
  sync_interval_minutes: number
  auto_sync: boolean
  field_mappings: { satip_field: string; external_field: string }[]
  webhook_url?: string
}

export interface IntegrationCatalogEntry {
  slug: string
  name: string
  category: IntegrationCategory
  description: string
  auth_type: IntegrationConfig['auth_type']
  popular?: boolean
}

export interface IntegrationSyncLogEntry {
  id: string
  integration_id: string
  timestamp: string
  direction: 'inbound' | 'outbound'
  operation: string
  status: 'success' | 'warning' | 'failed'
  records: number
  duration_ms: number
  message: string
}

export const INTEGRATION_CATALOG: IntegrationCatalogEntry[] = [
  { slug: 'servicenow', name: 'ServiceNow', category: 'itsm', description: 'Bi-directional ITSM sync for incidents and changes.', auth_type: 'oauth', popular: true },
  { slug: 'jira', name: 'Jira', category: 'itsm', description: 'Create and track Jira issues from test failures.', auth_type: 'oauth', popular: true },
  { slug: 'azure-devops', name: 'Azure DevOps', category: 'cicd', description: 'Trigger pipelines and report test results.', auth_type: 'oauth', popular: true },
  { slug: 'github-actions', name: 'GitHub Actions', category: 'cicd', description: 'Workflow dispatch integration for CI triggers.', auth_type: 'api_key' },
  { slug: 'slack', name: 'Slack', category: 'alerts', description: 'Channel notifications for test events.', auth_type: 'oauth', popular: true },
  { slug: 'microsoft-teams', name: 'Microsoft Teams', category: 'alerts', description: 'Post alerts and results to Teams channels.', auth_type: 'oauth' },
  { slug: 'pagerduty', name: 'PagerDuty', category: 'alerts', description: 'On-call alerting for critical failures.', auth_type: 'api_key' },
  { slug: 'opsgenie', name: 'Opsgenie', category: 'alerts', description: 'Route failures to on-call schedules.', auth_type: 'api_key' },
  { slug: 'confluence', name: 'Confluence', category: 'docs', description: 'Publish test documentation and evidence.', auth_type: 'oauth' },
  { slug: 'sharepoint', name: 'SharePoint', category: 'docs', description: 'Store evidence bundles and sign-offs.', auth_type: 'oauth' },
  { slug: 'splunk', name: 'Splunk', category: 'analytics', description: 'Export telemetry and execution logs.', auth_type: 'api_key' },
  { slug: 'datadog', name: 'Datadog', category: 'analytics', description: 'Runner metrics and dashboard export.', auth_type: 'api_key' },
  { slug: 'sap-cloud-alm', name: 'SAP Cloud ALM', category: 'analytics', description: 'Test case bindings and defect enrichment.', auth_type: 'oauth', popular: true },
  { slug: 'smtp-email', name: 'SMTP Email', category: 'email', description: 'Email notifications for completions and reports.', auth_type: 'basic' },
  { slug: 'custom-webhook', name: 'Custom Webhook', category: 'webhooks', description: 'Signed outbound webhooks for any event.', auth_type: 'webhook' },
  { slug: 's3-storage', name: 'Amazon S3', category: 'storage', description: 'Archive evidence bundles to S3 buckets.', auth_type: 'api_key' },
]

export const MOCK_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int_1',
    slug: 'servicenow',
    name: 'ServiceNow',
    category: 'itsm',
    description: 'Bi-directional sync with ServiceNow for incident and change management.',
    status: 'connected',
    last_sync: '2026-05-07T10:30:00+05:30',
    stats: { incidents_synced: 156, changes_synced: 42 },
    config: {
      instance_url: 'https://starcement.service-now.com',
      auth_type: 'oauth',
      client_id: 'satip-snow-prod',
      sync_interval_minutes: 15,
      auto_sync: true,
      field_mappings: [
        { satip_field: 'defect.summary', external_field: 'short_description' },
        { satip_field: 'defect.severity', external_field: 'priority' },
      ],
    },
  },
  {
    id: 'int_2',
    slug: 'jira',
    name: 'Jira',
    category: 'itsm',
    description: 'Create and track Jira issues from defects and test failures.',
    status: 'connected',
    last_sync: '2026-05-07T10:25:00+05:30',
    stats: { issues_created: 89, issues_resolved: 67 },
    config: {
      instance_url: 'https://starcement.atlassian.net',
      auth_type: 'oauth',
      sync_interval_minutes: 30,
      auto_sync: true,
      field_mappings: [
        { satip_field: 'defect.title', external_field: 'summary' },
        { satip_field: 'test_run.id', external_field: 'customfield_10201' },
      ],
    },
  },
  {
    id: 'int_3',
    slug: 'azure-devops',
    name: 'Azure DevOps',
    category: 'cicd',
    description: 'Trigger test runs from Azure Pipelines and report results.',
    status: 'connected',
    last_sync: '2026-05-07T09:15:00+05:30',
    stats: { pipelines_triggered: 234, builds_monitored: 456 },
    config: {
      instance_url: 'https://dev.azure.com/starcement',
      auth_type: 'oauth',
      sync_interval_minutes: 5,
      auto_sync: true,
      field_mappings: [],
    },
  },
  {
    id: 'int_4',
    slug: 'confluence',
    name: 'Confluence',
    category: 'docs',
    description: 'Publish test documentation and evidence to Confluence spaces.',
    status: 'connected',
    last_sync: '2026-05-06T16:00:00+05:30',
    stats: { pages_published: 78, attachments: 312 },
    config: {
      instance_url: 'https://starcement.atlassian.net/wiki',
      auth_type: 'oauth',
      sync_interval_minutes: 60,
      auto_sync: false,
      field_mappings: [],
    },
  },
  {
    id: 'int_5',
    slug: 'pagerduty',
    name: 'PagerDuty',
    category: 'alerts',
    description: 'Send critical test failure alerts to PagerDuty for on-call response.',
    status: 'connected',
    last_sync: '2026-05-07T08:00:00+05:30',
    stats: { alerts_sent: 23, acknowledged: 21 },
    config: {
      instance_url: 'https://api.pagerduty.com',
      auth_type: 'api_key',
      sync_interval_minutes: 1,
      auto_sync: true,
      field_mappings: [],
    },
  },
  {
    id: 'int_6',
    slug: 'slack',
    name: 'Slack',
    category: 'alerts',
    description: 'Send notifications to Slack channels for test events.',
    status: 'warning',
    last_sync: '2026-05-05T12:00:00+05:30',
    stats: { messages_sent: 1245, channels: 4 },
    warning: 'Token expires in 7 days',
    config: {
      instance_url: 'https://slack.com/api',
      auth_type: 'oauth',
      sync_interval_minutes: 1,
      auto_sync: true,
      field_mappings: [],
    },
  },
  {
    id: 'int_7',
    slug: 'microsoft-teams',
    name: 'Microsoft Teams',
    category: 'alerts',
    description: 'Post test results and alerts to Teams channels.',
    status: 'disconnected',
  },
  {
    id: 'int_8',
    slug: 'splunk',
    name: 'Splunk',
    category: 'analytics',
    description: 'Export test telemetry and logs to Splunk for analysis.',
    status: 'connected',
    last_sync: '2026-05-07T10:00:00+05:30',
    stats: { events_exported: 125000, dashboards: 6 },
    config: {
      instance_url: 'https://splunk.starcement.internal:8088',
      auth_type: 'api_key',
      sync_interval_minutes: 5,
      auto_sync: true,
      field_mappings: [],
    },
  },
  {
    id: 'int_9',
    slug: 'custom-webhook',
    name: 'Custom Webhook',
    category: 'webhooks',
    description: 'Send test events to custom webhook endpoints.',
    status: 'connected',
    last_sync: '2026-05-07T10:30:00+05:30',
    stats: { webhooks_sent: 3456, endpoints: 3 },
    config: {
      instance_url: 'https://integrations.starcement.com/hooks',
      auth_type: 'webhook',
      webhook_url: 'https://integrations.starcement.com/hooks/satip',
      sync_interval_minutes: 0,
      auto_sync: true,
      field_mappings: [],
    },
  },
  {
    id: 'int_10',
    slug: 'smtp-email',
    name: 'SMTP Email',
    category: 'email',
    description: 'Send email notifications for test completions and reports.',
    status: 'connected',
    last_sync: '2026-05-07T06:00:00+05:30',
    stats: { emails_sent: 567, templates: 12 },
    config: {
      instance_url: 'smtp.starcement.internal:587',
      auth_type: 'basic',
      sync_interval_minutes: 0,
      auto_sync: true,
      field_mappings: [],
    },
  },
  {
    id: 'int_11',
    slug: 'sap-cloud-alm',
    name: 'SAP Cloud ALM',
    category: 'analytics',
    description: 'Bi-directional sync with SAP Cloud ALM for test cases and defects.',
    status: 'connected',
    last_sync: '2026-06-05T08:45:00+05:30',
    stats: { bindings_synced: 62, defects_raised: 18 },
    config: {
      instance_url: 'https://starcement.eu10.alm.cloud.sap',
      auth_type: 'oauth',
      sync_interval_minutes: 15,
      auto_sync: true,
      field_mappings: [
        { satip_field: 'test_scenario.name', external_field: 'testCase.title' },
        { satip_field: 'defect.summary', external_field: 'defect.title' },
      ],
    },
  },
  {
    id: 'int_12',
    slug: 'datadog',
    name: 'Datadog',
    category: 'analytics',
    description: 'Export test telemetry and runner metrics to Datadog dashboards.',
    status: 'connected',
    last_sync: '2026-05-07T09:00:00+05:30',
    stats: { metrics_exported: 12500, dashboards: 8 },
    config: {
      instance_url: 'https://api.datadoghq.com',
      auth_type: 'api_key',
      sync_interval_minutes: 5,
      auto_sync: true,
      field_mappings: [],
    },
  },
  {
    id: 'int_13',
    slug: 'github-actions',
    name: 'GitHub Actions',
    category: 'cicd',
    description: 'Trigger SATIP runs from GitHub workflow dispatch events.',
    status: 'warning',
    last_sync: '2026-05-06T18:00:00+05:30',
    stats: { workflows_triggered: 89, runs_completed: 84 },
    warning: 'Webhook secret expires in 14 days',
    config: {
      instance_url: 'https://api.github.com',
      auth_type: 'api_key',
      sync_interval_minutes: 0,
      auto_sync: false,
      field_mappings: [],
    },
  },
  {
    id: 'int_14',
    slug: 'sharepoint',
    name: 'SharePoint',
    category: 'docs',
    description: 'Publish evidence bundles and sign-off documents to SharePoint.',
    status: 'connected',
    last_sync: '2026-05-07T07:30:00+05:30',
    stats: { documents_published: 234, libraries: 3 },
    config: {
      instance_url: 'https://starcement.sharepoint.com',
      auth_type: 'oauth',
      sync_interval_minutes: 120,
      auto_sync: false,
      field_mappings: [],
    },
  },
  {
    id: 'int_15',
    slug: 'opsgenie',
    name: 'Opsgenie',
    category: 'alerts',
    description: 'Route critical test failures to Opsgenie on-call schedules.',
    status: 'disconnected',
  },
]

export const MOCK_SYNC_LOGS: IntegrationSyncLogEntry[] = [
  { id: 'isl_1', integration_id: 'int_1', timestamp: '2026-05-07T10:30:00+05:30', direction: 'outbound', operation: 'POST /incident', status: 'success', records: 3, duration_ms: 412, message: 'Synced 3 defects to ServiceNow incidents' },
  { id: 'isl_2', integration_id: 'int_1', timestamp: '2026-05-07T10:15:00+05:30', direction: 'inbound', operation: 'GET /change_request', status: 'success', records: 12, duration_ms: 289, message: 'Pulled 12 change requests for transport linkage' },
  { id: 'isl_3', integration_id: 'int_1', timestamp: '2026-05-07T09:45:00+05:30', direction: 'outbound', operation: 'PATCH /incident/{id}', status: 'warning', records: 1, duration_ms: 520, message: 'Partial update — custom field mapping skipped' },
  { id: 'isl_4', integration_id: 'int_2', timestamp: '2026-05-07T10:25:00+05:30', direction: 'outbound', operation: 'POST /issue', status: 'success', records: 2, duration_ms: 318, message: 'Created 2 Jira issues from failed test cases' },
  { id: 'isl_5', integration_id: 'int_6', timestamp: '2026-05-05T12:00:00+05:30', direction: 'outbound', operation: 'POST /chat.postMessage', status: 'warning', records: 45, duration_ms: 890, message: 'Token refresh required within 7 days' },
  { id: 'isl_6', integration_id: 'int_3', timestamp: '2026-05-07T09:15:00+05:30', direction: 'outbound', operation: 'POST /pipeline/run', status: 'success', records: 1, duration_ms: 156, message: 'Triggered Azure pipeline run #8842' },
  { id: 'isl_7', integration_id: 'int_11', timestamp: '2026-06-05T08:45:00+05:30', direction: 'outbound', operation: 'POST /tasks (defect)', status: 'success', records: 1, duration_ms: 334, message: 'Raised CALM defect for failed bound run' },
  { id: 'isl_8', integration_id: 'int_9', timestamp: '2026-05-07T10:30:00+05:30', direction: 'outbound', operation: 'POST webhook', status: 'success', records: 18, duration_ms: 98, message: 'Delivered 18 execution.completed events' },
  { id: 'isl_9', integration_id: 'int_13', timestamp: '2026-05-06T18:00:00+05:30', direction: 'inbound', operation: 'workflow_dispatch', status: 'failed', records: 0, duration_ms: 1204, message: 'Webhook signature validation failed' },
]

export function getIntegrationById(id: string): IntegrationItem | undefined {
  return MOCK_INTEGRATIONS.find((i) => i.id === id)
}

export function getIntegrationBySlug(slug: string): IntegrationItem | undefined {
  return MOCK_INTEGRATIONS.find((i) => i.slug === slug)
}

export function getCatalogEntry(slug: string): IntegrationCatalogEntry | undefined {
  return INTEGRATION_CATALOG.find((c) => c.slug === slug)
}

export function getCategoryMeta(categoryId: string): { id: string; label: string; icon: LucideIcon } {
  return INTEGRATION_CATEGORIES.find((c) => c.id === categoryId) ?? {
    id: categoryId,
    label: categoryId,
    icon: Puzzle,
  }
}

export function getSyncLogsForIntegration(integrationId: string): IntegrationSyncLogEntry[] {
  return MOCK_SYNC_LOGS.filter((l) => l.integration_id === integrationId)
}

export function getAvailableCatalogEntries(): IntegrationCatalogEntry[] {
  const connectedSlugs = new Set(MOCK_INTEGRATIONS.filter((i) => i.status !== 'disconnected').map((i) => i.slug))
  return INTEGRATION_CATALOG.filter((c) => !connectedSlugs.has(c.slug) || c.slug === 'custom-webhook')
}
