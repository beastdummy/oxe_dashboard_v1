"use client"

import { useState, useRef, useEffect } from "react"
import { X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InventorySlot, INVENTORY_ITEMS } from "@/lib/types/inventory"

// Extend window interface for FiveM invokeNative
declare global {
  interface Window {
    invokeNative?: (method: string, ...args: any[]) => void
  }
}

interface InventoryModalProps {
  playerId: string
  playerName: string
  items: InventorySlot[]
  onClose: () => void
}

export function InventoryModal({ playerId, playerName, items, onClose }: InventoryModalProps) {
  const [position, setPosition] = useState(() => ({
    x: typeof window !== "undefined" ? window.innerWidth / 2 - 450 : 100,
    y: 50,
  }))
  const [size, setSize] = useState({ width: 660, height: 630 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [draggedItem, setDraggedItem] = useState<InventorySlot | null>(null)
  const [inventoryItems, setInventoryItems] = useState<InventorySlot[]>(items)
  const [showGiveDialog, setShowGiveDialog] = useState(false)
  const [giveQuantity, setGiveQuantity] = useState(1)
  const [giveItemName, setGiveItemName] = useState("")
  const [showDropDialog, setShowDropDialog] = useState(false)
  const [dropQuantity, setDropQuantity] = useState(1)
  const [dropItemName, setDropItemName] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteQuantity, setDeleteQuantity] = useState(1)
  const [deleteItemName, setDeleteItemName] = useState("")
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
  }, [isDragging, dragOffset, position])

  const handleItemDragStart = (item: InventorySlot) => {
    setDraggedItem(item)
  }

  const handleItemDrop = (targetSlot: number) => {
    if (!draggedItem) return

    // Trigger server event to move item
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', 'inventory:moveItem', playerId, draggedItem.slot, targetSlot)
      } catch (err) {
        console.error('Error triggering move event:', err)
      }
    }

    // Optimistic update: Update UI immediately
    setInventoryItems((prev) => {
      const newItems = [...prev]
      const draggedIndex = newItems.findIndex((i) => i.slot === draggedItem.slot)

      if (draggedIndex !== -1) {
        // Change the slot of the item to destination (allow empty slots)
        newItems[draggedIndex].slot = targetSlot

        // Re-sort by slot
        newItems.sort((a, b) => a.slot - b.slot)
      }

      return newItems
    })

    setDraggedItem(null)
  }

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropItem = () => {
    setDropItemName("")
    setDropQuantity(1)
    setShowDropDialog(true)
  }

  const handleConfirmDrop = () => {
    if (!dropItemName.trim() || dropQuantity < 1) {
      alert("Por favor completa los datos")
      return
    }
    
    // Llamar al evento del servidor Lua
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', 'inventory:dropItem', dropItemName, dropQuantity)
      } catch (err) {
        console.error('Error triggering drop event:', err)
        alert(`Soltando ${dropQuantity}x ${dropItemName} (Dev Mode)`)
      }
    } else {
      // Dev mode fallback
      console.log(`[Dev Mode] Drop: ${dropQuantity}x ${dropItemName}`)
      alert(`Soltando ${dropQuantity}x ${dropItemName} (Dev Mode)`)
    }
    
    setShowDropDialog(false)
    setDropItemName("")
    setDropQuantity(1)
  }

  const handleDeleteItem = (slot: number) => {
    setDeleteItemName("")
    setDeleteQuantity(1)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteItemName.trim() || deleteQuantity < 1) {
      alert("Por favor completa los datos")
      return
    }
    
    // Llamar al evento del servidor Lua
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', 'inventory:deleteItem', deleteItemName, deleteQuantity)
      } catch (err) {
        console.error('Error triggering delete event:', err)
        alert(`Eliminando ${deleteQuantity}x ${deleteItemName} (Dev Mode)`)
      }
    } else {
      // Dev mode fallback
      console.log(`[Dev Mode] Delete: ${deleteQuantity}x ${deleteItemName}`)
      alert(`Eliminando ${deleteQuantity}x ${deleteItemName} (Dev Mode)`)
    }
    
    setShowDeleteDialog(false)
    setDeleteItemName("")
    setDeleteQuantity(1)
  }

  const handleGiveItem = (slot: number) => {
    // Mostrar diálogo para dar item
    setGiveItemName("")
    setGiveQuantity(1)
    setShowGiveDialog(true)
  }

  const handleConfirmGive = () => {
    if (!giveItemName.trim() || giveQuantity < 1) {
      alert("Por favor completa los datos")
      return
    }
    
    // Llamar al evento del servidor Lua
    if (window.invokeNative) {
      try {
        window.invokeNative('triggerServerEvent', 'inventory:giveItem', giveItemName, giveQuantity)
      } catch (err) {
        console.error('Error triggering give event:', err)
        alert(`Dando ${giveQuantity}x ${giveItemName} al jugador (Dev Mode)`)
      }
    } else {
      // Dev mode fallback
      console.log(`[Dev Mode] Give: ${giveQuantity}x ${giveItemName}`)
      alert(`Dando ${giveQuantity}x ${giveItemName} al jugador (Dev Mode)`)
    }
    
    setShowGiveDialog(false)
    setGiveItemName("")
    setGiveQuantity(1)
  }

  const handleClearInventory = () => {
    if (window.confirm("¿Estás seguro de que deseas borrar TODO el inventario?")) {
      // Llamar al evento del servidor Lua
      if (window.invokeNative) {
        try {
          window.invokeNative('triggerServerEvent', 'inventory:clearInventory')
        } catch (err) {
          console.error('Error triggering clear event:', err)
          setInventoryItems([])
          alert("Inventario borrado (Dev Mode)")
        }
      } else {
        // Dev mode fallback
        console.log('[Dev Mode] Clear inventory')
        setInventoryItems([])
        alert("Inventario borrado (Dev Mode)")
      }
    }
  }

  const totalWeight = inventoryItems.reduce((sum, item) => sum + item.totalWeight, 0)
  const maxWeight = 100000 // kg ficticio

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
    <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none">
      <div
        ref={containerRef}
        className="absolute bg-neutral-900 border border-neutral-700 rounded-lg flex flex-col pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          boxShadow: isDragging ? "0 0 20px rgba(249, 115, 22, 0.3)" : "",
        }}
      >
        {/* Header */}
        <div
          className="border-b border-neutral-700 p-4 flex items-start justify-between cursor-move hover:bg-neutral-800/50 transition-colors"
          onMouseDown={handleHeaderMouseDown}
        >
          <div className="flex-1 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-white">Inventario</h2>
            </div>
            <div className="text-xs text-neutral-400">
              Peso: {(totalWeight / 1000).toFixed(2)} kg / {(maxWeight / 1000).toFixed(0)} kg
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

        {/* Inventory Grid */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {inventoryItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-neutral-500">
              <p>Inventario vacío</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-1">
              {inventoryItems.map((item, idx) => {
                const itemDef = INVENTORY_ITEMS[item.name]
                const imagePath = itemDef?.image 
                  ? `/inventory-icons/${itemDef.image}` 
                  : '/inventory-icons/default.png'

                return (
                  <div
                    key={`item-${idx}`}
                    className={`bg-neutral-800 border rounded-lg hover:border-orange-500/50 transition-all cursor-move group relative w-24 h-24 ${
                      draggedItem?.slot === item.slot ? "border-orange-500 opacity-50" : "border-neutral-700"
                    }`}
                    draggable
                    onDragStart={() => handleItemDragStart(item)}
                    onDragOver={handleItemDragOver}
                    onDrop={() => handleItemDrop(item.slot)}
                    onMouseEnter={(e) => {
                      setHoveredSlot(item.slot)
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setTooltipPos({ x: rect.right + 10, y: rect.top })
                    }}
                    onMouseLeave={() => setHoveredSlot(null)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={imagePath}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.style.display = 'none'
                        }}
                      />
                    </div>

                    {/* Tooltip */}
                    {hoveredSlot === item.slot && (
                      <div
                        className="fixed bg-neutral-900 border border-orange-500/50 rounded-lg p-3 z-[60] text-xs text-white w-48 pointer-events-none"
                        style={{
                          left: `${tooltipPos.x}px`,
                          top: `${tooltipPos.y}px`,
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.2)",
                        }}
                      >
                        <div className="space-y-2">
                          <div>
                            <p className="text-orange-400 font-bold">{item.label}</p>
                            <p className="text-neutral-400 text-[10px]">{item.name}</p>
                          </div>
                          <div className="border-t border-neutral-700 pt-2 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Cantidad:</span>
                              <span className="text-white font-mono">{item.count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Peso unitario:</span>
                              <span className="text-white font-mono">{(item.weight / 1000).toFixed(2)} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Peso total:</span>
                              <span className="text-orange-400 font-mono">{(item.totalWeight / 1000).toFixed(2)} kg</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              
              {/* Empty Slots */}
              {Array.from({ length: 50 - inventoryItems.length }).map((_, idx) => {
                const emptySlotNumber = inventoryItems.length + idx + 1
                return (
                  <div
                    key={`empty-${inventoryItems.length + idx}`}
                    className="bg-neutral-800/50 border border-dashed border-neutral-600 rounded-lg hover:border-neutral-500 transition-all w-24 h-24 cursor-move"
                    onDragOver={handleItemDragOver}
                    onDrop={() => handleItemDrop(emptySlotNumber)}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-neutral-700 p-4 bg-neutral-800/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handleGiveItem(draggedItem?.slot || 0)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              size="sm"
            >
              Dar
            </Button>
            <Button
              onClick={handleDropItem}
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
              size="sm"
            >
              Soltar
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs"
              size="sm"
            >
              Eliminar
            </Button>
            <Button
              onClick={handleClearInventory}
              className="bg-red-700 hover:bg-red-800 text-white text-xs"
              size="sm"
            >
              Borrar Todo
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="border-t border-neutral-700 p-4 bg-neutral-800/30">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    totalWeight / maxWeight > 0.8
                      ? "bg-red-500"
                      : totalWeight / maxWeight > 0.6
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(100, (totalWeight / maxWeight) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-neutral-400 whitespace-nowrap">
              {((totalWeight / maxWeight) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Give Item Dialog */}
      {showGiveDialog && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center pointer-events-auto">
          <div className="bg-neutral-900 border border-orange-500/50 rounded-lg p-6 w-96 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-4">Dar Item</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Nombre del item:</label>
                <Input
                  type="text"
                  placeholder="ej: money, burger, phone..."
                  value={giveItemName}
                  onChange={(e) => setGiveItemName(e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Cantidad:</label>
                <Input
                  type="number"
                  min="1"
                  value={giveQuantity}
                  onChange={(e) => setGiveQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-neutral-700">
              <Button
                onClick={() => setShowGiveDialog(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmGive}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drop Item Dialog */}
      {showDropDialog && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center pointer-events-auto">
          <div className="bg-neutral-900 border border-orange-500/50 rounded-lg p-6 w-96 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-4">Soltar Item</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Nombre del item:</label>
                <Input
                  type="text"
                  placeholder="ej: money, burger, phone..."
                  value={dropItemName}
                  onChange={(e) => setDropItemName(e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Cantidad:</label>
                <Input
                  type="number"
                  min="1"
                  value={dropQuantity}
                  onChange={(e) => setDropQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-neutral-700">
              <Button
                onClick={() => setShowDropDialog(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDrop}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                size="sm"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center pointer-events-auto">
          <div className="bg-neutral-900 border border-orange-500/50 rounded-lg p-6 w-96 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-4">Eliminar Item</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Nombre del item:</label>
                <Input
                  type="text"
                  placeholder="ej: money, burger, phone..."
                  value={deleteItemName}
                  onChange={(e) => setDeleteItemName(e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Cantidad:</label>
                <Input
                  type="number"
                  min="1"
                  value={deleteQuantity}
                  onChange={(e) => setDeleteQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-neutral-700">
              <Button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
