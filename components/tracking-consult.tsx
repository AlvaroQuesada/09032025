import { Search } from "lucide-react"

export function TrackingConsult() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center">
        <Search className="mr-2 w-5 h-5 md:w-6 md:h-6" /> Consulta el tracking de tu envío
      </h2>
      <form className="space-y-3 md:space-y-4">
        <input
          type="text"
          placeholder="Ingresa tu número de guía"
          className="w-full px-3 py-2 border rounded-md text-sm md:text-base"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm md:text-base transition-colors duration-300"
        >
          Rastrear
        </button>
      </form>
    </div>
  )
}

