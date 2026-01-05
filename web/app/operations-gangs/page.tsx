"use client"

import { Users } from "lucide-react"
import { JobsGangsSection } from "@/components/JobsGangsSection"

export default function OperationsGangsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
          <Users className="w-6 h-6" />
          GANGS & FACTIONS
        </h1>
        <p className="text-sm text-neutral-400">Manage all gangs and factions</p>
      </div>

      {/* Gangs Section */}
      <JobsGangsSection showTabs={false} showCreateButton={false} viewMode="gangs-only" />
    </div>
  )
}
