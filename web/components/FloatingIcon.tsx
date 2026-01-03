"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useModals } from "@/context/ModalsContext"

export function FloatingIcon() {
  const { restoreDashboard, closeDashboard } = useModals()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showMenu, setShowMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Solo montar en cliente
  useEffect(() => {
    setMounted(true)
    setPosition({
      x: window.innerWidth - 100,
      y: 100,
    })
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      
      setPosition(prev => ({
        x: Math.max(0, Math.min(prev.x + deltaX, window.innerWidth - 56)),
        y: Math.max(0, Math.min(prev.y + deltaY, window.innerHeight - 56)),
      }))
      
      setDragStart({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStart])

  if (!mounted) return null

  return (
    <div
      className="fixed z-40 w-14 h-14 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="relative w-full h-full">
        {/* Main Button */}
        <button
          onMouseDown={(e) => {
            setIsDragging(true)
            setDragStart({ x: e.clientX, y: e.clientY })
          }}
          onClick={() => !isDragging && setShowMenu(!showMenu)}
          className="w-full h-full flex items-center justify-center bg-neutral-900 border border-neutral-700 rounded-full shadow-lg hover:shadow-xl transition-all cursor-grab active:cursor-grabbing hover:scale-110"
          title="Dashboard (Arrastra para mover)"
        >
          <Menu className="w-6 h-6 text-orange-500" />
        </button>

        {/* Menu */}
        {showMenu && (
          <div className="absolute top-20 right-0 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden z-50 w-48">
            <button
              onClick={() => {
                restoreDashboard()
                setShowMenu(false)
              }}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 border-b border-neutral-700"
            >
              <Menu className="w-4 h-4" />
              Abrir Dashboard
            </button>
            <button
              onClick={() => {
                closeDashboard()
                setShowMenu(false)
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
