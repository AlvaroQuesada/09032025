"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createOrder } from "@/lib/shipping"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import { Package, MapPin, Truck } from "lucide-react"
import type { ShippingAddress, ShippingConfirmation } from "@/lib/types"
import { ShippingConfirmationModal } from "@/components/shipping/shipping-confirmation-modal"
import { useRouter } from "next/navigation"

interface QuickShippingFormProps {
  onSuccess: () => void
}

export function QuickShippingForm({ onSuccess }: QuickShippingFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationDetails, setConfirmationDetails] = useState<ShippingConfirmation | null>(null)

  const [formData, setFormData] = useState({
    packageType: "small",
    weight: "",
    pickupAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Perú",
    } as ShippingAddress,
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Perú",
    } as ShippingAddress,
    instructions: "",
    serviceType: "standard",
    requireInvoice: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const items = [
        {
          id: "quick-shipping",
          name: `Paquete ${formData.packageType}`,
          quantity: 1,
          price: calculateBasePrice(formData.packageType),
          weight: Number.parseFloat(formData.weight),
        },
      ]

      const { order, confirmation } = await createOrder(
        user.id,
        items,
        formData.pickupAddress,
        formData.deliveryAddress,
        formData.requireInvoice,
      )

      setConfirmationDetails(confirmation)
      setShowConfirmation(true)
      toast.success("¡Envío creado con éxito!")

      // Redirigir a la página de guía de envío
      router.push(`/shipping-guide/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Error al crear el envío. Por favor intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateBasePrice = (packageType: string) => {
    const prices = {
      small: 15,
      medium: 25,
      large: 35,
      extra: 50,
    }
    return prices[packageType as keyof typeof prices] || 15
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles del Paquete */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Package className="h-5 w-5" />
              <h3>Detalles del Paquete</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageType">Tipo de Paquete</Label>
              <Select
                value={formData.packageType}
                onValueChange={(value) => setFormData({ ...formData, packageType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de paquete" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequeño (hasta 3kg)</SelectItem>
                  <SelectItem value="medium">Mediano (hasta 10kg)</SelectItem>
                  <SelectItem value="large">Grande (hasta 20kg)</SelectItem>
                  <SelectItem value="extra">Extra Grande (hasta 30kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Ingrese el peso en kg"
                step="0.1"
                min="0"
                max="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de Servicio</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Estándar (3-5 días)</SelectItem>
                  <SelectItem value="express">Express (1-2 días)</SelectItem>
                  <SelectItem value="same_day">Mismo Día</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Direcciones */}
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                <h3>Dirección de Recojo</h3>
              </div>
              <Input
                placeholder="Calle"
                value={formData.pickupAddress.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pickupAddress: { ...formData.pickupAddress, street: e.target.value },
                  })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Ciudad"
                  value={formData.pickupAddress.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupAddress: { ...formData.pickupAddress, city: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="Departamento"
                  value={formData.pickupAddress.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupAddress: { ...formData.pickupAddress, state: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Truck className="h-5 w-5" />
                <h3>Dirección de Entrega</h3>
              </div>
              <Input
                placeholder="Calle"
                value={formData.deliveryAddress.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryAddress: { ...formData.deliveryAddress, street: e.target.value },
                  })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Ciudad"
                  value={formData.deliveryAddress.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryAddress: { ...formData.deliveryAddress, city: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="Departamento"
                  value={formData.deliveryAddress.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryAddress: { ...formData.deliveryAddress, state: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Instrucciones Especiales</Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Instrucciones adicionales para el envío..."
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="requireInvoice"
            checked={formData.requireInvoice}
            onCheckedChange={(checked) => setFormData({ ...formData, requireInvoice: checked as boolean })}
          />
          <Label htmlFor="requireInvoice">Requiero factura</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando envío..." : "Crear Envío"}
          </Button>
        </div>
      </form>

      {showConfirmation && confirmationDetails && (
        <ShippingConfirmationModal
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false)
            onSuccess()
          }}
          orderDetails={confirmationDetails}
        />
      )}
    </>
  )
}

