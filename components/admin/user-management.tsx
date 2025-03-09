"use client"

import { useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-browser"
import { toast } from "sonner"
import { Edit, Trash2, UserPlus } from "lucide-react"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function UserManagement({ userType = "all" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role: "customer",
    status: "active",
  })

  // Usar nuestro hook personalizado para consultas
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useSupabaseQuery(
    "users",
    (query) => {
      let q = query.select("*")
      if (userType !== "all") {
        q = q.eq("role", userType)
      }
      return q.order("created_at", { ascending: false })
    },
    [userType],
  )

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleEditUser = useCallback((user) => {
    setCurrentUser(user)
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number || "",
      role: user.role,
      status: user.status || "active",
    })
    setIsDialogOpen(true)
  }, [])

  const handleCreateUser = useCallback(() => {
    setCurrentUser(null)
    setFormData({
      full_name: "",
      email: "",
      phone_number: "",
      role: userType !== "all" ? userType : "customer",
      status: "active",
    })
    setIsDialogOpen(true)
  }, [userType])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (currentUser) {
        // Actualizar usuario existente
        const { error } = await supabase
          .from("users")
          .update({
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            role: formData.role,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentUser.id)

        if (error) throw error

        toast.success("Usuario actualizado con éxito")
      } else {
        // Crear nuevo usuario
        // Primero, crear el usuario en auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          email_confirm: true,
          user_metadata: {
            full_name: formData.full_name,
            role: formData.role,
          },
        })

        if (authError) throw authError

        // Luego, crear el usuario en la tabla users
        const { error } = await supabase.from("users").insert({
          email: formData.email,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          role: formData.role,
          status: formData.status,
          auth_id: authData.user.id,
        })

        if (error) throw error

        toast.success("Usuario creado con éxito")
      }

      setIsDialogOpen(false)
      refetch() // Actualizar datos
    } catch (error) {
      console.error("Error saving user:", error)
      toast.error(error.message || "Error al guardar usuario")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return

    try {
      const { error } = await supabase.from("users").update({ status: "inactive" }).eq("id", userId)

      if (error) throw error

      toast.success("Usuario desactivado con éxito")
      refetch() // Actualizar datos
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error al desactivar usuario")
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || user.status === statusFilter),
  )

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "bg-purple-100 text-purple-800",
      customer: "bg-blue-100 text-blue-800",
      driver: "bg-green-100 text-green-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || "bg-gray-100 text-gray-800"}`}>
        {role === "admin" ? "Administrador" : role === "customer" ? "Cliente" : "Mensajero"}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    if (!status) return null

    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status === "active" ? "Activo" : status === "inactive" ? "Inactivo" : "Pendiente"}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar usuarios..."
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
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number || "-"}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="full_name" className="text-right">
                  Nombre Completo
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                  disabled={!!currentUser}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone_number" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rol
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                  disabled={userType !== "all"}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Cliente</SelectItem>
                    <SelectItem value="driver">Mensajero</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {currentUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Estado
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{currentUser ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

