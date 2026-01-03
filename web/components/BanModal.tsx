"use client"

import { useState } from "react"
import { useModals } from "@/context/ModalsContext"
import { useActivity } from "@/context/ActivityContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface BanModalProps {
  playerId: string
  playerName: string
}

export function BanModal({ playerId, playerName }: BanModalProps) {
  const { banModal, closeBanModal } = useModals()
  const { addActivity } = useActivity()
  const [banType, setBanType] = useState<"permanent" | "temporary">("permanent")
  const [days, setDays] = useState("")
  const [reason, setReason] = useState("")

  const handleBan = () => {
    if (banType === "temporary" && (!days || parseInt(days) <= 0)) {
      alert("Por favor ingresa una cantidad válida de días")
      return
    }

    console.log("Ban enviado:", {
      playerId,
      playerName,
      type: banType,
      days: banType === "temporary" ? parseInt(days) : null,
      reason,
    })

    // Enviar al servidor
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative(
        "triggerServerEvent",
        "player:ban",
        playerId,
        banType === "permanent" ? -1 : parseInt(days),
        reason || "Sin especificar"
      )
    }

    // Registrar acción
    addActivity({
      type: "ban",
      playerId,
      playerName,
      action: `Baneado ${banType === "permanent" ? "permanentemente" : `por ${days} días`}`,
      icon: "ban",
      color: "#ef4444",
    })

    // Limpiar y cerrar
    setDays("")
    setReason("")
    setBanType("permanent")
    closeBanModal()
  }

  if (!banModal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-white">Banear Jugador</h2>
          <button
            onClick={closeBanModal}
            className="text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Nombre del jugador */}
          <div className="bg-neutral-800 p-3 rounded border border-neutral-700">
            <p className="text-sm text-neutral-400">Jugador</p>
            <p className="text-white font-semibold">{playerName}</p>
          </div>

          {/* Tipo de ban */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Tipo de ban</label>
            <div className="flex gap-2">
              <button
                onClick={() => setBanType("permanent")}
                className={`flex-1 px-4 py-2 rounded text-sm font-medium transition ${
                  banType === "permanent"
                    ? "bg-red-600 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                }`}
              >
                ♾️ Permanente
              </button>
              <button
                onClick={() => setBanType("temporary")}
                className={`flex-1 px-4 py-2 rounded text-sm font-medium transition ${
                  banType === "temporary"
                    ? "bg-red-600 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                }`}
              >
                ⏱️ Temporal
              </button>
            </div>
          </div>

          {/* Días (solo si es temporal) */}
          {banType === "temporary" && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Duración (días)</label>
              <Input
                type="number"
                placeholder="Ej: 7, 30, 365"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min="1"
                className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-600"
                autoFocus
              />
              <p className="text-xs text-neutral-500">
                {days && !isNaN(parseInt(days)) ? `${days} días = hasta el ${new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}` : ""}
              </p>
            </div>
          )}

          {/* Razón */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Razón (opcional)</label>
            <Input
              type="text"
              placeholder="Ej: Hacking, Spam, Comportamiento inapropiado"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-600"
            />
          </div>

          {/* Preview */}
          <div className={`p-3 rounded-lg border ${banType === "permanent" ? "bg-red-900/20 border-red-700" : "bg-orange-900/20 border-orange-700"}`}>
            <p className={`text-sm ${banType === "permanent" ? "text-red-400" : "text-orange-400"}`}>
              {banType === "permanent" 
                ? "🚫 El jugador será baneado PERMANENTEMENTE"
                : `⏱️ El jugador será baneado por ${days || 0} día(s)`
              }
              {reason ? ` por: ${reason}` : ""}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t border-neutral-700 p-4">
          <Button
            onClick={closeBanModal}
            className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleBan}
            disabled={banType === "temporary" && (!days || parseInt(days) <= 0)}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Banear
          </Button>
        </div>
      </div>
    </div>
  )
}
