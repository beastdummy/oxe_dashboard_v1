"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Copy,
  Lock,
  Users,
  MapPin,
  Target,
  Zap,
} from "lucide-react"
import type { Mission, MissionListItem, MissionDifficulty } from "@/lib/types/missions"

export default function MissionsSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState<"list" | "create" | "edit">("list")
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<MissionDifficulty | "all">("all")
  const [filterStatus, setFilterStatus] = useState<"active" | "draft" | "completed" | "all">("all")

  // Mock data
  const missions: MissionListItem[] = [
    {
      id: "MISSION-001",
      name: "jewelry_heist",
      label: "Jewelry Store Heist",
      type: "heist",
      difficulty: "hard",
      status: "active",
      completionRate: 85,
      rewards: { xp: 5000, money: 50000 },
    },
    {
      id: "MISSION-002",
      name: "drug_delivery",
      label: "Secure Delivery",
      type: "delivery",
      difficulty: "medium",
      status: "active",
      completionRate: 92,
      rewards: { xp: 2500, money: 25000 },
    },
    {
      id: "MISSION-003",
      name: "assassination",
      label: "Executive Elimination",
      type: "assassination",
      difficulty: "extreme",
      status: "draft",
      completionRate: 0,
      rewards: { xp: 10000, money: 100000 },
    },
    {
      id: "MISSION-004",
      name: "warehouse_robbery",
      label: "Warehouse Robbery",
      type: "robbery",
      difficulty: "medium",
      status: "active",
      completionRate: 78,
      rewards: { xp: 3000, money: 30000 },
    },
  ]

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.label.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === "all" || mission.difficulty === filterDifficulty
    const matchesStatus = filterStatus === "all" || mission.status === filterStatus
    return matchesSearch && matchesDifficulty && matchesStatus
  })

  const getDifficultyColor = (difficulty: MissionDifficulty) => {
    const colors: Record<MissionDifficulty, string> = {
      easy: "bg-green-500/20 text-green-400 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      hard: "bg-red-500/20 text-red-400 border-red-500/30",
      extreme: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    }
    return colors[difficulty]
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      archived: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
    }
    return colors[status] || colors.draft
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2 px-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-purple-500" />
          Missions System
        </h1>
        <p className="text-neutral-400">
          Crea y gestiona misiones personalizadas con NPCs, objetivos, minijuegos y sistemas de seguridad
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 border-b border-neutral-700">
        <button
          onClick={() => setSelectedTab("list")}
          className={`px-4 py-2 font-semibold transition-colors ${
            selectedTab === "list"
              ? "text-purple-400 border-b-2 border-purple-500"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          📋 Misiones
        </button>
        <button
          onClick={() => setSelectedTab("create")}
          className={`px-4 py-2 font-semibold transition-colors ${
            selectedTab === "create"
              ? "text-purple-400 border-b-2 border-purple-500"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          ➕ Crear
        </button>
      </div>

      {/* List View */}
      {selectedTab === "list" && (
        <div className="space-y-6 px-6">
          {/* Filters */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Buscar misión..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                  />
                </div>

                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value as any)}
                  className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-purple-500 focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">Todas las dificultades</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Media</option>
                  <option value="hard">Difícil</option>
                  <option value="extreme">Extrema</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-purple-500 focus:border-purple-500 focus:outline-none"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activas</option>
                  <option value="draft">Borrador</option>
                  <option value="completed">Completadas</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMissions.map((mission) => (
              <Card
                key={mission.id}
                className="bg-neutral-900 border-neutral-700 hover:border-purple-500/50 transition-colors cursor-pointer"
                onClick={() => {
                  // Just open detail view with basic info
                  console.log("Selected mission:", mission)
                }}
              >
                <CardHeader className="border-b border-neutral-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{mission.label}</CardTitle>
                      <p className="text-sm text-neutral-400 mt-1">{mission.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(mission.difficulty)}>
                        {mission.difficulty.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(mission.status)}>
                        {mission.status === "active" && "🟢 ACTIVA"}
                        {mission.status === "draft" && "📝 BORRADOR"}
                        {mission.status === "completed" && "✅ COMPLETADA"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {/* Mission Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>Players: {mission.completionRate}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>XP: {mission.rewards.xp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span>Type: {mission.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Lock className="w-4 h-4 text-red-400" />
                      <span>Reward: ${mission.rewards.money?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-neutral-700">
                    <Button
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-neutral-600 text-neutral-300 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-neutral-600 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMissions.length === 0 && (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-8 text-center">
                <p className="text-neutral-400">No se encontraron misiones</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Create View */}
      {selectedTab === "create" && (
        <div className="px-6">
          <MissionBuilder />
        </div>
      )}
    </div>
  )
}

// Mission Builder Component
function MissionBuilder() {
  const [step, setStep] = useState<"basic" | "npcs" | "props" | "objectives" | "minigames" | "security" | "review">(
    "basic"
  )
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    description: "",
    type: "heist" as const,
    difficulty: "medium" as const,
    timeLimit: 0,
  })

  const steps = ["basic", "npcs", "props", "objectives", "minigames", "security", "review"]
  const stepLabels: Record<string, string> = {
    basic: "Información Básica",
    npcs: "NPCs",
    props: "Props",
    objectives: "Objetivos",
    minigames: "Minijuegos",
    security: "Sistemas de Seguridad",
    review: "Revisión",
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            {steps.map((s, idx) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    steps.indexOf(step) >= idx
                      ? "bg-purple-500 text-white"
                      : "bg-neutral-700 text-neutral-400"
                  }`}
                >
                  {idx + 1}
                </div>
                <p className="text-xs text-neutral-400 mt-2 text-center max-w-[60px]">{stepLabels[s]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="border-b border-neutral-700">
          <CardTitle className="text-white">{stepLabels[step]}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {step === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Nombre de la Misión *</label>
                <Input
                  placeholder="jewelry_heist"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Etiqueta / Título *</label>
                <Input
                  placeholder="Jewelry Store Heist"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">Descripción</label>
                <textarea
                  placeholder="Describe los detalles de la misión..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded resize-none focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-purple-500 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="heist">Heist</option>
                    <option value="delivery">Delivery</option>
                    <option value="assassination">Assassination</option>
                    <option value="robbery">Robbery</option>
                    <option value="escort">Escort</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Dificultad</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded hover:border-purple-500 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Media</option>
                    <option value="hard">Difícil</option>
                    <option value="extreme">Extrema</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Límite de Tiempo (seg)</label>
                  <Input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                    className="bg-neutral-800 border-neutral-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === "npcs" && (
            <div className="text-neutral-400 text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Agrega NPCs a la misión (bosses, guardias, civiles, etc.)</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar NPC
              </Button>
            </div>
          )}

          {step === "props" && (
            <div className="text-neutral-400 text-center py-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Coloca props en el mapa (muebles, armas, herramientas, etc.)</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Prop
              </Button>
            </div>
          )}

          {step === "objectives" && (
            <div className="text-neutral-400 text-center py-8">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Define los objetivos que deben completar los jugadores</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Objetivo
              </Button>
            </div>
          )}

          {step === "minigames" && (
            <div className="text-neutral-400 text-center py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Configura los minijuegos (lockpick, hack, termita, etc.)</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Minijuego
              </Button>
            </div>
          )}

          {step === "security" && (
            <div className="text-neutral-400 text-center py-8">
              <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Agrega sistemas de seguridad (lásers, cámaras, alarmas)</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Sistema
              </Button>
            </div>
          )}

          {step === "review" && (
            <div className="text-center py-8">
              <p className="text-green-400 font-semibold">✅ Misión lista para crear</p>
              <p className="text-neutral-400 mt-2">Revisa todos los detalles antes de guardar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 justify-between">
        <Button
          onClick={() => {
            const currentIdx = steps.indexOf(step)
            if (currentIdx > 0) setStep(steps[currentIdx - 1] as any)
          }}
          disabled={step === "basic"}
          variant="outline"
          className="border-neutral-600"
        >
          ← Anterior
        </Button>

        <Button
          onClick={() => {
            const currentIdx = steps.indexOf(step)
            if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1] as any)
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {step === "review" ? "✅ Crear Misión" : "Siguiente →"}
        </Button>
      </div>
    </div>
  )
}
