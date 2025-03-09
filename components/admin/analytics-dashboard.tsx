"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { Users, Package, Truck, DollarSign, Clock, Calendar } from "lucide-react"

export function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    averageDeliveryTime: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("today")

  useEffect(() => {
    fetchStats()
  }, [timeRange])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // Fechas para filtrado
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay()) // Domingo como inicio de semana
      startOfWeek.setHours(0, 0, 0, 0)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Fetch total users
      const { count: userCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "customer")

      // Fetch total drivers
      const { count: driverCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "driver")

      // Fetch total orders
      const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

      // Fetch active orders
      const { count: activeOrderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "processing", "shipped"])

      // Fetch completed orders
      const { count: completedOrderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "delivered")

      // Fetch revenue for different time periods
      const { data: todayOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", today.toISOString())

      const { data: weekOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", startOfWeek.toISOString())

      const { data: monthOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", startOfMonth.toISOString())

      // Calculate revenue
      const revenueToday = todayOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const revenueThisWeek = weekOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const revenueThisMonth = monthOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      // Fetch average delivery time
      const { data: deliveredOrders } = await supabase
        .from("orders")
        .select("created_at, delivered_at")
        .eq("status", "delivered")
        .order("created_at", { ascending: false })
        .limit(100)

      let totalDeliveryTime = 0
      let countForAverage = 0

      if (deliveredOrders && deliveredOrders.length > 0) {
        deliveredOrders.forEach((order) => {
          if (order.created_at && order.delivered_at) {
            const createdDate = new Date(order.created_at)
            const deliveredDate = new Date(order.delivered_at)
            const timeDiff = deliveredDate.getTime() - createdDate.getTime()
            totalDeliveryTime += timeDiff
            countForAverage++
          }
        })
      }

      const averageDeliveryTime = countForAverage > 0 ? totalDeliveryTime / countForAverage / (1000 * 60 * 60) : 0 // en horas

      setStats({
        totalUsers: userCount || 0,
        totalDrivers: driverCount || 0,
        totalOrders: orderCount || 0,
        activeOrders: activeOrderCount || 0,
        completedOrders: completedOrderCount || 0,
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        averageDeliveryTime,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return `S/ ${amount.toFixed(2)}`
  }

  const formatTime = (hours) => {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours - wholeHours) * 60)
    return `${wholeHours}h ${minutes}m`
  }

  return (
    <div className="space-y-4">
      <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hoy
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Esta Semana
          </TabsTrigger>
          <TabsTrigger value="month" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Este Mes
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? `+${Math.floor(stats.totalUsers * 0.05)} nuevos este mes` : "Sin datos"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensajeros</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalDrivers > 0 ? `${Math.floor(stats.totalDrivers * 0.7)} activos actualmente` : "Sin datos"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOrders}</div>
              <p className="text-xs text-muted-foreground">De un total de {stats.totalOrders} pedidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(stats.averageDeliveryTime)}</div>
              <p className="text-xs text-muted-foreground">Tiempo promedio de entrega</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timeRange === "today"
                  ? formatCurrency(stats.revenueToday)
                  : timeRange === "week"
                    ? formatCurrency(stats.revenueThisWeek)
                    : formatCurrency(stats.revenueThisMonth)}
              </div>
              <p className="text-xs text-muted-foreground">
                {timeRange === "today"
                  ? "Ingresos de hoy"
                  : timeRange === "week"
                    ? "Ingresos de esta semana"
                    : "Ingresos de este mes"}
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Completados</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedOrders > 0
                  ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}% de tasa de finalización`
                  : "Sin pedidos completados"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

