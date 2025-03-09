"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Package, MapPin, Truck, DollarSign } from "lucide-react"

export default function CalcularTarifa() {
  const [result, setResult] = useState(null)

  const calculateRate = () => {
    // Simulación de cálculo de tarifa
    const rate = Math.floor(Math.random() * 50) + 10
    setResult(rate)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Calcular Tarifa de Envío</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Detalles del envío</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de envío</label>
                    <Select>
                      <option>Paquete</option>
                      <option>Documento</option>
                      <option>Carga pesada</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                    <Input type="number" placeholder="Ingrese el peso" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dimensiones (cm)</label>
                    <div className="flex space-x-2">
                      <Input type="number" placeholder="Largo" />
                      <Input type="number" placeholder="Ancho" />
                      <Input type="number" placeholder="Alto" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Origen y destino</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ciudad de origen</label>
                    <Input placeholder="Ingrese la ciudad de origen" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ciudad de destino</label>
                    <Input placeholder="Ingrese la ciudad de destino" />
                  </div>
                </div>
              </div>

              <Button onClick={calculateRate} className="w-full">
                Calcular tarifa
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Información de tarifas</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Package className="mr-2 text-blue-500" />
                    Tarifas basadas en peso y dimensiones
                  </li>
                  <li className="flex items-center">
                    <MapPin className="mr-2 text-blue-500" />
                    Precios varían según la distancia
                  </li>
                  <li className="flex items-center">
                    <Truck className="mr-2 text-blue-500" />
                    Opciones de envío estándar y express
                  </li>
                  <li className="flex items-center">
                    <DollarSign className="mr-2 text-blue-500" />
                    Descuentos disponibles para envíos frecuentes
                  </li>
                </ul>
              </div>

              {result && (
                <div className="bg-green-50 p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">Resultado del cálculo</h2>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">S/ {result.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mt-2">Tarifa estimada para su envío</p>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Desglose de la tarifa:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>Tarifa base: S/ {(result * 0.7).toFixed(2)}</li>
                      <li>Cargo por distancia: S/ {(result * 0.2).toFixed(2)}</li>
                      <li>Cargo por manejo: S/ {(result * 0.1).toFixed(2)}</li>
                    </ul>
                  </div>
                  <Button className="w-full mt-4">Proceder con el envío</Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

