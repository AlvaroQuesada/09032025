"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import Image from "next/image"

export function ChatSupport() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy el asistente de Llama Express. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const sendMessage = () => {
    if (inputMessage.trim() === "") return

    setMessages([...messages, { id: Date.now(), text: inputMessage, sender: "user" }])
    setInputMessage("")

    // Simular respuesta del bot
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          text: "Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto.",
          sender: "bot",
        },
      ])
    }, 1000)
  }

  return (
    <div className="h-[600px] flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Chat en Vivo</h2>
      <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-lg ${
              message.sender === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            } max-w-[70%] ${message.sender === "bot" ? "flex items-start" : ""}`}
          >
            {message.sender === "bot" && (
              <div className="mr-2 flex-shrink-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/llama-v6pTkz5WhxbsMir0f5QmbSOyX09uCu.gif"
                  alt="Llama Bot"
                  width={40}
                  height={40}
                  className="rounded-full"
                  priority={message.id === 1} // Priorizar la carga de la primera imagen
                  loading={message.id === 1 ? "eager" : "lazy"} // Carga eager para la primera imagen
                />
              </div>
            )}
            <div>{message.text}</div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribe tu mensaje aquí..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

