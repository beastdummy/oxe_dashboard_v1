"use client"

import { useState } from "react"
import { useModals } from "@/context/ModalsContext"
import { useActivity } from "@/context/ActivityContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface SuspendModalProps {
  playerId: string
  playerName: string
}

export function SuspendModal({ playerId, playerName }: SuspendModalProps) {
  const { suspendModal, closeSuspendModal } = useModals()
  const { addActivity } = useActivity()
  const [days, setDays] = useState("")
  const [reason, setReason] = useState("")

  const handleSuspend = () => {
    if (!days || parseInt(days) <= 0) {
      alert("Por favor ingresa una cantidad válida de días")
      return
    }

    console.log("Suspensión enviada:", {
      playerId,
      playerName,
      days: parseInt(days),
      reason,
    })

    // Enviar al servidor
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative(
        "triggerServerEvent",
        "player:suspend",
        playerId,
        parseInt(days),
        reason || "Sin especificar"
      )
    }

    // Registrar acción
    addActivity({
      type: "suspend",
      playerId,
      playerName,
      action: `Suspendido por ${days} días`,
      icon: "suspend",
      color: "#eab308",
    })

    // Limpiar y cerrar
    setDays("")
    setReason("")
    closeSuspendModal()
  }

  if (!suspendModal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-white">Suspender Jugador</h2>
          <button
            onClick={closeSuspendModal}
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

          {/* Días */}
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

          {/* Razón */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Razón (opcional)</label>
            <Input
              type="text"
              placeholder="Ej: Comportamiento inapropiado"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-600"
            />
          </div>

          {/* Preview */}
          {days && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-400">
                ⚠️ El jugador será suspendido por {days} día(s)
                {reason ? ` por: ${reason}` : ""}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t border-neutral-700 p-4">
          <Button
            onClick={closeSuspendModal}
            className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSuspend}
            disabled={!days || parseInt(days) <= 0}
            className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suspender
          </Button>
        </div>
      </div>
    </div>
  )
}
