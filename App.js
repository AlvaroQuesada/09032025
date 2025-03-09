import "./App.css"

// Componente Logo
function Logo({ variant = "default" }) {
  const textColor = variant === "default" ? "text-[#E31E24]" : "text-white"

  return (
    <a href="/" className="flex-shrink-0">
      <div className="flex items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cVxjG9RC2yd2v2wCCEM5C55K1FZJrD.png"
          alt="Llama Express Logo"
          className="w-12 h-12 mr-2"
        />
        <h1 className="text-2xl font-bold tracking-wider">
          <span className={textColor}>LLAMA</span>
          <span className="text-[#1e3fac]">EXPRESS</span>
        </h1>
      </div>
    </a>
  )
}

// Componente NavLink
function NavLink({ href, icon, label }) {
  return (
    <a href={href} className="flex flex-col items-center text-sm hover:opacity-80 transition-opacity">
      {icon}
      <span className="mt-1">{label}</span>
    </a>
  )
}

// Componente NavBar
function NavBar() {
  return (
    <nav className="bg-gradient-to-r from-[#E31E24] to-[#cb1a1f] text-white py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Logo variant="white" />
          <div className="flex items-center space-x-8">
            <NavLink href="/" icon="🏠" label="Inicio" />
            <NavLink href="/rastrea" icon="🔍" label="Rastrea" />
            <NavLink href="/pagalo" icon="💳" label="Págalo" />
            <NavLink href="/agencias" icon="📍" label="Agencias" />
            <NavLink href="/tarifas" icon="📄" label="Tarifas" />
          </div>
        </div>
      </div>
    </nav>
  )
}

// Componente SidebarItem
function SidebarItem({ icon, label, expandable }) {
  return (
    <button className="w-full text-left py-2 px-4 hover:bg-gray-100 flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
      {expandable && <span className="ml-auto">+</span>}
    </button>
  )
}

// Componente Sidebar
function Sidebar() {
  return (
    <div className="w-64 bg-white p-4 border-r h-screen">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Flota Llama Express</h2>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">NUEVO</span>
        </div>
        <div className="space-y-2">
          <SidebarItem icon="📦" label="Servicios" expandable />
          <SidebarItem icon="✉️" label="Envía" expandable />
          <SidebarItem icon="ℹ️" label="Llama Express Informa" />
          <SidebarItem icon="❓" label="Ayuda" expandable />
          <SidebarItem icon="📞" label="Comunícate" expandable />
        </div>
      </div>
    </div>
  )
}

// Componente principal App
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Bienvenido a Llama Express</h1>
          <p>Contenido principal aquí...</p>
        </main>
      </div>
    </div>
  )
}

export default App

