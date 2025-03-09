"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, MapPin, Clock } from "lucide-react"
import type { TrackingDetails } from "@/lib/types"
import { getTrackingDetails, subscribeToTrackingUpdates } from "@/lib/tracking"

interface TrackingDetailsProps {
  trackingNumber: string
}

export function TrackingDetails({ trackingNumber }: TrackingDetailsProps) {
  const [details, setDetails] = useState<TrackingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getTrackingDetails(trackingNumber)
        if (!data) {
          throw new Error("No se encontró información de seguimiento")
        }
        setDetails(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los detalles")
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()

    // Suscribirse a actualizaciones en tiempo real
    const unsubscribe = subscribeToTrackingUpdates(trackingNumber, (update) => {
      setDetails((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          status: update.status,
          lastUpdate: update.timestamp,
        }
      })
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

  if (error || !details) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">{error || "No se encontró información"}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Seguimiento de Envío #{trackingNumber}</span>
          <Badge variant={getStatusVariant(details.status)}>{getStatusText(details.status)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Información del envío */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>ID del Envío:</span>
            </div>
            <p className="font-medium">{details.shipmentId}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Última actualización:</span>
            </div>
            <p className="font-medium">{new Date(details.lastUpdate).toLocaleString("es-PE")}</p>
          </div>
        </div>

        {/* Información de la ruta */}
        {details.route && (
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Detalles de la Ruta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Origen:</span>
                </div>
                <p className="font-medium">{details.route.startLocation}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Destino:</span>
                </div>
                <p className="font-medium">{details.route.endLocation}</p>
              </div>
            </div>
            {details.estimatedDeliveryTime && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Entrega estimada:</span>
                </div>
                <p className="font-medium">{new Date(details.estimatedDeliveryTime).toLocaleString("es-PE")}</p>
              </div>
            )}
          </div>
        )}

        {/* Información del vehículo */}
        {details.vehicle && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5" />
              Vehículo
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Placa:</span>
                <p className="font-medium">{details.vehicle.plateNumber}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <p className="font-medium">{details.vehicle.vehicleType}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "success" {
  const variants: Record<string, "default" | "secondary" | "destructive" | "success"> = {
    pending: "secondary",
    processing: "default",
    picked_up: "default",
    in_transit: "default",
    out_for_delivery: "default",
    delivered: "success",
    cancelled: "destructive",
    failed_delivery: "destructive",
  }
  return variants[status] || "default"
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

