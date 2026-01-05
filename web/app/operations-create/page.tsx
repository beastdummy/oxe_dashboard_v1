"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, ArrowRight, Plus } from "lucide-react"
import { CreateJobGangModal } from "@/components/CreateJobGangModal"

export default function OperationsCreatePage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedType, setSelectedType] = useState<"job" | "gang" | null>(null)

  const handleCreateJobGang = (data: any) => {
    console.log("Creating:", data)
    // Send to server
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      if (data.type === "job") {
        ;(window as any).invokeNative("triggerServerEvent", [
          "job:create",
          JSON.stringify(data),
        ])
      } else {
        ;(window as any).invokeNative("triggerServerEvent", [
          "gang:create",
          JSON.stringify(data),
        ])
      }
    }
    setShowCreateModal(false)
    setSelectedType(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Plus className="w-8 h-8 text-orange-500" />
          Crear Nueva Organización
        </h1>
        <p className="text-neutral-400">
          Selecciona el tipo de organización que deseas crear: un trabajo remunerado o una banda criminal
        </p>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Card */}
        <Card
          className="bg-neutral-900 border-neutral-700 hover:border-blue-500/50 transition-all cursor-pointer group overflow-hidden"
          onClick={() => {
            setSelectedType("job")
            setShowCreateModal(true)
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              <Badge className="bg-blue-500/30 text-blue-400 border-blue-500/50">
                Trabajo
              </Badge>
            </div>
            <CardTitle className="text-xl text-white">
              Crear un Trabajo
            </CardTitle>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">
                Crea un nuevo trabajo remunerado con miembros, territorios y
                beneficios económicos.
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase">
                  Características:
                </h4>
                <ul className="space-y-1 text-xs text-neutral-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Sistema de pago por trabajo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Gestión de tesorería
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Niveles y progresión
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Control de territorio
                  </li>
                </ul>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4 group/btn">
              Crear Trabajo
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Gang Card */}
        <Card
          className="bg-neutral-900 border-neutral-700 hover:border-purple-500/50 transition-all cursor-pointer group overflow-hidden"
          onClick={() => {
            setSelectedType("gang")
            setShowCreateModal(true)
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <Badge className="bg-purple-500/30 text-purple-400 border-purple-500/50">
                Banda
              </Badge>
            </div>
            <CardTitle className="text-xl text-white">
              Crear una Banda
            </CardTitle>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-neutral-300">
                Organiza una banda criminal con liderazgo, territorio e
                influencia en la ciudad.
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase">
                  Características:
                </h4>
                <ul className="space-y-1 text-xs text-neutral-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Sistema de liderazgo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Reputación y respeto
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Control territorial
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Operaciones criminales
                  </li>
                </ul>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4 group/btn">
              Crear Banda
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              ¿Cuál es la diferencia?
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              Los trabajos son organizaciones legales con enfoque económico, mientras que las
              bandas son organizaciones criminales basadas en poder y territorio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Trabajos</h4>
              <ul className="space-y-1 text-neutral-400">
                <li>• Enfoque legal/económico</li>
                <li>• Ingresos por servicios</li>
                <li>• Estructura jerárquica</li>
                <li>• Beneficiarios: todos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Bandas</h4>
              <ul className="space-y-1 text-neutral-400">
                <li>• Enfoque criminal</li>
                <li>• Control territorial</li>
                <li>• Liderazgo fuerte</li>
                <li>• Operaciones ilegales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <CreateJobGangModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setSelectedType(null)
        }}
        onSubmit={handleCreateJobGang}
      />
    </div>
  )
}
