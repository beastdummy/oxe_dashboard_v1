"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, MapPin, DollarSign, Trophy, TrendingUp, Target, Edit2, Trash2, Plus, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CreateJobGangModal } from "./CreateJobGangModal"
import { JobModal } from "./JobModal"
import { GangModal } from "./GangModal"
import { MemberManagementModal } from "./MemberManagementModal"
import { ConfirmDialog } from "./ConfirmDialog"

interface Job {
  id: string
  name: string
  label: string
  members: number
  level: number
  treasury: number
  territory: string
  color: string
  status: "active" | "inactive"
}

interface Gang {
  id: string
  name: string
  label: string
  leader: string
  members: number
  reputation: number
  territory: string
  color: string
  status: "active" | "defeated"
}

interface JobsGangsSectionProps {
  showTabs?: boolean
  showCreateButton?: boolean
  viewMode?: "all" | "jobs-only" | "gangs-only"
}

export function JobsGangsSection({ showTabs = true, showCreateButton = true, viewMode = "all" }: JobsGangsSectionProps = {}) {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job_1",
      name: "Lost MC",
      label: "Lost MC",
      members: 12,
      level: 45,
      treasury: 450000,
      territory: "Downtown",
      color: "red",
      status: "active",
    },
    {
      id: "job_2",
      name: "Families",
      label: "Grove Street Families",
      members: 18,
      level: 52,
      treasury: 650000,
      territory: "South Side",
      color: "green",
      status: "active",
    },
    {
      id: "job_3",
      name: "Ballas",
      label: "Los Santos Vagos",
      members: 15,
      level: 48,
      treasury: 520000,
      territory: "East Side",
      color: "purple",
      status: "active",
    },
  ])

  const [gangs, setGangs] = useState<Gang[]>([
    {
      id: "gang_1",
      name: "Vagos",
      label: "Los Santos Vagos",
      leader: "Big Smoke",
      members: 25,
      reputation: 8500,
      territory: "Grove Street",
      color: "purple",
      status: "active",
    },
    {
      id: "gang_2",
      name: "Ballas",
      label: "Los Santos Ballas",
      leader: "Lance 'Ryder' Wilson",
      members: 30,
      reputation: 9200,
      territory: "East Los Santos",
      color: "purple",
      status: "active",
    },
    {
      id: "gang_3",
      name: "Mafia",
      label: "Italian Mafia",
      leader: "Salvatore Leone",
      members: 20,
      reputation: 7800,
      territory: "Chinatown",
      color: "red",
      status: "defeated",
    },
  ])

  const [searchJob, setSearchJob] = useState("")
  const [searchGang, setSearchGang] = useState("")
  const [selectedTab, setSelectedTab] = useState<"jobs" | "gangs">("jobs")

  // Create Job/Gang Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Job Modal State
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  // Gang Modal State
  const [showGangModal, setShowGangModal] = useState(false)
  const [editingGang, setEditingGang] = useState<Gang | null>(null)

  // Member Management Modal State
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [selectedJobForMembers, setSelectedJobForMembers] = useState<Job | null>(null)
  const [selectedGangForMembers, setSelectedGangForMembers] = useState<Gang | null>(null)

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    isDangerous?: boolean
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const filteredJobs = jobs.filter((job) =>
    job.name.toLowerCase().includes(searchJob.toLowerCase()) ||
    job.territory.toLowerCase().includes(searchJob.toLowerCase())
  )

  const filteredGangs = gangs.filter((gang) =>
    gang.name.toLowerCase().includes(searchGang.toLowerCase()) ||
    gang.leader.toLowerCase().includes(searchGang.toLowerCase()) ||
    gang.territory.toLowerCase().includes(searchGang.toLowerCase())
  )

  const getTreasuryColor = (treasury: number) => {
    if (treasury >= 600000) return "text-green-500"
    if (treasury >= 400000) return "text-blue-500"
    return "text-orange-500"
  }

  const getReputationColor = (reputation: number) => {
    if (reputation >= 9000) return "text-yellow-500"
    if (reputation >= 8000) return "text-orange-500"
    if (reputation >= 7000) return "text-blue-500"
    return "text-neutral-400"
  }

  // Create Job/Gang Modal Handler
  const handleCreateJobGangSubmit = (data: any) => {
    if (data.type === "job") {
      const jobData = {
        name: data.name,
        label: data.label,
        territory: data.territory,
        color: data.color,
        status: data.status,
        description: data.description,
        paymentRate: data.paymentRate,
      }
      handleCreateJob(jobData)
    } else {
      const gangData = {
        name: data.name,
        label: data.label,
        territory: data.territory,
        color: data.color,
        status: data.status,
        description: data.description,
        leader: data.leader,
      }
      handleCreateGang(gangData)
    }
  }

  // Job handlers
  const handleCreateJob = (jobData: any) => {
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", ["job:create", JSON.stringify(jobData)])
    }
    // For demo: add to local state
    const newJob: Job = {
      id: `job_${Date.now()}`,
      ...jobData,
      members: 0,
      treasury: 0,
    }
    setJobs([...jobs, newJob])
  }

  const handleUpdateJob = (jobId: string, jobData: any) => {
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", ["job:update", jobId, JSON.stringify(jobData)])
    }
    // For demo: update local state
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, ...jobData } : j)))
  }

  const handleDeleteJob = (jobId: string) => {
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", ["job:delete", jobId])
    }
    setJobs(jobs.filter((j) => j.id !== jobId))
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setShowJobModal(true)
  }

  const handleJobModalSubmit = (jobData: any) => {
    if (editingJob) {
      handleUpdateJob(editingJob.id, jobData)
      setEditingJob(null)
    } else {
      handleCreateJob(jobData)
    }
  }

  // Gang handlers
  const handleCreateGang = (gangData: any) => {
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", ["gang:create", JSON.stringify(gangData)])
    }
    // For demo: add to local state
    const newGang: Gang = {
      id: `gang_${Date.now()}`,
      ...gangData,
      members: 0,
      reputation: 0,
    }
    setGangs([...gangs, newGang])
  }

  const handleUpdateGang = (gangId: string, gangData: any) => {
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", ["gang:update", gangId, JSON.stringify(gangData)])
    }
    // For demo: update local state
    setGangs(gangs.map((g) => (g.id === gangId ? { ...g, ...gangData } : g)))
  }

  const handleDeleteGang = (gangId: string) => {
    if (typeof window !== "undefined" && (window as any).invokeNative) {
      ;(window as any).invokeNative("triggerServerEvent", ["gang:delete", gangId])
    }
    setGangs(gangs.filter((g) => g.id !== gangId))
  }

  const handleEditGang = (gang: Gang) => {
    setEditingGang(gang)
    setShowGangModal(true)
  }

  const handleGangModalSubmit = (gangData: any) => {
    if (editingGang) {
      handleUpdateGang(editingGang.id, gangData)
      setEditingGang(null)
    } else {
      handleCreateGang(gangData)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs - Only show if showTabs is true */}
      {showTabs && (
        <div className="flex gap-2">
          <Button
            onClick={() => setSelectedTab("jobs")}
            variant={selectedTab === "jobs" ? "default" : "outline"}
            className={`text-sm ${
              selectedTab === "jobs"
                ? "bg-orange-500 hover:bg-orange-600"
                : "border-neutral-600 text-neutral-400"
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Jobs ({jobs.length})
          </Button>
          <Button
            onClick={() => setSelectedTab("gangs")}
            variant={selectedTab === "gangs" ? "default" : "outline"}
            className={`text-sm ${
              selectedTab === "gangs"
                ? "bg-orange-500 hover:bg-orange-600"
                : "border-neutral-600 text-neutral-400"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Gangs ({gangs.length})
          </Button>
        </div>
      )}

      {/* JOBS TAB */}
      {(showTabs ? selectedTab === "jobs" : viewMode !== "gangs-only") && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                JOBS / ORGANIZATIONS
              </CardTitle>
              {showCreateButton && (
                <Button
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Briefcase className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="text"
                placeholder="Buscar por nombre o territorio..."
                value={searchJob}
                onChange={(e) => setSearchJob(e.target.value)}
                className="pl-8 text-xs bg-neutral-800 border-neutral-600"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 bg-neutral-800 border border-neutral-700 rounded hover:border-orange-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: job.color }}
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white group-hover:text-orange-400">
                          {job.name}
                        </h3>
                        <p className="text-xs text-neutral-500">{job.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          job.status === "active"
                            ? "border-green-500/30 text-green-400"
                            : "border-red-500/30 text-red-400"
                        }`}
                      >
                        {job.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditJob(job)}
                        className="h-6 w-6 p-0 text-neutral-400 hover:text-orange-400"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setConfirmDialog({
                            isOpen: true,
                            title: "Eliminar Job",
                            description: `¿Estás seguro de que quieres eliminar "${job.name}"? Esta acción no se puede deshacer.`,
                            onConfirm: () => handleDeleteJob(job.id),
                            isDangerous: true,
                          })
                        }
                        className="h-6 w-6 p-0 text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span>{job.members} members</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span>Level {job.level}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${getTreasuryColor(job.treasury)}`}>
                      <DollarSign className="w-3 h-3" />
                      <span>${(job.treasury / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      <span>{job.territory}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full bg-neutral-700 rounded h-1.5">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-yellow-500 h-1.5 rounded"
                      style={{ width: `${(job.level / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GANGS TAB */}
      {(showTabs ? selectedTab === "gangs" : viewMode !== "jobs-only") && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                GANGS / FACTIONS
              </CardTitle>
              {showCreateButton && (
                <Button
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 h-8"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Create
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Users className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                type="text"
                placeholder="Buscar por nombre, líder o territorio..."
                value={searchGang}
                onChange={(e) => setSearchGang(e.target.value)}
                className="pl-8 text-xs bg-neutral-800 border-neutral-600"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {filteredGangs.map((gang) => (
                <div
                  key={gang.id}
                  className={`p-3 border rounded transition-all group ${
                    gang.status === "active"
                      ? "bg-neutral-800 border-neutral-700 hover:border-orange-500/50"
                      : "bg-neutral-800/50 border-neutral-700/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: gang.color }}
                      />
                      <div className="flex-1">
                        <h3 className={`text-sm font-semibold ${gang.status === "active" ? "text-white group-hover:text-orange-400" : "text-neutral-500"}`}>
                          {gang.name}
                        </h3>
                        <p className="text-xs text-neutral-500">{gang.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          gang.status === "active"
                            ? "border-green-500/30 text-green-400"
                            : "border-red-500/30 text-red-400"
                        }`}
                      >
                        {gang.status === "active" ? "Active" : "Defeated"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditGang(gang)}
                        className="h-6 w-6 p-0 text-neutral-400 hover:text-orange-400"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setConfirmDialog({
                            isOpen: true,
                            title: "Eliminar Gang",
                            description: `¿Estás seguro de que quieres eliminar "${gang.name}"? Esta acción no se puede deshacer.`,
                            onConfirm: () => handleDeleteGang(gang.id),
                            isDangerous: true,
                          })
                        }
                        className="h-6 w-6 p-0 text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Target className="w-3 h-3 text-orange-500" />
                      <span>Leader: {gang.leader}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span>{gang.members} members</span>
                    </div>
                    <div className={`flex items-center gap-1 ${getReputationColor(gang.reputation)}`}>
                      <TrendingUp className="w-3 h-3" />
                      <span>{gang.reputation.toLocaleString()} rep</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      <span>{gang.territory}</span>
                    </div>
                  </div>

                  {/* Reputation Bar */}
                  <div className="w-full bg-neutral-700 rounded h-1.5">
                    <div
                      className="bg-gradient-to-r from-red-500 to-yellow-500 h-1.5 rounded"
                      style={{ width: `${Math.min((gang.reputation / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <JobModal
        isOpen={showJobModal}
        onClose={() => {
          setShowJobModal(false)
          setEditingJob(null)
        }}
        onSubmit={handleJobModalSubmit}
        initialData={editingJob || undefined}
        isEditing={!!editingJob}
      />

      <GangModal
        isOpen={showGangModal}
        onClose={() => {
          setShowGangModal(false)
          setEditingGang(null)
        }}
        onSubmit={handleGangModalSubmit}
        initialData={editingGang || undefined}
        isEditing={!!editingGang}
      />

      <MemberManagementModal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false)
          setSelectedJobForMembers(null)
          setSelectedGangForMembers(null)
        }}
        title={selectedJobForMembers?.name || selectedGangForMembers?.name || ""}
        type={selectedJobForMembers ? "job" : "gang"}
        members={[]}
        onAddMember={() => {}}
        onRemoveMember={() => {}}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={confirmDialog.isDangerous}
        onConfirm={() => {
          confirmDialog.onConfirm()
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      <CreateJobGangModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateJobGangSubmit}
      />    </div>
  )
}