"use client"

import { useState, useRef, useEffect } from "react"
import { X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

// Extend window interface for FiveM invokeNative
declare global {
  interface Window {
    invokeNative?: (method: string, ...args: any[]) => void
  }
}

interface ActionsModalProps {
  playerId: string
  playerName: string
  onClose: () => void
}

const ACTIONS = [
  { id: 'player:bring', emoji: '🔗', label: 'Traer' },
  { id: 'player:goTo', emoji: '🚀', label: 'Ir a Jugador' },
  { id: 'player:heal', emoji: '💚', label: 'Sanar' },
  { id: 'player:freeze', emoji: '❄️', label: 'Congelar' },
  { id: 'player:slap', emoji: '👋', label: 'Golpear' },
  { id: 'player:burn', emoji: '🔥', label: 'Quemar' },
  { id: 'player:electrocute', emoji: '⚡', label: 'Electrocutar' },
  { id: 'player:kill', emoji: '💀', label: 'Matar' },
]

export function ActionsModal({ playerId, playerName, onClose }: ActionsModalProps) {
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth / 2 - 200 : 100,
    y: 100,
  }))
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

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
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const triggerAction = (action: string) => {
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', action, playerId)
      } catch (err) {
        console.error(`Error triggering ${action}:`, err)
        alert(`Acción: ${action} (Dev Mode)`)
      }
    } else {
      alert(`Acción: ${action} (Dev Mode)`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 pointer-events-none">
      <div
        ref={containerRef}
        className="absolute bg-neutral-900 border border-neutral-700 rounded-lg flex flex-col pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '500px',
          boxShadow: isDragging ? "0 0 20px rgba(59, 130, 246, 0.3)" : "",
        }}
      >
        {/* Header */}
        <div
          className="border-b border-neutral-700 p-4 flex items-center justify-between cursor-move hover:bg-neutral-800/50 transition-colors"
          onMouseDown={handleHeaderMouseDown}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <Zap className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-white">Acciones</h2>
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

        {/* Subtitle */}
        <div className="px-4 pt-2 text-xs text-neutral-400">
          {playerName}
        </div>

        {/* Actions Grid */}
        <div className="p-4 grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                triggerAction(action.id)
                onClose()
              }}
              className={`px-2 py-3 rounded text-center text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                action.id === 'player:kill'
                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30'
                  : 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-600/30'
              }`}
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="border-t border-neutral-700 px-4 py-2 text-xs text-neutral-500">
          ID: {playerId}
        </div>
      </div>
    </div>
  )
}
