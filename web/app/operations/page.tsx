"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DollarSign, Briefcase, Users } from "lucide-react"
import { JobsGangsSection } from "@/components/JobsGangsSection"

export default function OperationsPage() {
  // Mock data for jobs
  const jobsData = [
    { name: "Active", value: 8 },
    { name: "Completed", value: 12 },
    { name: "Failed", value: 3 },
  ]

  // Mock data for gangs with earnings
  const gangsScoreboard = [
    { id: 1, name: "Shadow Cartel", members: 15, money: 125000, territory: "North District", reputation: 85 },
    { id: 2, name: "Iron Brotherhood", members: 22, money: 189500, territory: "Downtown", reputation: 92 },
    { id: 3, name: "Crimson Syndicate", members: 18, money: 145600, territory: "East Side", reputation: 78 },
    { id: 4, name: "Black Market Crew", members: 11, money: 98700, territory: "Port Area", reputation: 65 },
  ]

  // Chart colors
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"]
  const gangColors = ["#8b5cf6", "#ec4899", "#f43f5e", "#06b6d4"]

  // Data for bar chart
  const activityData = [
    { name: "Mon", jobs: 4, gangs: 6 },
    { name: "Tue", jobs: 3, gangs: 8 },
    { name: "Wed", jobs: 5, gangs: 5 },
    { name: "Thu", jobs: 6, gangs: 7 },
    { name: "Fri", jobs: 4, gangs: 9 },
    { name: "Sat", jobs: 7, gangs: 4 },
    { name: "Sun", jobs: 2, gangs: 6 },
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider">OPERATIONS CENTER</h1>
        <p className="text-sm text-neutral-400">Mission planning and job/gang creation</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs Status Chart */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white tracking-wider">JOBS STATUS</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={jobsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} jobs`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white tracking-wider">WEEKLY ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #404040" }} />
                <Legend />
                <Bar dataKey="jobs" fill="#10b981" name="Jobs" />
                <Bar dataKey="gangs" fill="#8b5cf6" name="Gangs" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gangs Scoreboard */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-white tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            GANGS EARNINGS SCOREBOARD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-neutral-400 tracking-wider">GANG NAME</th>
                  <th className="text-left py-3 px-4 text-neutral-400 tracking-wider">MEMBERS</th>
                  <th className="text-left py-3 px-4 text-neutral-400 tracking-wider">TERRITORY</th>
                  <th className="text-left py-3 px-4 text-neutral-400 tracking-wider">REPUTATION</th>
                  <th className="text-right py-3 px-4 text-neutral-400 tracking-wider">TOTAL EARNINGS</th>
                </tr>
              </thead>
              <tbody>
                {gangsScoreboard.map((gang, index) => (
                  <tr key={gang.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: gangColors[index % gangColors.length] }}
                        ></div>
                        <span className="text-white font-medium">{gang.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {gang.members}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">{gang.territory}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-neutral-800 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${gang.reputation}%` }}
                          ></div>
                        </div>
                        <span className="text-yellow-500 font-mono text-xs">{gang.reputation}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-green-400 font-mono font-semibold">{formatCurrency(gang.money)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* JOBS & GANGS SECTION */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white tracking-wider">CREATE & MANAGE</h2>
          <p className="text-xs text-neutral-500">Create new jobs and gangs</p>
        </div>
        <JobsGangsSection />
      </div>
    </div>
  )
}

