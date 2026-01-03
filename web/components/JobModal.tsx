"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, DollarSign } from "lucide-react"

interface JobData {
  id?: string
  name: string
  label: string
  color: string
  territory: string
  paymentRate?: number
  description?: string
  status: "active" | "inactive"
}

interface JobModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: JobData) => void
  initialData?: JobData
  isEditing?: boolean
}

export function JobModal({ isOpen, onClose, onSubmit, initialData, isEditing }: JobModalProps) {
  const [formData, setFormData] = useState<JobData>({
    name: "",
    label: "",
    color: "#FFA500",
    territory: "",
    paymentRate: 500,
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
        color: "#FFA500",
        territory: "",
        paymentRate: 500,
        description: "",
        status: "active",
      })
    }
  }, [initialData, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "paymentRate" ? parseInt(value) || 0 : value,
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
    { name: "Orange", value: "#FFA500" },
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0066FF" },
    { name: "Green", value: "#00AA00" },
    { name: "Purple", value: "#AA00FF" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Pink", value: "#FF1493" },
    { name: "Cyan", value: "#00FFFF" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-700 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Editar Job" : "Crear Job"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              NOMBRE DEL JOB *
            </label>
            <Input
              type="text"
              name="name"
              placeholder="ej: Lost MC, Families"
              value={formData.name}
              onChange={handleInputChange}
              className="text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              disabled={isEditing}
            />
          </div>

          {/* Label */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              ETIQUETA/DESCRIPCIÓN *
            </label>
            <Input
              type="text"
              name="label"
              placeholder="ej: Lost Motorcycle Club"
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
              placeholder="ej: Downtown, South Side"
              value={formData.territory}
              onChange={handleInputChange}
              className="text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
            />
          </div>

          {/* Payment Rate */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              PAGO POR MISIÓN
            </label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="number"
                name="paymentRate"
                placeholder="500"
                value={formData.paymentRate}
                onChange={handleInputChange}
                className="pl-8 text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              />
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              COLOR
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
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
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
              placeholder="Descripción del job..."
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
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-sm font-semibold text-white">{formData.name || "Sin nombre"}</span>
              </div>
              <p className="text-xs text-neutral-400">{formData.label || "Sin etiqueta"}</p>
              <div className="text-xs text-neutral-500 space-y-1">
                <p>📍 {formData.territory || "Sin territorio"}</p>
                <p>💰 ${formData.paymentRate?.toLocaleString()} por misión</p>
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
            {isEditing ? "Guardar Cambios" : "Crear Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
