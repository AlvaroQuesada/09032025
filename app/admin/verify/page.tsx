"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyAdminPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [adminInfo, setAdminInfo] = useState({ email: "", name: "" })

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      verifyToken(token)
    } else {
      setIsLoading(false)
      setError("Token de verificación no proporcionado")
    }
  }, [searchParams])

  const verifyToken = async (token: string) => {
    setIsLoading(true)
    try {
      // Verificar que el token existe y no ha expirado
      const { data: tokenData, error: tokenError } = await supabase
        .from("admin_verification_tokens")
        .select("*")
        .eq("token", token)
        .single()

      if (tokenError) throw new Error("Token inválido o expirado")

      if (new Date(tokenData.expires_at) < new Date()) {
        throw new Error("El token ha expirado")
      }

      // Obtener información del usuario
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", tokenData.email)
        .single()

      if (userError) throw userError

      setAdminInfo({
        email: userData.email,
        name: userData.full_name,
      })

      // Actualizar el usuario en auth para confirmar su email
      const { error: updateError } = await supabase.auth.admin.updateUserById(userData.auth_id, {
        email_confirm: true,
        user_metadata: {
          ...userData.user_metadata,
          pending_verification: false,
        },
      })

      if (updateError) throw updateError

      // Eliminar el token usado
      await supabase.from("admin_verification_tokens").delete().eq("token", token)

      setIsVerified(true)
      toast.success("Administrador verificado correctamente")
    } catch (error) {
      console.error("Error verifying admin:", error)
      setError(error instanceof Error ? error.message : "Error al verificar el administrador")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verificación de Administrador</CardTitle>
          <CardDescription>Verificación de nueva cuenta de administrador</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
              <p>Verificando...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center text-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verificación fallida</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Administrador verificado</h3>
              <p className="text-gray-600">
                La cuenta de administrador para {adminInfo.name} ({adminInfo.email}) ha sido verificada y activada
                correctamente.
              </p>
            </div>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/admin")} className="w-full" disabled={isLoading}>
            Volver al panel de administración
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

