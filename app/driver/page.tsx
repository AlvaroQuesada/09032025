"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-browser"
import { toast } from "sonner"
import {
  MapPin,
  Package,
  Navigation,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  User,
  LogOut,
  Truck,
} from "lucide-react"

export default function DriverDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("deliveries")
  const [isAvailable, setIsAvailable] = useState(true)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [watchId, setWatchId] = useState(null)
  const [deliveries, setDeliveries] = useState([
    {
      id: "DEL-1234",
      status: "assigned",
      customer: "Juan Pérez",
      address: "Av. Javier Prado 1234, San Isidro",
      time: "10:30 AM - 11:30 AM",
      items: "2 paquetes",
      priority: "alta",
    },
    {
      id: "DEL-5678",
      status: "in_progress",
      customer: "María García",
      address: "Calle Los Pinos 567, Miraflores",
      time: "12:00 PM - 1:00 PM",
      items: "1 paquete",
      priority: "media",
    },
  ])

  useEffect(() => {
    // Iniciar el seguimiento de ubicación cuando el componente se monta
    startLocationTracking()

    // Limpiar cuando el componente se desmonta
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalización no soportada en este dispositivo")
      return
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ latitude, longitude })
        updateLocationInDatabase(latitude, longitude)
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error)
        toast.error("No se pudo obtener tu ubicación")
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      },
    )

    setWatchId(id)
  }

  const updateLocationInDatabase = async (latitude, longitude) => {
    if (!user) return

    try {
      // Primero, obtener el ID del driver basado en el auth_id
      const { data: driverData, error: driverError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single()

      if (driverError) throw driverError

      // Luego, actualizar la ubicación
      const { error } = await supabase.from("driver_locations").upsert(
        {
          driver_id: driverData.id,
          latitude,
          longitude,
          status: isAvailable ? "available" : "busy",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "driver_id",
        },
      )

      if (error) throw error
    } catch (error) {
      console.error("Error actualizando ubicación:", error)
    }
  }

  const toggleAvailability = async (value) => {
    setIsAvailable(value)

    if (currentLocation) {
      await updateLocationInDatabase(currentLocation.latitude, currentLocation.longitude)
    }

    toast.success(value ? "Ahora estás disponible" : "Has pausado tu disponibilidad")
  }

  const handleSignOut = async () => {
    // Actualizar estado a offline antes de cerrar sesión
    if (currentLocation) {
      try {
        const { data: driverData } = await supabase.from("users").select("id").eq("auth_id", user.id).single()

        await supabase.from("driver_locations").update({ status: "offline" }).eq("driver_id", driverData.id)
      } catch (error) {
        console.error("Error al actualizar estado:", error)
      }
    }

    await signOut()
    router.push("/auth")
  }

  const updateDeliveryStatus = (id, newStatus) => {
    setDeliveries(deliveries.map((delivery) => (delivery.id === id ? { ...delivery, status: newStatus } : delivery)))

    toast.success(`Entrega ${id} actualizada a ${newStatus}`)
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header con información del driver */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              <Truck className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{user.user_metadata?.full_name || "Driver"}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={isAvailable ? "success" : "secondary"}>
                {isAvailable ? "Disponible" : "No disponible"}
              </Badge>
              {currentLocation && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  Ubicación activa
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Control de disponibilidad */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="availability">Disponibilidad</Label>
              <p className="text-sm text-muted-foreground">
                {isAvailable ? "Estás disponible para recibir entregas" : "No estás recibiendo nuevas entregas"}
              </p>
            </div>
            <Switch id="availability" checked={isAvailable} onCheckedChange={toggleAvailability} />
          </div>
        </CardContent>
      </Card>

      {/* Tabs para navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deliveries">
            <Package className="h-4 w-4 mr-2" />
            Entregas
          </TabsTrigger>
          <TabsTrigger value="map">
            <Navigation className="h-4 w-4 mr-2" />
            Mapa
          </TabsTrigger>
        </TabsList>

        {/* Contenido de entregas */}
        <TabsContent value="deliveries" className="space-y-4 mt-4">
          {deliveries.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">No tienes entregas asignadas</p>
            </div>
          ) : (
            deliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className={`
                ${delivery.status === "completed" ? "bg-muted" : ""}
                ${delivery.priority === "alta" ? "border-l-4 border-l-red-500" : ""}
              `}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base flex items-center">
                      {delivery.id}
                      {delivery.priority === "alta" && <AlertTriangle className="h-4 w-4 ml-2 text-red-500" />}
                    </CardTitle>
                    <Badge
                      variant={
                        delivery.status === "assigned"
                          ? "outline"
                          : delivery.status === "in_progress"
                            ? "secondary"
                            : delivery.status === "completed"
                              ? "success"
                              : "default"
                      }
                    >
                      {delivery.status === "assigned"
                        ? "Asignado"
                        : delivery.status === "in_progress"
                          ? "En progreso"
                          : delivery.status === "completed"
                            ? "Completado"
                            : delivery.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{delivery.customer}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{delivery.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{delivery.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span>{delivery.items}</span>
                    </div>
                  </div>

                  {delivery.status !== "completed" && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`tel:+51987654321`)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Llamar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`https://maps.google.com/?q=${delivery.address}`)}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Navegar
                      </Button>
                    </div>
                  )}

                  {delivery.status === "assigned" && (
                    <Button className="w-full mt-2" onClick={() => updateDeliveryStatus(delivery.id, "in_progress")}>
                      Iniciar entrega
                    </Button>
                  )}

                  {delivery.status === "in_progress" && (
                    <Button className="w-full mt-2" onClick={() => updateDeliveryStatus(delivery.id, "completed")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completar entrega
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Contenido del mapa */}
        <TabsContent value="map">
          <Card>
            <CardContent className="pt-6">
              <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
                {currentLocation ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-primary mx-auto animate-bounce" />
                      <p className="text-sm mt-2">
                        Lat: {currentLocation.latitude.toFixed(6)}
                        <br />
                        Lng: {currentLocation.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Aquí se mostraría el mapa de Google Maps</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Obteniendo ubicación...</p>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Tu ubicación actual</h3>
                {currentLocation ? (
                  <p className="text-sm text-muted-foreground">
                    Latitud: {currentLocation.latitude.toFixed(6)}
                    <br />
                    Longitud: {currentLocation.longitude.toFixed(6)}
                    <br />
                    Estado: {isAvailable ? "Disponible" : "No disponible"}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Obteniendo datos de ubicación...</p>
                )}
              </div>

              <Button variant="outline" className="w-full mt-4" onClick={startLocationTracking}>
                <Navigation className="h-4 w-4 mr-2" />
                Actualizar ubicación
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botón de soporte flotante */}
      <Button
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
        onClick={() => window.open("https://wa.me/51987654321")}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  )
}

