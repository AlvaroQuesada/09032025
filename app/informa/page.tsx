"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Newspaper, TrendingUp, AlertTriangle } from "lucide-react"
import Image from "next/image"

export default function LlamaExpressInforma() {
  const [activeTab, setActiveTab] = useState("noticias")

  const news = [
    {
      id: 1,
      title: "Llama Express amplía su flota de vehículos eléctricos",
      date: "15 de Mayo, 2025",
      image: "/placeholder.svg?height=200&width=300",
      excerpt:
        "En un esfuerzo por reducir nuestra huella de carbono, hemos incorporado 50 nuevos vehículos eléctricos a nuestra flota...",
    },
    {
      id: 2,
      title: "Nueva alianza estratégica con tiendas online",
      date: "3 de Abril, 2025",
      image: "/placeholder.svg?height=200&width=300",
      excerpt:
        "Nos complace anunciar nuestra nueva alianza con las principales tiendas online del país para ofrecer envíos más rápidos y económicos...",
    },
    {
      id: 3,
      title: "Inauguración de nuevo centro de distribución en Arequipa",
      date: "20 de Marzo, 2025",
      image: "/placeholder.svg?height=200&width=300",
      excerpt:
        "Con el objetivo de mejorar nuestros tiempos de entrega en el sur del país, hemos inaugurado un nuevo centro de distribución en Arequipa...",
    },
  ]

  const updates = [
    {
      id: 1,
      title: "Actualización de la aplicación móvil",
      date: "10 de Mayo, 2025",
      description:
        "Hemos lanzado una nueva versión de nuestra aplicación móvil con mejoras en el seguimiento de envíos en tiempo real.",
    },
    {
      id: 2,
      title: "Nuevas tarifas para envíos internacionales",
      date: "1 de Mayo, 2025",
      description:
        "A partir del 1 de junio, entrarán en vigor nuevas tarifas para envíos internacionales. Consulta los detalles en nuestra sección de tarifas.",
    },
    {
      id: 3,
      title: "Ampliación de horarios de atención",
      date: "25 de Abril, 2025",
      description:
        "Nuestras oficinas principales ahora atenderán de lunes a sábado de 8:00 AM a 8:00 PM para tu comodidad.",
    },
  ]

  const alerts = [
    {
      id: 1,
      title: "Retrasos en entregas por mantenimiento vial",
      date: "18 de Mayo, 2025",
      description:
        "Debido a trabajos de mantenimiento en la Carretera Central, pueden presentarse retrasos en las entregas hacia la sierra central.",
    },
    {
      id: 2,
      title: "Cierre temporal de oficina en Miraflores",
      date: "12 de Mayo, 2025",
      description:
        "Nuestra oficina en Miraflores estará cerrada del 20 al 25 de mayo por renovaciones. Por favor, utilice nuestras oficinas alternativas.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Llama Express Informa</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="noticias" className="flex items-center">
                <Newspaper className="mr-2" />
                Noticias
              </TabsTrigger>
              <TabsTrigger value="actualizaciones" className="flex items-center">
                <TrendingUp className="mr-2" />
                Actualizaciones
              </TabsTrigger>
              <TabsTrigger value="alertas" className="flex items-center">
                <AlertTriangle className="mr-2" />
                Alertas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="noticias">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.date}</p>
                      <p className="text-sm">{item.excerpt}</p>
                      <Button className="mt-4">Leer más</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="actualizaciones">
              <div className="space-y-6">
                {updates.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.date}</p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="alertas">
              <div className="space-y-6">
                {alerts.map((item) => (
                  <div key={item.id} className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <AlertTriangle className="mr-2 text-red-500" />
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{item.date}</p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Suscríbete a nuestras actualizaciones</h2>
            <div className="flex space-x-2">
              <Input placeholder="Ingresa tu correo electrónico" className="flex-grow" />
              <Button>
                <Bell className="mr-2" />
                Suscribirse
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

