import { Phone, Mail, MapPin } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Phone className="mr-2" /> Teléfono
          </h3>
          <p>Atención al cliente: 0800-123-4567</p>
          <p>Ventas corporativas: (01) 234-5678</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Mail className="mr-2" /> Correo Electrónico
          </h3>
          <p>Consultas generales: info@llamaexpress.com</p>
          <p>Soporte técnico: soporte@llamaexpress.com</p>
        </div>
        <div className="p-4 border rounded-lg md:col-span-2">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <MapPin className="mr-2" /> Dirección
          </h3>
          <p>Oficina principal: Av. Javier Prado Este 3580, San Borja, Lima</p>
          <p>Horario de atención: Lunes a Viernes de 9:00 AM a 6:00 PM</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Formulario de Contacto</h3>
        <form className="space-y-4">
          <input type="text" placeholder="Nombre" className="w-full p-2 border rounded" />
          <input type="email" placeholder="Correo electrónico" className="w-full p-2 border rounded" />
          <textarea placeholder="Mensaje" rows={4} className="w-full p-2 border rounded"></textarea>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  )
}

