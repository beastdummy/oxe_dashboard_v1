"use client"

import { useState, useMemo } from "react"
import { X, Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Player {
  id: string
  name: string
  band: string
  level: number
  online: boolean
}

interface InvitePlayerModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (playerId: string, playerName: string) => void
  currentTicketId: string
}

// Lista de ejemplo de jugadores disponibles
const AVAILABLE_PLAYERS: Player[] = [
  { id: "1", name: "VENGEFUL SPIRIT", band: "SHADOW SYNDICATE", level: 45, online: true },
  { id: "2", name: "OBSIDIAN SENTINEL", band: "OBSIDIAN SENTINEL", level: 38, online: true },
  { id: "3", name: "GHOSTLY FURY", band: "CURSED REVENANT", level: 52, online: false },
  { id: "4", name: "CIPHER NOVA", band: "CRIMSON NEXUS", level: 41, online: true },
  { id: "5", name: "SHADOW MASTER", band: "SHADOW SYNDICATE", level: 48, online: true },
  { id: "6", name: "ROGUE PHANTOM", band: "OBSIDIAN SENTINEL", level: 35, online: false },
  { id: "7", name: "DARK ORACLE", band: "CURSED REVENANT", level: 50, online: true },
  { id: "8", name: "VOID HUNTER", band: "CRIMSON NEXUS", level: 43, online: true },
]

export function InvitePlayerModal({ isOpen, onClose, onInvite, currentTicketId }: InvitePlayerModalProps) {
  const [searchId, setSearchId] = useState("")
  const [searchName, setSearchName] = useState("")

  const filteredPlayers = AVAILABLE_PLAYERS.filter((player) => {
    const matchesId = player.id.toLowerCase().includes(searchId.toLowerCase())
    const matchesName = player.name.toLowerCase().includes(searchName.toLowerCase())
    return matchesId && matchesName
  })

  const handleInvite = (player: Player) => {
    onInvite(player.id, player.name)
    setSearchId("")
    setSearchName("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-2xl w-full p-6 shadow-xl pointer-events-auto max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-orange-500" />
            Invitar Jugador al Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Filters */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-sm text-neutral-300 block mb-2">Buscar por ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="text"
                placeholder="Ingresa el ID del jugador..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-300 block mb-2">Buscar por Nombre</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="text"
                placeholder="Ingresa el nombre del jugador..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500"
              />
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-2">
          <p className="text-xs text-neutral-400 mb-3">
            {filteredPlayers.length} jugador{filteredPlayers.length !== 1 ? "es" : ""} encontrado{filteredPlayers.length !== 1 ? "s" : ""}
          </p>

          {filteredPlayers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-neutral-400">No se encontraron jugadores</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg p-3 flex items-center justify-between transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          player.online ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-mono text-orange-400">ID: {player.id}</span>
                      <span className={`text-xs px-2 py-1 rounded ${player.online ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {player.online ? "Online" : "Offline"}
                      </span>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-white font-semibold truncate">{player.name}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <span>{player.band}</span>
                        <span>•</span>
                        <span>Nivel {player.level}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleInvite(player)}
                    className="ml-2 bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
                    size="sm"
                    type="button"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Invitar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-neutral-600 text-neutral-300 hover:text-white pointer-events-auto"
            type="button"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
