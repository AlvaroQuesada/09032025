import Link from "next/link"
import { ArrowRight, Send, MessageSquare, Package, Store, Gift, Calculator } from "lucide-react"

export function Linktree() {
  const links = [
    { name: "Tus envíos urgentes", href: "/envios-urgentes", color: "bg-red-500", icon: Send },
    {
      name: "Contáctanos (WhatsApp)",
      href: "https://wa.me/yourwhatsappnumber",
      color: "bg-green-500",
      icon: MessageSquare,
    },
    { name: "Servicios", href: "/servicios", color: "bg-blue-500", icon: Package },
    { name: "Nuestra tienda", href: "/tienda", color: "bg-purple-500", icon: Store },
    { name: "Promociones", href: "/promociones", color: "bg-yellow-500", icon: Gift },
    { name: "Cotizaciones", href: "/cotizaciones", color: "bg-orange-500", icon: Calculator },
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Accesos Rápidos</h2>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`block w-full text-left ${link.color} hover:opacity-90 text-white font-medium py-2 px-3 rounded-md transition-all duration-300 ease-in-out flex justify-between items-center text-sm`}
          >
            <span className="flex items-center">
              <link.icon className="w-4 h-4 mr-2" />
              {link.name}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ))}
      </div>
    </div>
  )
}

