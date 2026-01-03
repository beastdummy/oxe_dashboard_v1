"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatMessage {
  id: string
  admin: string
  message: string
  timestamp: string
}

export function AdminChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      admin: "ADMIN_ROOT",
      message: "Sistema de seguridad activado",
      timestamp: "03/01 14:32",
    },
    {
      id: "2",
      admin: "ADMIN_SECURITY",
      message: "Vigilancia de bandas iniciada",
      timestamp: "03/01 14:33",
    },
    {
      id: "3",
      admin: "ADMIN_ROOT",
      message: "Confirmado. Monitoreo en tiempo real activo.",
      timestamp: "03/01 14:35",
    },
    {
      id: "4",
      admin: "ADMIN_MODERATION",
      message: "5 nuevos jugadores registrados",
      timestamp: "03/01 14:38",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [currentAdmin] = useState("ADMIN_ROOT")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const now = new Date()
      const timestamp = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        admin: currentAdmin,
        message: inputMessage,
        timestamp,
      }

      setMessages([...messages, newMessage])
      setInputMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-64 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-neutral-500 font-mono">[{msg.timestamp}]</span>
              <span className="text-orange-500 font-bold">{msg.admin}</span>
            </div>
            <div className="text-neutral-300 ml-4 mt-1 break-words">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Mensaje..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="text-xs bg-neutral-800 border-neutral-700 text-white placeholder-neutral-600"
        />
        <Button
          onClick={handleSendMessage}
          size="icon"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
