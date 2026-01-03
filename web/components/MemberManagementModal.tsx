"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus, Users, Trash2 } from "lucide-react"

interface Member {
  id: string
  playerId: string
  playerName: string
  rank?: number
  grade?: number
  salary?: number
}

interface MemberManagementModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  type: "job" | "gang"
  members: Member[]
  onAddMember: (playerId: string, playerName: string, salary?: number) => void
  onRemoveMember: (memberId: string) => void
}

export function MemberManagementModal({
  isOpen,
  onClose,
  title,
  type,
  members,
  onAddMember,
  onRemoveMember,
}: MemberManagementModalProps) {
  const [newPlayerId, setNewPlayerId] = useState("")
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newSalary, setNewSalary] = useState("0")
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddMember = () => {
    if (!newPlayerId.trim() || !newPlayerName.trim()) {
      alert("Por favor completa ID y nombre del jugador")
      return
    }

    const salary = type === "job" ? parseInt(newSalary) || 0 : undefined
    onAddMember(newPlayerId, newPlayerName, salary)

    setNewPlayerId("")
    setNewPlayerName("")
    setNewSalary("0")
  }

  const filteredMembers = members.filter(
    (m) =>
      m.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.playerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-700 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            Gestionar Miembros - {title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Miembros ({members.length})
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Agregar
            </TabsTrigger>
          </TabsList>

          {/* Members List */}
          <TabsContent value="members" className="space-y-3 mt-4">
            <div className="relative mb-3">
              <Input
                type="text"
                placeholder="Buscar miembro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm bg-neutral-800 border-neutral-600 text-white placeholder-neutral-500"
              />
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-6 text-neutral-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sin miembros agregados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="bg-neutral-800 border-neutral-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">{member.playerName}</p>
                          <p className="text-xs text-neutral-400">ID: {member.playerId}</p>
                          {type === "job" && member.salary !== undefined && (
                            <p className="text-xs text-green-400 mt-1">
                              💰 Salario: ${member.salary.toLocaleString()}
                            </p>
                          )}
                          {type === "gang" && member.rank !== undefined && (
                            <Badge variant="outline" className="text-xs mt-1 border-yellow-500/30 text-yellow-400">
                              Rango {member.rank}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRemoveMember(member.id)}
                          className="h-8 w-8 p-0 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Add Member */}
          <TabsContent value="add" className="space-y-4 mt-4">
            <div className="space-y-3 p-4 bg-neutral-800 rounded border border-neutral-700">
              {/* Player ID */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 tracking-wider">
                  ID DEL JUGADOR
                </label>
                <Input
                  type="text"
                  placeholder="ej: 1, 2, 3"
                  value={newPlayerId}
                  onChange={(e) => setNewPlayerId(e.target.value)}
                  className="text-sm bg-neutral-700 border-neutral-600 text-white placeholder-neutral-500"
                />
              </div>

              {/* Player Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 tracking-wider">
                  NOMBRE DEL JUGADOR
                </label>
                <Input
                  type="text"
                  placeholder="ej: John Doe"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="text-sm bg-neutral-700 border-neutral-600 text-white placeholder-neutral-500"
                />
              </div>

              {/* Salary (only for jobs) */}
              {type === "job" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 tracking-wider">
                    SALARIO
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="text-sm bg-neutral-700 border-neutral-600 text-white placeholder-neutral-500"
                  />
                </div>
              )}

              <Button
                onClick={handleAddMember}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
            </div>

            {/* Quick Template */}
            <div className="p-3 bg-neutral-800 rounded border border-neutral-700 text-xs text-neutral-400">
              <p className="font-semibold text-neutral-300 mb-2">Formato esperado:</p>
              <code className="block p-2 bg-neutral-900 rounded mb-2 overflow-auto">
                ID: número único del jugador
                <br />
                Nombre: nombre del jugador en el servidor
                {type === "job" && (
                  <>
                    <br />
                    Salario: cantidad por ciclo de pago
                  </>
                )}
              </code>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
