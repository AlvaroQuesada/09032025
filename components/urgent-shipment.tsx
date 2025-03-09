"use client"

import { useState } from "react"
import { Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UrgentShipmentModal } from "./urgent-shipment-modal"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export function UrgentShipment() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (!user) {
      router.push("/auth")
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
          <Truck className="mr-2 w-5 h-5 md:w-6 md:h-6" /> Tus envíos urgentes
        </h2>
        <p className="mb-3 md:mb-4 text-sm md:text-base">
          ¿Necesitas hacer un envío urgente? ¡Estamos aquí para ayudarte!
        </p>
        <Button
          onClick={handleClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm md:text-base transition-colors duration-300"
        >
          Solicitar envío urgente
        </Button>
      </div>

      <UrgentShipmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

