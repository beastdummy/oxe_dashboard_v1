// Tipos de eventos del sistema
export type EventType = 
  | "player_new"
  | "band_created"
  | "band_deleted"
  | "player_joined"
  | "player_left"
  | "player_promoted"
  | "player_banned"
  | "player_connected"
  | "player_disconnected"

export interface ActivityLog {
  id: string
  timestamp: string
  type: EventType
  playerName?: string
  bandName?: string
  message: string
}

// Configuración de colores y estilos para cada tipo de evento
export const eventConfig: Record<EventType, { color: string; bgColor: string; icon: string }> = {
  player_new: {
    color: "text-green-500",
    bgColor: "border-l-green-500",
    icon: "✦",
  },
  band_created: {
    color: "text-blue-500",
    bgColor: "border-l-blue-500",
    icon: "⬆",
  },
  band_deleted: {
    color: "text-red-500",
    bgColor: "border-l-red-500",
    icon: "✕",
  },
  player_joined: {
    color: "text-cyan-500",
    bgColor: "border-l-cyan-500",
    icon: "→",
  },
  player_left: {
    color: "text-yellow-500",
    bgColor: "border-l-yellow-500",
    icon: "←",
  },
  player_promoted: {
    color: "text-purple-500",
    bgColor: "border-l-purple-500",
    icon: "▲",
  },
  player_banned: {
    color: "text-red-600",
    bgColor: "border-l-red-600",
    icon: "⛔",
  },
  player_connected: {
    color: "text-green-400",
    bgColor: "border-l-green-400",
    icon: "●",
  },
  player_disconnected: {
    color: "text-gray-500",
    bgColor: "border-l-gray-500",
    icon: "○",
  },
}
