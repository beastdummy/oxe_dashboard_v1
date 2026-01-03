"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, priorityConfig, statusConfig } from "@/lib/types/tickets"
import { TicketDetail } from "./TicketDetail"

export function TicketsSection() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [tickets] = useState<Ticket[]>([
    {
      id: "TK-001",
      playerId: "G-078W",
      playerName: "VENGEFUL SPIRIT",
      playerBand: "SHADOW SYNDICATE",
      title: "Problema con la banda",
      description: "No puedo acceder a los fondos de la banda, me sale error de permisos.",
      priority: "high",
      status: "open",
      createdAt: "03/01/2026 14:32",
      updatedAt: "03/01/2026 14:32",
      messages: [
        {
          id: "1",
          author: "G-078W",
          role: "user",
          message: "No puedo acceder a los fondos de la banda, me sale error de permisos.",
          timestamp: "14:32",
        },
      ],
    },
    {
      id: "TK-002",
      playerId: "G-079X",
      playerName: "OBSIDIAN SENTINEL",
      playerBand: "OBSIDIAN SENTINEL",
      title: "Reporte de jugador sospechoso",
      description: "Sospecho que G-156K está usando hacks, tiene stats imposibles.",
      priority: "critical",
      status: "in-progress",
      createdAt: "03/01/2026 13:15",
      updatedAt: "03/01/2026 14:20",
      messages: [
        {
          id: "1",
          author: "G-079X",
          role: "user",
          message: "Sospecho que G-156K está usando hacks, tiene stats imposibles.",
          timestamp: "13:15",
        },
        {
          id: "2",
          author: "ADMIN_SECURITY",
          role: "admin",
          message: "Gracias por el reporte. Estamos investigando la cuenta.",
          timestamp: "13:45",
        },
      ],
    },
    {
      id: "TK-003",
      playerId: "G-080Y",
      playerName: "GHOSTLY FURY",
      playerBand: "CURSED REVENANT",
      title: "Bug en el servidor",
      description: "Se me desconecta constantemente durante las misiones.",
      priority: "medium",
      status: "open",
      createdAt: "03/01/2026 12:50",
      updatedAt: "03/01/2026 12:50",
      messages: [
        {
          id: "1",
          author: "G-080Y",
          role: "user",
          message: "Se me desconecta constantemente durante las misiones.",
          timestamp: "12:50",
        },
      ],
    },
  ])

  return (
    <>
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            TICKETS / REPORTES ({tickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tickets.map((ticket) => {
              const priorityStyle = priorityConfig[ticket.priority]
              const statusStyle = statusConfig[ticket.status]
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="p-3 bg-neutral-800 border border-neutral-700 rounded hover:border-orange-500/50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-mono text-orange-500">{ticket.id}</span>
                      <h3 className="text-sm font-semibold text-white flex-1">{ticket.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <span className={`text-xs px-2 py-1 rounded ${priorityStyle.bgColor} ${priorityStyle.color}`}>
                        {priorityStyle.label}
                      </span>
                      <span 
                        className="text-xs px-2 py-1 rounded border"
                        style={{ color: statusStyle.style.color, borderColor: statusStyle.style.borderColor }}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400 mb-2">
                    <span className="text-orange-500">{ticket.playerName}</span>
                    {" • Banda: "}
                    <span className="text-orange-500">{ticket.playerBand}</span>
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-700">
                    <span className="text-xs text-neutral-500">{ticket.createdAt}</span>
                    <span className="text-xs text-neutral-500">{ticket.messages.length} mensajes</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedTicket && <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </>
  )
}
