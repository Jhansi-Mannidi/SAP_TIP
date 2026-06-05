/**
 * Portfolio Intelligence Design System
 * Consistent layout, motion, and surface primitives for SAP Test Assurance.
 */

export {
  PageLayout,
  PageHeader,
  PageSection,
  StaggerGrid,
  StaggerItem,
  SectionCard,
  MetricTile,
} from './page-layout'

export { MotionCard } from './motion-card'
export { KpiStatCard, type KpiStatCardProps, type KpiStatTone } from './kpi-stat-card'

/** Typography class names — defined in app/globals.css */
export const typography = {
  pageTitle: 'page-title',
  pageDescription: 'page-description',
  sectionTitle: 'section-title',
  sectionDescription: 'section-description',
  cardTitle: 'card-title-text',
  statValue: 'stat-value',
  kpiValue: 'kpi-value',
  microLabel: 'micro-label',
  caption: 'caption-text',
  body: 'body-text',
} as const
