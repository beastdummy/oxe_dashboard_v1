"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, MapPin, MoreHorizontal, Search, Trophy } from "lucide-react"
import { useModals } from "@/context/ModalsContext"
import { useActivity } from "@/context/ActivityContext"
import { InventorySlot } from "@/lib/types/inventory"
import type { FilterOptions } from "@/components/FilterModal"

// Extend window interface for FiveM invokeNative
declare global {
  interface Window {
    invokeNative?: (method: string, ...args: any[]) => void
  }
}

type PlayerPresence = "online" | "offline"
type PlayerAccountStatus = "active" | "banned" | "suspended"

type CurrencyType = {
  name: string
  key: string
  color: string
  amount: number
  icon: string
}

type Player = {
  id: string
  name: string
  band: string
  level: number
  experience: number
  money: number
  currency: CurrencyType[]
  kills: number
  deaths: number
  missions: number
  playtimeHours: number
  reputation: number
  presence: PlayerPresence
  location: string
  accountStatus: PlayerAccountStatus
}

const accountStatusLabel: Record<PlayerAccountStatus, string> = {
  active: "Activo",
  banned: "Baneado",
  suspended: "Suspendido",
}

const accountStatusColor: Record<PlayerAccountStatus, { dot: string; text: string }> = {
  active: { dot: "bg-green-400", text: "#4ade80" },
  banned: { dot: "bg-red-500", text: "#ef4444" },
  suspended: { dot: "bg-yellow-500", text: "#eab308" },
}

export default function PlayersPage() {
  const { openBroadcastModal, openFilterModal, openSuspendModal, openBanModal, openMessageModal } = useModals()
  const { addActivity } = useActivity()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    presence: "all",
    accountStatus: "all",
    minLevel: 1,
    maxLevel: 99,
    sortBy: "name",
  })
  const { openInventoryModal, openActionsModal } = useModals()

  const players: Player[] = useMemo(
    () => [
      {
        id: "P-0001",
        name: "Jugador1",
        band: "VENGEFUL SPIRIT",
        level: 45,
        experience: 8750,
        money: 125000,
        currency: [
          { name: "Efectivo", key: "cash", color: "text-green-400", amount: 50000, icon: "💵" },
          { name: "Banco", key: "bank", color: "text-blue-400", amount: 75000, icon: "🏦" },
          { name: "Cripto", key: "crypto", color: "text-yellow-400", amount: 12500, icon: "₿" },
          { name: "Disponible", key: "available", color: "text-gray-400", amount: 0, icon: "➕" },
        ],
        kills: 156,
        deaths: 23,
        missions: 47,
        playtimeHours: 284,
        reputation: 8500,
        presence: "online",
        location: "Paleto Bay",
        accountStatus: "active",
      },
      {
        id: "P-0002",
        name: "Jugador2",
        band: "OBSIDIAN SENTINEL",
        level: 38,
        experience: 6200,
        money: 87000,
        currency: [
          { name: "Efectivo", key: "cash", color: "text-green-400", amount: 35000, icon: "💵" },
          { name: "Banco", key: "bank", color: "text-blue-400", amount: 52000, icon: "🏦" },
          { name: "Disponible", key: "available", color: "text-gray-400", amount: 0, icon: "➕" },
        ],
        kills: 98,
        deaths: 45,
        missions: 32,
        playtimeHours: 156,
        reputation: 5200,
        presence: "online",
        location: "Downtown",
        accountStatus: "active",
      },
      {
        id: "P-0003",
        name: "Jugador3",
        band: "GHOSTLY FURY",
        level: 52,
        experience: 12500,
        money: 250000,
        currency: [
          { name: "Efectivo", key: "cash", color: "text-green-400", amount: 100000, icon: "💵" },
          { name: "Banco", key: "bank", color: "text-blue-400", amount: 150000, icon: "🏦" },
          { name: "Cripto", key: "crypto", color: "text-yellow-400", amount: 45000, icon: "₿" },
          { name: "Oro", key: "gold", color: "text-yellow-600", amount: 25000, icon: "🏆" },
          { name: "Disponible", key: "available", color: "text-gray-400", amount: 0, icon: "➕" },
        ],
        kills: 234,
        deaths: 18,
        missions: 63,
        playtimeHours: 412,
        reputation: 12300,
        presence: "online",
        location: "Sandy Shores",
        accountStatus: "active",
      },
      {
        id: "P-0004",
        name: "Jugador4",
        band: "CURSED REVENANT",
        level: 28,
        experience: 3450,
        money: 45000,
        currency: [
          { name: "Efectivo", key: "cash", color: "text-green-400", amount: 20000, icon: "💵" },
          { name: "Banco", key: "bank", color: "text-blue-400", amount: 25000, icon: "🏦" },
          { name: "Disponible", key: "available", color: "text-gray-400", amount: 0, icon: "➕" },
        ],
        kills: 45,
        deaths: 67,
        missions: 18,
        playtimeHours: 78,
        reputation: 2100,
        presence: "offline",
        location: "Vinewood",
        accountStatus: "banned",
      },
      {
        id: "P-0005",
        name: "Jugador5",
        band: "VENOMOUS SHADE",
        level: 42,
        experience: 7800,
        money: 156000,
        currency: [
          { name: "Efectivo", key: "cash", color: "text-green-400", amount: 60000, icon: "💵" },
          { name: "Banco", key: "bank", color: "text-blue-400", amount: 96000, icon: "🏦" },
          { name: "Disponible", key: "available", color: "text-gray-400", amount: 0, icon: "➕" },
        ],
        kills: 129,
        deaths: 31,
        missions: 41,
        playtimeHours: 234,
        reputation: 7600,
        presence: "offline",
        location: "Pacific Bluffs",
        accountStatus: "suspended",
      },
      {
        id: "P-0006",
        name: "Jugador6",
        band: "MYSTIC ENIGMA",
        level: 15,
        experience: 1200,
        money: 12000,
        currency: [
          { name: "Efectivo", key: "cash", color: "text-green-400", amount: 8000, icon: "💵" },
          { name: "Banco", key: "bank", color: "text-blue-400", amount: 4000, icon: "🏦" },
          { name: "Disponible", key: "available", color: "text-gray-400", amount: 0, icon: "➕" },
        ],
        kills: 12,
        deaths: 34,
        missions: 5,
        playtimeHours: 24,
        reputation: 800,
        presence: "online",
        location: "Pillbox Hill",
        accountStatus: "active",
      },
    ],
    [],
  )

  // Mock inventories por jugador
  const playerInventories: Record<string, InventorySlot[]> = useMemo(
    () => ({
      "P-0001": [
        { name: "money", label: "Money", count: 125000, weight: 0, slot: 1, totalWeight: 0 },
        { name: "burger", label: "Burger", count: 3, weight: 220, slot: 2, totalWeight: 660 },
        { name: "water", label: "Water", count: 2, weight: 500, slot: 3, totalWeight: 1000 },
        { name: "phone", label: "Phone", count: 1, weight: 190, slot: 4, totalWeight: 190 },
        { name: "identification", label: "Identification", count: 1, weight: 0, slot: 5, totalWeight: 0 },
        { name: "lockpick", label: "Lockpick", count: 5, weight: 160, slot: 6, totalWeight: 800 },
      ],
      "P-0002": [
        { name: "money", label: "Money", count: 87000, weight: 0, slot: 1, totalWeight: 0 },
        { name: "radio", label: "Radio", count: 1, weight: 1000, slot: 2, totalWeight: 1000 },
        { name: "bandage", label: "Bandage", count: 4, weight: 115, slot: 3, totalWeight: 460 },
        { name: "mastercard", label: "Fleeca Card", count: 1, weight: 10, slot: 4, totalWeight: 10 },
      ],
      "P-0003": [
        { name: "money", label: "Money", count: 250000, weight: 0, slot: 1, totalWeight: 0 },
        { name: "armour", label: "Bulletproof Vest", count: 1, weight: 3000, slot: 2, totalWeight: 3000 },
        { name: "phone", label: "Phone", count: 1, weight: 190, slot: 3, totalWeight: 190 },
        { name: "sprunk", label: "Sprunk", count: 1, weight: 350, slot: 4, totalWeight: 350 },
        { name: "lockpick", label: "Lockpick", count: 10, weight: 160, slot: 5, totalWeight: 1600 },
      ],
      "P-0004": [
        { name: "money", label: "Money", count: 45000, weight: 0, slot: 1, totalWeight: 0 },
        { name: "burger", label: "Burger", count: 1, weight: 220, slot: 2, totalWeight: 220 },
      ],
      "P-0005": [
        { name: "money", label: "Money", count: 156000, weight: 0, slot: 1, totalWeight: 0 },
        { name: "radio", label: "Radio", count: 2, weight: 1000, slot: 2, totalWeight: 2000 },
        { name: "phone", label: "Phone", count: 1, weight: 190, slot: 3, totalWeight: 190 },
      ],
      "P-0006": [
        { name: "money", label: "Money", count: 12000, weight: 0, slot: 1, totalWeight: 0 },
        { name: "water", label: "Water", count: 1, weight: 500, slot: 2, totalWeight: 500 },
        { name: "identification", label: "Identification", count: 1, weight: 0, slot: 3, totalWeight: 0 },
      ],
    }),
    [],
  )

  const handleViewInventory = (playerId: string, playerName: string) => {
    const items = playerInventories[playerId] || []
    openInventoryModal(playerId, playerName, items)
  }

  const triggerAction = (action: string) => {
    if (!selectedPlayer) return
    
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', action, selectedPlayer.id)
      } catch (err) {
        console.error(`Error triggering ${action}:`, err)
        alert(`Acción: ${action} (Dev Mode)`)
      }
    } else {
      alert(`Acción: ${action} (Dev Mode)`)
    }
  }

  const filteredPlayers = useMemo(() => {
    let result = players

    // Filtro por búsqueda
    const q = searchTerm.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.band.toLowerCase().includes(q),
      )
    }

    // Filtro por presencia
    if (filters.presence !== "all") {
      result = result.filter((p) => p.presence === filters.presence)
    }

    // Filtro por estado de cuenta
    if (filters.accountStatus !== "all") {
      result = result.filter((p) => p.accountStatus === filters.accountStatus)
    }

    // Filtro por nivel
    result = result.filter((p) => p.level >= filters.minLevel && p.level <= filters.maxLevel)

    // Ordenar
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "level":
          return b.level - a.level
        case "money":
          return b.money - a.money
        case "kills":
          return b.kills - a.kills
        case "reputation":
          return b.reputation - a.reputation
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [players, searchTerm, filters])

  const onlineCount = players.filter((p) => p.presence === "online").length
  const offlineCount = players.length - onlineCount
  const bannedCount = players.filter((p) => p.accountStatus === "banned").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">JUGADORES</h1>
          <p className="text-sm text-neutral-400">Gestiona y monitorea jugadores del servidor</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={openBroadcastModal}
          >
            Broadcast
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              setFilters({
                presence: "all",
                accountStatus: "all",
                minLevel: 1,
                maxLevel: 99,
                sortBy: "name",
              })
              openFilterModal()
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-1 bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Buscar jugador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ONLINE</p>
                <p className="text-2xl font-bold text-green-400 font-mono">{onlineCount}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">OFFLINE</p>
                <p className="text-2xl font-bold text-neutral-400 font-mono">{offlineCount}</p>
              </div>
              <Trophy className="w-8 h-8 text-neutral-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">BANEADOS</p>
                <p className="text-2xl font-bold text-red-500 font-mono">{bannedCount}</p>
              </div>
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{players.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">LISTA DE JUGADORES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">JUGADOR</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">BANDA</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">NIVEL</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">EXP</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">DINERO</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">K/D</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">MISIONES</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">TIEMPO</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">REPUTACIÓN</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">PRESENCIA</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">UBICACIÓN</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">ESTADO</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-400">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, index) => {
                  const status = accountStatusColor[player.accountStatus]
                  return (
                    <tr
                      key={player.id}
                      className={`border-b border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer ${
                        index % 2 === 0 ? "bg-neutral-900" : "bg-neutral-850"
                      }`}
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <td className="py-3 px-4 text-white font-mono">{player.id}</td>
                      <td className="py-3 px-4 text-white">{player.name}</td>
                      <td className="py-3 px-4 text-orange-500">{player.band}</td>
                      <td className="py-3 px-4 text-white">{player.level}</td>
                      <td className="py-3 px-4 text-white">{player.experience}</td>
                      <td className="py-3 px-4 text-white font-mono">${player.money.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="text-green-400">{player.kills}</span>
                        <span className="text-neutral-400">/</span>
                        <span className="text-red-400">{player.deaths}</span>
                      </td>
                      <td className="py-3 px-4 text-white">{player.missions}</td>
                      <td className="py-3 px-4 text-white">{player.playtimeHours}h</td>
                      <td className="py-3 px-4 text-orange-500">{player.reputation}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${player.presence === "online" ? "bg-green-400" : "bg-neutral-500"}`}
                          />
                          <span className="text-neutral-300">{player.presence === "online" ? "Online" : "Offline"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span className="text-neutral-300">{player.location}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                          <span style={{ color: status.text }}>{accountStatusLabel[player.accountStatus]}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-wider">
                  {selectedPlayer.name} ({selectedPlayer.id})
                </CardTitle>
                <p className="text-sm text-orange-500">Banda: {selectedPlayer.band}</p>
              </div>
              <Button
                onClick={() => {
                  setSelectedPlayer(null)
                }}
                className="text-neutral-400 hover:text-white"
                variant="ghost"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">NIVEL</p>
                  <p className="text-2xl font-bold text-white">{selectedPlayer.level}</p>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">EXPERIENCIA</p>
                  <p className="text-2xl font-bold text-white">{selectedPlayer.experience}</p>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">REPUTACIÓN</p>
                  <p className="text-2xl font-bold text-orange-500">{selectedPlayer.reputation}</p>
                </div>
              </div>

              {/* Sección de Monedas/Divisas */}
              <div>
                <p className="text-xs text-neutral-400 mb-3 font-semibold tracking-wider">DIVISAS</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedPlayer.currency.map((curr) => (
                    <div key={curr.key} className="bg-neutral-800 p-4 rounded border border-neutral-700 hover:border-neutral-600 transition">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-neutral-400">{curr.name}</p>
                        <span className="text-xl">{curr.icon}</span>
                      </div>
                      <p className={`text-xl font-bold ${curr.color}`}>${curr.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">KILLS</p>
                  <p className="text-2xl font-bold text-green-400">{selectedPlayer.kills}</p>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">MUERTES</p>
                  <p className="text-2xl font-bold text-red-400">{selectedPlayer.deaths}</p>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">MISIONES</p>
                  <p className="text-2xl font-bold text-white">{selectedPlayer.missions}</p>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">TIEMPO DE JUEGO</p>
                  <p className="text-lg font-bold text-white">{selectedPlayer.playtimeHours} horas</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">PRESENCIA</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${selectedPlayer.presence === "online" ? "bg-green-400" : "bg-neutral-500"}`}
                    />
                    <p className="text-white">{selectedPlayer.presence === "online" ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">UBICACIÓN</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <p className="text-white">{selectedPlayer.location}</p>
                  </div>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-xs text-neutral-400 mb-2">ESTADO</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const s = accountStatusColor[selectedPlayer.accountStatus]
                      return (
                        <>
                          <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                          <span style={{ color: s.text }}>{accountStatusLabel[selectedPlayer.accountStatus]}</span>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700 flex-wrap">
                <Button 
                  onClick={() => {
                    openMessageModal(selectedPlayer.id, selectedPlayer.name)
                    addActivity({
                      type: "message",
                      playerId: selectedPlayer.id,
                      playerName: selectedPlayer.name,
                      action: "Mensaje abierto",
                      icon: "message",
                      color: "#f97316",
                    })
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Enviar Mensaje
                </Button>
                <Button 
                  onClick={() => {
                    if (window.invokeNative) {
                      window.invokeNative('triggerServerEvent', 'spectate:player', selectedPlayer.id)
                    } else {
                      alert(`Spectate: ${selectedPlayer.name}`)
                    }
                    addActivity({
                      type: "spectate",
                      playerId: selectedPlayer.id,
                      playerName: selectedPlayer.name,
                      action: "Espectate iniciado",
                      icon: "spectate",
                      color: "#a855f7",
                    })
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  👁️ Spectate
                </Button>
                <Button 
                  onClick={() => {
                    handleViewInventory(selectedPlayer.id, selectedPlayer.name)
                    addActivity({
                      type: "inventory",
                      playerId: selectedPlayer.id,
                      playerName: selectedPlayer.name,
                      action: "Inventario visualizado",
                      icon: "inventory",
                      color: "#22c55e",
                    })
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Ver Inventario
                </Button>
                <Button
                  onClick={() => {
                    openActionsModal(selectedPlayer.id, selectedPlayer.name)
                    addActivity({
                      type: "spectate",
                      playerId: selectedPlayer.id,
                      playerName: selectedPlayer.name,
                      action: "Acciones modal abierto",
                      icon: "spectate",
                      color: "#3b82f6",
                    })
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ⚡ Acciones
                </Button>
                <Button 
                  onClick={() => {
                    openSuspendModal(selectedPlayer.id, selectedPlayer.name)
                    addActivity({
                      type: "suspend",
                      playerId: selectedPlayer.id,
                      playerName: selectedPlayer.name,
                      action: "Suspensión modal abierto",
                      icon: "suspend",
                      color: "#eab308",
                    })
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Suspender
                </Button>
                <Button 
                  onClick={() => {
                    openBanModal(selectedPlayer.id, selectedPlayer.name)
                    addActivity({
                      type: "ban",
                      playerId: selectedPlayer.id,
                      playerName: selectedPlayer.name,
                      action: "Ban modal abierto",
                      icon: "ban",
                      color: "#ef4444",
                    })
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Banear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
