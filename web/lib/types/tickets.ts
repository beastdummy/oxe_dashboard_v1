// Tipos para tickets y reportes
export type TicketStatus = "open" | "in-progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "critical"

export interface TicketMessage {
  id: string
  author: string
  role: "user" | "admin"
  message: string
  timestamp: string
  image?: string
}

export interface Ticket {
  id: string
  playerId: string
  playerName: string
  playerBand: string
  title: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

export const priorityConfig = {
  low: { color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Baja" },
  medium: { color: "text-yellow-500", bgColor: "bg-yellow-500/10", label: "Media" },
  high: { color: "text-orange-500", bgColor: "bg-orange-500/10", label: "Alta" },
  critical: { color: "text-red-500", bgColor: "bg-red-500/10", label: "Crítica" },
}

export const statusConfig = {
  open: { style: { color: "white", borderColor: "white" }, label: "Abierto" },
  "in-progress": { style: { color: "#4ade80", borderColor: "#4ade80" }, label: "En Proceso" },
  resolved: { style: { color: "#d8b4fe", borderColor: "#d8b4fe" }, label: "Resuelto" },
  closed: { style: { color: "#9ca3af", borderColor: "#9ca3af" }, label: "Cerrado" },
}
