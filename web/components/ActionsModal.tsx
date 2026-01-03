"use client"

import { useState, useRef, useEffect } from "react"
import { X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActivity } from "@/context/ActivityContext"
import { ConfirmDialog } from "@/components/ConfirmDialog"

// Extend window interface for FiveM invokeNative
declare global {
  interface Window {
    invokeNative?: (method: string, ...args: any[]) => void
  }
}

interface Action {
  id: string
  label: string
  icon: string
  description: string
}

interface ActionsModalProps {
  playerId: string
  playerName: string
  onClose: () => void
}

const DANGEROUS_ACTIONS = ["kill", "freeze", "electrocute", "burn", "slap"]

export function ActionsModal({ playerId, playerName, onClose }: ActionsModalProps) {
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth / 2 - 200 : 100,
    y: 100,
  }))
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    action: Action | null
  }>({ isOpen: false, action: null })
  const { addActivity } = useActivity()
  const containerRef = useRef<HTMLDivElement>(null)

  // Request available actions from server on mount
  useEffect(() => {
    setLoading(true)
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', 'actions:getAvailable')
      } catch (err) {
        console.error('Error requesting actions:', err)
        setLoading(false)
      }
    }
  }, [])

  // Listen for actions update from server
  useEffect(() => {
    const handleActionsUpdate = (event: CustomEvent) => {
      setActions(event.detail || [])
      setLoading(false)
    }

    window.addEventListener('oxe_dashboard:actionsUpdate', handleActionsUpdate as EventListener)
    return () => window.removeEventListener('oxe_dashboard:actionsUpdate', handleActionsUpdate as EventListener)
  }, [])

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
  }, [isDragging, dragOffset, position.x, position.y])

  const triggerAction = (action: Action) => {
    // Check if action is dangerous
    if (DANGEROUS_ACTIONS.includes(action.id)) {
      setConfirmDialog({ isOpen: true, action })
    } else {
      executeAction(action)
    }
  }

  const executeAction = (action: Action) => {
    // Register activity
    addActivity({
      type: "action",
      action: `Ejecutó acción: ${action.label} en ${playerName}`,
      icon: action.icon,
      color: "purple",
    })

    // Send to server
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', 'action:execute', action.id, playerId)
      } catch (err) {
        console.error(`Error triggering ${action.id}:`, err)
      }
    }

    setConfirmDialog({ isOpen: false, action: null })
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
          {loading ? (
            <div className="col-span-3 text-center py-4 text-neutral-400">
              <p>Cargando acciones...</p>
            </div>
          ) : actions.length === 0 ? (
            <div className="col-span-3 text-center py-4 text-neutral-400">
              <p>No hay acciones disponibles</p>
            </div>
          ) : (
            actions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  triggerAction(action)
                  onClose()
                }}
                className="px-2 py-3 rounded text-center text-xs font-medium transition-colors flex flex-col items-center gap-1 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-600/30 hover:border-blue-500/50"
                title={action.description}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs">{action.label}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-neutral-700 px-4 py-2 text-xs text-neutral-500">
          ID: {playerId}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action?.label || "Confirmar"}
        description={`¿Estás seguro de que deseas ejecutar "${confirmDialog.action?.label}" en ${playerName}? Esta acción no se puede deshacer.`}
        isDangerous={true}
        confirmText="Ejecutar"
        onConfirm={() => {
          if (confirmDialog.action) {
            executeAction(confirmDialog.action)
            onClose()
          }
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, action: null })}
      />    </div>
  )
}