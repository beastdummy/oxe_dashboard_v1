"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Users, DollarSign, User, Car, MapPin, Shield, TrendingUp } from "lucide-react"

interface Member {
  id: string
  name: string
  rank: string
  joinDate: string
}

interface Vehicle {
  id: string
  name: string
  plate: string
  condition: "excellent" | "good" | "fair" | "damaged"
}

interface OrganizationDetailProps {
  isOpen: boolean
  onClose: () => void
  type: "job" | "gang"
  data: {
    id: string
    name: string
    label: string
    color: string
    status: "active" | "inactive" | "defeated"
    territory: string
    leader?: string
    members: number
    treasury?: number
    reputation?: number
    level?: number
    membersList?: Member[]
    vehiclesList?: Vehicle[]
    description?: string
  }
}

const membersMockData: { [key: string]: Member[] } = {
  job_1: [
    { id: "m1", name: "John Rider", rank: "President", joinDate: "2024-01-15" },
    { id: "m2", name: "Mike Savage", rank: "Vice-President", joinDate: "2024-02-20" },
    { id: "m3", name: "Johnny", rank: "Sergeant", joinDate: "2024-03-10" },
    { id: "m4", name: "Chibs", rank: "Member", joinDate: "2024-04-05" },
    { id: "m5", name: "Juice", rank: "Member", joinDate: "2024-04-15" },
    { id: "m6", name: "Happy", rank: "Member", joinDate: "2024-05-01" },
    { id: "m7", name: "Tig", rank: "Member", joinDate: "2024-05-10" },
    { id: "m8", name: "Jax", rank: "Member", joinDate: "2024-05-20" },
    { id: "m9", name: "Opie", rank: "Member", joinDate: "2024-06-01" },
    { id: "m10", name: "Clay", rank: "Member", joinDate: "2024-06-15" },
    { id: "m11", name: "Half-Sack", rank: "Prospect", joinDate: "2024-06-25" },
    { id: "m12", name: "Rooster", rank: "Prospect", joinDate: "2024-07-05" },
  ],
  gang_1: [
    { id: "gm1", name: "Big Smoke", rank: "Leader", joinDate: "2023-01-10" },
    { id: "gm2", name: "Lance 'Ryder' Wilson", rank: "Underboss", joinDate: "2023-02-15" },
    { id: "gm3", name: "Melvin 'Big Smoke' Harris", rank: "Capo", joinDate: "2023-03-20" },
    { id: "gm4", name: "Sean 'Zero' Johnson", rank: "Capo", joinDate: "2023-04-10" },
    { id: "gm5", name: "Jeffrey 'OG Loc' Cross", rank: "Soldado", joinDate: "2023-05-05" },
    { id: "gm6", name: "Lance 'Ryder' Wilson", rank: "Soldado", joinDate: "2023-05-15" },
    { id: "gm7", name: "Melvin 'Big Smoke' Harris", rank: "Soldado", joinDate: "2023-06-01" },
    { id: "gm8", name: "Sean 'Zero' Johnson", rank: "Soldado", joinDate: "2023-06-15" },
    { id: "gm9", name: "B-Dup", rank: "Associate", joinDate: "2023-07-01" },
    { id: "gm10", name: "Homie", rank: "Associate", joinDate: "2023-07-15" },
    { id: "gm11", name: "Homie 2", rank: "Associate", joinDate: "2023-08-01" },
    { id: "gm12", name: "Homie 3", rank: "Associate", joinDate: "2023-08-15" },
    { id: "gm13", name: "Homie 4", rank: "Associate", joinDate: "2023-09-01" },
    { id: "gm14", name: "Homie 5", rank: "Associate", joinDate: "2023-09-15" },
    { id: "gm15", name: "Homie 6", rank: "Associate", joinDate: "2023-10-01" },
    { id: "gm16", name: "Homie 7", rank: "Associate", joinDate: "2023-10-15" },
    { id: "gm17", name: "Homie 8", rank: "Associate", joinDate: "2023-11-01" },
    { id: "gm18", name: "Homie 9", rank: "Associate", joinDate: "2023-11-15" },
    { id: "gm19", name: "Homie 10", rank: "Associate", joinDate: "2023-12-01" },
    { id: "gm20", name: "Homie 11", rank: "Associate", joinDate: "2023-12-15" },
    { id: "gm21", name: "Homie 12", rank: "Recruit", joinDate: "2024-01-01" },
    { id: "gm22", name: "Homie 13", rank: "Recruit", joinDate: "2024-01-15" },
    { id: "gm23", name: "Homie 14", rank: "Recruit", joinDate: "2024-02-01" },
    { id: "gm24", name: "Homie 15", rank: "Recruit", joinDate: "2024-02-15" },
    { id: "gm25", name: "Homie 16", rank: "Recruit", joinDate: "2024-03-01" },
  ],
  gang_2: [
    { id: "gm2_1", name: "Lance 'Ryder' Wilson", rank: "Leader", joinDate: "2023-01-10" },
    { id: "gm2_2", name: "Officer Eddie Pulaski", rank: "Underboss", joinDate: "2023-02-15" },
    { id: "gm2_3", name: "Officer Eddie Pulaski", rank: "Capo", joinDate: "2023-03-20" },
    { id: "gm2_4", name: "Corrupt Officer", rank: "Capo", joinDate: "2023-04-10" },
    { id: "gm2_5", name: "Street Member 1", rank: "Soldado", joinDate: "2023-05-05" },
  ],
}

const vehiclesMockData: { [key: string]: Vehicle[] } = {
  job_1: [
    { id: "v1", name: "Chopper", plate: "LOST-001", condition: "excellent" },
    { id: "v2", name: "Bati 801", plate: "LOST-002", condition: "excellent" },
    { id: "v3", name: "FCR-900", plate: "LOST-003", condition: "good" },
    { id: "v4", name: "Hexer", plate: "LOST-004", condition: "good" },
    { id: "v5", name: "Sanchez", plate: "LOST-005", condition: "fair" },
    { id: "v6", name: "PCJ-600", plate: "LOST-006", condition: "good" },
    { id: "v7", name: "Freeway", plate: "LOST-007", condition: "fair" },
    { id: "v8", name: "Daemon", plate: "LOST-008", condition: "excellent" },
    { id: "v9", name: "Akuma", plate: "LOST-009", condition: "damaged" },
    { id: "v10", name: "NRG-500", plate: "LOST-010", condition: "good" },
  ],
  gang_1: [
    { id: "g1_v1", name: "Sabrosa", plate: "VAGOS-01", condition: "excellent" },
    { id: "g1_v2", name: "Burrito", plate: "VAGOS-02", condition: "good" },
    { id: "g1_v3", name: "Dilettante", plate: "VAGOS-03", condition: "good" },
    { id: "g1_v4", name: "Esperanto", plate: "VAGOS-04", condition: "good" },
    { id: "g1_v5", name: "Taco Van", plate: "VAGOS-05", condition: "fair" },
    { id: "g1_v6", name: "Cluckin Bell Box", plate: "VAGOS-06", condition: "fair" },
    { id: "g1_v7", name: "Mr Whoopee", plate: "VAGOS-07", condition: "good" },
    { id: "g1_v8", name: "Hotdog Van", plate: "VAGOS-08", condition: "fair" },
  ],
  gang_2: [
    { id: "g2_v1", name: "Baller", plate: "BALLAS-01", condition: "excellent" },
    { id: "g2_v2", name: "Primo", plate: "BALLAS-02", condition: "excellent" },
    { id: "g2_v3", name: "Perennial", plate: "BALLAS-03", condition: "good" },
    { id: "g2_v4", name: "Buffalo", plate: "BALLAS-04", condition: "excellent" },
    { id: "g2_v5", name: "Patriot", plate: "BALLAS-05", condition: "good" },
    { id: "g2_v6", name: "Feltzer", plate: "BALLAS-06", condition: "good" },
  ],
}

const getColorStyle = (color: string) => {
  const colorMap: { [key: string]: string } = {
    red: "bg-red-500 text-white",
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    yellow: "bg-yellow-500 text-black",
    orange: "bg-orange-500 text-white",
    pink: "bg-pink-500 text-white",
    cyan: "bg-cyan-500 text-white",
  }
  return colorMap[color] || "bg-neutral-600 text-white"
}

const getConditionColor = (condition: string) => {
  const conditionMap: { [key: string]: string } = {
    excellent: "text-green-500 bg-green-900",
    good: "text-blue-500 bg-blue-900",
    fair: "text-yellow-500 bg-yellow-900",
    damaged: "text-red-500 bg-red-900",
  }
  return conditionMap[condition] || "text-neutral-400 bg-neutral-800"
}

const getRankColor = (rank: string) => {
  if (rank === "President" || rank === "Leader") return "text-yellow-500"
  if (rank === "Vice-President" || rank === "Underboss") return "text-orange-500"
  if (rank === "Sergeant" || rank === "Capo") return "text-blue-500"
  if (rank === "Member" || rank === "Soldado") return "text-green-500"
  if (rank === "Prospect" || rank === "Associate") return "text-purple-500"
  return "text-neutral-400"
}

export function OrganizationDetailModal({ isOpen, onClose, type, data }: OrganizationDetailProps) {
  if (!isOpen) return null

  const members = membersMockData[data.id] || []
  const vehicles = vehiclesMockData[data.id] || []

  const colorBg = `bg-${data.color}-500`
  const colorText = `text-${data.color}-500`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-neutral-900 border-b border-neutral-700 flex flex-row items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-4 h-4 rounded-full ${getColorStyle(data.color).split(" ")[0]}`}></div>
              <CardTitle className="text-2xl font-bold text-white">{data.name}</CardTitle>
              <Badge
                className={`${
                  data.status === "active"
                    ? "bg-green-500 text-white"
                    : data.status === "defeated"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-600 text-white"
                }`}
              >
                {data.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-neutral-400">{data.label}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-4 text-center">
                <MapPin className="w-4 h-4 mx-auto mb-2 text-orange-500" />
                <p className="text-xs text-neutral-400">Territorio</p>
                <p className="text-sm font-semibold text-white">{data.territory}</p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-4 text-center">
                <Users className="w-4 h-4 mx-auto mb-2 text-blue-500" />
                <p className="text-xs text-neutral-400">Miembros</p>
                <p className="text-sm font-semibold text-white">{data.members}</p>
              </CardContent>
            </Card>

            {data.treasury !== undefined && (
              <Card className="bg-neutral-800 border-neutral-700">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-4 h-4 mx-auto mb-2 text-green-500" />
                  <p className="text-xs text-neutral-400">Tesorería</p>
                  <p className="text-sm font-semibold text-green-500">
                    ${(data.treasury / 1000).toFixed(0)}k
                  </p>
                </CardContent>
              </Card>
            )}

            {data.reputation !== undefined && (
              <Card className="bg-neutral-800 border-neutral-700">
                <CardContent className="p-4 text-center">
                  <Shield className="w-4 h-4 mx-auto mb-2 text-yellow-500" />
                  <p className="text-xs text-neutral-400">Reputación</p>
                  <p className="text-sm font-semibold text-yellow-500">{data.reputation}</p>
                </CardContent>
              </Card>
            )}

            {data.level !== undefined && (
              <Card className="bg-neutral-800 border-neutral-700">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-4 h-4 mx-auto mb-2 text-purple-500" />
                  <p className="text-xs text-neutral-400">Nivel</p>
                  <p className="text-sm font-semibold text-purple-500">{data.level}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Description */}
          {data.description && (
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-4">
                <p className="text-sm text-neutral-300">{data.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Members List */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Miembros ({members.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {members.map((member) => (
                <Card key={member.id} className="bg-neutral-800 border-neutral-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className={`text-xs font-medium ${getRankColor(member.rank)}`}>
                          {member.rank}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Unido: {new Date(member.joinDate).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <User className="w-4 h-4 text-neutral-500 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Vehicles List */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-500" />
              Vehículos ({vehicles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="bg-neutral-800 border-neutral-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{vehicle.name}</p>
                        <p className="text-xs text-neutral-400 font-mono">
                          Placa: {vehicle.plate}
                        </p>
                        <Badge className={`mt-2 ${getConditionColor(vehicle.condition)}`}>
                          {vehicle.condition.charAt(0).toUpperCase() + vehicle.condition.slice(1)}
                        </Badge>
                      </div>
                      <Car className="w-4 h-4 text-neutral-500 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>

        <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-700 p-4 flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
          >
            Cerrar
          </Button>
        </div>
      </Card>
    </div>
  )
}
