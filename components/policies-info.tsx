export function PoliciesInfo() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Políticas de Envío</h2>
      <div className="space-y-4">
        <section>
          <h3 className="text-xl font-semibold">Límites de Peso y Tamaño</h3>
          <ul className="list-disc list-inside">
            <li>Peso máximo por paquete: 30 kg</li>
            <li>Dimensiones máximas: 100cm x 60cm x 60cm</li>
            <li>Para envíos más grandes, contacte nuestro servicio de carga</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Artículos Prohibidos</h3>
          <ul className="list-disc list-inside">
            <li>Materiales peligrosos o inflamables</li>
            <li>Drogas ilegales y medicamentos sin receta</li>
            <li>Animales vivos</li>
            <li>Armas de fuego y explosivos</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Garantías y Seguros</h3>
          <p>Ofrecemos seguro opcional para todos los envíos. El costo es del 1% del valor declarado del paquete.</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold">Tiempos de Entrega</h3>
          <ul className="list-disc list-inside">
            <li>Envío estándar: 3-5 días hábiles</li>
            <li>Envío express: 1-2 días hábiles</li>
            <li>Los tiempos pueden variar según la ubicación y las condiciones</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

