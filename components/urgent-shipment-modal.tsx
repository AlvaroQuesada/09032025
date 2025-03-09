"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, MapPin, Clock, ArrowRight, Truck, AlertCircle } from "lucide-react"
import { createOrder, createShipment } from "@/lib/shipping"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import type { ShippingAddress } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UrgentShipmentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { user } = useAuth()
  const [step, setStep] = useState("details")
  const [isLoading, setIsLoading] = useState(false)
  const [weightError, setWeightError] = useState(false)

  const [formData, setFormData] = useState({
    packageDetails: {
      type: "medium",
      weight: "10",
      description: "Documentos importantes y material de oficina",
      fragile: true,
    },
    pickup: {
      street: "Av. Javier Prado Este 4600",
      city: "Lima",
      state: "Lima",
      zipCode: "15023",
      country: "Perú",
      instructions: "Preguntar por María en recepción",
    } as ShippingAddress,
    delivery: {
      street: "Calle Los Negocios 230",
      city: "Arequipa",
      state: "Arequipa",
      zipCode: "04001",
      country: "Perú",
      instructions: "Dejar en seguridad si no hay nadie",
    } as ShippingAddress,
    schedule: {
      date: new Date(),
      timeSlot: "afternoon",
    },
  })

  useEffect(() => {
    const isValid = validateWeight(formData.packageDetails.type, Number(formData.packageDetails.weight))
    setWeightError(!isValid)
  }, [formData.packageDetails.type, formData.packageDetails.weight])

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un envío")
      return
    }

    setIsLoading(true)
    try {
      const items = [
        {
          id: "urgent-delivery",
          name: `Envío Urgente - ${formData.packageDetails.type}`,
          quantity: 1,
          price: calculatePrice(formData.packageDetails.type, Number(formData.packageDetails.weight)),
          weight: Number(formData.packageDetails.weight),
        },
      ]

      const order = await createOrder(user.id, items, formData.pickup, formData.delivery)

      await createShipment(order.id, null, null, null, new Date().toISOString())

      toast.success("¡Envío urgente creado con éxito!")
      onClose()
    } catch (error) {
      console.error("Error creating urgent shipment:", error)
      let errorMessage = "Error al crear el envío. Por favor intenta de nuevo."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePrice = (type: string, weight: number) => {
    const basePrice = {
      small: { price: 50, limit: 5 },
      medium: { price: 75, limit: 15 },
      large: { price: 100, limit: 30 },
    }[type] || { price: 50, limit: 5 }

    const weightCharge = weight * 2
    return basePrice.price + weightCharge
  }

  const validateWeight = (type: string, weight: number) => {
    const limits = {
      small: 5,
      medium: 15,
      large: 30,
    }
    return weight <= (limits[type as keyof typeof limits] || 30)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Solicitar Envío Urgente</DialogTitle>
        </DialogHeader>

        <Tabs value={step} onValueChange={setStep}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">
              <Package className="mr-2 h-4 w-4" />
              Detalles
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="mr-2 h-4 w-4" />
              Direcciones
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Clock className="mr-2 h-4 w-4" />
              Programación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Paquete</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.packageDetails.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packageDetails: { ...formData.packageDetails, type: e.target.value },
                    })
                  }
                >
                  <option value="small">Pequeño (hasta 5kg)</option>
                  <option value="medium">Mediano (hasta 15kg)</option>
                  <option value="large">Grande (hasta 30kg)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  value={formData.packageDetails.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packageDetails: { ...formData.packageDetails, weight: e.target.value },
                    })
                  }
                  placeholder="Ingrese el peso en kg"
                  className={weightError ? "border-red-500" : ""}
                />
                {weightError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>El peso excede el límite para el tipo de paquete seleccionado.</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label>Descripción del contenido</Label>
                <Input
                  value={formData.packageDetails.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      packageDetails: { ...formData.packageDetails, description: e.target.value },
                    })
                  }
                  placeholder="Describe el contenido del paquete"
                />
              </div>

              <Button onClick={() => setStep("addresses")} className="w-full" disabled={weightError}>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dirección de recojo */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <MapPin className="mr-2 h-4 w-4" /> Dirección de Recojo
                </h3>
                <Input
                  placeholder="Calle"
                  value={formData.pickup.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickup: { ...formData.pickup, street: e.target.value },
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Ciudad"
                    value={formData.pickup.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup: { ...formData.pickup, city: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="Departamento"
                    value={formData.pickup.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickup: { ...formData.pickup, state: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              {/* Dirección de entrega */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <Truck className="mr-2 h-4 w-4" /> Dirección de Entrega
                </h3>
                <Input
                  placeholder="Calle"
                  value={formData.delivery.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      delivery: { ...formData.delivery, street: e.target.value },
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Ciudad"
                    value={formData.delivery.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery: { ...formData.delivery, city: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="Departamento"
                    value={formData.delivery.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery: { ...formData.delivery, state: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Button onClick={() => setStep("schedule")} className="w-full">
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Horario de Recojo</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.schedule.timeSlot}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, timeSlot: e.target.value },
                    })
                  }
                >
                  <option value="morning">Mañana (9:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Tarde (2:00 PM - 6:00 PM)</option>
                  <option value="evening">Noche (6:00 PM - 9:00 PM)</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Resumen del Envío</h4>
                <p>
                  Precio estimado: S/{" "}
                  {calculatePrice(formData.packageDetails.type, Number(formData.packageDetails.weight)).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-2">El precio incluye recojo y entrega el mismo día</p>
                {weightError && (
                  <p className="text-red-500 mt-2">
                    Advertencia: El peso excede el límite para el tipo de paquete seleccionado.
                  </p>
                )}
              </div>

              <Button onClick={handleSubmit} className="w-full" disabled={isLoading || weightError}>
                {isLoading ? "Procesando..." : "Confirmar Envío Urgente"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

