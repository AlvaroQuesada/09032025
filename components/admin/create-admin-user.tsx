"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CreateAdminUser() {
  const { userRole } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    verifyEmail: "", // Email para enviar la verificación
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Verificar que el usuario actual es administrador
      if (userRole !== "admin") {
        throw new Error("Solo los administradores pueden crear nuevos administradores")
      }

      // Obtener el correo de verificación configurado o usar el proporcionado
      const targetEmail = formData.verifyEmail || verificationEmail || formData.email

      // Crear el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        email_confirm: false, // Requerirá verificación
        user_metadata: {
          full_name: formData.fullName,
          role: "admin",
          phone_number: formData.phoneNumber,
          pending_verification: true,
        },
      })

      if (authError) throw authError

      // Crear el usuario en la tabla users
      const { error: dbError } = await supabase.from("users").insert({
        email: formData.email,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        role: "admin",
        auth_id: authData.user.id,
      })

      if (dbError) throw dbError

      // Enviar correo de verificación al administrador actual o al correo configurado
      const { error: verificationError } = await supabase.functions.invoke("send-admin-verification", {
        body: {
          newAdminEmail: formData.email,
          newAdminName: formData.fullName,
          verificationEmail: targetEmail,
        },
      })

      if (verificationError) throw verificationError

      setVerificationSent(true)
      toast.success(`Se ha enviado un correo de verificación a ${targetEmail}`)

      // Limpiar el formulario
      setFormData({
        email: "",
        fullName: "",
        phoneNumber: "",
        verifyEmail: "",
      })
    } catch (error) {
      console.error("Error creating admin user:", error)
      setError(error instanceof Error ? error.message : "Error al crear el administrador")
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar el correo de verificación configurado
  const loadVerificationEmail = async () => {
    try {
      const { data, error } = await supabase.from("admin_settings").select("verification_email").single()

      if (error) throw error
      if (data?.verification_email) {
        setVerificationEmail(data.verification_email)
      }
    } catch (error) {
      console.error("Error loading verification email:", error)
    }
  }

  // Cargar el correo al montar el componente
  useState(() => {
    loadVerificationEmail()
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Administrador</CardTitle>
        <CardDescription>Crea una nueva cuenta de administrador. Se enviará un correo de verificación.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verificationSent && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Se ha enviado un correo de verificación. El nuevo administrador debe seguir las instrucciones para activar
              su cuenta.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Teléfono</Label>
            <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verifyEmail">Enviar verificación a (opcional)</Label>
            <Input
              id="verifyEmail"
              name="verifyEmail"
              type="email"
              value={formData.verifyEmail}
              onChange={handleInputChange}
              placeholder={verificationEmail || "Correo para verificación"}
            />
            <p className="text-xs text-gray-500">
              Si se deja vacío, se enviará al correo configurado en ajustes
              {verificationEmail ? ` (${verificationEmail})` : ""}.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? "Creando..." : "Crear Administrador"}
        </Button>
      </CardFooter>
    </Card>
  )
}

