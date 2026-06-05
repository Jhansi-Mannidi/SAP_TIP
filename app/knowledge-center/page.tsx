"use client"

import { useState } from "react"
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, AnimatedNumber, fadeInUp } from '@/lib/animations'
import { AppShell } from "@/components/app-shell"
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KBArticleCard } from "@/components/kb-article-card"
import { IRStepInspector } from "@/components/ir-step-inspector"
import { 
  Search,
  Brain,
  BookOpen,
  MessageSquare,
  Sparkles,
  FileCode,
  Lightbulb,
  Send,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ExternalLink,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react"

// Mock KB articles
const kbArticles = [
  {
    id: "KB-001",
    title: "Self-Healing Locator Strategies",
    description: "How the AI agent identifies and updates changed field locators in SAP screens",
    category: "AI Engine",
    views: 1245,
    helpful: 89,
    lastUpdated: "2024-01-10"
  },
  {
    id: "KB-002",
    title: "Understanding IR Step Format",
    description: "Complete reference for Intermediate Representation step structure and execution",
    category: "Test Engine",
    views: 892,
    helpful: 76,
    lastUpdated: "2024-01-08"
  },
  {
    id: "KB-003",
    title: "SAP GUI Automation Best Practices",
    description: "Guidelines for reliable SAP GUI test automation including wait strategies",
    category: "Best Practices",
    views: 2341,
    helpful: 94,
    lastUpdated: "2024-01-12"
  },
  {
    id: "KB-004",
    title: "Handling Dynamic Table Controls",
    description: "Techniques for interacting with SAP ALV grids and table controls",
    category: "Test Engine",
    views: 756,
    helpful: 82,
    lastUpdated: "2024-01-05"
  },
  {
    id: "KB-005",
    title: "Evidence Package Compliance",
    description: "How to structure evidence bundles for audit and regulatory compliance",
    category: "Compliance",
    views: 567,
    helpful: 91,
    lastUpdated: "2024-01-14"
  }
]

// Mock chat messages
const initialMessages = [
  {
    role: "assistant",
    content: "Hello! I'm the SAP Test Assurance AI assistant. I can help you with:\n\n• Writing and debugging test cases\n• Understanding SAP transactions and fields\n• Troubleshooting test failures\n• Explaining healing suggestions\n• Best practices for test automation\n\nHow can I assist you today?"
  }
]

// Mock IR data for the inspector
const sampleIRSteps = [
  {
    stepNumber: 1,
    action: "navigate",
    target: { type: "transaction", value: "VA01" },
    description: "Open Create Sales Order transaction"
  },
  {
    stepNumber: 2,
    action: "input",
    target: { type: "field", locator: "wnd[0]/usr/ctxtVBAK-AUART", label: "Order Type" },
    value: "OR",
    description: "Enter standard order type"
  },
  {
    stepNumber: 3,
    action: "input",
    target: { type: "field", locator: "wnd[0]/usr/ctxtVBAK-VKORG", label: "Sales Org" },
    value: "1000",
    description: "Enter sales organization"
  },
  {
    stepNumber: 4,
    action: "click",
    target: { type: "button", locator: "wnd[0]/tbar[0]/btn[0]", label: "Enter" },
    description: "Press Enter to continue"
  }
]

export default function KnowledgeCenterPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState(initialMessages)
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: "user", content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: `I understand you're asking about "${inputMessage}". Let me help you with that.\n\nBased on the SAP Test Assurance knowledge base, here are some relevant insights:\n\n1. **Best Practice**: Always use explicit waits after navigation actions\n2. **Tip**: For dynamic tables, consider using row-relative locators\n3. **Note**: The healing engine can automatically detect screen changes\n\nWould you like me to elaborate on any of these points?`
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Animated Header */}
        <motion.div 
          className="flex items-center justify-between p-4 border-b bg-background"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="page-title">AI Knowledge Center</h1>
            <p className="page-description">AI-powered assistance and documentation</p>
          </div>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search knowledge base..." 
                className="w-80 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="px-4 pt-4 border-b">
              <TabsList>
                <TabsTrigger value="chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="kb">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Knowledge Base
                </TabsTrigger>
                <TabsTrigger value="ir">
                  <FileCode className="mr-2 h-4 w-4" />
                  IR Inspector
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Insights
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0">
              <div className="flex h-full">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    <div className="max-w-3xl mx-auto space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                          {message.role === "assistant" && (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div className={`
                            max-w-[80%] rounded-lg p-4
                            ${message.role === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                            }
                          `}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                                <Button variant="ghost" size="sm" className="h-7 px-2">
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Helpful
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2">
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  Not helpful
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {message.role === "user" && (
                            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="max-w-3xl mx-auto">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ask me anything about SAP testing..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="caption-text mt-2 text-center">
                        AI can make mistakes. Verify important information.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="w-64 border-l p-4 bg-muted/30">
                  <h3 className="font-medium mb-3">Quick Prompts</h3>
                  <div className="space-y-2">
                    {[
                      "How do I handle popups?",
                      "Explain self-healing",
                      "Best wait strategies",
                      "Debug failing test",
                      "Write test for VA01"
                    ].map((prompt, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => setInputMessage(prompt)}
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        {prompt}
                      </Button>
                    ))}
                  </div>

                  <h3 className="font-medium mt-6 mb-3">Related Articles</h3>
                  <div className="space-y-2">
                    {kbArticles.slice(0, 3).map((article) => (
                      <Button 
                        key={article.id}
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-xs h-auto py-2"
                      >
                        <div className="text-left">
                          <p className="truncate">{article.title}</p>
                          <p className="page-description text-[10px]">{article.category}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kb" className="flex-1 overflow-auto m-0 p-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {kbArticles.map((article) => (
                    <KBArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ir" className="flex-1 overflow-auto m-0 p-4">
              <div className="max-w-4xl mx-auto">
                <IRStepInspector 
                  steps={sampleIRSteps}
                  testCaseId="TC-001-001"
                  testCaseName="Create Sales Order VA01"
                />
              </div>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 overflow-auto m-0 p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      Healing Trends
                    </CardTitle>
                    <CardDescription>AI-detected patterns in test failures and self-healing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">67% fewer locator failures</span>
                      </div>
                      <p className="page-description">
                        The healing engine has reduced locator-based failures by 67% over the past 30 days by learning common UI patterns.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="font-medium">Pattern Detected: Table Control Changes</span>
                      </div>
                      <p className="page-description">
                        Multiple tests affected by SAP ALV grid column reordering after recent transport. Consider updating base locators.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                        <span className="font-medium">Recommendation: Add Explicit Waits</span>
                      </div>
                      <p className="page-description">
                        12 tests in the O2C suite have timing-related intermittent failures. Adding explicit waits after navigation would improve stability.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
