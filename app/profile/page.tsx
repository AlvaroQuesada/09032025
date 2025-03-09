"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  })

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.user_metadata.full_name || "",
        email: user.email || "",
        phone_number: user.user_metadata.phone_number || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone_number: profile.phone_number,
        },
      })

      if (error) throw error

      toast.success("Perfil actualizado con éxito")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Error al actualizar el perfil")
    }
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Perfil de Usuario</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nombre Completo</Label>
              <Input id="full_name" name="full_name" value={profile.full_name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" value={profile.email} disabled />
            </div>
            <div>
              <Label htmlFor="phone_number">Teléfono</Label>
              <Input id="phone_number" name="phone_number" value={profile.phone_number} onChange={handleInputChange} />
            </div>
            <Button type="submit">Actualizar Perfil</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

