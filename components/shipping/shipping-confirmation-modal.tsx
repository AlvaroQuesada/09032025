"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, Printer, Copy, CheckCircle2, PhoneIcon as WhatsApp, Mail, QrCode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"

interface ShippingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  orderDetails: {
    trackingNumber: string
    orderNumber: string
    totalAmount: number
    pickupAddress: string
    deliveryAddress: string
    packageDetails: {
      type: string
      weight: string
      description?: string
    }
    estimatedDelivery: string
  }
}

export function ShippingConfirmationModal({ isOpen, onClose, orderDetails }: ShippingConfirmationModalProps) {
  const [showQR, setShowQR] = useState(false)

  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard.writeText(orderDetails.trackingNumber)
      toast.success("Número de guía copiado al portapapeles")
    } catch (err) {
      toast.error("Error al copiar el número de guía")
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: "Seguimiento de envío Llama Express",
      text: `Sigue tu envío con el número de guía: ${orderDetails.trackingNumber}`,
      url: `${window.location.origin}/tracking/${orderDetails.trackingNumber}`,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        throw new Error("Compartir no está disponible")
      }
    } catch (err) {
      toast.error("Error al compartir")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `¡Hola! Puedes seguir tu envío de Llama Express con el número de guía: ${orderDetails.trackingNumber}
Link de seguimiento: ${window.location.origin}/tracking/${orderDetails.trackingNumber}`,
    )
    window.open(`https://wa.me/?text=${text}`, "_blank")
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Seguimiento de envío Llama Express")
    const body = encodeURIComponent(
      `Número de guía: ${orderDetails.trackingNumber}
Link de seguimiento: ${window.location.origin}/tracking/${orderDetails.trackingNumber}`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            ¡Envío creado exitosamente!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información principal */}
          <Card className="bg-green-50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Número de Guía</p>
                  <p className="text-2xl font-bold">{orderDetails.trackingNumber}</p>
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowQR(!showQR)}>
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              {showQR && (
                <div className="mt-4 flex justify-center">
                  <QRCodeSVG
                    value={`${window.location.origin}/tracking/${orderDetails.trackingNumber}`}
                    size={128}
                    level="H"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detalles del envío */}
          <div className="space-y-4">
            <h3 className="font-semibold">Detalles del Envío</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Número de Orden</p>
                <p className="font-medium">{orderDetails.orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Monto Total</p>
                <p className="font-medium">S/ {orderDetails.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Tipo de Paquete</p>
                <p className="font-medium">{orderDetails.packageDetails.type}</p>
              </div>
              <div>
                <p className="text-gray-600">Peso</p>
                <p className="font-medium">{orderDetails.packageDetails.weight} kg</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div>
                <p className="text-gray-600 text-sm">Dirección de Recojo</p>
                <p className="font-medium">{orderDetails.pickupAddress}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Dirección de Entrega</p>
                <p className="font-medium">{orderDetails.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Entrega Estimada</p>
                <p className="font-medium">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCopyTracking} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copiar N° de Guía
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button onClick={handlePrint} variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleWhatsAppShare} className="flex-1 bg-green-500 hover:bg-green-600">
                <WhatsApp className="h-4 w-4 mr-2" />
                Compartir por WhatsApp
              </Button>
              <Button onClick={handleEmailShare} className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Mail className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
              <Button
                onClick={() => window.open(`/tracking/${orderDetails.trackingNumber}`, "_blank")}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Guía
              </Button>
            </div>
          </div>

          {/* Mensaje de ayuda */}
          <p className="text-sm text-gray-600 text-center">
            Guarda el número de guía para hacer seguimiento a tu envío. También puedes descargarlo o compartirlo
            directamente.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

