"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DollarSign, Briefcase, Users, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react"
import { JobsGangsSection } from "@/components/JobsGangsSection"

export default function OperationsPage() {
  const [selectedEntity, setSelectedEntity] = useState<"gang1" | "gang2" | "job1" | null>("gang1")
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly")

  // Mock data - in a real app, this would come from props or API
  const jobsStats = {
    total: 23,
    active: 8,
    inactive: 15,
  }

  const gangsStats = {
    total: 4,
    active: 3,
    defeated: 1,
  }

  // Mock entities for selection
  const entities = [
    { id: "gang1", name: "Shadow Cartel", type: "gang" },
    { id: "gang2", name: "Iron Brotherhood", type: "gang" },
    { id: "job1", name: "Police Department", type: "job" },
  ]

  // Weekly income/expense data
  const weeklyData = [
    { name: "Mon", income: 45000, expense: 12000 },
    { name: "Tue", income: 52000, expense: 15000 },
    { name: "Wed", income: 38000, expense: 10000 },
    { name: "Thu", income: 61000, expense: 18000 },
    { name: "Fri", income: 55000, expense: 14000 },
    { name: "Sat", income: 72000, expense: 20000 },
    { name: "Sun", income: 48000, expense: 11000 },
  ]

  // Monthly income/expense data
  const monthlyData = [
    { name: "Week 1", income: 232000, expense: 60000 },
    { name: "Week 2", income: 248000, expense: 65000 },
    { name: "Week 3", income: 256000, expense: 68000 },
    { name: "Week 4", income: 268000, expense: 70000 },
  ]

  // Mock data for jobs
  const jobsData = [
    { name: "Active", value: jobsStats.active },
    { name: "Inactive", value: jobsStats.inactive },
  ]

  // Mock data for gangs
  const gangsData = [
    { name: "Active", value: gangsStats.active },
    { name: "Defeated", value: gangsStats.defeated },
  ]

  // Mock data for gangs with earnings
  const gangsScoreboard = [
    { id: 1, name: "Shadow Cartel", members: 15, money: 125000, territory: "North District", reputation: 85 },
    { id: 2, name: "Iron Brotherhood", members: 22, money: 189500, territory: "Downtown", reputation: 92 },
    { id: 3, name: "Crimson Syndicate", members: 18, money: 145600, territory: "East Side", reputation: 78 },
    { id: 4, name: "Black Market Crew", members: 11, money: 98700, territory: "Port Area", reputation: 65 },
  ]

  // Chart colors
  const COLORS = ["#10b981", "#ef4444"]
  const gangColors = ["#8b5cf6", "#ec4899", "#f43f5e", "#06b6d4"]

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

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Jobs Cards */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL JOBS</p>
                <p className="text-2xl font-bold text-white font-mono">{jobsStats.total}</p>
              </div>
              <Briefcase className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">JOBS ACTIVOS</p>
                <p className="text-2xl font-bold text-green-500 font-mono">{jobsStats.active}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">JOBS INACTIVOS</p>
                <p className="text-2xl font-bold text-red-500 font-mono">{jobsStats.inactive}</p>
              </div>
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        {/* Gangs Cards */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL GANGS</p>
                <p className="text-2xl font-bold text-white font-mono">{gangsStats.total}</p>
              </div>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">GANGS ACTIVAS</p>
                <p className="text-2xl font-bold text-green-500 font-mono">{gangsStats.active}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">GANGS DERROTADAS</p>
                <p className="text-2xl font-bold text-red-500 font-mono">{gangsStats.defeated}</p>
              </div>
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
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

        {/* Gangs Status Chart */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white tracking-wider">GANGS STATUS</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gangsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gangsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} gangs`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Activity Chart */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-sm font-bold text-white tracking-wider">FINANCIAL ACTIVITY</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setTimeRange("weekly")}
                variant={timeRange === "weekly" ? "default" : "outline"}
                className={`text-xs ${
                  timeRange === "weekly"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "border-neutral-600 text-neutral-400 hover:bg-neutral-800"
                }`}
              >
                Weekly
              </Button>
              <Button
                size="sm"
                onClick={() => setTimeRange("monthly")}
                variant={timeRange === "monthly" ? "default" : "outline"}
                className={`text-xs ${
                  timeRange === "monthly"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "border-neutral-600 text-neutral-400 hover:bg-neutral-800"
                }`}
              >
                Monthly
              </Button>
            </div>
          </div>

          {/* Entity Selection */}
          <div className="flex gap-2 flex-wrap">
            {entities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntity(entity.id as any)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedEntity === entity.id
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                {entity.type === "gang" ? (
                  <Users className="w-3 h-3 inline mr-1" />
                ) : (
                  <Briefcase className="w-3 h-3 inline mr-1" />
                )}
                {entity.name}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeRange === "weekly" ? weeklyData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="name" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #404040" }}
                formatter={(value) => [
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(value as number),
                ]}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-neutral-800 p-3 rounded">
              <p className="text-xs text-neutral-400 mb-1">Total Income</p>
              <p className="text-lg font-bold text-green-500">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(
                  (timeRange === "weekly" ? weeklyData : monthlyData).reduce(
                    (acc, d) => acc + d.income,
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-neutral-800 p-3 rounded">
              <p className="text-xs text-neutral-400 mb-1">Total Expenses</p>
              <p className="text-lg font-bold text-red-500">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(
                  (timeRange === "weekly" ? weeklyData : monthlyData).reduce(
                    (acc, d) => acc + d.expense,
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-neutral-800 p-3 rounded">
              <p className="text-xs text-neutral-400 mb-1">Net Profit</p>
              <p className="text-lg font-bold text-blue-500">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(
                  (timeRange === "weekly" ? weeklyData : monthlyData).reduce(
                    (acc, d) => acc + d.income - d.expense,
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-neutral-800 p-3 rounded">
              <p className="text-xs text-neutral-400 mb-1">Profit Margin</p>
              <p className="text-lg font-bold text-purple-500">
                {(
                  ((timeRange === "weekly" ? weeklyData : monthlyData).reduce(
                    (acc, d) => acc + d.income - d.expense,
                    0
                  ) /
                    (timeRange === "weekly" ? weeklyData : monthlyData).reduce(
                      (acc, d) => acc + d.income,
                      0
                    )) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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

