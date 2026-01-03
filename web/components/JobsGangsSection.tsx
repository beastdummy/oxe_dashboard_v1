"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, MapPin, DollarSign, Trophy, TrendingUp, Target } from "lucide-react"
import { Input } from "@/components/ui/input"

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

export function JobsGangsSection() {
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

  const filteredJobs = jobs.filter((job) =>
    job.name.toLowerCase().includes(searchJob.toLowerCase()) ||
    job.territory.toLowerCase().includes(searchJob.toLowerCase())
  )

  const filteredGangs = gangs.filter((gang) =>
    gang.name.toLowerCase().includes(searchGang.toLowerCase()) ||
    gang.leader.toLowerCase().includes(searchGang.toLowerCase()) ||
    gang.territory.toLowerCase().includes(searchGang.toLowerCase())
  )

  const getReputationColor = (reputation: number) => {
    if (reputation >= 9000) return "text-yellow-500"
    if (reputation >= 8000) return "text-orange-500"
    if (reputation >= 7000) return "text-blue-500"
    return "text-neutral-400"
  }

  const getTreasuryColor = (treasury: number) => {
    if (treasury >= 600000) return "text-green-500"
    if (treasury >= 400000) return "text-blue-500"
    return "text-orange-500"
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
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

      {/* JOBS TAB */}
      {selectedTab === "jobs" && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                JOBS / ORGANIZATIONS
              </CardTitle>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                {filteredJobs.length} Active
              </Badge>
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
                  className="p-3 bg-neutral-800 border border-neutral-700 rounded hover:border-orange-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: job.color }}
                      />
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-orange-400">
                          {job.name}
                        </h3>
                        <p className="text-xs text-neutral-500">{job.label}</p>
                      </div>
                    </div>
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
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs">
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
      {selectedTab === "gangs" && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                GANGS / FACTIONS
              </CardTitle>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                {gangs.filter((g) => g.status === "active").length} Active
              </Badge>
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
                  className={`p-3 border rounded hover:border-orange-500/50 cursor-pointer transition-all group ${
                    gang.status === "active"
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-neutral-800/50 border-neutral-700/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: gang.color }}
                      />
                      <div>
                        <h3 className={`text-sm font-semibold ${gang.status === "active" ? "text-white group-hover:text-orange-400" : "text-neutral-500"}`}>
                          {gang.name}
                        </h3>
                        <p className="text-xs text-neutral-500">{gang.label}</p>
                      </div>
                    </div>
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
    </div>
  )
}
