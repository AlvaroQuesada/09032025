"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagement } from "@/components/admin/user-management"
import { OrderManagement } from "@/components/admin/order-management"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { Settings } from "@/components/admin/settings"
import { DriverTracking } from "@/components/admin/driver-tracking"
import { Users, Package, BarChart2, SettingsIcon, MapPin, Truck, User } from "lucide-react"
import { CreateAdminUser } from "@/components/admin/create-admin"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Mensajeros
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Rastreo
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Administradores
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard General</CardTitle>
              <CardDescription>Vista general del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Clientes</CardTitle>
              <CardDescription>Administra los clientes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement userType="customer" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Mensajeros</CardTitle>
              <CardDescription>Administra los mensajeros del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement userType="driver" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Rastreo de Mensajeros</CardTitle>
              <CardDescription>Visualiza la ubicación de los mensajeros en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <DriverTracking />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pedidos</CardTitle>
              <CardDescription>Administra los pedidos y envíos</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Administradores</CardTitle>
              <CardDescription>Crea y administra cuentas de administrador</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateAdminUser />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>Ajusta la configuración general del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Settings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

