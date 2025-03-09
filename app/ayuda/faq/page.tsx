"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Package, Truck, CreditCard, Clock } from "lucide-react"

export default function PreguntasFrecuentes() {
  const [searchTerm, setSearchTerm] = useState("")

  const faqs = [
    {
      category: "Envíos",
      icon: Package,
      questions: [
        {
          q: "¿Cuánto tiempo tarda un envío estándar?",
          a: "Los envíos estándar generalmente tardan de 3 a 5 días hábiles en llegar a su destino dentro del país.",
        },
        {
          q: "¿Puedo cambiar la dirección de entrega una vez que el paquete está en camino?",
          a: "Sí, es posible cambiar la dirección de entrega hasta 24 horas antes de la entrega programada. Contacta a nuestro servicio al cliente para realizar el cambio.",
        },
        {
          q: "¿Qué pasa si no estoy en casa para recibir mi paquete?",
          a: "Si no estás en casa, intentaremos entregar el paquete hasta 3 veces. Después del tercer intento, el paquete se mantendrá en nuestra oficina más cercana durante 7 días para que lo recojas.",
        },
      ],
    },
    {
      category: "Tarifas y Pagos",
      icon: CreditCard,
      questions: [
        {
          q: "¿Cómo se calculan las tarifas de envío?",
          a: "Las tarifas se calculan en base al peso, dimensiones y distancia del envío. Puedes usar nuestra calculadora de tarifas en línea para obtener una cotización precisa.",
        },
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Aceptamos tarjetas de crédito/débito, transferencias bancarias, y pagos a través de aplicaciones como Yape y Plin.",
        },
        {
          q: "¿Ofrecen descuentos para envíos frecuentes?",
          a: "Sí, ofrecemos programas de descuento para clientes frecuentes y empresas. Contacta a nuestro equipo de ventas para más información.",
        },
      ],
    },
    {
      category: "Seguimiento y Entrega",
      icon: Truck,
      questions: [
        {
          q: "¿Cómo puedo rastrear mi paquete?",
          a: "Puedes rastrear tu paquete ingresando el número de guía en nuestra página web o app móvil. También enviamos actualizaciones por correo electrónico y SMS.",
        },
        {
          q: "¿Qué hago si mi paquete está retrasado?",
          a: "Si tu paquete está retrasado, primero verifica su estado en nuestro sistema de rastreo. Si el retraso es significativo, contacta a nuestro servicio al cliente para obtener más información.",
        },
        {
          q: "¿Entregan los sábados y domingos?",
          a: "Realizamos entregas de lunes a sábado. Los domingos solo entregamos para servicios express seleccionados en ciertas áreas.",
        },
      ],
    },
    {
      category: "Servicios Especiales",
      icon: Clock,
      questions: [
        {
          q: "¿Ofrecen servicio de entrega el mismo día?",
          a: "Sí, ofrecemos servicio de entrega el mismo día en ciertas áreas metropolitanas. Este servicio debe solicitarse antes de las 10 AM y está sujeto a disponibilidad.",
        },
        {
          q: "¿Pueden manejar envíos de artículos frágiles o valiosos?",
          a: "Sí, ofrecemos servicios especiales para artículos frágiles o de alto valor. Estos envíos reciben un manejo especial y seguro adicional.",
        },
        {
          q: "¿Realizan mudanzas o traslados de oficinas?",
          a: "Sí, contamos con un servicio especializado para mudanzas residenciales y comerciales. Contacta a nuestro equipo de ventas para obtener una cotización personalizada.",
        },
      ],
    },
  ]

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) || q.a.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Preguntas Frecuentes</h1>

          <div className="mb-6 relative">
            <Input
              type="text"
              placeholder="Buscar preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {filteredFaqs.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <category.icon className="mr-2" />
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem value={`item-${index}-${faqIndex}`} key={faqIndex}>
                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                    <AccordionContent>{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No se encontraron preguntas que coincidan con tu búsqueda.</p>
              <p className="mt-2">
                Intenta con otros términos o contacta a nuestro servicio al cliente para asistencia adicional.
              </p>
            </div>
          )}

          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">¿No encontraste lo que buscabas?</h2>
            <p className="mb-4">
              Si no pudiste encontrar la respuesta a tu pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Contactar Soporte
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                Chat en Vivo
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

