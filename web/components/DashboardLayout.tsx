"use client"

import { useModals } from "@/context/ModalsContext"
import { FloatingIcon } from "@/components/FloatingIcon"
import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { dashboardVisible } = useModals()

  if (!dashboardVisible) {
    return <FloatingIcon />
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
