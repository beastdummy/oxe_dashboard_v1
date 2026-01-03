"use client"

import { useActivity } from "@/context/ActivityContext"
import { Trash2, Check } from "lucide-react"

export function ActivityLog() {
  const { activities, clearActivities } = useActivity()

  const getActivityIcon = (icon: string) => {
    const icons: Record<string, string> = {
      message: "📨",
      suspend: "⏸️",
      ban: "🔴",
      spectate: "👁️",
      broadcast: "📢",
      heal: "💊",
      kill: "💀",
      freeze: "❄️",
      inventory: "🎒",
    }
    return icons[icon] || icon
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return "hace unos segundos"
    if (diff < 3600000) return `hace ${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)}h`
    return date.toLocaleDateString("es-ES")
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <h2 className="text-lg font-semibold text-white">Historial de Acciones</h2>
          {activities.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
              {activities.length}
            </span>
          )}
        </div>
        <button
          onClick={clearActivities}
          disabled={activities.length === 0}
          className="p-2 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Limpiar historial"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-neutral-500">
            <div className="text-center">
              <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No hay acciones registradas</p>
              <p className="text-xs mt-1 text-neutral-600">Las acciones aparecerán aquí en tiempo real</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="px-4 py-3 border-b border-neutral-800 hover:bg-neutral-800/50 transition text-sm group"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <span className="text-lg mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {getActivityIcon(activity.icon)}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-white">{activity.action}</span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap"
                        style={{
                          backgroundColor: `${activity.color}20`,
                          color: activity.color,
                        }}
                      >
                        {activity.playerName}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>

                  {/* Status dot */}
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 animate-pulse" 
                    style={{ backgroundColor: activity.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
