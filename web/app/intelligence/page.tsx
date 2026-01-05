"use client"

import { useState } from "react"
import MissionsSection from "@/components/MissionsSection"

export default function IntelligencePage() {
  const [viewMode, setViewMode] = useState<"missions" | "reports">("missions")

  return (
    <div className="w-full">
      {viewMode === "missions" && <MissionsSection />}
    </div>
  )
}
