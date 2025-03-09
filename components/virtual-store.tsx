"use client"

import { useState, useCallback, useMemo } from "react"
import { ShoppingBag, Gem, Package, ChevronLeft, ChevronRight, Star, Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const categories = [
  {
    name: "Deportes",
    icon: Package,
    emoji: "🏅",
    subcategories: [
      { name: "Ropa deportiva", description: "Leggings, shorts, camisetas dry-fit, gorras" },
      { name: "Accesorios fitness", description: "Bandas elásticas, guantes de gimnasio, toallas deportivas" },
      { name: "Equipos pequeños", description: "Mancuernas, cuerdas para saltar, esteras de yoga" },
      { name: "Suplementos y batidos", description: "Proteínas, colágeno, creatina" },
      { name: "Ciclismo y running", description: "Luces, botellas térmicas, mochilas de hidratación" },
    ],
  },
  {
    name: "Bisutería",
    icon: Gem,
    emoji: "💎",
    subcategories: [
      { name: "Pulseras personalizadas", description: "Con nombres, iniciales o piedras energéticas" },
      { name: "Collares y cadenas", description: "Con dijes de moda (iniciales, corazones, lunas)" },
      { name: "Aretes minimalistas", description: "De acero inoxidable, bañados en oro" },
      { name: "Anillos ajustables", description: "Diseños vintage o modernos" },
      { name: "Set de accesorios", description: "Combos de pulsera + collar + aretes" },
    ],
  },
]

const featuredProducts = [
  {
    name: "Bolso de viaje multifuncional",
    price: "S/ 189.99",
    image:
      "https://image.pollinations.ai/prompt/Multifunctional%20travel%20bag%20with%20hidden%20compartments%20and%20USB%20charging%20port",
  },
  {
    name: "Billetera inteligente con rastreador",
    price: "S/ 79.99",
    image: "https://image.pollinations.ai/prompt/Smart%20wallet%20with%20GPS%20tracker%20and%20RFID%20protection",
  },
  {
    name: "Set de maquillaje ecológico",
    price: "S/ 109.99",
    image: "https://image.pollinations.ai/prompt/Eco-friendly%20makeup%20set%20with%20bamboo%20packaging",
  },
  {
    name: "Collar de plata con piedra lunar",
    price: "S/ 129.99",
    image: "https://image.pollinations.ai/prompt/Silver%20necklace%20with%20iridescent%20moonstone%20pendant",
  },
  {
    name: "Mochila solar con panel integrado",
    price: "S/ 249.99",
    image:
      "https://image.pollinations.ai/prompt/Backpack%20with%20integrated%20solar%20panel%20for%20charging%20devices",
  },
  {
    name: "Reloj de madera artesanal",
    price: "S/ 159.99",
    image: "https://image.pollinations.ai/prompt/Handcrafted%20wooden%20watch%20with%20visible%20gears",
  },
  {
    name: "Bufanda térmica inteligente",
    price: "S/ 69.99",
    image: "https://image.pollinations.ai/prompt/Smart%20thermal%20scarf%20with%20temperature%20control",
  },
  {
    name: "Gafas de sol con audio integrado",
    price: "S/ 199.99",
    image: "https://image.pollinations.ai/prompt/Sunglasses%20with%20built-in%20bone%20conduction%20audio",
  },
  {
    name: "Pulsera de fitness con hologramas",
    price: "S/ 89.99",
    image: "https://image.pollinations.ai/prompt/Fitness%20bracelet%20with%20holographic%20display",
  },
  {
    name: "Botella de agua purificadora UV",
    price: "S/ 79.99",
    image: "https://image.pollinations.ai/prompt/Water%20bottle%20with%20built-in%20UV%20purification%20system",
  },
]

export function VirtualStore() {
  const [startIndex, setStartIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [cartItems, setCartItems] = useState<string[]>([])

  const nextSlide = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length)
  }, [])

  const prevSlide = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex - 1 + featuredProducts.length) % featuredProducts.length)
  }, [])

  // Modificar cómo se generan los productos visibles para un ciclo infinito
  const visibleProducts = useMemo(() => {
    // Crear un array circular para un desplazamiento infinito
    const doubledProducts = [...featuredProducts, ...featuredProducts]
    return doubledProducts.slice(startIndex, startIndex + 10)
  }, [featuredProducts, startIndex])

  const filteredProducts = visibleProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (productName: string) => {
    setCartItems((prevItems) => [...prevItems, productName])
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" /> Tienda virtual Llama Express
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          <span className="font-semibold">{cartItems.length} items</span>
        </div>
      </div>

      <div className="mb-6 md:mb-8">
        <h3 className="text-lg font-semibold mb-3 md:mb-4 text-red-600">Artículos destacados</h3>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(startIndex % featuredProducts.length) * 100}%)` }}
          >
            {filteredProducts.map((product, index) => (
              <div key={`${product.name}-${index}`} className="w-full md:w-1/2 lg:w-1/5 flex-shrink-0 px-2">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
                  <div className="relative aspect-square bg-transparent p-2">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm h-10 overflow-hidden">{product.name}</h4>
                    <p className="text-blue-600 font-semibold my-1 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" />
                      {product.price}
                    </p>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded text-sm transition-colors duration-300"
                      onClick={() => addToCart(product.name)}
                    >
                      Agregar al carrito
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 md:mb-4 text-red-600">Categorías</h3>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{category.emoji}</span>
                  <h4 className="text-lg font-semibold">{category.name}</h4>
                </div>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.subcategories.map((subcategory, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <p className="font-medium text-sm">{subcategory.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{subcategory.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

