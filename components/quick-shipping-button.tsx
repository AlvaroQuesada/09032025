"use client"

import { useState } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QuickShippingForm } from "@/components/quick-shipping-form"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export function QuickShippingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (!user) {
      router.push("/auth")
      return
    }
    setIsOpen(true)
  }

  return (
    <>
      <div className="group relative">
        <Button
          onClick={handleClick}
          className="fixed bottom-4 right-4 rounded-full h-16 w-16 shadow-lg bg-red-600 hover:bg-red-700 z-50 transition-all duration-300"
          aria-label="Crear Envío Rápido"
        >
          <Package className="h-8 w-8" />
          <span className="sr-only">Crear Envío Rápido</span>
        </Button>
        <div className="fixed bottom-[5.5rem] right-4 bg-black text-white text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
          Crear Envío Rápido
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crear Envío Rápido</DialogTitle>
          </DialogHeader>
          <QuickShippingForm onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

