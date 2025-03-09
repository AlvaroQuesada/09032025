"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, MapPin, CheckCircle2 } from "lucide-react"
import type { TrackingUpdate } from "@/lib/types"
import { getTrackingUpdates, subscribeToTrackingUpdates } from "@/lib/tracking"

interface TrackingTimelineProps {
  trackingNumber: string
}

export function TrackingTimeline({ trackingNumber }: TrackingTimelineProps) {
  const [updates, setUpdates] = useState<TrackingUpdate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUpdates() {
      const data = await getTrackingUpdates(trackingNumber)
      setUpdates(data)
      setLoading(false)
    }

    fetchUpdates()

    // Suscribirse a nuevas actualizaciones
    const unsubscribe = subscribeToTrackingUpdates(trackingNumber, (update) => {
      setUpdates((prev) => [update, ...prev])
    })

    return () => {
      unsubscribe()
    }
  }, [trackingNumber])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Seguimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Línea vertical de la línea de tiempo */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Actualizaciones */}
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={index} className="relative flex gap-4 pb-6">
                {/* Icono del estado */}
                <div className="absolute left-0 rounded-full bg-white p-1">{getStatusIcon(update.status)}</div>

                {/* Contenido de la actualización */}
                <div className="ml-12">
                  <p className="font-medium">{getStatusText(update.status)}</p>
                  <p className="text-sm text-muted-foreground">{new Date(update.timestamp).toLocaleString("es-PE")}</p>
                  {update.location && (
                    <p className="text-sm text-muted-foreground mt-1">Ubicación: {update.location}</p>
                  )}
                  {update.description && <p className="text-sm mt-1">{update.description}</p>}
                </div>
              </div>
            ))}

            {updates.length === 0 && (
              <p className="text-center text-muted-foreground">No hay actualizaciones disponibles</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusIcon(status: string) {
  const iconProps = { className: "h-6 w-6" }
  switch (status) {
    case "pending":
      return <Package {...iconProps} className="text-gray-400" />
    case "picked_up":
      return <Truck {...iconProps} className="text-blue-500" />
    case "in_transit":
      return <Truck {...iconProps} className="text-blue-500" />
    case "out_for_delivery":
      return <MapPin {...iconProps} className="text-green-500" />
    case "delivered":
      return <CheckCircle2 {...iconProps} className="text-green-500" />
    default:
      return <Package {...iconProps} className="text-gray-400" />
  }
}

function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    pending: "Pendiente",
    processing: "Procesando",
    picked_up: "Recogido",
    in_transit: "En Tránsito",
    out_for_delivery: "En Reparto",
    delivered: "Entregado",
    cancelled: "Cancelado",
    failed_delivery: "Entrega Fallida",
  }
  return statusTexts[status] || status
}

