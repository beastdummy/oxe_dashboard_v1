"use client"

import { Briefcase } from "lucide-react"
import { JobsGangsSection } from "@/components/JobsGangsSection"

export default function OperationsJobsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          JOBS & ORGANIZATIONS
        </h1>
        <p className="text-sm text-neutral-400">Manage all jobs and organizations</p>
      </div>

      {/* Jobs Section */}
      <JobsGangsSection showTabs={false} showCreateButton={false} viewMode="jobs-only" />
    </div>
  )
}
