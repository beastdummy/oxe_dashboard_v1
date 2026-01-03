"use client"

import { useState } from "react"
import { useModals } from "@/context/ModalsContext"
import { useActivity } from "@/context/ActivityContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Radio } from "lucide-react"

type NotificationType = "success" | "info" | "warn" | "error"

const notificationConfig = {
  success: { color: "text-green-400", bg: "bg-green-900/20 border-green-700" },
  info: { color: "text-blue-400", bg: "bg-blue-900/20 border-blue-700" },
  warn: { color: "text-yellow-400", bg: "bg-yellow-900/20 border-yellow-700" },
  error: { color: "text-red-400", bg: "bg-red-900/20 border-red-700" },
}

export function BroadcastModal() {
  const { broadcastModal, closeBroadcastModal } = useModals()
  const { addActivity } = useActivity()
  const [message, setMessage] = useState("")
  const [notificationType, setNotificationType] = useState<NotificationType>("info")

  const handleSendBroadcast = () => {
    if (!message.trim()) return

    // Register activity
    addActivity({
      type: "broadcast",
      action: `Envió anuncio (${notificationType}): "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"`,
      icon: "📢",
      color: notificationType === "success" ? "green" : notificationType === "error" ? "red" : notificationType === "warn" ? "yellow" : "blue",
    })

    // Send to server
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative(
        "triggerServerEvent",
        "broadcast:send",
        message,
        notificationType
      )
    }

    // Limpiar y cerrar
    setMessage("")
    setNotificationType("info")
    closeBroadcastModal()
  }

  if (!broadcastModal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-white">Enviar Broadcast</h2>
          <button
            onClick={closeBroadcastModal}
            className="text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Descripción */}
          <p className="text-sm text-neutral-400">
            Envía un mensaje a todos los jugadores del servidor
          </p>

          {/* Mensaje */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Mensaje</label>
            <Input
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-600"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendBroadcast()
              }}
            />
          </div>

          {/* Tipo de notificación */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Tipo de notificación</label>
            <div className="grid grid-cols-2 gap-2">
              {(["success", "info", "warn", "error"] as NotificationType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setNotificationType(type)}
                  className={`px-3 py-2 rounded text-sm font-medium transition ${
                    notificationType === type
                      ? `${notificationConfig[type].bg} ${notificationConfig[type].color} border`
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                  }`}
                >
                  {type === "success" && "✓ Éxito"}
                  {type === "info" && "ℹ Info"}
                  {type === "warn" && "⚠ Aviso"}
                  {type === "error" && "✕ Error"}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {message && (
            <div className={`p-3 rounded-lg border ${notificationConfig[notificationType].bg}`}>
              <p className="text-xs text-neutral-500 mb-1">Preview:</p>
              <p className={`text-sm ${notificationConfig[notificationType].color}`}>
                {message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t border-neutral-700 p-4">
          <Button
            onClick={closeBroadcastModal}
            className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSendBroadcast}
            disabled={!message.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}

