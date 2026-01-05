"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CreateJobGangModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  forceType?: "job" | "gang"
}

const COLOR_OPTIONS = [
  { value: "red", label: "Red", bg: "bg-red-500" },
  { value: "blue", label: "Blue", bg: "bg-blue-500" },
  { value: "green", label: "Green", bg: "bg-green-500" },
  { value: "yellow", label: "Yellow", bg: "bg-yellow-500" },
  { value: "purple", label: "Purple", bg: "bg-purple-500" },
  { value: "pink", label: "Pink", bg: "bg-pink-500" },
  { value: "orange", label: "Orange", bg: "bg-orange-500" },
  { value: "cyan", label: "Cyan", bg: "bg-cyan-500" },
]

export function CreateJobGangModal({ isOpen, onClose, onSubmit, forceType }: CreateJobGangModalProps) {
  const [entityType, setEntityType] = useState<"job" | "gang">(forceType || "job")
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    territory: "",
    color: "red",
    status: "active",
    description: "",
    // Job specific
    paymentRate: "",
    // Gang specific
    leader: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }))
  }

  const handleStatusChange = () => {
    if (entityType === "job") {
      setFormData((prev) => ({
        ...prev,
        status: prev.status === "active" ? "inactive" : "active",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        status: prev.status === "active" ? "defeated" : "active",
      }))
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.label || !formData.territory) {
      alert("Please fill in all required fields")
      return
    }

    const submitData = {
      type: entityType,
      ...formData,
      id: `${entityType}_${Date.now()}`,
    }

    onSubmit(submitData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: "",
      label: "",
      territory: "",
      color: "red",
      status: "active",
      description: "",
      paymentRate: "",
      leader: "",
    })
    setEntityType("job")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-neutral-900 border-neutral-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold tracking-wider">CREATE NEW {entityType.toUpperCase()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Entity Type Selection - Only show if not forced */}
          {!forceType && (
            <div className="flex gap-2 border-b border-neutral-700 pb-4">
              <button
                onClick={() => setEntityType("job")}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  entityType === "job"
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Job
              </button>
              <button
                onClick={() => setEntityType("gang")}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  entityType === "gang"
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                <Users className="w-4 h-4" />
                Gang
              </button>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-1 block">NAME *</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={entityType === "job" ? "e.g., Police Department" : "e.g., Ballas"}
                className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
              />
            </div>

            {/* Label */}
            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-1 block">LABEL *</label>
              <Input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                placeholder="Display label"
                className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
              />
            </div>

            {/* Territory */}
            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-1 block">TERRITORY *</label>
              <Input
                type="text"
                name="territory"
                value={formData.territory}
                onChange={handleInputChange}
                placeholder={entityType === "job" ? "e.g., Downtown" : "e.g., South District"}
                className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
              />
            </div>

            {/* Job Specific Fields */}
            {entityType === "job" && (
              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-1 block">PAYMENT RATE</label>
                <Input
                  type="text"
                  name="paymentRate"
                  value={formData.paymentRate}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                />
              </div>
            )}

            {/* Gang Specific Fields */}
            {entityType === "gang" && (
              <div>
                <label className="text-xs text-neutral-400 tracking-wider mb-1 block">LEADER</label>
                <Input
                  type="text"
                  name="leader"
                  value={formData.leader}
                  onChange={handleInputChange}
                  placeholder="Gang leader name"
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-1 block">DESCRIPTION</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description..."
                rows={3}
                className="w-full bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 p-2 text-sm resize-none"
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-xs text-neutral-400 tracking-wider mb-2 block">COLOR</label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    className={`p-3 rounded border-2 transition-all ${
                      formData.color === color.value
                        ? `${color.bg} border-white`
                        : `${color.bg} border-transparent opacity-60 hover:opacity-80`
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between bg-neutral-800 p-3 rounded">
              <label className="text-xs text-neutral-400 tracking-wider">STATUS</label>
              <button
                onClick={handleStatusChange}
                className="px-3 py-1 rounded text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: formData.status === "active" ? "#10b981" : "#ef4444",
                  color: "white",
                }}
              >
                {formData.status === "active"
                  ? entityType === "job"
                    ? "Active"
                    : "Activa"
                  : entityType === "job"
                    ? "Inactive"
                    : "Derrotada"}
              </button>
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-neutral-400 tracking-wider">PREVIEW</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: COLOR_OPTIONS.find((c) => c.value === formData.color)?.value,
                  }}
                ></div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{formData.name || "Name"}</p>
                  <p className="text-xs text-neutral-400">{formData.label || "Label"}</p>
                </div>
                <Badge className={formData.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                  {formData.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white">
            Create {entityType === "job" ? "Job" : "Gang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
