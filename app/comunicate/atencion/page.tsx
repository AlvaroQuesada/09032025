"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MessageSquare, Clock, Video } from "lucide-react"

export default function AtencionAlCliente() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ sender: "bot", message: "¡Hola! ¿En qué puedo ayudarte hoy?" }])
  const [userMessage, setUserMessage] = useState("")

  const toggleChat = () => setChatOpen(!chatOpen)

  const sendMessage = (e) => {
    e.preventDefault()
    if (userMessage.trim() === "") return

    setChatMessages([...chatMessages, { sender: "user", message: userMessage }])
    setUserMessage("")

    // Simular respuesta del bot
    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", message: "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto." },
      ])
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 pt-12">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto ml-64">
          <h1 className="text-3xl font-bold mb-6">Atención al Cliente</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Canales de atención</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <Phone className="w-8 h-8 mr-4 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Atención telefónica</h3>
                    <p>Llámanos al: +51 1 234 5678</p>
                    <p className="text-sm text-gray-600">Lunes a Viernes: 8:00 AM - 8:00 PM</p>
                    <p className="text-sm text-gray-600">Sábados: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <Mail className="w-8 h-8 mr-4 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Correo electrónico</h3>
                    <p>Escríbenos a: atencion@llamaexpress.com</p>
                    <p className="text-sm text-gray-600">Responderemos en un máximo de 24 horas</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <MessageSquare className="w-8 h-8 mr-4 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold">Chat en vivo</h3>
                    <p>Chatea con nuestros agentes en tiempo real</p>
                    <p className="text-sm text-gray-600">Disponible 24/7</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <Video className="w-8 h-8 mr-4 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">Videollamada</h3>
                    <p>Agenda una videollamada con nuestro equipo</p>
                    <p className="text-sm text-gray-600">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Preguntas frecuentes</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>¿Cómo puedo rastrear mi envío?</AccordionTrigger>
                    <AccordionContent>
                      Puedes rastrear tu envío ingresando el número de guía en nuestra página principal o en la sección
                      "Rastrear" de nuestra aplicación móvil.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>¿Cuáles son los tiempos de entrega estándar?</AccordionTrigger>
                    <AccordionContent>
                      Nuestros tiempos de entrega estándar son de 2 a 3 días hábiles para envíos locales y de 3 a 5 días
                      hábiles para envíos nacionales.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>¿Qué hago si mi paquete no ha llegado en el tiempo estimado?</AccordionTrigger>
                    <AccordionContent>
                      Si tu paquete no ha llegado en el tiempo estimado, por favor contáctanos a través de cualquiera de
                      nuestros canales de atención con tu número de guía a la mano.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>¿Cómo puedo cambiar la dirección de entrega de mi paquete?</AccordionTrigger>
                    <AccordionContent>
                      Para cambiar la dirección de entrega, debes contactar a nuestro servicio de atención al cliente lo
                      antes posible. Ten en cuenta que esto puede afectar el tiempo de entrega y posiblemente incurrir
                      en cargos adicionales.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Contáctanos</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <Input type="text" id="nombre" name="nombre" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <Input type="email" id="email" name="email" required />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <Input type="tel" id="telefono" name="telefono" />
                </div>
                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto
                  </label>
                  <Input type="text" id="asunto" name="asunto" required />
                </div>
                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <Textarea id="mensaje" name="mensaje" rows={4} required />
                </div>
                <Button type="submit" className="w-full">
                  Enviar mensaje
                </Button>
              </form>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Horario de atención</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    <span>
                      <strong>Lunes a Viernes:</strong> 8:00 AM - 8:00 PM
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    <span>
                      <strong>Sábados:</strong> 9:00 AM - 5:00 PM
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    <span>
                      <strong>Domingos y feriados:</strong> Cerrado
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Atención prioritaria</h3>
                <p className="mb-4">
                  Si eres cliente corporativo o tienes un envío urgente, contáctanos para recibir atención prioritaria.
                </p>
                <Button className="w-full">Solicitar atención prioritaria</Button>
              </div>
            </div>
          </div>

          {/* Chat en vivo flotante */}
          <div className={`fixed bottom-4 right-4 z-50 ${chatOpen ? "w-80" : "w-auto"}`}>
            {!chatOpen && (
              <Button onClick={toggleChat} className="rounded-full p-4">
                <MessageSquare className="w-6 h-6" />
              </Button>
            )}
            {chatOpen && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                  <h3 className="font-semibold">Chat en vivo</h3>
                  <Button variant="ghost" size="sm" onClick={toggleChat}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
                <div className="h-64 overflow-y-auto p-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.sender === "user" ? "text-right" : ""}`}>
                      <span
                        className={`inline-block p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-100" : "bg-gray-100"}`}
                      >
                        {msg.message}
                      </span>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t">
                  <div className="flex">
                    <Input
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-grow mr-2"
                    />
                    <Button type="submit">Enviar</Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

