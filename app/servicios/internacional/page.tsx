"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plane, ShieldCheck, Clock } from "lucide-react"
import Image from "next/image"

export default function EnvioInternacional() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Servicio de Envío Internacional</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-lg">
                Conecta Perú con el mundo a través de Llama Express. Nuestro servicio de envío internacional te ofrece
                la mejor combinación de velocidad, seguridad y precio para tus paquetes internacionales.
              </p>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Ventajas de nuestro servicio:</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Envíos a más de 200 países</li>
                  <li>Opciones de envío express y económico</li>
                  <li>Trámites aduaneros simplificados</li>
                  <li>Seguimiento internacional en tiempo real</li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <Button className="flex-1">Cotizar envío internacional</Button>
                <Button className="flex-1" variant="outline">
                  Ver destinos
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Mapa mundial con rutas de envío"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white text-lg font-semibold">
                  Conectamos Perú con más de 200 países alrededor del mundo
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-semibold">Nuestros servicios internacionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Plane,
                  title: "Express Internacional",
                  description: "Entrega en 3-5 días hábiles a destinos principales",
                },
                {
                  icon: ShieldCheck,
                  title: "Envío Seguro",
                  description: "Seguro incluido y embalaje especial para artículos frágiles",
                },
                {
                  icon: Clock,
                  title: "Económico",
                  description: "Opción más económica con tiempos de entrega de 7-10 días",
                },
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-full mr-4">
                      <service.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                  </div>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Calcula tu envío internacional</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="País de origen" />
              <Input placeholder="País de destino" />
              <Input placeholder="Peso del paquete (kg)" type="number" />
              <Button className="h-10">Calcular tarifa</Button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {[
                {
                  question: "¿Qué documentos necesito para un envío internacional?",
                  answer:
                    "Generalmente, necesitarás una factura comercial, lista de empaque y, dependiendo del destino, documentos adicionales como certificados de origen.",
                },
                {
                  question: "¿Cómo puedo rastrear mi envío internacional?",
                  answer:
                    "Puedes rastrear tu envío en tiempo real a través de nuestra plataforma en línea o app móvil utilizando el número de guía proporcionado.",
                },
                {
                  question: "¿Qué artículos no puedo enviar internacionalmente?",
                  answer:
                    "Existen restricciones para artículos como productos perecederos, materiales peligrosos, y ciertos bienes según las regulaciones de cada país. Consulta nuestra lista completa de artículos prohibidos.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

