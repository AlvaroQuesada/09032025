"use client"

import { Linktree } from "@/components/linktree"
import { Package, Send, Info, HelpCircle, Phone, LogOut, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function MobileMenu() {
  const { user, userRole, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  return (
    <div className="flex flex-col h-full">
      {user && (
        <div className="p-4 border-b">
          <div className="font-medium">{user.user_metadata.full_name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )}

      <div className="flex-grow space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Flota Llama Express</h2>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NUEVO</span>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="servicios">
            <AccordionTrigger className="flex items-center">
              <Package className="mr-2" />
              Servicios
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/servicios/nacional">Envío Nacional</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/servicios/internacional">Envío Internacional</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/servicios/especiales">Servicios Especiales</Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="envia">
            <AccordionTrigger className="flex items-center">
              <Send className="mr-2" />
              Envía
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/envia/crear">Crear Envío</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/envia/calcular">Calcular Tarifa</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/envia/recojo">Programar Recojo</Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="informa">
            <AccordionTrigger className="flex items-center">
              <Info className="mr-2" />
              Llama Express Informa
            </AccordionTrigger>
            <AccordionContent>
              <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                <Link href="/informa">Ver Información</Link>
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ayuda">
            <AccordionTrigger className="flex items-center">
              <HelpCircle className="mr-2" />
              Ayuda
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/ayuda/faq">Preguntas Frecuentes</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/ayuda/contacto">Contacto</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/ayuda/soporte">Soporte en Línea</Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="comunicate">
            <AccordionTrigger className="flex items-center">
              <Phone className="mr-2" />
              Comunícate
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-6 space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/comunicate/atencion">Atención al Cliente</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/comunicate/reclamos">Reclamos</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/comunicate/sugerencias">Sugerencias</Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {user ? (
          <div className="space-y-2 mt-4">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/user">
                <User className="mr-2" />
                Mi Perfil
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleSignOut}>
              <LogOut className="mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          <Button className="w-full" asChild>
            <Link href="/auth">Iniciar Sesión</Link>
          </Button>
        )}
      </div>

      <div className="mt-8 p-4">
        <Linktree />
      </div>
    </div>
  )
}

