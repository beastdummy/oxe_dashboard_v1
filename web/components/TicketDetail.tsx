"use client"

import { useState, useRef, useEffect } from "react"
import { X, Image, Users, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, TicketMessage, priorityConfig, statusConfig } from "@/lib/types/tickets"

interface TicketDetailProps {
  ticket: Ticket
  onClose: () => void
}

export function TicketDetail({ ticket, onClose }: TicketDetailProps) {
  const [messages, setMessages] = useState<TicketMessage[]>(ticket.messages)
  const [inputMessage, setInputMessage] = useState("")
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth / 2 - 400 : 100,
    y: 50,
  }))
  const [size, setSize] = useState({ width: 800, height: 500 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: TicketMessage = {
        id: Date.now().toString(),
        author: "ADMIN_ROOT",
        role: "admin",
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setInputMessage("")
    }
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

  const priorityStyle = priorityConfig[ticket.priority]
  const statusStyle = statusConfig[ticket.status]

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
                className="text-xs px-2 py-1 rounded border"
                style={{ color: statusStyle.style.color, borderColor: statusStyle.style.borderColor }}
              >
                {statusStyle.label}
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
              size="sm"
              variant="outline"
              className="text-xs text-neutral-400 border-neutral-600 pointer-events-auto"
            >
              <Image className="w-3 h-3 mr-1" />
              Imagen
            </Button>
            <Button
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
      </div>
    </div>
  )
}
