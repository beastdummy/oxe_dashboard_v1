"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Users, MapPin, Zap, Target, Lock, Settings } from "lucide-react"
import type { Mission, MissionDifficulty } from "@/lib/types/missions"

interface MissionDetailModalProps {
  mission: Mission
  onClose: () => void
  onEdit: () => void
}

export default function MissionDetailModal({ mission, onClose, onEdit }: MissionDetailModalProps) {
  const getDifficultyColor = (difficulty: MissionDifficulty) => {
    const colors: Record<MissionDifficulty, string> = {
      easy: "bg-green-500/20 text-green-400 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      hard: "bg-red-500/20 text-red-400 border-red-500/30",
      extreme: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    }
    return colors[difficulty]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="border-b border-neutral-700 flex flex-row items-start justify-between sticky top-0 bg-neutral-900">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-white">{mission.label}</CardTitle>
            <p className="text-sm text-neutral-400 mt-2">{mission.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Mission Image */}
          {mission.thumbnail && (
            <div className="w-full">
              <img
                src={mission.thumbnail}
                alt={mission.label}
                className="w-full h-64 object-cover rounded-lg border border-neutral-700"
              />
            </div>
          )}

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-xs text-neutral-400 font-semibold mb-1">TIPO</p>
              <p className="text-lg text-white font-mono">{mission.type.toUpperCase()}</p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-xs text-neutral-400 font-semibold mb-1">DIFICULTAD</p>
              <Badge className={getDifficultyColor(mission.difficulty)}>
                {mission.difficulty.toUpperCase()}
              </Badge>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-xs text-neutral-400 font-semibold mb-1">ESTADO</p>
              <Badge className="bg-blue-500/20 text-blue-400">
                {mission.status === "active" ? "ACTIVA" : mission.status === "draft" ? "BORRADOR" : "COMPLETADA"}
              </Badge>
            </div>
            <div className="bg-neutral-800 p-4 rounded-lg">
              <p className="text-xs text-neutral-400 font-semibold mb-1">NIVEL MÍNIMO</p>
              <p className="text-lg text-white font-mono">{mission.minLevel || 0}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">DESCRIPCIÓN</h3>
            <p className="text-neutral-300 bg-neutral-800/50 p-4 rounded-lg">{mission.description}</p>
          </div>

          {/* Objectives */}
          {mission.objectives.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                OBJETIVOS ({mission.objectives.length})
              </h3>
              <div className="space-y-2">
                {mission.objectives.map((obj) => (
                  <div key={obj.id} className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                    <p className="text-white font-medium">{obj.title}</p>
                    <p className="text-xs text-neutral-400 mt-1">{obj.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-neutral-700 text-neutral-300 text-xs">{obj.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NPCs */}
          {mission.npcs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                NPCs ({mission.npcs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mission.npcs.map((npc) => (
                  <div key={npc.id} className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                    <p className="text-white font-medium">{npc.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">{npc.type}</Badge>
                      <Badge className="bg-green-500/20 text-green-400 text-xs">{npc.behavior}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Props */}
          {mission.props.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                PROPS ({mission.props.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mission.props.map((prop) => (
                  <div key={prop.id} className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                    <p className="text-white font-medium text-sm">{prop.name}</p>
                    <Badge className="bg-neutral-700 text-neutral-300 text-xs mt-1">{prop.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicles */}
          {mission.vehicles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-yellow-400" />
                VEHÍCULOS ({mission.vehicles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mission.vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                    <p className="text-white font-medium text-sm">{vehicle.model}</p>
                    <Badge className={vehicle.locked ? "bg-red-500/20 text-red-400 text-xs" : "bg-green-500/20 text-green-400 text-xs"}>
                      {vehicle.locked ? "Bloqueado" : "Desbloqueado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minigames */}
          {mission.minigames.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                MINIJUEGOS ({mission.minigames.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mission.minigames.map((mg, idx) => (
                  <div key={idx} className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                    <p className="text-white font-medium text-sm">{mg.type.toUpperCase()}</p>
                    <p className="text-xs text-neutral-400 mt-1">Dificultad: {mg.difficulty}</p>
                    <p className="text-xs text-yellow-400 mt-1">XP: +{mg.reward.xp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Systems */}
          {mission.securitySystems.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                SISTEMAS DE SEGURIDAD ({mission.securitySystems.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mission.securitySystems.map((sec) => (
                  <div key={sec.id} className="bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                    <p className="text-white font-medium text-sm">{sec.type.toUpperCase()}</p>
                    <Badge className="bg-red-500/20 text-red-400 text-xs mt-1">Sistema Activo</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rewards */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">RECOMPENSAS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-4 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-400 font-semibold">⭐ XP</p>
                <p className="text-2xl font-bold text-yellow-300 mt-1">{mission.rewards.xp.toLocaleString()}</p>
              </div>
              {mission.rewards.money && (
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-lg border border-green-500/30">
                  <p className="text-green-400 font-semibold">💵 Dinero</p>
                  <p className="text-2xl font-bold text-green-300 mt-1">${mission.rewards.money.toLocaleString()}</p>
                </div>
              )}
              {mission.timeLimit && (
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 rounded-lg border border-blue-500/30">
                  <p className="text-blue-400 font-semibold">⏱️ Tiempo Límite</p>
                  <p className="text-2xl font-bold text-blue-300 mt-1">{mission.timeLimit}s</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-neutral-700 pt-4">
            <div className="grid grid-cols-2 text-sm">
              <div>
                <p className="text-neutral-400">Creado por:</p>
                <p className="text-white">{mission.createdBy}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-400">Última actualización:</p>
                <p className="text-white">{mission.updatedAt}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <Button onClick={onEdit} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
              ✏️ Editar
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 border-neutral-600 text-neutral-300 hover:text-white">
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
