// lib/types.ts

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  instructions?: string
}

export interface ShippingRate {
  id: string
  name: string
  description: string
  price: number
  estimated_days: number
  carrier: string
}

export interface TrackingDetails {
  orderId: string
  shipmentId: string
  status: OrderStatus
  currentLocation?: {
    lat: number
    lng: number
  }
  estimatedDeliveryTime?: string
  lastUpdate: string
  route?: {
    startLocation: string
    endLocation: string
    estimatedDuration: string
  }
  vehicle?: {
    plateNumber: string
    vehicleType: string
  }
  driver?: {
    name: string
    phoneNumber: string
  }
}

export interface TrackingUpdate {
  timestamp: string
  status: OrderStatus
  location?: string
  description: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  weight?: number
}

export interface ShippingCalculation {
  base_rate: number
  weight_charge: number
  distance_charge: number
  total: number
  available_services: ShippingRate[]
}

export interface Order {
  id: string
  customer_id: string
  status: OrderStatus
  pickup_address: string
  delivery_address: string
  require_invoice: boolean
  created_at: string
  updated_at: string
}

export interface Shipment {
  id: string
  order_id: string
  driver_id: string | null
  vehicle_id: string | null
  route_id: string | null
  start_time: string
  end_time?: string
  status: ShipmentStatus
  current_location?: { lat: number; lng: number }
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  auth_id: string
  email: string
  full_name: string
  role: UserRole
  phone_number: string
}

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

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type ShipmentStatus = "scheduled" | "in_transit" | "delivered" | "delayed" | "cancelled"

export type UserRole = "customer" | "admin" | "driver"

