import type { ShippingAddress, OrderItem, ShippingCalculation, Order, Shipment, User } from "./types"
import { supabase } from "@/lib/supabase"

// Define OrderStatus type
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

// Define ShipmentStatus type
export type ShipmentStatus = "scheduled" | "in_transit" | "delivered" | "delayed" | "cancelled"

export interface ShippingConfirmation {
  trackingNumber: string
  orderNumber: string
  totalAmount: number
  pickupAddress: string
  deliveryAddress: string
  packageDetails: {
    type: string
    weight: string
    description?: string
  }
  estimatedDelivery: string
}

export async function calculateShipping(
  origin: ShippingAddress,
  destination: ShippingAddress,
  items: OrderItem[],
): Promise<ShippingCalculation> {
  // Existing calculation logic...
  const totalWeight = items.reduce((sum, item) => {
    return sum + (item.weight || 0) * item.quantity
  }, 0)

  const baseRate = 10.0
  const weightCharge = totalWeight * 2
  const distanceCharge = origin.city === destination.city ? 5 : 15
  const total = baseRate + weightCharge + distanceCharge

  const availableServices = [
    {
      id: "standard",
      name: "Envío Estándar",
      description: "Entrega en 3-5 días hábiles",
      price: total,
      estimated_days: 5,
      carrier: "Llama Express",
    },
    {
      id: "express",
      name: "Envío Express",
      description: "Entrega en 1-2 días hábiles",
      price: total * 1.5,
      estimated_days: 2,
      carrier: "Llama Express",
    },
    {
      id: "same_day",
      name: "Entrega el Mismo Día",
      description: "Entrega garantizada hoy mismo",
      price: total * 2,
      estimated_days: 0,
      carrier: "Llama Express",
    },
  ]

  return {
    base_rate: baseRate,
    weight_charge: weightCharge,
    distance_charge: distanceCharge,
    total: total,
    available_services: availableServices,
  }
}

export async function getUserByAuthId(authId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("auth_id", authId).single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function generateShippingConfirmation(orderId: string): Promise<ShippingConfirmation> {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        shipments (
          *,
          routes (*)
        )
      `)
      .eq("id", orderId)
      .single()

    if (error) throw error

    // Generar número de guía único
    const trackingNumber = `LL${Date.now().toString().slice(-8)}PE`

    // TODO: Implement calculateTotalAmount and calculateEstimatedDelivery
    const calculateTotalAmount = (order: any) => 100
    const calculateEstimatedDelivery = (shipment: any) => "2024-12-25"

    return {
      trackingNumber,
      orderNumber: `ORD-${order.id}`,
      totalAmount: calculateTotalAmount(order),
      pickupAddress: JSON.parse(order.pickup_address).street,
      deliveryAddress: JSON.parse(order.delivery_address).street,
      packageDetails: {
        type: order.package_type,
        weight: order.weight,
        description: order.description,
      },
      estimatedDelivery: calculateEstimatedDelivery(order.shipments[0]),
    }
  } catch (error) {
    console.error("Error generating shipping confirmation:", error)
    throw error
  }
}

export async function createOrder(
  authUserId: string,
  items: OrderItem[],
  pickup: ShippingAddress,
  delivery: ShippingAddress,
  requireInvoice: boolean,
): Promise<{ order: Order; confirmation: ShippingConfirmation }> {
  try {
    const user = await getUserByAuthId(authUserId)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    const orderData = {
      customer_id: user.id,
      status: "pending",
      pickup_address: JSON.stringify(pickup),
      delivery_address: JSON.stringify(delivery),
      require_invoice: requireInvoice,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("orders").insert(orderData).select().single()

    if (error) throw error
    if (!data) throw new Error("No se devolvieron datos después de insertar la orden")

    const confirmation = await generateShippingConfirmation(data.id)

    return {
      order: data,
      confirmation,
    }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function createShipment(
  orderId: string,
  driverId: string | null,
  vehicleId: string | null,
  routeId: string | null,
  startTime: string,
): Promise<Shipment> {
  try {
    const { data, error } = await supabase
      .from("shipments")
      .insert({
        order_id: orderId,
        driver_id: driverId,
        vehicle_id: vehicleId,
        route_id: routeId,
        start_time: startTime,
        status: "scheduled",
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      throw new Error("No se devolvieron datos después de insertar el envío")
    }

    return data[0]
  } catch (error) {
    console.error("Error creating shipment:", error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()

  if (error) throw error
  return data[0]
}

export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  endTime?: string,
): Promise<Shipment> {
  const updateData: Partial<Shipment> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (endTime) {
    updateData.end_time = endTime
  }

  const { data, error } = await supabase.from("shipments").update(updateData).eq("id", shipmentId).select()

  if (error) throw error
  return data[0]
}

export async function getOrderDetails(orderId: string): Promise<{ order: Order; confirmation: ShippingConfirmation }> {
  try {
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError) throw orderError
    if (!order) throw new Error("Orden no encontrada")

    const confirmation = await generateShippingConfirmation(orderId)

    return { order, confirmation }
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

