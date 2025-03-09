"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download, Truck, Package, MapPin } from "lucide-react"
import { getOrderDetails } from "@/lib/shipping"
import type { Order, ShippingConfirmation } from "@/lib/types"

interface ShippingGuidePageProps {
  params: {
    id: string
  }
}

export default function ShippingGuidePage({ params }: ShippingGuidePageProps) {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null)
  const [shippingConfirmation, setShippingConfirmation] = useState<ShippingConfirmation | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const { order, confirmation } = await getOrderDetails(params.id)
        setOrderDetails(order)
        setShippingConfirmation(confirmation)
      } catch (error) {
        console.error("Error fetching order details:", error)
        // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
      }
    }

    fetchOrderDetails()
  }, [params.id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implementar la lógica para descargar la guía como PDF
    // Puedes usar una librería como jsPDF para generar el PDF
  }

  if (!orderDetails || !shippingConfirmation) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Guía de Envío</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2" />
            Detalles del Envío
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Número de Guía:</p>
              <p>{shippingConfirmation.trackingNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Número de Orden:</p>
              <p>{shippingConfirmation.orderNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Estado:</p>
              <p>{orderDetails.status}</p>
            </div>
            <div>
              <p className="font-semibold">Fecha de Creación:</p>
              <p>{new Date(orderDetails.created_at).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2" />
            Direcciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Dirección de Recojo:</p>
              <p>{shippingConfirmation.pickupAddress}</p>
            </div>
            <div>
              <p className="font-semibold">Dirección de Entrega:</p>
              <p>{shippingConfirmation.deliveryAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2" />
            Detalles del Paquete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Tipo de Paquete:</p>
              <p>{shippingConfirmation.packageDetails.type}</p>
            </div>
            <div>
              <p className="font-semibold">Peso:</p>
              <p>{shippingConfirmation.packageDetails.weight} kg</p>
            </div>
            {shippingConfirmation.packageDetails.description && (
              <div className="col-span-2">
                <p className="font-semibold">Descripción:</p>
                <p>{shippingConfirmation.packageDetails.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {orderDetails.require_invoice && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Factura</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Se ha solicitado una factura para este envío. La factura será enviada por correo electrónico.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Guía
        </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Descargar Guía
        </Button>
      </div>
    </div>
  )
}

