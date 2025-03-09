"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export function Settings() {
  const [settings, setSettings] = useState({
    companyName: "Llama Express",
    supportEmail: "soporte@llamaexpress.com",
    enableNotifications: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar la configuración
    console.log("Configuración guardada:", settings)
    toast.success("Configuración actualizada con éxito")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Nombre de la Empresa</Label>
        <Input id="companyName" name="companyName" value={settings.companyName} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supportEmail">Email de Soporte</Label>
        <Input
          id="supportEmail"
          name="supportEmail"
          type="email"
          value={settings.supportEmail}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="enableNotifications"
          name="enableNotifications"
          checked={settings.enableNotifications}
          onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableNotifications: checked }))}
        />
        <Label htmlFor="enableNotifications">Habilitar Notificaciones</Label>
      </div>
      <Button type="submit">Guardar Configuración</Button>
    </form>
  )
}

