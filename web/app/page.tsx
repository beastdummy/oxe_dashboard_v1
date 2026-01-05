"use client"

import { useState } from "react"
import { ChevronRight, Monitor, Settings, Shield, Target, Users, Bell, RefreshCw, Globe, Minimize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import CommandCenterPage from "./command-center/page"
import AgentNetworkPage from "./agent-network/page"
import OperationsPage from "./operations/page"
import OperationsJobsPage from "./operations-jobs/page"
import OperationsGangsPage from "./operations-gangs/page"
import IntelligencePage from "./intelligence/page"
import SystemsPage from "./systems/page"
import ActivityPage from "./activity/page"
import { useTranslation } from "@/lib/useTranslation"
import { useLanguage } from "@/context/LanguageContext"
import { useModals } from "@/context/ModalsContext"

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const t = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { minimizeDashboard, closeDashboard } = useModals()

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-lg tracking-wider">{t.app.title}</h1>
              <p className="text-neutral-500 text-xs">{t.app.version}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: Monitor, label: t.sidebar.centerCommand },
              { id: "agents", icon: Users, label: t.sidebar.players },
              { id: "operations", icon: Target, label: t.sidebar.operations, submenu: true },
              { id: "intelligence", icon: Shield, label: t.sidebar.intelligence },
              { id: "systems", icon: Settings, label: t.sidebar.systems },
              { id: "activity", icon: Bell, label: "Actividad" },
            ].map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.submenu) {
                      setExpandedMenu(expandedMenu === item.id ? null : item.id)
                    } else {
                      setActiveSection(item.id)
                      setExpandedMenu(null)
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                    activeSection === item.id
                      ? "bg-orange-500 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.submenu && (
                        <ChevronRight
                          className={`w-4 h-4 ml-auto transition-transform ${
                            expandedMenu === item.id ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && expandedMenu === item.id && !sidebarCollapsed && (
                  <div className="ml-4 mt-2 space-y-1 border-l border-neutral-700 pl-2">
                    <button
                      onClick={() => {
                        setActiveSection("operations-jobs")
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === "operations-jobs"
                          ? "bg-orange-500/20 text-orange-500"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      Ver Trabajos
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection("operations-gangs")
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === "operations-gangs"
                          ? "bg-orange-500/20 text-orange-500"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      Ver Bandas
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection("operations-create")
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === "operations-create"
                          ? "bg-orange-500/20 text-orange-500"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      Crear Nuevo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs text-white">{t.status.systemOnline}</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>{t.status.uptime}: 72:14:33</div>
                <div>{t.status.agents}: 847 ACTIVE</div>
                <div>{t.status.missions}: 23 ONGOING</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              {t.header.tacticalCommand} / <span className="text-orange-500">OVERVIEW</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">{t.header.lastUpdate}: 05/06/2025 20:00 UTC</div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <div className="border-l border-neutral-700 pl-4 ml-2 flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLanguage(language === "en" ? "es" : "en")}
                className="text-xs text-neutral-400 hover:text-orange-500 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {language === "en" ? "ES" : "EN"}
              </Button>
              <Button
                onClick={minimizeDashboard}
                variant="ghost"
                size="icon"
                className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                title="Minimizar dashboard"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={closeDashboard}
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Cerrar dashboard"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "agents" && <AgentNetworkPage />}
          {activeSection === "operations" && <OperationsPage />}
          {activeSection === "operations-jobs" && <OperationsJobsPage />}
          {activeSection === "operations-gangs" && <OperationsGangsPage />}
          {activeSection === "intelligence" && <IntelligencePage />}
          {activeSection === "systems" && <SystemsPage />}
          {activeSection === "activity" && <ActivityPage />}
        </div>
      </div>
    </div>
  )
}
