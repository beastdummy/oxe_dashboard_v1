"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface GangData {
  id?: string
  name: string
  label: string
  color: string
  territory: string
  leader?: string
  description?: string
  status: "active" | "defeated"
}

interface GangModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: GangData) => void
  initialData?: GangData
  isEditing?: boolean
}

export function GangModal({ isOpen, onClose, onSubmit, initialData, isEditing }: GangModalProps) {
  const [formData, setFormData] = useState<GangData>({
    name: "",
    label: "",
    color: "#8B008B",
    territory: "",
    leader: "",
    description: "",
    status: "active",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        name: "",
        label: "",
        color: "#8B008B",
        territory: "",
        leader: "",
        description: "",
        status: "active",
      })
    }
  }, [initialData, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.label.trim() || !formData.territory.trim()) {
      alert("Por favor completa los campos requeridos (nombre, etiqueta, territorio)")
      return
    }

    onSubmit(formData)
    onClose()
  }

  const colors = [
    { name: "Purple", value: "#8B008B" },
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0066FF" },
    { name: "Green", value: "#00AA00" },
    { name: "Yellow", value: "#FFD700" },
    { name: "Orange", value: "#FF6500" },
    { name: "Pink", value: "#FF1493" },
    { name: "Cyan", value: "#00FFFF" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-700 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Editar Gang" : "Crear Gang"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              NOMBRE DE LA BANDA *
            </label>
            <Input
              type="text"
              name="name"
              placeholder="ej: Vagos, Ballas, Mafia"
              value={formData.name}
              onChange={handleInputChange}
              className="text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              disabled={isEditing}
            />
          </div>

          {/* Label */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              ETIQUETA/NOMBRE COMPLETO *
            </label>
            <Input
              type="text"
              name="label"
              placeholder="ej: Los Santos Vagos"
              value={formData.label}
              onChange={handleInputChange}
              className="text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
            />
          </div>

          {/* Territory */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              TERRITORIO *
            </label>
            <Input
              type="text"
              name="territory"
              placeholder="ej: Grove Street, East Side"
              value={formData.territory}
              onChange={handleInputChange}
              className="text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
            />
          </div>

          {/* Leader */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              LÍDER (OPCIONAL)
            </label>
            <Input
              type="text"
              name="leader"
              placeholder="Nombre del líder"
              value={formData.leader || ""}
              onChange={handleInputChange}
              className="text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              COLOR DE BANDA
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => setFormData((prev) => ({ ...prev, color: colorOption.value }))}
                  className={`p-3 rounded border-2 transition-all ${
                    formData.color === colorOption.value
                      ? "border-orange-500 ring-2 ring-orange-500"
                      : "border-neutral-600 hover:border-orange-400"
                  }`}
                  title={colorOption.name}
                >
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: colorOption.value }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 tracking-wider">
                ESTADO
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full text-sm bg-neutral-800 border border-neutral-600 text-white px-3 py-2 rounded"
              >
                <option value="active">Activa</option>
                <option value="defeated">Derrotada</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              DESCRIPCIÓN (OPCIONAL)
            </label>
            <textarea
              name="description"
              placeholder="Descripción de la banda..."
              value={formData.description || ""}
              onChange={handleInputChange}
              className="w-full text-sm bg-neutral-800 border border-neutral-600 text-white px-3 py-2 rounded resize-none"
              rows={3}
            />
          </div>

          {/* Preview */}
          <Card className="bg-neutral-800 border-neutral-700 mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-neutral-300">VISTA PREVIA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: formData.color }}
                  />
                  <span className="text-sm font-semibold text-white">{formData.name || "Sin nombre"}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    formData.status === "active"
                      ? "border-green-500/30 text-green-400"
                      : "border-red-500/30 text-red-400"
                  }`}
                >
                  {formData.status === "active" ? "Activa" : "Derrotada"}
                </Badge>
              </div>
              <p className="text-xs text-neutral-400">{formData.label || "Sin etiqueta"}</p>
              <div className="text-xs text-neutral-500 space-y-1">
                <p>📍 {formData.territory || "Sin territorio"}</p>
                {formData.leader && <p>👑 Líder: {formData.leader}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isEditing ? "Guardar Cambios" : "Crear Gang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
