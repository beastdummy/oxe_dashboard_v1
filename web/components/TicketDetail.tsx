"use client"

import { useState, useRef, useEffect } from "react"
import { X, Image, Users, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageModal } from "@/components/ImageModal"
import { InvitePlayerModal } from "@/components/InvitePlayerModal"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Ticket, TicketMessage, priorityConfig, statusConfig } from "@/lib/types/tickets"

interface TicketDetailProps {
  ticket: Ticket
  onClose: () => void
}

export function TicketDetail({ ticket, onClose }: TicketDetailProps) {
  const [messages, setMessages] = useState<TicketMessage[]>(ticket.messages)
  const [inputMessage, setInputMessage] = useState("")
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth / 2 - 400 : 100,
    y: 50,
  }))
  const [size, setSize] = useState({ width: 800, height: 500 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    newStatus: string | null
  }>({ isOpen: false, newStatus: null })
  const [inviteConfirm, setInviteConfirm] = useState<{
    isOpen: boolean
    playerId: string
    playerName: string
  }>({ isOpen: false, playerId: "", playerName: "" })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (inputMessage.trim() || pendingImage) {
      // Enviar mensaje al backend
      const messageType = pendingImage ? "image" : "text"
      if (typeof window !== "undefined" && (window as any).invokeNative) {
        ;(window as any).invokeNative(
          "triggerServerEvent",
          "ticket:addMessage",
          ticket.id,
          inputMessage,
          messageType,
          pendingImage || null
        )
      }

      // Mostrar inmediatamente en UI (optimistic update)
      const newMessage: TicketMessage = {
        id: Date.now().toString(),
        author: "ADMIN_ROOT",
        role: "admin",
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        image: pendingImage || undefined,
      }
      setMessages([...messages, newMessage])
      setInputMessage("")
      setPendingImage(null)
    }
  }

  const handleImageAdd = (imageUrl: string) => {
    setPendingImage(imageUrl)
  }

  const handleInvitePlayer = (playerId: string, playerName: string) => {
    setInviteConfirm({ isOpen: true, playerId, playerName })
  }

  const executeInvite = () => {
    // Enviar invitación al backend
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative(
        "triggerServerEvent",
        "ticket:invitePlayer",
        ticket.id,
        parseInt(inviteConfirm.playerId),
        inviteConfirm.playerName
      )
    }

    // Mostrar inmediatamente en UI
    const newMessage: TicketMessage = {
      id: Date.now().toString(),
      author: "ADMIN_ROOT",
      role: "admin",
      message: `📍 Invitó a @${inviteConfirm.playerName} (ID: ${inviteConfirm.playerId}) al ticket`,
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages([...messages, newMessage])
    setInviteConfirm({ isOpen: false, playerId: "", playerName: "" })
  }

  // Drag functionality
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
      if (isResizing) {
        setSize({
          width: Math.max(500, e.clientX - position.x),
          height: Math.max(300, e.clientY - position.y),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, position])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleStatusChange = (newStatus: string) => {
    // Mostrar confirmación para cambios críticos
    if (newStatus === "closed" || newStatus === "resolved") {
      setConfirmDialog({ isOpen: true, newStatus })
    } else {
      executeStatusChange(newStatus)
    }
  }

  const executeStatusChange = (newStatus: string) => {
    // Enviar cambio de estado al backend
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", "ticket:updateStatus", ticket.id, newStatus)
    }
    setConfirmDialog({ isOpen: false, newStatus: null })
  }

  const priorityStyle = priorityConfig[ticket.priority]
  const statusStyle = statusConfig[ticket.status]

  const statusOptions = ["open", "in_progress", "resolved", "closed"]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none">
      <div
        ref={containerRef}
        className="absolute bg-neutral-900 border border-neutral-700 rounded-lg flex flex-col pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          boxShadow: isDragging || isResizing ? "0 0 20px rgba(249, 115, 22, 0.3)" : "",
        }}
      >
        {/* Header - Draggable */}
        <div
          className="border-b border-neutral-700 p-4 flex items-start justify-between cursor-move hover:bg-neutral-800/50 transition-colors"
          onMouseDown={handleHeaderMouseDown}
        >
          <div className="flex-1 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold text-white">{ticket.title}</h2>
              <span className={`text-xs px-2 py-1 rounded ${priorityStyle.bgColor} ${priorityStyle.color}`}>
                {priorityStyle.label}
              </span>
              <span 
                className="text-xs px-2 py-1 rounded border cursor-pointer pointer-events-auto group relative"
                style={{ color: statusStyle.style.color, borderColor: statusStyle.style.borderColor }}
              >
                {statusStyle.label}
                {/* Status dropdown menu */}
                <div className="hidden group-hover:block absolute top-full mt-1 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-10">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="block w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-orange-500/30 hover:text-orange-400 transition-colors"
                    >
                      {statusConfig[status as keyof typeof statusConfig]?.label}
                    </button>
                  ))}
                </div>
              </span>
            </div>
            <div className="text-xs text-neutral-400 space-y-1">
              <div>
                De: <span className="text-orange-500 font-mono">{ticket.playerName}</span>
                {" • Banda: "}
                <span className="text-orange-500 font-mono">{ticket.playerBand}</span>
              </div>
              <div>ID: {ticket.id} • Creado: {ticket.createdAt}</div>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white pointer-events-auto"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Description */}
        <div className="border-b border-neutral-700 p-4 bg-neutral-800/50">
          <p className="text-sm text-neutral-300">{ticket.description}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "admin" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs ${
                  msg.role === "admin"
                    ? "bg-orange-500/20 border border-orange-500/30"
                    : "bg-neutral-800 border border-neutral-700"
                } rounded-lg p-3`}
              >
                <div className="text-xs text-neutral-400 mb-1">
                  {msg.author} • {msg.timestamp}
                </div>
                <p className="text-sm text-white">{msg.message}</p>
                {msg.image && (
                  <img src={msg.image} alt="Attachment" className="mt-2 rounded w-full max-w-xs" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-neutral-700 p-4 bg-neutral-800/30">
          <div className="flex gap-2 mb-2">
            <Button
              onClick={() => setImageModalOpen(true)}
              size="sm"
              variant="outline"
              className={`text-xs border-neutral-600 pointer-events-auto ${
                pendingImage
                  ? "border-orange-500 text-orange-400"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Image className="w-3 h-3 mr-1" />
              Imagen {pendingImage && "✓"}
            </Button>
            <Button
              onClick={() => setInviteModalOpen(true)}
              size="sm"
              variant="outline"
              className="text-xs text-neutral-400 border-neutral-600 pointer-events-auto"
            >
              <Users className="w-3 h-3 mr-1" />
              Invitar Jugador
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Responder al reporte..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              className="text-xs bg-neutral-700 border-neutral-600 text-white"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white pointer-events-auto"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-gradient-to-tl from-orange-500/30 to-transparent hover:from-orange-500/50"
          title="Arrastrar para redimensionar"
        />

        {/* Image Modal */}
        <ImageModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          onImageAdd={handleImageAdd}
        />

        {/* Invite Player Modal */}
        <InvitePlayerModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInvitePlayer}
          currentTicketId={ticket.id}
        />

        {/* Status Change Confirmation */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={`Cambiar estado a "${statusConfig[confirmDialog.newStatus as keyof typeof statusConfig]?.label}"`}
          description={`¿Estás seguro de cambiar el estado de este ticket a "${statusConfig[confirmDialog.newStatus as keyof typeof statusConfig]?.label}"? Esta acción se registrará en el log de actividad.`}
          isDangerous={confirmDialog.newStatus === "closed"}
          confirmText="Confirmar"
          cancelText="Cancelar"
          onConfirm={() => {
            if (confirmDialog.newStatus) {
              executeStatusChange(confirmDialog.newStatus)
            }
          }}
          onCancel={() => setConfirmDialog({ isOpen: false, newStatus: null })}
        />
        {/* Invite Player Confirmation */}
        <ConfirmDialog
          isOpen={inviteConfirm.isOpen}
          title="Invitar jugador al ticket"
          description={`¿Estás seguro de invitar a ${inviteConfirm.playerName} (ID: ${inviteConfirm.playerId}) a este ticket?`}
          isDangerous={false}
          confirmText="Invitar"
          cancelText="Cancelar"
          onConfirm={executeInvite}
          onCancel={() => setInviteConfirm({ isOpen: false, playerId: "", playerName: "" })}
        />
      </div>
    </div>
  )
}