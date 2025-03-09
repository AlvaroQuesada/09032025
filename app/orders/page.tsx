"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (user) {
      fetchUserId()
    }
  }, [user])

  useEffect(() => {
    if (userId) {
      fetchOrders()
      fetchInvoices()
    }
  }, [userId])

  const fetchUserId = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id").eq("auth_id", user.id).single()

      if (error) throw error
      setUserId(data.id)
      console.log("User ID fetched:", data.id)
    } catch (error) {
      console.error("Error fetching user ID:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders for user ID:", userId)
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      console.log("Orders fetched:", data)
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    }
  }

  const fetchInvoices = async () => {
    try {
      console.log("Fetching invoices for user ID:", userId)
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      console.log("Invoices fetched:", data)
      setInvoices(data || [])
    } catch (error) {
      console.error("Error fetching invoices:", error)
      setInvoices([])
    }
  }

  const safeParseAddress = (address) => {
    try {
      const parsedAddress = JSON.parse(address)
      return parsedAddress.street || address
    } catch (error) {
      return address
    }
  }

  const formatTotal = (total) => {
    if (total === null || total === undefined) {
      return "N/A"
    }
    return `S/ ${Number(total).toFixed(2)}`
  }

  if (!user) {
    return <div>Por favor, inicia sesión para ver tus pedidos y facturas.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos y Facturas</h1>

      {/* Información de depuración */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>Auth ID: {user?.id}</p>
        <p>Usuario ID en la base de datos: {userId}</p>
        <p>Pedidos cargados: {orders.length}</p>
        <p>Facturas cargadas: {invoices.length}</p>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mis Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p>No tienes pedidos registrados.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID del Pedido</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead>Dirección de Recogida</TableHead>
                      <TableHead>Dirección de Entrega</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                        <TableCell>{safeParseAddress(order.pickup_address)}</TableCell>
                        <TableCell>{safeParseAddress(order.delivery_address)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Mis Facturas</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p>No tienes facturas registradas.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID de Factura</TableHead>
                      <TableHead>Número de Factura</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.invoice_number}</TableCell>
                        <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{formatTotal(invoice.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

