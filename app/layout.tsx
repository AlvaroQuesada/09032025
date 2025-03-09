import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "sonner"
import { QuickShippingButtonWrapper } from "@/components/quick-shipping-button-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Llama Express Perú",
  description: "Servicios de envío y logística en Perú",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" />
          <NavBar />
          <div className="flex flex-1 pt-16 md:pt-12">
            <Sidebar />
            <main className="flex-1 p-3 md:p-6 overflow-y-auto w-full lg:ml-64">{children}</main>
          </div>
          <QuickShippingButtonWrapper />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'