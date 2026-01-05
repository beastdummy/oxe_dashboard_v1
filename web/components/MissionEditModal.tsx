"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import type { Mission } from "@/lib/types/missions"

interface MissionEditModalProps {
  mission: Mission
  onClose: () => void
  onSave: (updatedMission: Mission) => void
}

export default function MissionEditModal({ mission, onClose, onSave }: MissionEditModalProps) {
  const [formData, setFormData] = useState<Mission>(mission)
  const [thumbnail, setThumbnail] = useState<string | null>(mission.thumbnail || null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(mission.thumbnail || null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "timeLimit" || name === "minLevel" ? parseInt(value) || 0 : value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen no debe exceder 2MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setThumbnail(base64)
        setPreviewUrl(base64)
        setFormData((prev) => ({
          ...prev,
          thumbnail: base64,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setThumbnail(null)
    setPreviewUrl(null)
    setFormData((prev) => ({
      ...prev,
      thumbnail: undefined,
    }))
  }

  const handleSave = () => {
    if (!formData.name || !formData.label) {
      alert("Nombre y etiqueta son requeridos")
      return
    }

    const updatedMission: Mission = {
      ...formData,
      updatedAt: new Date().toISOString(),
    }

    onSave(updatedMission)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="border-b border-neutral-700 flex flex-row items-start justify-between sticky top-0 bg-neutral-900">
          <CardTitle className="text-2xl font-bold text-white">Editar Misión</CardTitle>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-orange-400" />
              Imagen de la Misión
            </h3>

            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-neutral-700"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-neutral-700 rounded-lg p-8 hover:border-orange-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 bg-neutral-800/30">
                <Upload className="w-8 h-8 text-neutral-400" />
                <div className="text-center">
                  <p className="text-white font-medium">Haz click o arrastra una imagen</p>
                  <p className="text-xs text-neutral-400 mt-1">PNG, JPG (máx 2MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Información Básica</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">Nombre *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="jewelry_heist"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">Etiqueta *</label>
                <Input
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="Jewelry Store Heist"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 font-semibold mb-1 block">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe la misión..."
                rows={4}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded resize-none focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">Tipo</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-orange-500 focus:border-orange-500 focus:outline-none"
                >
                  <option value="heist">Heist</option>
                  <option value="delivery">Delivery</option>
                  <option value="assassination">Assassination</option>
                  <option value="robbery">Robbery</option>
                  <option value="escort">Escort</option>
                  <option value="rescue">Rescue</option>
                  <option value="sabotage">Sabotage</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">Dificultad</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-orange-500 focus:border-orange-500 focus:outline-none"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Media</option>
                  <option value="hard">Difícil</option>
                  <option value="extreme">Extrema</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">Límite de Tiempo (seg)</label>
                <Input
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit || 0}
                  onChange={handleInputChange}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">Nivel Mínimo</label>
                <Input
                  type="number"
                  name="minLevel"
                  value={formData.minLevel || 0}
                  onChange={handleInputChange}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Recompensas</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">XP</label>
                <Input
                  type="number"
                  value={formData.rewards.xp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rewards: {
                        ...prev.rewards,
                        xp: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-semibold mb-1 block">Dinero</label>
                <Input
                  type="number"
                  value={formData.rewards.money || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rewards: {
                        ...prev.rewards,
                        money: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs text-neutral-400 font-semibold mb-1 block">Estado</label>
            <div className="flex gap-2">
              {(["draft", "active", "completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFormData((prev) => ({ ...prev, status }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.status === status
                      ? "bg-orange-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {status === "draft" && "📝"}
                  {status === "active" && "🟢"}
                  {status === "completed" && "✅"}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              ✅ Guardar Cambios
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 border-neutral-600 text-neutral-300 hover:text-white">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
