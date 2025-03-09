"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase-browser"
import { toast } from "sonner"
import { Eye, Truck, Package, RefreshCw, Calendar, Clock, Users } from "lucide-react"

export function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState("")
  const [orderStatus, setOrderStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          users:customer_id(full_name, email, phone_number),
          shipments(
            *,
            driver:driver_id(full_name, email, phone_number)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Error al cargar pedidos")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("role", "driver")
        .eq("status", "active")

      if (error) throw error

      setAvailableDrivers(data || [])
    } catch (error) {
      console.error("Error fetching drivers:", error)
      toast.error("Error al cargar mensajeros disponibles")
    }
  }

  const handleViewOrder = async (order) => {
    setSelectedOrder(order)
    setOrderStatus(order.status)

    if (order.shipments && order.shipments[0]?.driver_id) {
      setSelectedDriver(order.shipments[0].driver_id)
    } else {
      setSelectedDriver("")
      await fetchAvailableDrivers()
    }

    setIsDialogOpen(true)
  }

  const handleUpdateOrder = async () => {
    setIsLoading(true)
    try {
      // Actualizar estado del pedido
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: orderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedOrder.id)

      if (orderError) throw orderError

      // Si hay un envío existente, actualizarlo
      if (selectedOrder.shipments && selectedOrder.shipments.length > 0) {
        const { error: shipmentError } = await supabase
          .from("shipments")
          .update({
            driver_id: selectedDriver || null,
            status: orderStatus === "delivered" ? "delivered" : orderStatus === "shipped" ? "in_transit" : "scheduled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedOrder.shipments[0].id)

        if (shipmentError) throw shipmentError
      }
      // Si no hay envío, crear uno nuevo
      else if (selectedDriver) {
        const { error: newShipmentError } = await supabase.from("shipments").insert({
          order_id: selectedOrder.id,
          driver_id: selectedDriver,
          status: orderStatus === "delivered" ? "delivered" : orderStatus === "shipped" ? "in_transit" : "scheduled",
          start_time: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })

        if (newShipmentError) throw newShipmentError
      }

      toast.success("Pedido actualizado con éxito")
      setIsDialogOpen(false)
      fetchOrders()
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Error al actualizar el pedido")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    if (!status) return null

    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }

    const statusText = {
      pending: "Pendiente",
      processing: "Procesando",
      shipped: "En camino",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }

    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{statusText[status] || status}</Badge>
  }

  const formatAddress = (addressStr) => {
    try {
      const address = JSON.parse(addressStr)
      return `${address.street}, ${address.city}, ${address.state}`
    } catch (e) {
      return addressStr || "Dirección no disponible"
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toString().includes(searchTerm) ||
        order.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || order.status === statusFilter),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="processing">Procesando</SelectItem>
              <SelectItem value="shipped">En camino</SelectItem>
              <SelectItem value="delivered">Entregados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Mensajero</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No se encontraron pedidos
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.users?.full_name || "Cliente desconocido"}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {order.shipments && order.shipments[0]?.driver
                        ? order.shipments[0].driver.full_name
                        : "No asignado"}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalles del Pedido #{selectedOrder.id}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">
                  <Package className="h-4 w-4 mr-2" />
                  Detalles
                </TabsTrigger>
                <TabsTrigger value="customer">
                  <Users className="h-4 w-4 mr-2" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger value="shipping">
                  <Truck className="h-4 w-4 mr-2" />
                  Envío
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="processing">Procesando</SelectItem>
                        <SelectItem value="shipped">En camino</SelectItem>
                        <SelectItem value="delivered">Entregado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha de creación</h3>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                      <Clock className="h-4 w-4 mx-2 text-gray-400" />
                      {new Date(selectedOrder.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dirección de recogida</h3>
                  <p>{formatAddress(selectedOrder.pickup_address)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dirección de entrega</h3>
                  <p>{formatAddress(selectedOrder.delivery_address)}</p>
                </div>

                {selectedOrder.require_invoice && (
                  <div>
                    <Badge>Requiere factura</Badge>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="customer">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                    <p className="font-medium">{selectedOrder.users?.full_name || "No disponible"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{selectedOrder.users?.email || "No disponible"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                    <p>{selectedOrder.users?.phone_number || "No disponible"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mensajero asignado</h3>
                    <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar mensajero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Sin asignar</SelectItem>
                        {availableDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.full_name}
                          </SelectItem>
                        ))}
                        {selectedOrder.shipments && selectedOrder.shipments[0]?.driver && (
                          <SelectItem value={selectedOrder.shipments[0].driver.id}>
                            {selectedOrder.shipments[0].driver.full_name} (Actual)
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedOrder.shipments && selectedOrder.shipments[0] && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Estado del envío</h3>
                        <p>{getStatusBadge(selectedOrder.shipments[0].status)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Fecha de inicio</h3>
                        <p>{new Date(selectedOrder.shipments[0].start_time).toLocaleString()}</p>
                      </div>

                      {selectedOrder.shipments[0].end_time && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Fecha de entrega</h3>
                          <p>{new Date(selectedOrder.shipments[0].end_time).toLocaleString()}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateOrder} disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

