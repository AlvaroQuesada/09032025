import { Package, Truck, Warehouse, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogisticsSidebar({ activeSection, setActiveSection }) {
  const sections = [
    { name: "dashboard", label: "Dashboard", icon: <Package className="w-4 h-4 mr-2" /> },
    { name: "envios", label: "Envíos", icon: <Truck className="w-4 h-4 mr-2" /> },
    { name: "inventario", label: "Inventario", icon: <Warehouse className="w-4 h-4 mr-2" /> },
    { name: "usuarios", label: "Usuarios", icon: <Users className="w-4 h-4 mr-2" /> },
    { name: "configuracion", label: "Configuración", icon: <Settings className="w-4 h-4 mr-2" /> },
  ]

  return (
    <div className="w-64 bg-white p-4 border-r h-[calc(100vh-3rem)] fixed top-12 left-0 overflow-y-auto shadow-lg transition-all duration-300 ease-in-out">
      <div className="pt-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Gestión de Logística</h2>
        <div className="space-y-2">
          {sections.map((section) => (
            <Button
              key={section.name}
              variant={activeSection === section.name ? "default" : "ghost"}
              className={`w-full justify-start transition-all duration-300 ease-in-out ${
                activeSection === section.name
                  ? "bg-gradient-to-r from-red-500 to-blue-500 text-white"
                  : "hover:bg-gradient-to-r hover:from-red-100 hover:to-blue-100"
              }`}
              onClick={() => setActiveSection(section.name)}
            >
              {section.icon}
              {section.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

