"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Upload, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  onImageAdd: (imageUrl: string) => void
}

export function ImageModal({ isOpen, onClose, onImageAdd }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pasteAreaRef = useRef<HTMLDivElement>(null)

  const handleImageFile = useCallback((file: File) => {
    setIsLoading(true)
    setError("")

    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setPreviewUrl(url)
      setImageUrl(url)
      setIsLoading(false)
    }
    reader.onerror = () => {
      setError("Error al leer la imagen")
      setIsLoading(false)
    }
    reader.readAsDataURL(file)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setImageUrl("")
      setPreviewUrl("")
      setError("")
      return
    }

    // Manejar pegado global de imágenes con Ctrl+V cuando el modal está abierto
    const handleWindowPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          e.preventDefault()
          const file = items[i].getAsFile()
          if (file) {
            handleImageFile(file)
          }
          return
        }
      }
    }

    window.addEventListener("paste", handleWindowPaste)
    return () => window.removeEventListener("paste", handleWindowPaste)
  }, [isOpen, handleImageFile])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    setError("")

    if (url.trim()) {
      // Validar que sea una URL
      try {
        new URL(url)
        // Precargar la imagen para verificar que exista
        const img = new Image()
        img.onload = () => {
          setPreviewUrl(url)
        }
        img.onerror = () => {
          setPreviewUrl("")
          setError("No se pudo cargar la imagen desde esa URL")
        }
        img.src = url
      } catch {
        setError("URL inválida")
        setPreviewUrl("")
      }
    } else {
      setPreviewUrl("")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageFile(file)
    }
  }

  const handleAdd = () => {
    if (!imageUrl.trim()) {
      setError("Por favor ingresa una URL o selecciona una imagen")
      return
    }

    if (!previewUrl) {
      setError("La imagen no se pudo cargar correctamente")
      return
    }

    onImageAdd(imageUrl)
    setImageUrl("")
    setPreviewUrl("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full p-6 shadow-xl pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Agregar Imagen</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Input */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-neutral-300">URL de la imagen</label>
          <Input
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imageUrl}
            onChange={handleUrlChange}
            className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500"
          />
        </div>

        {/* Or Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-neutral-900 text-neutral-400">O</span>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-neutral-300">Subir archivo o pegar (Ctrl+V)</label>
          <div
            ref={pasteAreaRef}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const file = e.dataTransfer.files?.[0]
              if (file && file.type.startsWith("image/")) {
                handleImageFile(file)
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-600 rounded-lg p-6 cursor-pointer hover:border-orange-500 hover:bg-orange-500/5 transition-colors flex flex-col items-center justify-center"
            tabIndex={0}
          >
            <Upload className="w-6 h-6 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-300 text-center">
              Haz clic para seleccionar una imagen
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              O pega una imagen con Ctrl+V
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4">
            <p className="text-sm text-neutral-300 mb-2">Vista previa:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full rounded-lg max-h-48 object-contain bg-neutral-800 border border-neutral-700"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-neutral-600 text-neutral-300 hover:text-white pointer-events-auto"
            type="button"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!previewUrl || isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
            type="button"
          >
            {isLoading ? "Cargando..." : "Agregar Imagen"}
          </Button>
        </div>
      </div>
    </div>
  )
}
