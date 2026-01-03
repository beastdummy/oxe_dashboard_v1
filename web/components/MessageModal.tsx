"use client"

import { useState } from "react"
import { useModals } from "@/context/ModalsContext"
import { useActivity } from "@/context/ActivityContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface MessageModalProps {
  playerId: string
  playerName: string
}

export function MessageModal({ playerId, playerName }: MessageModalProps) {
  const { messageModal, closeMessageModal } = useModals()
  const { addActivity } = useActivity()
  const [messageType, setMessageType] = useState<"chat" | "notification">("notification")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert("Por favor ingresa un mensaje")
      return
    }

    console.log("Mensaje enviado:", {
      playerId,
      playerName,
      type: messageType,
      title,
      message,
    })

    // Enviar al servidor
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative(
        "triggerServerEvent",
        "player:message",
        playerId,
        messageType,
        title || "Sistema",
        message
      )
    }

    // Registrar acción
    addActivity({
      type: "message",
      playerId,
      playerName,
      action: `Mensaje ${messageType === "notification" ? "notificación" : "chat"} enviado`,
      icon: "message",
      color: "#f97316",
    })

    // Limpiar y cerrar
    setTitle("")
    setMessage("")
    setMessageType("notification")
    closeMessageModal()
  }

  if (!messageModal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-white">Enviar Mensaje</h2>
          <button
            onClick={closeMessageModal}
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

          {/* Tipo de mensaje */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Tipo de mensaje</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMessageType("notification")}
                className={`flex-1 px-4 py-2 rounded text-sm font-medium transition ${
                  messageType === "notification"
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                }`}
              >
                🔔 Notificación
              </button>
              <button
                onClick={() => setMessageType("chat")}
                className={`flex-1 px-4 py-2 rounded text-sm font-medium transition ${
                  messageType === "chat"
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-600"
                }`}
              >
                💬 Chat
              </button>
            </div>
          </div>

          {/* Título (solo para notificación) */}
          {messageType === "notification" && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-300">Título (opcional)</label>
              <Input
                type="text"
                placeholder="Ej: Advertencia, Info, Importante"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-600"
              />
            </div>
          )}

          {/* Mensaje */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">Mensaje</label>
            <textarea
              placeholder="Escribe el mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-600 rounded p-3 text-sm resize-none h-24"
              autoFocus
            />
            <p className="text-xs text-neutral-500">{message.length}/500 caracteres</p>
          </div>

          {/* Preview */}
          {message && (
            <div className={`p-3 rounded-lg border ${messageType === "notification" ? "bg-blue-900/20 border-blue-700" : "bg-green-900/20 border-green-700"}`}>
              <p className={`text-xs font-semibold mb-1 ${messageType === "notification" ? "text-blue-400" : "text-green-400"}`}>
                {messageType === "notification" ? "Preview - Notificación:" : "Preview - Chat:"}
              </p>
              {messageType === "notification" && title && (
                <p className="text-sm text-white font-semibold">{title}</p>
              )}
              <p className="text-sm text-neutral-300">{message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t border-neutral-700 p-4">
          <Button
            onClick={closeMessageModal}
            className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSendMessage}
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
