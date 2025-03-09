import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-center">Verifica tu correo electrónico</CardTitle>
          <CardDescription className="text-center">
            Hemos enviado un enlace de verificación a tu correo electrónico
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.
          </p>
          <p className="text-sm text-gray-500">
            Si no recibes el correo en unos minutos, revisa tu carpeta de spam o solicita un nuevo enlace.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

