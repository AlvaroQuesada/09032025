"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Truck, CreditCard } from "lucide-react"
import Image from "next/image"

export default function CrearEnvio() {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Crear Nuevo Envío</h1>

          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 4 && <div className={`h-1 w-16 ${step > i ? "bg-blue-500" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Detalles del envío</span>
              <span className="text-sm">Origen y destino</span>
              <span className="text-sm">Opciones de envío</span>
              <span className="text-sm">Pago</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Detalles del envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-1">Valor declarado (S/)</label>
                  <Input type="number" placeholder="Ingrese el valor" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="fragile" />
                <label htmlFor="fragile" className="text-sm font-medium">
                  Este envío contiene artículos frágiles
                </label>
              </div>
              <Button onClick={nextStep} className="w-full">
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Origen y destino</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dirección de origen</h3>
                  <Input placeholder="Nombre del remitente" />
                  <Input placeholder="Dirección" />
                  <Input placeholder="Ciudad" />
                  <Input placeholder="Código postal" />
                  <Input placeholder="Teléfono" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dirección de destino</h3>
                  <Input placeholder="Nombre del destinatario" />
                  <Input placeholder="Dirección" />
                  <Input placeholder="Ciudad" />
                  <Input placeholder="Código postal" />
                  <Input placeholder="Teléfono" />
                </div>
              </div>
              <div className="flex justify-between">
                <Button onClick={prevStep} variant="outline">
                  Atrás
                </Button>
                <Button onClick={nextStep}>Continuar</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Opciones de envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Truck, title: "Estándar", description: "Entrega en 3-5 días hábiles", price: "S/ 15.00" },
                  { icon: Package, title: "Express", description: "Entrega al siguiente día hábil", price: "S/ 25.00" },
                  { icon: Truck, title: "Same Day", description: "Entrega el mismo día", price: "S/ 40.00" },
                ].map((option, index) => (
                  <div key={index} className="border rounded-lg p-4 flex flex-col items-center text-center">
                    <option.icon className="w-12 h-12 text-blue-500 mb-2" />
                    <h3 className="text-lg font-semibold">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <p className="font-bold">{option.price}</p>
                    <Button className="mt-4 w-full">Seleccionar</Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} variant="outline">
                  Atrás
                </Button>
                <Button onClick={nextStep}>Continuar</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Resumen y pago</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Resumen del envío</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Tipo de envío:</strong> Paquete
                  </p>
                  <p>
                    <strong>Peso:</strong> 2 kg
                  </p>
                  <p>
                    <strong>Origen:</strong> Lima
                  </p>
                  <p>
                    <strong>Destino:</strong> Arequipa
                  </p>
                  <p>
                    <strong>Opción de envío:</strong> Express
                  </p>
                  <p>
                    <strong>Costo total:</strong> S/ 25.00
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Método de pago</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center justify-center">
                    <CreditCard className="mr-2" /> Tarjeta de crédito
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=24&width=24"
                      alt="Yape"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    Yape
                  </Button>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button onClick={prevStep} variant="outline">
                  Atrás
                </Button>
                <Button onClick={() => alert("¡Envío creado con éxito!")}>Confirmar y pagar</Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

