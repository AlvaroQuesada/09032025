"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Package, Truck, Clock, MapPin, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Lista de distritos de Lima
const limaDistricts = [
  "Ancón",
  "Ate",
  "Barranco",
  "Breña",
  "Carabayllo",
  "Chaclacayo",
  "Chorrillos",
  "Cieneguilla",
  "Comas",
  "El Agustino",
  "Independencia",
  "Jesús María",
  "La Molina",
  "La Victoria",
  "Lima",
  "Lince",
  "Los Olivos",
  "Lurigancho",
  "Lurín",
  "Magdalena del Mar",
  "Miraflores",
  "Pachacámac",
  "Pucusana",
  "Pueblo Libre",
  "Puente Piedra",
  "Punta Hermosa",
  "Punta Negra",
  "Rímac",
  "San Bartolo",
  "San Borja",
  "San Isidro",
  "San Juan de Lurigancho",
  "San Juan de Miraflores",
  "San Luis",
  "San Martín de Porres",
  "San Miguel",
  "Santa Anita",
  "Santa María del Mar",
  "Santa Rosa",
  "Santiago de Surco",
  "Surquillo",
  "Villa El Salvador",
  "Villa María del Triunfo",
]

export function ShippingCalculator() {
  const [weight, setWeight] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [shippingType, setShippingType] = useState("standard")
  const [quote, setQuote] = useState(null)

  const calculateShipping = () => {
    // Aquí iría la lógica real de cálculo. Por ahora, usaremos un cálculo simple.
    const baseRate = 10
    const weightRate = Number.parseFloat(weight) * 0.5
    const distanceRate = Math.random() * 20 // Simulando distancia
    const typeMultiplier = shippingType === "express" ? 1.5 : 1

    const total = (baseRate + weightRate + distanceRate) * typeMultiplier
    setQuote(total.toFixed(2))
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4 flex items-start">
        <AlertTriangle className="text-amber-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          <span className="font-medium">Importante:</span> Actualmente solo realizamos envíos dentro de Lima
          Metropolitana.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Truck className="mr-2 h-6 w-6 text-blue-600" />
        Calculadora de Envíos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight" className="flex items-center">
            <Package className="mr-1 h-4 w-4 text-gray-500" />
            Peso (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ingrese el peso"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="origin" className="flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-red-500" />
            Distrito de origen
          </Label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger id="origin" className="mt-1">
              <SelectValue placeholder="Seleccione distrito de origen" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Distritos de Lima</SelectLabel>
                {limaDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="destination" className="flex items-center">
            <MapPin className="mr-1 h-4 w-4 text-blue-500" />
            Distrito de destino
          </Label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger id="destination" className="mt-1">
              <SelectValue placeholder="Seleccione distrito de destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Distritos de Lima</SelectLabel>
                {limaDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="shippingType" className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-purple-500" />
            Tipo de envío
          </Label>
          <Select value={shippingType} onValueChange={setShippingType}>
            <SelectTrigger id="shippingType" className="mt-1">
              <SelectValue placeholder="Seleccione tipo de envío" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Estándar</SelectItem>
              <SelectItem value="express">Express</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={calculateShipping} className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
        <Truck className="mr-2 h-4 w-4" />
        Calcular Cotización
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Truck className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Envío Estándar</h3>
              <Badge variant="outline" className="ml-auto">
                Económico
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Entrega en 24-48 horas dentro de Lima Metropolitana. Ideal para envíos regulares sin urgencia.
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-medium">Envío Express</h3>
              <Badge variant="outline" className="ml-auto bg-red-50 text-red-700 border-red-200">
                Urgente
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Entrega en el mismo día (pedidos antes de las 11am) o máximo en 12 horas. Perfecto para envíos urgentes.
            </p>
          </CardContent>
        </Card>
      </div>

      {quote && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <Info className="text-green-600 mr-2 h-5 w-5" />
            <p className="text-lg font-semibold text-green-800">Cotización estimada: S/ {quote}</p>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Esta es una estimación. El precio final puede variar según factores adicionales.
          </p>
        </div>
      )}
    </div>
  )
}

