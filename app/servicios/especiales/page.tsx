"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Truck, Thermometer, Leaf } from "lucide-react"
import Image from "next/image"

export default function EnviosEspeciales() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Servicios de Envíos Especiales</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-lg">
                En Llama Express, entendemos que algunos envíos requieren un cuidado extra. Nuestros servicios de envíos
                especiales están diseñados para manejar paquetes delicados, de gran tamaño o que requieren condiciones
                específicas de transporte.
              </p>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Nuestros servicios especiales incluyen:</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Envío de artículos frágiles</li>
                  <li>Transporte de carga pesada</li>
                  <li>Envíos con control de temperatura</li>
                  <li>Servicios de mudanza</li>
                  <li>Envíos de materiales peligrosos (con certificación)</li>
                </ul>
              </div>
              <Button className="w-full">Solicitar cotización personalizada</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Envío de artículos frágiles"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Transporte de carga pesada"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Envíos con control de temperatura"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Servicios de mudanza"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-semibold">Nuestros servicios especiales destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Package,
                  title: "Embalaje Especializado",
                  description:
                    "Utilizamos materiales de alta calidad y técnicas avanzadas para proteger tus artículos más delicados.",
                },
                {
                  icon: Truck,
                  title: "Transporte de Carga Pesada",
                  description:
                    "Contamos con vehículos especializados para mover cargas de gran tamaño y peso con seguridad.",
                },
                {
                  icon: Thermometer,
                  title: "Control de Temperatura",
                  description:
                    "Mantenemos la cadena de frío para productos que requieren temperaturas específicas durante el transporte.",
                },
                {
                  icon: Leaf,
                  title: "Envíos Eco-friendly",
                  description:
                    "Ofrecemos opciones de embalaje y rutas optimizadas para reducir el impacto ambiental de tus envíos.",
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
            <h2 className="text-2xl font-semibold mb-4">Solicita una cotización personalizada</h2>
            <p className="mb-4">Cuéntanos sobre tu envío especial y te proporcionaremos una cotización a medida.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nombre" />
              <Input placeholder="Correo electrónico" />
              <Input placeholder="Teléfono" />
              <Input placeholder="Tipo de envío especial" />
              <textarea
                className="col-span-2 p-2 border rounded-md"
                rows={4}
                placeholder="Describe los detalles de tu envío especial"
              ></textarea>
            </div>
            <Button className="mt-4 w-full">Enviar solicitud</Button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">¿Por qué elegir nuestros servicios especiales?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Experiencia en manejo de cargas delicadas y especiales</li>
              <li>Personal altamente capacitado y certificado</li>
              <li>Flota de vehículos adaptada para diferentes tipos de carga</li>
              <li>Seguimiento en tiempo real de tu envío especial</li>
              <li>Seguro incluido para mayor tranquilidad</li>
              <li>Atención personalizada durante todo el proceso</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}

