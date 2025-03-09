"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const mockLocations = [
  { id: 1, name: "Lima Centro", address: "Av. Arequipa 123, Lima" },
  { id: 2, name: "Miraflores", address: "Calle Schell 456, Miraflores" },
  { id: 3, name: "San Isidro", address: "Av. Javier Prado 789, San Isidro" },
  { id: 4, name: "Surco", address: "Av. Caminos del Inca 321, Surco" },
]

export function LocationFinder() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])

  const searchLocations = () => {
    const filtered = mockLocations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setResults(filtered)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Buscador de Ubicaciones</h2>
      <div className="flex space-x-2">
        <div className="flex-grow">
          <Label htmlFor="locationSearch">Buscar ubicación</Label>
          <Input
            id="locationSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ingrese una ciudad o dirección"
          />
        </div>
        <Button onClick={searchLocations} className="mt-6">
          Buscar
        </Button>
      </div>
      {results.length > 0 ? (
        <div className="mt-4 space-y-2">
          {results.map((location) => (
            <div key={location.id} className="p-3 bg-gray-100 rounded-md">
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm text-gray-600">{location.address}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No se encontraron resultados.</p>
      )}
    </div>
  )
}

