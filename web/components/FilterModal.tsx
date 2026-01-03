"use client"

import { useState, useEffect } from "react"
import { useModals } from "@/context/ModalsContext"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface FilterOptions {
  presence: "all" | "online" | "offline"
  accountStatus: "all" | "active" | "banned" | "suspended"
  minLevel: number
  maxLevel: number
  sortBy: "name" | "level" | "money" | "kills" | "reputation"
}

interface FilterModalProps {
  onApplyFilter: (filters: FilterOptions) => void
}

export function FilterModal({ onApplyFilter }: FilterModalProps) {
  const { filterModal, closeFilterModal } = useModals()
  const [filters, setFilters] = useState<FilterOptions>({
    presence: "all",
    accountStatus: "all",
    minLevel: 1,
    maxLevel: 99,
    sortBy: "name",
  })

  // Ejecutar callback cuando se apliquen los filtros
  const handleApply = () => {
    onApplyFilter(filters)
    closeFilterModal()
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      presence: "all",
      accountStatus: "all",
      minLevel: 1,
      maxLevel: 99,
      sortBy: "name",
    }
    setFilters(resetFilters)
    onApplyFilter(resetFilters)
  }

  if (!filterModal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-white">Filtrar Jugadores</h2>
          <button
            onClick={closeFilterModal}
            className="text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Presencia */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Estado</label>
            <div className="grid grid-cols-3 gap-2">
              {(["all", "online", "offline"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilters({ ...filters, presence: option })}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    filters.presence === option
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                  }`}
                >
                  {option === "all" && "Todos"}
                  {option === "online" && "En línea"}
                  {option === "offline" && "Offline"}
                </button>
              ))}
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Estado de Cuenta</label>
            <div className="grid grid-cols-2 gap-2">
              {(["all", "active", "banned", "suspended"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilters({ ...filters, accountStatus: option })}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    filters.accountStatus === option
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                  }`}
                >
                  {option === "all" && "Todos"}
                  {option === "active" && "Activo"}
                  {option === "banned" && "Baneado"}
                  {option === "suspended" && "Suspendido"}
                </button>
              ))}
            </div>
          </div>

          {/* Nivel */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Rango de Nivel</label>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-neutral-400">Mínimo</span>
                  <span className="text-xs text-orange-500 font-semibold">{filters.minLevel}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={filters.minLevel}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minLevel: Math.min(parseInt(e.target.value), filters.maxLevel),
                    })
                  }
                  className="w-full accent-orange-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-neutral-400">Máximo</span>
                  <span className="text-xs text-orange-500 font-semibold">{filters.maxLevel}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={filters.maxLevel}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxLevel: Math.max(parseInt(e.target.value), filters.minLevel),
                    })
                  }
                  className="w-full accent-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Ordenar por */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Ordenar por</label>
            <div className="space-y-2">
              {(["name", "level", "money", "kills", "reputation"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilters({ ...filters, sortBy: option })}
                  className={`w-full px-3 py-2 rounded text-sm font-medium text-left transition ${
                    filters.sortBy === option
                      ? "bg-orange-500 text-white"
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-750"
                  }`}
                >
                  {option === "name" && "Nombre"}
                  {option === "level" && "Nivel"}
                  {option === "money" && "Dinero"}
                  {option === "kills" && "Kills"}
                  {option === "reputation" && "Reputación"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t border-neutral-700 p-4">
          <Button
            onClick={handleReset}
            className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700"
          >
            Resetear
          </Button>
          <Button
            onClick={handleApply}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  )
}
