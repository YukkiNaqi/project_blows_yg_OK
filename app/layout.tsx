import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import RootLayoutClient from "./layout-client"
import "./globals.css"

export const metadata: Metadata = {
  title: "BLOWS - Basic Layer Operating Widget System",
  description:
    "Penyedia peralatan jaringan dan layanan IT terpercaya di Jakarta Timur. Router, Switch, Kabel LAN, dan jasa instalasi jaringan profesional.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RootLayoutClient>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
        {children}
      </Suspense>
    </RootLayoutClient>
  )
}
