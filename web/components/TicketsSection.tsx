"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Ticket, priorityConfig, statusConfig } from "@/lib/types/tickets"
import { TicketDetail } from "./TicketDetail"

export function TicketsSection() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Cargar tickets desde la base de datos
  useEffect(() => {
    const handleTicketsData = (event: CustomEvent) => {
      setTickets(event.detail || [])
      setLoading(false)
    }

    window.addEventListener("oxe_dashboard:ticketsUpdate", handleTicketsData as EventListener)
    
    // Solicitar tickets del servidor (solo en FiveM)
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", "tickets:getAll")
    } else {
      console.log("[TicketsSection] invokeNative no disponible")
      setLoading(false)
    }

    return () => {
      window.removeEventListener("oxe_dashboard:ticketsUpdate", handleTicketsData as EventListener)
    }
  }, [])

  // Filtrar y buscar tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchLower = searchText.toLowerCase()
      const matchesSearch =
        searchLower === "" ||
        ticket.playerName.toLowerCase().includes(searchLower) ||
        ticket.playerId.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.title.toLowerCase().includes(searchLower)

      const matchesStatus = filterStatus === null || ticket.status === filterStatus
      const matchesPriority = filterPriority === null || ticket.priority === filterPriority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tickets, searchText, filterStatus, filterPriority])

  return (
    <>
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              TICKETS / REPORTES ({filteredTickets.length})
            </CardTitle>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              size="sm"
              variant="outline"
              className={`text-xs border-neutral-600 ${
                showFilters ? "bg-orange-500/20 text-orange-400 border-orange-500/50" : "text-neutral-400"
              }`}
            >
              <Filter className="w-3 h-3 mr-1" />
              Filtros
            </Button>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="p-3 bg-neutral-800/50 rounded border border-neutral-700 space-y-3">
              {/* Búsqueda */}
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <Input
                    type="text"
                    placeholder="Nombre, ID, título..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-8 text-xs bg-neutral-700 border-neutral-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Filtro por Estado */}
                <div>
                  <label className="text-xs text-neutral-400 mb-2 block">Estado</label>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => setFilterStatus(null)}
                      className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                        filterStatus === null
                          ? "bg-orange-500/30 text-orange-400"
                          : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                      }`}
                    >
                      Todos
                    </button>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                          filterStatus === key
                            ? "bg-orange-500/30 text-orange-400"
                            : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        }`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro por Prioridad */}
                <div>
                  <label className="text-xs text-neutral-400 mb-2 block">Prioridad</label>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => setFilterPriority(null)}
                      className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                        filterPriority === null
                          ? "bg-orange-500/30 text-orange-400"
                          : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                      }`}
                    >
                      Todas
                    </button>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setFilterPriority(key)}
                        className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                          filterPriority === key
                            ? "bg-orange-500/30 text-orange-400"
                            : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                        }`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {loading ? (
              <div className="p-4 text-center text-neutral-500 text-sm">Cargando tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-4 text-center text-neutral-500 text-sm">No se encontraron tickets</div>
            ) : (
              filteredTickets.map((ticket) => {
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
              })
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTicket && <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </>
  )
}
