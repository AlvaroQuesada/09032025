"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-browser"
import { toast } from "sonner"
import { MapPin, Truck, Phone, RefreshCw, Package, Send, CheckCircle } from "lucide-react"
import { RequireAuth } from "@/components/auth/require-auth"

export default function DriverTrackingPage() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <DriverTracking />
    </RequireAuth>
  )
}

function DriverTracking() {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState("map")
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    fetchDrivers()
    fetchPendingOrders()

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

      // Obtener entregas asignadas a cada mensajero
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from("shipments")
        .select("*")
        .in("status", ["scheduled", "in_transit"])

      if (deliveriesError) throw deliveriesError

      // Combinar datos
      const driversWithData = driversData.map((driver) => {
        const location = locationsData.find((loc) => loc.driver_id === driver.id)
        const deliveries = deliveriesData.filter((del) => del.driver_id === driver.id)

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
          deliveries: deliveries.length,
        }
      })

      setDrivers(driversWithData)

      // Si no hay un conductor seleccionado y hay conductores disponibles, seleccionar el primero
      if (!selectedDriver && driversWithData.length > 0) {
        setSelectedDriver(driversWithData[0])
      }
    } catch (error) {
      console.error("Error fetching drivers:", error)
      toast.error("Error al cargar mensajeros")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          users:customer_id(full_name, email, phone_number)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error) throw error

      setPendingOrders(data || [])
    } catch (error) {
      console.error("Error fetching pending orders:", error)
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

  const handleAssignOrder = async () => {
    if (!selectedDriver || !selectedOrder) {
      toast.error("Selecciona un conductor y un pedido")
      return
    }

    try {
      // Actualizar el estado del pedido
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedOrder.id)

      if (orderError) throw orderError

      // Crear un nuevo envío
      const { error: shipmentError } = await supabase.from("shipments").insert({
        order_id: selectedOrder.id,
        driver_id: selectedDriver.id,
        status: "scheduled",
        start_time: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })

      if (shipmentError) throw shipmentError

      toast.success(`Pedido asignado a ${selectedDriver.full_name}`)
      setIsAssignDialogOpen(false)

      // Actualizar listas
      fetchDrivers()
      fetchPendingOrders()
    } catch (error) {
      console.error("Error assigning order:", error)
      toast.error("Error al asignar el pedido")
    }
  }

  const getStatusBadge = (status) => {
    if (!status) return null

    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      busy: "bg-yellow-100 text-yellow-800",
      available: "bg-blue-100 text-blue-800",
      offline: "bg-gray-100 text-gray-800",
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
                : status === "offline"
                  ? "Desconectado"
                  : status}
      </Badge>
    )
  }

  const filteredDrivers = drivers.filter(
    (driver) =>
      (driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" ||
        (driver.location && driver.location.status === statusFilter) ||
        (!driver.location && statusFilter === "offline")),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Rastreo de Mensajeros</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Pedidos Pendientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Mensajeros</h3>
                <Button variant="outline" size="sm" onClick={fetchDrivers}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Buscar mensajero..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="available">Disponibles</SelectItem>
                    <SelectItem value="busy">Ocupados</SelectItem>
                    <SelectItem value="offline">Desconectados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedDriver?.id === driver.id ? "border-blue-500 bg-blue-50" : ""
                      }`}
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
                            {getStatusBadge(driver.location?.status || "offline")}
                            {driver.deliveries > 0 && (
                              <Badge variant="outline" className="mt-1">
                                {driver.deliveries} entregas
                              </Badge>
                            )}
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
                        <div className="flex items-center gap-2">
                          {getStatusBadge(selectedDriver.location?.status || "offline")}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAssignDialogOpen(true)}
                            disabled={!selectedDriver.location || selectedDriver.location.status !== "available"}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Asignar pedido
                          </Button>
                        </div>
                      </div>

                      {selectedDriver.location ? (
                        <div className="flex-1 bg-gray-100 rounded-md relative" ref={mapRef}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
                              <p className="mt-2">
                                {selectedDriver.location.lat.toFixed(6)}, {selectedDriver.location.lng.toFixed(6)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Aquí se mostraría el mapa de Google Maps con la ubicación del conductor
                              </p>
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
                        <Button variant="outline">
                          <Send className="h-4 w-4 mr-2" />
                          Enviar mensaje
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
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Mensajeros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2 w-full max-w-sm">
                  <Input
                    placeholder="Buscar mensajero..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="available">Disponibles</SelectItem>
                      <SelectItem value="busy">Ocupados</SelectItem>
                      <SelectItem value="offline">Desconectados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={fetchDrivers}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>

              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mensajero
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última actualización
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entregas activas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Truck className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.full_name}</div>
                              <div className="text-sm text-gray-500">{driver.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(driver.location?.status || "offline")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.location ? new Date(driver.location.lastUpdated).toLocaleString() : "No disponible"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.deliveries || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" onClick={() => handleDriverSelect(driver.id)}>
                            <MapPin className="h-4 w-4 mr-1" />
                            Ver ubicación
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2 w-full max-w-sm">
                  <Input placeholder="Buscar pedido..." className="flex-1" />
                </div>
                <Button variant="outline" onClick={fetchPendingOrders}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>

              {pendingOrders.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 opacity-50" />
                  <p className="mt-2 text-gray-500">No hay pedidos pendientes</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.users?.full_name || "Cliente desconocido"}
                            </div>
                            <div className="text-sm text-gray-500">{order.users?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order)
                                setIsAssignDialogOpen(true)
                              }}
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Asignar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para asignar pedido */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Pedido a Mensajero</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Seleccionar Mensajero</Label>
              <Select
                value={selectedDriver?.id}
                onValueChange={(value) => {
                  const driver = drivers.find((d) => d.id === value)
                  setSelectedDriver(driver)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mensajero" />
                </SelectTrigger>
                <SelectContent>
                  {drivers
                    .filter((d) => d.location && d.location.status === "available")
                    .map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.full_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Seleccionar Pedido</Label>
              <Select
                value={selectedOrder?.id}
                onValueChange={(value) => {
                  const order = pendingOrders.find((o) => o.id === value)
                  setSelectedOrder(order)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar pedido" />
                </SelectTrigger>
                <SelectContent>
                  {pendingOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.users?.full_name || "Cliente"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedOrder && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-sm">Detalles del pedido</h4>
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Cliente:</strong> {selectedOrder.users?.full_name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {selectedDriver && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-sm">Detalles del mensajero</h4>
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Nombre:</strong> {selectedDriver.full_name}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedDriver.location?.status || "Desconectado"}
                  </p>
                  <p>
                    <strong>Entregas activas:</strong> {selectedDriver.deliveries || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssignOrder} disabled={!selectedDriver || !selectedOrder}>
              Asignar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

