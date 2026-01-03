import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono as GeistMono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/context/LanguageContext"
import { ModalsProvider } from "@/context/ModalsContext"
import { ActivityProvider } from "@/context/ActivityContext"
import { GlobalModals } from "@/components/GlobalModals"
import { DashboardLayout } from "@/components/DashboardLayout"

const geistMono = GeistMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tactical Operations Dashboard",
  description: "Tactical command and control system",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistMono.className} bg-black text-white antialiased`}>
        <ActivityProvider>
          <ModalsProvider>
            <DashboardLayout>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </DashboardLayout>
            <GlobalModals />
          </ModalsProvider>
        </ActivityProvider>
      </body>
    </html>
  )
}
