import { AuthForm } from "@/components/auth/auth-form"
import Image from "next/image"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagen_de_WhatsApp_2025-02-04_a_las_12.24.39_d040dbc0-removebg-preview-dS8TNTko9LdhVkaZZ3agMhVzRngJAZ.png"
            alt="Llama Express Logo"
            width={120}
            height={120}
            className="mb-4"
          />
          <h2 className="text-3xl font-bold text-center text-gray-900">Bienvenido a Llama Express</h2>
          <p className="mt-2 text-center text-gray-600">La plataforma líder en envíos y logística en Perú</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}

