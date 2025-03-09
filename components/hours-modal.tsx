"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

export function HoursModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">¡HORARIO EXTENDIDO!</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="relative w-full h-48 mb-4">
            <Image
              src="/placeholder.svg?height=192&width=384"
              alt="Imagen acogedora de atención al cliente"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <p className="text-lg">
            Atendemos los
            <br />
            <span className="text-red-600 font-bold">domingos de:</span>
          </p>
          <p className="text-xl font-bold text-red-600">8:00 am a 5:00 pm</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Tu agencia aquí</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

