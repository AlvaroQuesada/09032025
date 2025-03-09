"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Clock, Package, Truck } from "lucide-react"

export default function ProgramarRecojo() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Programar Recojo</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Detalles del recojo</h2>
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
                    <label className="block text-sm font-medium mb-1">Cantidad de paquetes</label>
                    <Input type="number" placeholder="Ingrese la cantidad" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Peso total aproximado (kg)</label>
                    <Input type="number" placeholder="Ingrese el peso total" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Dirección de recojo</h2>
                <div className="space-y-4">
                  <Input placeholder="Nombre del remitente" />
                  <Input placeholder="Dirección" />
                  <Input placeholder="Ciudad" />
                  <Input placeholder="Código postal" />
                  <Input placeholder="Teléfono de contacto" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Fecha y hora de recojo</h2>
                <div className="space-y-4">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                  <Select>
                    <option>Mañana (9:00 AM - 12:00 PM)</option>
                    <option>Tarde (1:00 PM - 5:00 PM)</option>
                    <option>Noche (6:00 PM - 9:00 PM)</option>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Información importante</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Clock className="mr-2 text-blue-500" />
                    Programación con 24 horas de anticipación
                  </li>
                  <li className="flex items-center">
                    <Package className="mr-2 text-blue-500" />
                    Asegúrese de que los paquetes estén listos
                  </li>
                  <li className="flex items-center">
                    <MapPin className="mr-2 text-blue-500" />
                    Proporcione una dirección precisa
                  </li>
                  <li className="flex items-center">
                    <Truck className="mr-2 text-blue-500" />
                    Nuestro personal llegará en el horario seleccionado
                  </li>
                </ul>
              </div>

              <Button className="w-full">Programar recojo</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

