import { supabase } from "@/lib/supabase"
import type { TrackingDetails, TrackingUpdate } from "./types"

export async function getTrackingDetails(trackingNumber: string): Promise<TrackingDetails | null> {
  try {
    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        shipments (
          *,
          routes (*),
          vehicles (*)
        )
      `)
      .eq("id", trackingNumber)
      .single()

    if (orderError) throw orderError
    if (!order) return null

    const shipment = order.shipments[0]
    if (!shipment) return null

    // Transform the data into TrackingDetails format
    const trackingDetails: TrackingDetails = {
      orderId: order.id,
      shipmentId: shipment.id,
      status: order.status,
      currentLocation: shipment.current_location,
      estimatedDeliveryTime: calculateEstimatedDelivery(shipment),
      lastUpdate: shipment.updated_at,
      route: {
        startLocation: shipment.routes.start_location,
        endLocation: shipment.routes.end_location,
        estimatedDuration: shipment.routes.estimated_duration,
      },
      vehicle: {
        plateNumber: shipment.vehicles.plate_number,
        vehicleType: shipment.vehicles.vehicle_type,
      },
    }

    return trackingDetails
  } catch (error) {
    console.error("Error fetching tracking details:", error)
    return null
  }
}

export async function getTrackingUpdates(trackingNumber: string): Promise<TrackingUpdate[]> {
  try {
    const { data, error } = await supabase
      .from("tracking_updates")
      .select("*")
      .eq("order_id", trackingNumber)
      .order("timestamp", { ascending: false })

    if (error) throw error

    return data.map((update) => ({
      timestamp: update.timestamp,
      status: update.status,
      location: update.location,
      description: update.description,
    }))
  } catch (error) {
    console.error("Error fetching tracking updates:", error)
    return []
  }
}

function calculateEstimatedDelivery(shipment: any): string {
  if (!shipment.start_time || !shipment.routes?.estimated_duration) {
    return ""
  }

  const startTime = new Date(shipment.start_time)
  const duration = parseDuration(shipment.routes.estimated_duration)
  const estimatedDelivery = new Date(startTime.getTime() + duration)

  return estimatedDelivery.toISOString()
}

function parseDuration(duration: string): number {
  // Parse PostgreSQL interval to milliseconds
  const matches = duration.match(/(\d+):(\d+):(\d+)/)
  if (!matches) return 0

  const [_, hours, minutes, seconds] = matches
  return Number.parseInt(hours) * 3600000 + Number.parseInt(minutes) * 60000 + Number.parseInt(seconds) * 1000
}

// Función para suscribirse a actualizaciones en tiempo real
export function subscribeToTrackingUpdates(trackingNumber: string, onUpdate: (update: TrackingUpdate) => void) {
  const subscription = supabase
    .channel(`tracking-${trackingNumber}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "tracking_updates",
        filter: `order_id=eq.${trackingNumber}`,
      },
      (payload) => {
        const update: TrackingUpdate = {
          timestamp: payload.new.timestamp,
          status: payload.new.status,
          location: payload.new.location,
          description: payload.new.description,
        }
        onUpdate(update)
      },
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

