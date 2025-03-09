import { CreditCard } from "lucide-react"
import Image from "next/image"

export function PaymentMethods() {
  const methods = [
    {
      name: "Plin",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plin-3HqmwgvjhmqQenqcvLcPu7a6uZKh2x.png",
    },
    {
      name: "Yape",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yape-aMT22cg707KMVyxyEI2nQYznm6XwmP.png",
    },
    {
      name: "BCP",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bcp-IZEz1rSEsCDSmMxj6fI1cJXWdR83fO.png",
    },
    {
      name: "Efectivo",
      icon: (
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#4CAF50" />
          <path
            d="M12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12C18 8.7 15.3 6 12 6ZM12 16.5C9.525 16.5 7.5 14.475 7.5 12C7.5 9.525 9.525 7.5 12 7.5C14.475 7.5 16.5 9.525 16.5 12C16.5 14.475 14.475 16.5 12 16.5Z"
            fill="white"
          />
          <path
            d="M12 9.75C11.175 9.75 10.5 10.425 10.5 11.25V12.75C10.5 13.575 11.175 14.25 12 14.25C12.825 14.25 13.5 13.575 13.5 12.75V11.25C13.5 10.425 12.825 9.75 12 9.75Z"
            fill="white"
          />
          <path d="M9 10.5V13.5M15 10.5V13.5" stroke="white" strokeWidth="1.5" />
        </svg>
      ),
    },
  ]

  return (
    <div className="bg-white/50 backdrop-blur-sm border rounded-lg p-3 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-gray-600" />
          <span className="font-medium text-lg text-gray-600">Aceptamos:</span>
        </div>

        {/* Eliminar el espacio entre "Aceptamos:" y los logos */}
        <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4 w-full md:w-auto">
          {methods.map((method) => (
            <div key={method.name} className="transition-transform hover:scale-110">
              <div className="relative w-14 h-14 flex items-center justify-center">
                {typeof method.icon === "string" ? (
                  <Image
                    src={method.icon || "/placeholder.svg"}
                    alt={`${method.name} logo`}
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                ) : (
                  method.icon
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

