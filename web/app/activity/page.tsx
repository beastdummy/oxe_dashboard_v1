"use client"

import { ActivityLog } from "@/components/ActivityLog"

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-4xl mx-auto">
        <ActivityLog />
      </div>
    </div>
  )
}
