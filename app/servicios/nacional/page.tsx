"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Truck, Package, Clock, MapPin } from "lucide-react"
import Image from "next/image"

export default function EnvioNacional() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Servicio de Envío Nacional</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-lg">
                Llama Express te ofrece el servicio de envío más rápido y confiable en todo el Perú. Con nuestra amplia
                red de distribución, tu paquete llegará a su destino en tiempo récord.
              </p>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Características del servicio:</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Entrega en 24-48 horas a ciudades principales</li>
                  <li>Seguimiento en tiempo real</li>
                  <li>Seguro incluido en todos los envíos</li>
                  <li>Opciones de recojo a domicilio</li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <Button className="flex-1">Cotizar envío</Button>
                <Button className="flex-1" variant="outline">
                  Ver cobertura
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Mapa de cobertura nacional"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white text-lg font-semibold">Cobertura en más de 1,800 destinos en todo el Perú</p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-semibold">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Package, title: "Empaca", description: "Embala tu paquete de forma segura" },
                { icon: MapPin, title: "Programa", description: "Elige la fecha y hora de recojo" },
                { icon: Truck, title: "Enviamos", description: "Recogemos y enviamos tu paquete" },
                { icon: Clock, title: "Entregamos", description: "Tu paquete llega a su destino" },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="bg-red-100 p-4 rounded-full mb-4">
                    <step.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Calcula el costo de tu envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Ciudad de origen" />
              <Input placeholder="Ciudad de destino" />
              <Input placeholder="Peso del paquete (kg)" type="number" />
            </div>
            <Button className="mt-4 w-full">Calcular tarifa</Button>
          </div>
        </main>
      </div>
    </div>
  )
}

