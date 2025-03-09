"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { RequireAuth } from "@/components/auth/require-auth"

export default function AdminSettingsPage() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminSettings />
    </RequireAuth>
  )
}

function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")
  const [originalEmail, setOriginalEmail] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("admin_settings").select("*").single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setVerificationEmail(data.verification_email || "")
        setOriginalEmail(data.verification_email || "")
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("Error al cargar la configuración")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Verificar si ya existe un registro
      const { data, error: checkError } = await supabase.from("admin_settings").select("id").single()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }

      if (data) {
        // Actualizar registro existente
        const { error } = await supabase
          .from("admin_settings")
          .update({ verification_email: verificationEmail })
          .eq("id", data.id)

        if (error) throw error
      } else {
        // Crear nuevo registro
        const { error } = await supabase.from("admin_settings").insert({ verification_email: verificationEmail })

        if (error) throw error
      }

      setOriginalEmail(verificationEmail)
      toast.success("Configuración guardada correctamente")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Error al guardar la configuración")
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = verificationEmail !== originalEmail

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Configuración de Administración</h1>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Configuración de Verificación</CardTitle>
          <CardDescription>
            Configura el correo electrónico al que se enviarán las notificaciones de verificación para nuevos
            administradores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="settings-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationEmail">Correo de Verificación</Label>
              <Input
                id="verificationEmail"
                type="email"
                value={verificationEmail}
                onChange={(e) => setVerificationEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
              <p className="text-xs text-gray-500">
                Este correo recibirá las notificaciones cuando se cree un nuevo administrador.
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="settings-form" disabled={isLoading || !hasChanges} className="w-full">
            {isLoading ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

