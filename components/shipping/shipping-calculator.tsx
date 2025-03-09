"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ShippingAddress, ShippingRate } from "@/lib/types"
import { calculateShipping } from "@/lib/shipping"

interface OrderItem {
  id: string
  quantity: number
  price: number
}

interface ShippingCalculatorProps {
  items: OrderItem[]
  onShippingMethodSelect: (rate: ShippingRate) => void
}

export function ShippingCalculator({ items, onShippingMethodSelect }: ShippingCalculatorProps) {
  const [origin, setOrigin] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Perú",
  })

  const [destination, setDestination] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Perú",
  })

  const [rates, setRates] = useState<ShippingRate[]>([])
  const [selectedRate, setSelectedRate] = useState<string>("")
  const [isCalculating, setIsCalculating] = useState(false)

  const handleCalculate = async () => {
    setIsCalculating(true)
    try {
      const calculation = await calculateShipping(origin, destination, items)
      setRates(calculation.available_services)
    } catch (error) {
      console.error("Error calculating shipping:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleRateSelect = (rateId: string) => {
    setSelectedRate(rateId)
    const rate = rates.find((r) => r.id === rateId)
    if (rate) {
      onShippingMethodSelect(rate)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calcular Envío</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dirección de Origen */}
          <div className="space-y-4">
            <h3 className="font-medium">Dirección de Recojo</h3>
            <div className="space-y-2">
              <Label htmlFor="origin-street">Calle</Label>
              <Input
                id="origin-street"
                value={origin.street}
                onChange={(e) => setOrigin({ ...origin, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="origin-city">Ciudad</Label>
                <Input
                  id="origin-city"
                  value={origin.city}
                  onChange={(e) => setOrigin({ ...origin, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin-state">Departamento</Label>
                <Input
                  id="origin-state"
                  value={origin.state}
                  onChange={(e) => setOrigin({ ...origin, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin-zip">Código Postal</Label>
              <Input
                id="origin-zip"
                value={origin.zipCode}
                onChange={(e) => setOrigin({ ...origin, zipCode: e.target.value })}
              />
            </div>
          </div>

          {/* Dirección de Destino */}
          <div className="space-y-4">
            <h3 className="font-medium">Dirección de Entrega</h3>
            <div className="space-y-2">
              <Label htmlFor="dest-street">Calle</Label>
              <Input
                id="dest-street"
                value={destination.street}
                onChange={(e) => setDestination({ ...destination, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="dest-city">Ciudad</Label>
                <Input
                  id="dest-city"
                  value={destination.city}
                  onChange={(e) => setDestination({ ...destination, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dest-state">Departamento</Label>
                <Input
                  id="dest-state"
                  value={destination.state}
                  onChange={(e) => setDestination({ ...destination, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-zip">Código Postal</Label>
              <Input
                id="dest-zip"
                value={destination.zipCode}
                onChange={(e) => setDestination({ ...destination, zipCode: e.target.value })}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full" disabled={isCalculating}>
          {isCalculating ? "Calculando..." : "Calcular Tarifa"}
        </Button>

        {rates.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Opciones de Envío Disponibles</h3>
            <RadioGroup value={selectedRate} onValueChange={handleRateSelect}>
              {rates.map((rate) => (
                <div key={rate.id} className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem value={rate.id} id={rate.id} />
                  <div className="flex-1">
                    <Label htmlFor={rate.id} className="font-medium">
                      {rate.name}
                    </Label>
                    <p className="text-sm text-gray-600">{rate.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">S/ {rate.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{rate.estimated_days} días</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

