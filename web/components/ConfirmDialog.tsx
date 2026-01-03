"use client"

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center pointer-events-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {isDangerous ? (
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h2 className={`text-lg font-bold ${isDangerous ? "text-red-400" : "text-white"}`}>
              {title}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onCancel}
            variant="outline"
            className="text-neutral-300 border-neutral-600 hover:bg-neutral-800"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={
              isDangerous
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
