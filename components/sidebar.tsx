"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Package, Send, Info, HelpCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Linktree } from "@/components/linktree"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import Link from "next/link"

// Memoizar los componentes del sidebar para evitar re-renderizados innecesarios
const MemoizedSidebarItem = memo(SidebarItem)
const MemoizedSidebarItemWithSubmenu = memo(SidebarItemWithSubmenu)

export function Sidebar() {
  const [showDialog, setShowDialog] = useState(false)
  // Modificar el componente Sidebar para incluir un botón de colapso
  // Primero, agregar un estado para controlar la visibilidad de la sidebar
  // Modificar el componente Sidebar para tener una versión colapsada con iconos
  // Reemplazar el estado actual y el div principal con esta implementación

  // Modificar el estado
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Reemplazar el div principal con esta implementación que incluye dos versiones de la sidebar
  return (
    <>
      {/* Sidebar completa */}
      <div
        className={`${isSidebarCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-64"} bg-white p-4 border-r fixed top-16 left-0 overflow-y-auto flex-col hidden lg:flex h-[calc(100vh-4rem)] pb-16 z-10 scrollbar-thin transition-all duration-300`}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      >
        {/* Eliminar o comentar este botón
        <button
          onClick={() => setIsSidebarCollapsed(true)}
          className="absolute -right-4 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button> */}

        {/* Resto del contenido de la sidebar completa */}
        <style jsx>{`
          .scrollbar-thin {
            /* Estilos para Firefox */
            scrollbar-width: thin;
            scrollbar-color: rgba(203, 213, 225, 0.5) transparent;
          }
          
          /* Estilos para Chrome, Edge y Safari */
          .scrollbar-thin::-webkit-scrollbar {
            width: 2px;
            transition: width 0.2s ease;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(203, 213, 225, 0.5);
            border-radius: 20px;
          }
          
          .scrollbar-thin:hover::-webkit-scrollbar {
            width: 4px;
          }
          
          .scrollbar-thin:hover::-webkit-scrollbar-thumb {
            background-color: rgba(203, 213, 225, 0.8);
          }
        `}</style>
        <div className="flex-grow pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Flota Llama Express</h2>
            </div>

            <div className="space-y-2">
              <MemoizedSidebarItemWithSubmenu
                icon={<Package />}
                label="Servicios"
                submenuItems={[
                  { label: "Envío Nacional", href: "/servicios/nacional" },
                  { label: "Envío Internacional", href: "/servicios/internacional" },
                  { label: "Servicios Especiales", href: "/servicios/especiales" },
                ]}
              />
              <MemoizedSidebarItemWithSubmenu
                icon={<Send />}
                label="Envía"
                submenuItems={[
                  { label: "Crear Envío", href: "/envia/crear" },
                  { label: "Calcular Tarifa", href: "/envia/calcular" },
                  { label: "Programar Recojo", href: "/envia/recojo" },
                ]}
              />
              <MemoizedSidebarItem icon={<Info />} label="Llama Express Informa" href="/informa" />
              <MemoizedSidebarItemWithSubmenu
                icon={<HelpCircle />}
                label="Ayuda"
                submenuItems={[
                  { label: "Preguntas Frecuentes", href: "/ayuda/faq" },
                  { label: "Contacto", href: "/ayuda/contacto" },
                  { label: "Soporte en Línea", href: "/ayuda/soporte" },
                ]}
              />
              <MemoizedSidebarItemWithSubmenu
                icon={<Phone />}
                label="Comunícate"
                submenuItems={[
                  { label: "Atención al Cliente", href: "/comunicate/atencion" },
                  { label: "Reclamos", href: "/comunicate/reclamos" },
                  { label: "Sugerencias", href: "/comunicate/sugerencias" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Botón animado importante arriba de Linktree */}
        <div className="mt-6 mb-4">
          <motion.button
            className="w-full bg-gradient-to-r from-red-500 to-blue-500 text-white py-2 px-4 rounded-xl font-medium shadow-md flex items-center justify-center"
            onClick={() => setShowDialog(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -5, 0],
              boxShadow: [
                "0 4px 6px rgba(0, 0, 0, 0.1)",
                "0 10px 15px rgba(0, 0, 0, 0.2)",
                "0 4px 6px rgba(0, 0, 0, 0.1)",
              ],
            }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
              boxShadow: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
            }}
          >
            <Info className="w-5 h-5 mr-2" />
            Sobre Nosotros
          </motion.button>
        </div>

        <div className="mt-2">
          <Linktree />
        </div>
      </div>

      {/* Mini sidebar con solo iconos */}
      <div
        className={`${isSidebarCollapsed ? "w-16" : "w-0 opacity-0 pointer-events-none"} bg-white border-r fixed top-16 left-0 overflow-y-auto flex-col hidden lg:flex h-[calc(100vh-4rem)] z-10 transition-all duration-300`}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
      >
        {/* Eliminar o comentar este botón
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="absolute -right-4 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
          style={{ transform: "rotate(180deg)" }}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button> */}

        <div className="flex-grow pt-4 flex flex-col items-center space-y-6">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-md hover:bg-gray-100 transition-colors mb-6"
            title={isSidebarCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            <ChevronRight
              className={`w-5 h-5 text-gray-600 transition-transform ${isSidebarCollapsed ? "" : "rotate-180"}`}
            />
          </button>
          {/* Iconos de navegación */}
          <MiniSidebarItem icon={<Package />} label="Servicios" href="/servicios/nacional" />
          <MiniSidebarItem icon={<Send />} label="Envía" href="/envia/crear" />
          <MiniSidebarItem icon={<Info />} label="Llama Express Informa" href="/informa" />
          <MiniSidebarItem icon={<HelpCircle />} label="Ayuda" href="/ayuda/faq" />
          <MiniSidebarItem icon={<Phone />} label="Comunícate" href="/comunicate/atencion" />
        </div>

        {/* Botón de Sobre Nosotros en versión mini */}
        <div className="mt-6 mb-4 px-2">
          <motion.button
            className="w-full aspect-square bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-full shadow-md flex items-center justify-center"
            onClick={() => setShowDialog(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -5, 0],
              boxShadow: [
                "0 4px 6px rgba(0, 0, 0, 0.1)",
                "0 10px 15px rgba(0, 0, 0, 0.2)",
                "0 4px 6px rgba(0, 0, 0, 0.1)",
              ],
            }}
            transition={{
              y: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
              boxShadow: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
            }}
          >
            <Info className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Diálogo */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-xl p-6 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Sobre Nosotros</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1" />
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Nuestra empresa */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🏢</span> Nuestra empresa
              </h3>
              <div className="pl-7">
                <h4 className="font-medium">Presentación</h4>
                <p className="text-gray-700 mt-1">
                  Llama express S.A.C., es una empresa domiciliada en el Perú, creada sobre la base de los principios y
                  valores, cuyo objetivo fundamental es la satisfacción de nuestros clientes.
                </p>
              </div>
            </div>

            {/* Visión */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🔭</span> Visión de la empresa
              </h3>
              <p className="text-gray-700 pl-7">
                Ser a los ojos de nuestros clientes los mejores en el mercado, reconocidos por nuestra capacidad de
                gestión de transporte de carga y logística de manera confiable, eficiente, por sus niveles de
                competitividad y la calidad del servicio, que en la actualidad el mundo global, se mueve y comunica de
                manera diferente.
              </p>
            </div>

            {/* Misión */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🎯</span> Misión de la empresa
              </h3>
              <div className="text-gray-700 pl-7 space-y-2">
                <p>
                  Brindar y atender a nuestros clientes y colaboradores, los servicios de transporte, almacenamiento y
                  logística de manera eficiente confiable y personalizada, a nivel nacional e internacional.
                </p>
                <p>
                  Establecer a Llama express, como líder en logística, que brinda servicio de transporte y encomiendas
                  en el interior y exterior del país.
                </p>
              </div>
            </div>

            {/* Valores */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">✨</span> Valores de la empresa
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-red-600 mb-1">Honestidad</h4>
                  <p className="text-xs text-gray-600">
                    Nos caracterizamos con la transparencia en cada una de las operaciones del servicio.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-blue-600 mb-1">Calidad</h4>
                  <p className="text-xs text-gray-600">Cumplir con los más altos estándares de calidad y exigencias.</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-green-600 mb-1">Eficacia</h4>
                  <p className="text-xs text-gray-600">
                    Nos destacamos con los tiempos de entrega programados y minimizar incidencia en las operaciones.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-purple-600 mb-1">Profesionalismo</h4>
                  <p className="text-xs text-gray-600">
                    La logística que manejamos es de calidad y cuidado en cada operación.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-yellow-600 mb-1">Respeto</h4>
                  <p className="text-xs text-gray-600">
                    Valorar a los clientes, colaboradores, comunidades con dignidad y equidad; y al medio ambiente.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-indigo-600 mb-1">Compromiso</h4>
                  <p className="text-xs text-gray-600">
                    La atención y servicio que ofrecemos con la mayor eficacia a nuestros clientes, es nuestro principal
                    compromiso.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-teal-600 mb-1">Trabajo en equipo</h4>
                  <p className="text-xs text-gray-600">
                    Fomentamos la participación y atención en equipo, para crear un entorno de trabajo colaborativo y
                    promover la comunicación efectiva.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h4 className="font-medium text-orange-600 mb-1">Pasión</h4>
                  <p className="text-xs text-gray-600">
                    Entusiasmo y compromiso con nuestros clientes en las operaciones de logística.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Agregar este nuevo componente para los elementos de la mini sidebar
function MiniSidebarItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link href={href} passHref>
      <div className="relative group">
        <Button variant="ghost" className="w-10 h-10 rounded-full flex items-center justify-center p-0">
          {icon}
        </Button>
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
          {label}
        </div>
      </div>
    </Link>
  )
}

function SidebarItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  )
}

function SidebarItemWithSubmenu({
  icon,
  label,
  submenuItems,
}: {
  icon: React.ReactNode
  label: string
  submenuItems: { label: string; href: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Link href={submenuItems[0].href} passHref>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
        >
          {icon}
          <span>{label}</span>
          <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isOpen ? "rotate-90" : ""}`} />
        </Button>
      </Link>
      <motion.div
        className={cn("pl-6 space-y-1 mt-1")}
        initial="collapsed"
        animate={isOpen ? "open" : "collapsed"}
        variants={{
          open: { opacity: 1, height: "auto", marginTop: "0.25rem" },
          collapsed: { opacity: 0, height: 0, marginTop: 0 },
        }}
        transition={{ duration: 0.2 }}
      >
        {submenuItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}

