"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type ActivityType = "message" | "suspend" | "ban" | "spectate" | "broadcast" | "action" | "heal" | "kill" | "freeze" | "inventory"

export interface Activity {
  id: string
  type: ActivityType
  action: string
  timestamp: Date
  icon: string
  color: string
  playerId?: string
  playerName?: string
}

interface ActivityContextType {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void
  clearActivities: () => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([])

  const addActivity = (activity: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activity,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    }

    setActivities((prev) => [newActivity, ...prev].slice(0, 50)) // Keep last 50 activities
  }

  const clearActivities = () => {
    setActivities([])
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        clearActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}

export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider")
  }
  return context
}
