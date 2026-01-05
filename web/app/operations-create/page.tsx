"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Briefcase, Users } from "lucide-react"

export default function OperationsCreatePage() {
  const [formData, setFormData] = useState({
    type: "job",
    name: "",
    label: "",
    description: "",
    stash: "vec3(0, 0, 0)",
    bankMoney: "10000",
    initialMoney: "5000",
    color: "orange",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const parseVec3 = (vec3String: string) => {
    const match = vec3String.match(/vec3\s*\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/i)
    if (match) {
      return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
        z: parseFloat(match[3]),
      }
    }
    return { x: 0, y: 0, z: 0 }
  }

  const getVec3Display = (vec3String: string) => {
    const parsed = parseVec3(vec3String)
    return `(${parsed.x}, ${parsed.y}, ${parsed.z})`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos requeridos
    if (!formData.name || !formData.label || !formData.description) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    // Validar formato de vec3
    const parsedStash = parseVec3(formData.stash)
    if (parsedStash.x === 0 && parsedStash.y === 0 && parsedStash.z === 0 && formData.stash !== "vec3(0, 0, 0)") {
      alert("Formato de ubicación inválido. Usa: vec3(x, y, z)")
      return
    }

    setIsLoading(true)

    const createData = {
      type: formData.type,
      name: formData.name,
      label: formData.label,
      description: formData.description,
      stash: parsedStash,
      status: "active",
      color: formData.color,
      ...(formData.type === "job"
        ? {
            treasury: parseInt(formData.bankMoney) || 10000,
            level: 1,
            members: 0,
          }
        : {
            leader: "N/A",
            reputation: parseInt(formData.initialMoney) || 5000,
            members: 0,
          }),
    }

    // Enviar al servidor vía NUI callback
    const eventName = formData.type === "job" ? "job:create" : "gang:create"
    
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      try {
        ;(window as any).invokeNative("triggerServerEvent", [eventName, JSON.stringify(createData)])
        
        console.log(`✅ Evento ${eventName} enviado:`, createData)

        // Mostrar mensaje de éxito
        setSuccessMessage(
          `¡${formData.type === "job" ? "Trabajo" : "Banda"} "${formData.name}" enviado al servidor!`
        )

        // Reset del formulario
        setFormData({
          type: "job",
          name: "",
          label: "",
          description: "",
          stash: "vec3(0, 0, 0)",
          bankMoney: "10000",
          initialMoney: "5000",
          color: "orange",
        })

        setIsLoading(false)

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000)
      } catch (error) {
        console.error("Error enviando evento:", error)
        alert("Error al enviar la solicitud al servidor")
        setIsLoading(false)
      }
    } else {
      console.warn("⚠️ invokeNative no disponible, modo desarrollo")
      console.log("Datos que se enviarían:", createData)
      
      // Simular envío en desarrollo
      setTimeout(() => {
        setSuccessMessage(
          `¡${formData.type === "job" ? "Trabajo" : "Banda"} "${formData.name}" creado (modo desarrollo)!`
        )
        setIsLoading(false)
        setTimeout(() => setSuccessMessage(""), 3000)
      }, 500)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2 px-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Plus className="w-8 h-8 text-orange-500" />
          Crear Nueva Organización
        </h1>
        <p className="text-neutral-400">
          Completa el formulario para crear un nuevo trabajo o banda
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Card className="bg-green-500/10 border-green-500/30 mx-6">
          <CardContent className="p-4">
            <p className="text-green-400 text-sm font-medium">{successMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Form - Full Width */}
      <div className="px-6">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="border-b border-neutral-700">
            <CardTitle className="text-white">Formulario de Creación</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row - Type and Name */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">
                    Tipo de Organización *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
                  >
                    <option value="job" className="bg-neutral-800">
                      Trabajo / Job
                    </option>
                    <option value="gang" className="bg-neutral-800">
                      Banda / Gang
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Nombre *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={formData.type === "job" ? "e.g., Lost MC" : "e.g., Los Vagos"}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Label / Etiqueta *</label>
                  <Input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    placeholder={formData.type === "job" ? "e.g., Lost MC MC" : "e.g., Los Santos Vagos"}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                  />
                </div>
              </div>

              {/* Second Row - Stash Coordinates and Color */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="text-sm font-semibold text-white mb-2">
                    Ubicación Stash Principal (Vec3)
                  </label>
                  <Input
                    type="text"
                    name="stash"
                    value={formData.stash}
                    onChange={handleInputChange}
                    placeholder="vec3(0, 0, 0)"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 font-mono"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Formato: vec3(200, 300, 400)</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Color</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
                  >
                    <option value="red" className="bg-neutral-800">🔴 Rojo</option>
                    <option value="blue" className="bg-neutral-800">🔵 Azul</option>
                    <option value="green" className="bg-neutral-800">🟢 Verde</option>
                    <option value="yellow" className="bg-neutral-800">🟡 Amarillo</option>
                    <option value="purple" className="bg-neutral-800">🟣 Púrpura</option>
                    <option value="pink" className="bg-neutral-800">🩷 Rosa</option>
                    <option value="orange" className="bg-neutral-800">🟠 Naranja</option>
                    <option value="cyan" className="bg-neutral-800">🔷 Cyan</option>
                  </select>
                </div>
              </div>

              {/* Third Row - Bank Money, Initial Money and Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Bank Money
                  </label>
                  <Input
                    type="number"
                    name="bankMoney"
                    value={formData.bankMoney}
                    onChange={handleInputChange}
                    placeholder="10000"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    Initial Money
                  </label>
                  <Input
                    type="number"
                    name="initialMoney"
                    value={formData.initialMoney}
                    onChange={handleInputChange}
                    placeholder="5000"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                  />
                </div>

                {/* Preview Card - Embedded */}
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Vista Previa</label>
                  <Card className="bg-neutral-800 border-neutral-700 h-full">
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: {
                                red: "#ef4444",
                                blue: "#3b82f6",
                                green: "#22c55e",
                                yellow: "#eab308",
                                purple: "#a855f7",
                                pink: "#ec4899",
                                orange: "#f97316",
                                cyan: "#06b6d4",
                              }[formData.color] || "#f97316",
                            }}
                          />
                          <span className="text-white font-semibold text-sm">{formData.name || "(Nombre)"}</span>
                          <Badge className="bg-orange-500/30 text-orange-400 text-xs">
                            {formData.type === "job" ? <Briefcase className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                            {formData.type === "job" ? "Job" : "Gang"}
                          </Badge>
                        </div>
                        <p className="text-neutral-400 text-xs">{formData.label || "(Label)"}</p>
                        <p className="text-neutral-400 text-xs">
                          📍 Stash: {getVec3Display(formData.stash)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Description - Full Width */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Descripción *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe los objetivos y características de la organización..."
                  rows={5}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded focus:border-orange-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-neutral-700">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Creando..." : "Crear Organización"}
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFormData({
                      type: "job",
                      name: "",
                      label: "",
                      description: "",
                      stash: "vec3(0, 0, 0)",
                      bankMoney: "10000",
                      initialMoney: "5000",
                      color: "orange",
                    })
                  }
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 py-2 rounded transition-colors"
                >
                  Limpiar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Info - Full Width */}
      <div className="px-6">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <p className="text-xs text-neutral-400">
              💡 <strong>Tip:</strong> Los valores de dinero se pueden ajustar posteriormente. Asegúrate de que el nombre y
              descripción sean descriptivos para que los miembros entiendan la función de la organización.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
