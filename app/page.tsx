"use client"

import { UrgentShipment } from "@/components/urgent-shipment"
import { TrackingConsult } from "@/components/tracking-consult"
import { PaymentMethods } from "@/components/payment-methods"
import { Suspense, lazy } from "react"

// Carga perezosa de componentes pesados
const LazyVirtualStore = lazy(() => import("@/components/virtual-store").then((mod) => ({ default: mod.VirtualStore })))

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="mx-auto mb-6 max-w-xs">
            <video
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young%20Man%20drive%20delivery%20truck-JRJZXiPJi7pl2N5zwSRBf3lpMtPZRK.mp4"
              className="w-full"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Young Man drive delivery truck"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Bienvenido a Llama Express Perú</h1>
        </div>
        <PaymentMethods />
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <UrgentShipment />
          <TrackingConsult />
        </div>
        <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>}>
          <LazyVirtualStore />
        </Suspense>
      </main>
    </div>
  )
}

