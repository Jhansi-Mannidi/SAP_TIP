'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TestTube2,
  Bug,
  Archive,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Rocket,
  Server,
  Workflow,
  Brain,
  Play,
  Layers,
  FileText,
  ClipboardCheck,
  Database,
  FileCode2,
  Code2,
  Sparkles,
  Users,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  X,
  Zap,
  Shield,
  ShieldAlert,
  Camera,
  Compass,
  ShoppingCart,
  Package,
  Target,
  GitBranch,
  Factory,
  Download,
  History,
  BookOpen,
  Building2,
  Plug,
  Key,
  Bot,
  ShieldCheck,
  Puzzle,
  ScrollText,
  AlertTriangle,
  AlertCircle,
  Calendar,
  HeartPulse,
  FileCheck,
  Activity,
  Truck,
  Clock,
  CheckCircle,
  User,
  TrendingUp,
  RefreshCw,
  Radio,
  Monitor,
  ListChecks,
  FileSignature,
  Archive as ArchiveIcon,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RouteTransition, AnimatedBadge } from '@/lib/animations'
import { PageLayout } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// Theme context
const ThemeContext = React.createContext<{
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}>({
  theme: 'light',
  setTheme: () => {},
})

export function useTheme() {
  return React.useContext(ThemeContext)
}

// App definitions with routes
const apps = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'catalog', name: 'Catalog', icon: Compass, href: '/catalog' },
  { id: 'test-repository', name: 'Test Repository', icon: Layers, href: '/test-repository', badge: 47 },
  { id: 'execution-console', name: 'Execution Console', icon: Play, href: '/execution-console', badge: 3 },
  { id: 'defect-manager', name: 'Defect & Healing', icon: Bug, href: '/defect-manager', badge: 12 },
  { id: 'evidence-portal', name: 'Evidence & Sign-Off', icon: Archive, href: '/evidence-portal', badge: 2 },
  { id: 'analytics', name: 'Analytics Hub', icon: BarChart3, href: '/analytics' },
  { id: 'migration-cockpit', name: 'Migration Cockpit', icon: Rocket, href: '/migration-cockpit' },
  { id: 'cutover-command', name: 'Cutover Command', icon: Radio, href: '/cutover' },
  { id: 'transport-intelligence', name: 'Transport Intelligence', icon: Truck, href: '/transports' },
  { id: 'system-admin', name: 'System Admin', icon: Server, href: '/system-admin' },
  { id: 'process-mining', name: 'Process Mining', icon: Workflow, href: '/process-mining' },
  { id: 'knowledge-center', name: 'AI Knowledge Center', icon: Brain, href: '/knowledge-center' },
]

// Navigation items per app
const navigationItems: Record<string, { label: string; icon: React.ElementType; href: string; badge?: number }[]> = {
  'dashboard': [
    { label: 'Overview', icon: LayoutDashboard, href: '/' },
  ],
  'catalog': [
    { label: 'By Business Process', icon: ShoppingCart, href: '/catalog/business-process' },
    { label: 'By Module', icon: Package, href: '/catalog/module' },
    { label: 'By Industry', icon: Factory, href: '/catalog/industry' },
    { label: 'Full Catalog', icon: Compass, href: '/catalog' },
  ],
  'test-repository': [
    { label: 'Test Suites', icon: Layers, href: '/test-repository/suites', badge: 8 },
    { label: 'Test Scenarios', icon: FileText, href: '/test-repository/scenarios' },
    { label: 'Test Cases', icon: ClipboardCheck, href: '/test-repository/tasks' },
    { label: 'Step Library', icon: Code2, href: '/test-repository/steps', badge: 8 },
    { label: 'Data Fixtures', icon: Database, href: '/test-repository/data' },
    { label: 'Data Generators', icon: Zap, href: '/test-repository/generators' },
    { label: 'Snapshots', icon: Camera, href: '/test-repository/snapshots' },
    { label: 'Test Packs', icon: Package, href: '/test-repository/packs', badge: 4 },
    { label: 'Imported Packs', icon: Download, href: '/test-repository/packs/imported', badge: 1 },
    { label: 'IR Browser', icon: FileCode2, href: '/test-repository/ir' },
    { label: 'Audit Trail', icon: History, href: '/test-repository/audit' },
  ],
  'test-manager': [
    { label: 'Test Suites', icon: Layers, href: '/test-manager', badge: 5 },
    { label: 'Test Cases', icon: FileCode2, href: '/test-manager/cases' },
    { label: 'Step Library', icon: ClipboardCheck, href: '/test-manager/steps' },
    { label: 'Test Data', icon: Database, href: '/test-manager/data' },
  ],
  'execution-console': [
    { label: 'Active Runs', icon: Play, href: '/execution-console', badge: 4 },
    { label: 'Today\'s Schedule', icon: Calendar, href: '/execution-console/schedule', badge: 6 },
    { label: 'My Tasks', icon: User, href: '/execution-console/my-tasks', badge: 5 },
    { label: 'My Agents', icon: Bot, href: '/execution-console/my-agents', badge: 3 },
    { label: 'Past Runs', icon: History, href: '/execution-console/history' },
    { label: 'Trends', icon: TrendingUp, href: '/execution-console/trends' },
  ],
  'defect-manager': [
    { label: 'All Defects', icon: Bug, href: '/defect-manager', badge: 12 },
    { label: 'My Defects', icon: User, href: '/defect-manager/my-defects', badge: 4 },
    { label: 'By Severity', icon: AlertTriangle, href: '/defect-manager/by-severity' },
    { label: 'By Source', icon: Layers, href: '/defect-manager/by-source' },
    { label: 'By Migration', icon: Rocket, href: '/defect-manager/by-migration' },
    { label: 'ITSM Sync', icon: RefreshCw, href: '/defect-manager/itsm-sync' },
    { label: 'Healing Queue', icon: Sparkles, href: '/defect-manager/healing', badge: 4 },
    { label: 'Healing Promotions', icon: Zap, href: '/defect-manager/healing-promotions', badge: 5 },
    { label: 'Trends', icon: BarChart3, href: '/defect-manager/trends' },
  ],
  'evidence-portal': [
    { label: 'Evidence Bundles', icon: Archive, href: '/evidence-portal' },
    { label: 'Sign-Off Requests', icon: ClipboardCheck, href: '/evidence-portal/signoffs', badge: 2 },
    { label: 'Audit Log', icon: Shield, href: '/evidence-portal/audit' },
  ],
  'analytics': [
    { label: 'Test Pack Coverage', icon: Target, href: '/analytics' },
    { label: 'Pass Rate Trends', icon: TrendingUp, href: '/analytics/pass-rate' },
    { label: 'Healing Effectiveness', icon: Sparkles, href: '/analytics/healing' },
    { label: 'Runner Utilization', icon: Activity, href: '/analytics/runners' },
    { label: 'Defect Aging', icon: Clock, href: '/analytics/defect-aging' },
    { label: 'Migration Scorecard', icon: Rocket, href: '/analytics/migrations' },
    { label: 'SI Burndown', icon: BarChart3, href: '/analytics/si-burndown' },
    { label: 'ABAP Burndown', icon: FileCode2, href: '/analytics/abap-burndown' },
    { label: 'BP Coverage', icon: CheckCircle, href: '/analytics/bp-coverage' },
    { label: 'Evidence Locker', icon: Archive, href: '/analytics/evidence' },
    { label: 'Sign-Off Trail', icon: Shield, href: '/analytics/signoff-trail' },
    { label: 'Run Records', icon: Database, href: '/analytics/run-records' },
    { label: 'Audit Templates', icon: FileCheck, href: '/analytics/audit-templates' },
    { label: 'Audit Exports', icon: Download, href: '/analytics/audit-exports' },
    { label: 'CIO Dashboard', icon: LayoutDashboard, href: '/analytics/cio' },
    { label: 'Partner View', icon: Users, href: '/analytics/partner' },
    { label: 'Program Health', icon: HeartPulse, href: '/analytics/program-health' },
    { label: 'KPI Dictionary', icon: BookOpen, href: '/analytics/kpi-dictionary' },
    { label: 'Custom Reports', icon: Settings, href: '/analytics/custom' },
  ],
  'migration-cockpit': [
    { label: 'Migrations', icon: Rocket, href: '/migration-cockpit' },
    { label: 'Phases', icon: GitBranch, href: '/migration-cockpit/phases' },
    { label: 'Scope', icon: Target, href: '/migration-cockpit/scope' },
    { label: 'Readiness', icon: Shield, href: '/migration-cockpit/readiness' },
    { label: 'SI Items', icon: AlertTriangle, href: '/migration-cockpit/si-items', badge: 12 },
    { label: 'ABAP Findings', icon: FileCode2, href: '/migration-cockpit/abap', badge: 18 },
    { label: 'BP Violations', icon: AlertCircle, href: '/migration-cockpit/bp-violations', badge: 8 },
    { label: 'Cutover Plan', icon: Calendar, href: '/migration-cockpit/cutover' },
    { label: 'Hypercare', icon: HeartPulse, href: '/migration-cockpit/hypercare' },
    { label: 'Sign-Off Pack', icon: FileCheck, href: '/migration-cockpit/signoff' },
    { label: 'Activity', icon: Activity, href: '/migration-cockpit/activity' },
  ],
  'cutover-command': [
    { label: 'Active Window', icon: Radio, href: '/cutover' },
    { label: 'Upcoming Windows', icon: Calendar, href: '/cutover/upcoming' },
    { label: 'Past Windows', icon: History, href: '/cutover/past' },
    { label: 'War Room', icon: Monitor, href: '/cutover/war-room' },
    { label: 'Cutover Plan', icon: ListChecks, href: '/cutover/plan' },
    { label: 'Decision Log', icon: FileSignature, href: '/cutover/decisions' },
  ],
  'transport-intelligence': [
    { label: 'All Transports', icon: Truck, href: '/transports' },
    { label: 'Pending Analysis', icon: Clock, href: '/transports/pending-analysis', badge: 3 },
    { label: 'Pending Approval', icon: ClipboardCheck, href: '/transports/pending-approval', badge: 5 },
    { label: 'In Test', icon: Play, href: '/transports/in-test', badge: 2 },
    { label: 'Released to QAS', icon: CheckCircle, href: '/transports/released-qas' },
    { label: 'Released to PROD', icon: Rocket, href: '/transports/released-prod' },
    { label: 'High Risk', icon: AlertTriangle, href: '/transports/high-risk', badge: 4 },
  ],
  'system-admin': [
    { label: 'SAP Systems', icon: Server, href: '/system-admin' },
    { label: 'Clients', icon: Database, href: '/system-admin/clients' },
    { label: 'RFC Destinations', icon: Plug, href: '/system-admin/rfc' },
    { label: 'NTUs', icon: Key, href: '/system-admin/ntus' },
    { label: 'Service Roles', icon: Users, href: '/system-admin/roles' },
    { label: 'Pairing Rules', icon: GitBranch, href: '/system-admin/pairing' },
    { label: 'AI Agents', icon: Bot, href: '/system-admin/agents' },
    { label: 'Identity Providers', icon: ShieldCheck, href: '/system-admin/idps' },
    { label: 'Runner Pools', icon: Layers, href: '/system-admin/runners' },
    { label: 'Integrations', icon: Puzzle, href: '/system-admin/integrations' },
    { label: 'Policies', icon: ScrollText, href: '/system-admin/policies' },
    { label: 'Audit Trail', icon: History, href: '/system-admin/audit' },
    { label: 'Settings', icon: Settings, href: '/system-admin/settings' },
  ],
  'process-mining': [
    { label: 'Process Discovery', icon: Workflow, href: '/process-mining' },
    { label: 'Coverage Analysis', icon: Target, href: '/process-mining/coverage' },
    { label: 'AI Suggestions', icon: Sparkles, href: '/process-mining/suggestions' },
    { label: 'Variants', icon: GitBranch, href: '/process-mining/variants' },
  ],
  'knowledge-center': [
    { label: 'AI Assistant', icon: Brain, href: '/knowledge-center' },
    { label: 'Domain KB', icon: BookOpen, href: '/knowledge-center/domain' },
    { label: 'BP KB', icon: Target, href: '/knowledge-center/bp' },
    { label: 'Org KB', icon: Building2, href: '/knowledge-center/org' },
    { label: 'KB Admin', icon: Settings, href: '/knowledge-center/admin' },
  ],
}

interface AppShellProps {
  children: React.ReactNode
  currentApp?: string
  isProductiveSystem?: boolean
  breadcrumbs?: { label: string; href?: string }[]
}

export function AppShell({ 
  children, 
  currentApp,
  isProductiveSystem = false,
  breadcrumbs = []
}: AppShellProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Optimistic active nav highlight. As soon as a user clicks a sidebar item
  // we mark that href as "pending" so the active styles flip instantly — long
  // before the next page has actually finished hydrating. The pending state
  // is cleared automatically when the real pathname catches up.
  const [pendingHref, setPendingHref] = React.useState<string | null>(null)
  React.useEffect(() => {
    setPendingHref(null)
  }, [pathname])
  
  // Theme management
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
  
  // Determine active app from current path or prop
  const activeAppId = currentApp || apps.find(app => 
    app.href === '/' ? pathname === '/' : pathname.startsWith(app.href)
  )?.id || 'dashboard'
  
  const currentNavItems = navigationItems[activeAppId] || navigationItems['dashboard']
  const activeAppData = apps.find(a => a.id === activeAppId)

  // Close mobile menu on navigation
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Sidebar content component for reuse
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo with Collapse Button */}
      <div className={cn(
        'flex h-14 items-center justify-between border-b border-border px-4',
        isMobile && 'px-4'
      )}>
        {(sidebarCollapsed && !isMobile) ? (
          <div className="flex flex-col items-center gap-1 mx-auto">
            <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold text-sm">
              V
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(false)}
              className="h-6 w-6"
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold text-sm shadow-sm">
                V
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">VoltusWave</div>
                <div className="text-sm font-semibold text-foreground -mt-0.5">SAP Test Assurance</div>
              </div>
            </Link>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(true)}
                className="h-8 w-8"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* App Switcher */}
      <div className="border-b border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                'w-full justify-start gap-2.5 h-10 px-3 rounded-md hover:bg-muted',
                (sidebarCollapsed && !isMobile) && 'justify-center px-2'
              )}
            >
              {activeAppData && <activeAppData.icon className="h-4 w-4 text-brand" />}
              {(!sidebarCollapsed || isMobile) && (
                <>
                  <span className="flex-1 text-left text-sm font-semibold text-foreground">{activeAppData?.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch App</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {apps.map((app) => (
              <DropdownMenuItem key={app.id} asChild>
                <Link href={app.href} className="flex items-center gap-2 cursor-pointer">
                  <app.icon className="h-4 w-4" />
                  <span className="flex-1">{app.name}</span>
                  {app.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {app.badge}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2">
          {(() => {
            // Pick the single most-specific item that matches the current pathname.
            // This prevents a parent-style item (e.g. Active Runs -> /execution-console)
            // from staying highlighted on every child route like /execution-console/trends.
            const activeHref = currentNavItems
              .filter((item) =>
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href + '/'))
              )
              .reduce<string | null>(
                (longest, item) =>
                  !longest || item.href.length > longest.length ? item.href : longest,
                null
              )
            return currentNavItems.map((item) => {
            const isRealActive = item.href === activeHref
            const isPending = pendingHref === item.href
            const isActive = isRealActive || isPending
            // Show "real" active for everything *except* the route currently
            // being navigated to — once a pending href exists, dim the old
            // active item so the user only sees one source of truth.
            const isPrevActive =
              pendingHref !== null && isRealActive && pendingHref !== item.href

            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    prefetch
                    onClick={() => {
                      if (item.href !== pathname) {
                        setPendingHref(item.href)
                        if (isMobile) setMobileMenuOpen(false)
                      }
                    }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-2.5 mb-0.5 h-9 rounded-md text-sm font-medium transition-all',
                        isActive
                          ? 'bg-brand-soft text-brand-soft-foreground hover:bg-brand-soft hover:text-brand-soft-foreground'
                          : isPrevActive
                            ? 'text-foreground/60 hover:bg-muted hover:text-foreground'
                            : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                        (sidebarCollapsed && !isMobile) && 'justify-center px-2'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4 shrink-0', isActive && 'text-brand')} />
                      {(!sidebarCollapsed || isMobile) && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className={cn(
                              'inline-flex items-center justify-center rounded-full h-5 min-w-5 px-1.5 text-[10px] font-semibold tabular-nums',
                              isActive
                                ? 'bg-brand text-brand-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {(sidebarCollapsed && !isMobile) && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })
          })()}
        </nav>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="border-t border-border p-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link href="/system-admin/settings">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start gap-2',
                  (sidebarCollapsed && !isMobile) && 'justify-center px-2'
                )}
              >
                <Settings className="h-4 w-4" />
                {(!sidebarCollapsed || isMobile) && <span className="text-sm">Settings</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {(sidebarCollapsed && !isMobile) && (
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </>
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <TooltipProvider>
        <div className="flex h-screen bg-muted/40 dark:bg-background">
          {/* Desktop Sidebar */}
          <aside
            className={cn(
              'hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-200',
              sidebarCollapsed ? 'w-16' : 'w-64'
            )}
          >
            <SidebarContent />
          </aside>

          {/* Mobile Sidebar Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-72">
              <div className="flex flex-col h-full">
                <SidebarContent isMobile />
              </div>
            </SheetContent>
          </Sheet>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Productive System Warning Banner */}
            {isProductiveSystem && (
              <div className="flex items-center gap-2 bg-red-700 px-4 py-2 text-white">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  PRODUCTIVE SYSTEM — actions are restricted; cosigned approval required for any write.
                </span>
              </div>
            )}

            {/* Top Bar */}
            <header className="flex h-14 items-center justify-between border-b border-border bg-card px-2 md:px-4 gap-2">
              {/* Mobile Menu Button + Breadcrumbs */}
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden flex-shrink-0"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                {/* Breadcrumbs - hidden on mobile */}
                <nav className="hidden md:flex items-center gap-1 text-sm min-w-0">
                  <Link href="/" className="text-muted-foreground hover:text-foreground flex-shrink-0">Star Cement</Link>
                  {activeAppData && activeAppData.id !== 'dashboard' && (
                    <>
                      <span className="text-muted-foreground">/</span>
                      <Link href={activeAppData.href} className="text-foreground hover:underline font-medium truncate">
                        {activeAppData.name}
                      </Link>
                    </>
                  )}
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-muted-foreground">/</span>
                      {crumb.href ? (
                        <Link href={crumb.href} className="text-foreground hover:underline truncate">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-foreground font-medium truncate">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>

                {/* Mobile App Title */}
                <span className="md:hidden text-sm font-medium truncate">
                  {activeAppData?.name || 'Dashboard'}
                </span>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                {/* Global Search - Collapsible on mobile */}
                <div className={cn(
                  'relative transition-all duration-200',
                  searchOpen ? 'w-48 md:w-64' : 'w-auto'
                )}>
                  {searchOpen ? (
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-8 h-9 text-sm"
                        autoFocus
                        onBlur={() => {
                          if (!searchQuery) setSearchOpen(false)
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-9 w-9"
                        onClick={() => {
                          setSearchQuery('')
                          setSearchOpen(false)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Separator orientation="vertical" className="h-6 hidden md:block" />

                {/* Theme Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={toggleTheme}
                    >
                      {theme === 'light' ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
                  </TooltipContent>
                </Tooltip>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                      <Bell className="h-4 w-4" />
                      <span className="absolute -right-0.5 -top-0.5">
                        <AnimatedBadge count={3} className="h-4 w-4 min-w-4 text-[10px]" />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="text-sm font-medium">Test Suite TS-002 completed</span>
                      <span className="text-xs text-muted-foreground">2 minutes ago</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="text-sm font-medium">Self-healing applied to TC-001-003</span>
                      <span className="text-xs text-muted-foreground">15 minutes ago</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="text-sm font-medium">Sign-off pending: EVB-2024-001</span>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          PS
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm hidden md:inline">Priya Sharma</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>Priya Sharma</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          Test Lead &bull; Star Cement
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleTheme}>
                      {theme === 'light' ? (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          Dark Mode
                        </>
                      ) : (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          Light Mode
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Sign out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/40 dark:bg-background">
          <RouteTransition routeKey={pathname} className="w-full p-4 sm:p-6 lg:p-8">
            <PageLayout stagger className="min-h-0">
              {children}
            </PageLayout>
          </RouteTransition>
        </main>
          </div>
        </div>
      </TooltipProvider>
    </ThemeContext.Provider>
  )
}
