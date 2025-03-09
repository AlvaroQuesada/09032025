"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShippingCalculator } from "@/components/shipping-calculator"
import { PoliciesInfo } from "@/components/policies-info"
import { ContactInfo } from "@/components/contact-info"
import { ChatSupport } from "@/components/chat-support"

export default function Cotizaciones() {
  const [activeTab, setActiveTab] = useState("calculator")

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 pt-12">
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Cotizaciones y Cálculos</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calculator">Calculadora</TabsTrigger>
              <TabsTrigger value="policies">Políticas</TabsTrigger>
              <TabsTrigger value="contact">Contacto</TabsTrigger>
              <TabsTrigger value="chat">Chat en vivo</TabsTrigger>
            </TabsList>
            <TabsContent value="calculator">
              <ShippingCalculator />
            </TabsContent>
            <TabsContent value="policies">
              <PoliciesInfo />
            </TabsContent>
            <TabsContent value="contact">
              <ContactInfo />
            </TabsContent>
            <TabsContent value="chat">
              <ChatSupport />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

