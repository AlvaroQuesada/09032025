"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { MapPin, Truck, Phone, RefreshCw } from "lucide-react"

export function DriverTracking() {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("active")
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    fetchDrivers()

    // Configurar suscripción en tiempo real para actualizaciones de ubicación
    const subscription = supabase
      .channel("driver-locations")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "driver_locations",
        },
        handleLocationUpdate,
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }
  }, [mapRef.current, typeof window !== "undefined"])

  useEffect(() => {
    if (drivers.length > 0 && mapInstanceRef.current) {
      updateMarkers()
    }
  }, [drivers, selectedDriver])

  const fetchDrivers = async () => {
    setIsLoading(true)
    try {
      // Obtener usuarios con rol de mensajero
      const { data: driversData, error: driversError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "driver")
        .order("full_name")

      if (driversError) throw driversError

      // Obtener ubicaciones de los mensajeros
      const { data: locationsData, error: locationsError } = await supabase.from("driver_locations").select("*")

      if (locationsError) throw locationsError

      // Combinar datos
      const driversWithLocations = driversData.map((driver) => {
        const location = locationsData.find((loc) => loc.driver_id === driver.id)
        return {
          ...driver,
          location: location
            ? {
                lat: location.latitude,
                lng: location.longitude,
                lastUpdated: location.updated_at,
                status: location.status,
              }
            : null,
        }
      })

      setDrivers(driversWithLocations)

      // Si no hay un conductor seleccionado y hay conductores disponibles, seleccionar el primero
      if (!selectedDriver && driversWithLocations.length > 0) {
        setSelectedDriver(driversWithLocations[0])
      }
    } catch (error) {
      console.error("Error fetching drivers:", error)
      toast.error("Error al cargar mensajeros")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationUpdate = (payload) => {
    const { new: newLocation } = payload

    setDrivers((prevDrivers) => {
      return prevDrivers.map((driver) => {
        if (driver.id === newLocation.driver_id) {
          return {
            ...driver,
            location: {
              lat: newLocation.latitude,
              lng: newLocation.longitude,
              lastUpdated: newLocation.updated_at,
              status: newLocation.status,
            },
          }
        }
        return driver
      })
    })
  }

  const initializeMap = () => {
    // Esta función inicializaría el mapa de Google Maps
    // En un entorno real, necesitarías incluir la API de Google Maps
    // y proporcionar una clave de API válida

    // Simulación de inicialización de mapa
    console.log("Mapa inicializado")
    mapInstanceRef.current = {
      setCenter: (coords) => console.log("Mapa centrado en:", coords),
      setZoom: (zoom) => console.log("Zoom establecido en:", zoom),
    }

    // Después de inicializar el mapa, actualizar los marcadores
    updateMarkers()
  }

  const updateMarkers = () => {
    // Esta función actualizaría los marcadores en el mapa
    // En un entorno real, crearías marcadores de Google Maps
    // para cada conductor y los posicionarías en el mapa

    // Simulación de actualización de marcadores
    drivers.forEach((driver) => {
      if (driver.location) {
        console.log(`Marcador para ${driver.full_name} actualizado en: ${driver.location.lat}, ${driver.location.lng}`)
      }
    })

    // Si hay un conductor seleccionado con ubicación, centrar el mapa en él
    if (selectedDriver && selectedDriver.location && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({
        lat: selectedDriver.location.lat,
        lng: selectedDriver.location.lng,
      })
      mapInstanceRef.current.setZoom(15)
    }
  }

  const handleDriverSelect = (driverId) => {
    const driver = drivers.find((d) => d.id === driverId)
    setSelectedDriver(driver)
  }

  const getStatusBadge = (status) => {
    if (!status) return null

    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      busy: "bg-yellow-100 text-yellow-800",
      available: "bg-blue-100 text-blue-800",
    }

    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status === "active"
          ? "Activo"
          : status === "inactive"
            ? "Inactivo"
            : status === "busy"
              ? "Ocupado"
              : status === "available"
                ? "Disponible"
                : status}
      </Badge>
    )
  }

  const filteredDrivers = drivers.filter(
    (driver) =>
      statusFilter === "all" ||
      driver.status === statusFilter ||
      (driver.location && driver.location.status === statusFilter),
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Mensajeros</h3>
          <Button variant="outline" size="sm" onClick={fetchDrivers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="available">Disponibles</SelectItem>
            <SelectItem value="busy">Ocupados</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No se encontraron mensajeros</div>
          ) : (
            filteredDrivers.map((driver) => (
              <Card
                key={driver.id}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedDriver?.id === driver.id ? "border-blue-500 bg-blue-50" : ""}`}
                onClick={() => handleDriverSelect(driver.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{driver.full_name}</div>
                      <div className="text-sm text-gray-500">{driver.email}</div>
                      {driver.phone_number && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {driver.phone_number}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      {getStatusBadge(driver.location?.status || driver.status)}
                      {driver.location && (
                        <div className="text-xs text-gray-500 mt-1">
                          Última actualización: {new Date(driver.location.lastUpdated).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            {selectedDriver ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedDriver.full_name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Truck className="h-4 w-4 mr-1" />
                      {selectedDriver.vehicle_info || "Vehículo no registrado"}
                    </div>
                  </div>
                  <div>{getStatusBadge(selectedDriver.location?.status || selectedDriver.status)}</div>
                </div>

                {selectedDriver.location ? (
                  <div className="flex-1 bg-gray-100 rounded-md relative" ref={mapRef}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-red-500 mx-auto" />
                        <p className="mt-2">
                          {selectedDriver.location.lat.toFixed(6)}, {selectedDriver.location.lng.toFixed(6)}
                        </p>
                        <p className="text-sm text-gray-500">Mapa en tiempo real no disponible en esta vista previa</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto opacity-20" />
                      <p className="mt-2">Ubicación no disponible</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </Button>
                  <Button>
                    <Truck className="h-4 w-4 mr-2" />
                    Asignar Pedido
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Truck className="h-12 w-12 mx-auto opacity-20" />
                  <p className="mt-2">Selecciona un mensajero para ver su ubicación</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

