"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Search, Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"

const categories = ["Todos", "Tecnología", "Moda", "Hogar", "Deportes", "Belleza", "Juguetes", "Libros", "Alimentos"]

const products = [
  {
    id: 1,
    name: "Llama Express Delivery Bag",
    category: "Accesorios",
    price: 89.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    description: "Bolsa de entrega oficial de Llama Express, resistente y con múltiples compartimentos.",
  },
  {
    id: 2,
    name: "Llama Tracking Device",
    category: "Tecnología",
    price: 49.99,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200",
    description: "Dispositivo de seguimiento GPS para paquetes, con batería de larga duración.",
  },
  {
    id: 3,
    name: "Express Delivery Uniform",
    category: "Ropa",
    price: 129.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    description: "Uniforme oficial de Llama Express, cómodo y resistente para el trabajo diario.",
  },
  {
    id: 4,
    name: "Llama Express Water Bottle",
    category: "Accesorios",
    price: 19.99,
    rating: 4.0,
    image: "/placeholder.svg?height=200&width=200",
    description: "Botella de agua ecológica con el logo de Llama Express, perfecta para mantenerte hidratado.",
  },
  {
    id: 5,
    name: "Delivery Route Optimizer Software",
    category: "Software",
    price: 299.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    description: "Software avanzado para optimizar rutas de entrega y mejorar la eficiencia.",
  },
  {
    id: 6,
    name: "Llama Express Cap",
    category: "Ropa",
    price: 24.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200",
    description: "Gorra oficial de Llama Express, perfecta para protegerte del sol durante las entregas.",
  },
  {
    id: 7,
    name: "Smart Packaging Tape",
    category: "Accesorios",
    price: 14.99,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    description: "Cinta de embalaje inteligente que cambia de color si el paquete ha sido manipulado.",
  },
  {
    id: 8,
    name: "Llama Express Drone",
    category: "Tecnología",
    price: 599.99,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
    description: "Dron de entrega para acceder a zonas de difícil acceso, con cámara HD y GPS integrado.",
  },
]

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 600])
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart([...cart, product])
    alert(`${product.name} agregado al carrito`)
  }

  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    const result = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "Todos" || product.category === selectedCategory) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (!showFeaturedOnly || product.rating >= 4.5),
    )

    result.sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price
      if (sortBy === "priceDesc") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return 0 // featured
    })

    setFilteredProducts(result)
  }, [searchTerm, selectedCategory, sortBy, priceRange, showFeaturedOnly])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Marketplace Llama Express</h1>

      {/* Filters section - moved to top */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros y Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <Select id="category" value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full transition-colors duration-200 hover:bg-red-100 focus:bg-red-100">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
                Rango de Precio
              </label>
              <Slider
                id="priceRange"
                min={0}
                max={600}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
                className="w-full transition-colors duration-200 hover:bg-red-100"
              />
              <div className="flex justify-between mt-2">
                <span>S/ {priceRange[0]}</span>
                <span>S/ {priceRange[1]}</span>
              </div>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full transition-colors duration-200 hover:bg-red-100 focus:bg-red-100">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="priceAsc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="priceDesc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="rating">Mejor Calificados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col justify-end">
              <div className="flex items-center space-x-2 mb-1">
                <Switch
                  id="featuredOnly"
                  checked={showFeaturedOnly}
                  onCheckedChange={setShowFeaturedOnly}
                  className="transition-colors duration-200 hover:bg-red-100"
                />
                <Label htmlFor="featuredOnly" className="text-sm font-medium text-gray-700">
                  Solo Destacados
                </Label>
              </div>
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products grid - changed to 5x5 grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Productos</h2>
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">{cart.length} items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col h-full">
            <div className="relative h-40 w-full">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
              <p className="text-xs text-gray-600 mb-1">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-blue-600">S/ {product.price.toFixed(2)}</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart className="mr-1 h-3 w-3" /> Agregar al carrito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

