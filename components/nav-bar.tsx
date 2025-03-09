"use client"

import { ShoppingCart, User, Home, ShoppingBag, Calculator, Menu, LogOut, Truck } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileMenu } from "@/components/mobile-menu"
import { useState, useEffect } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

// Reemplaza la función useOrders con esta versión actualizada
function useOrders(userId: string | undefined) {
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    if (userId) {
      const fetchOrderCount = async () => {
        const { count, error } = await supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("customer_id", userId)
          .not("status", "eq", "cancelled")

        if (error) {
          console.error("Error fetching order count:", error)
        } else {
          setOrderCount(count || 0)
        }
      }

      fetchOrderCount()
    }
  }, [userId])

  return orderCount
}

export function NavBar() {
  const [isMobile, setIsMobile] = useState(false)
  const { user, userRole, signOut } = useAuth()
  const router = useRouter()
  const orderCount = useOrders(user?.id)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U"
    return user.user_metadata.full_name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
  }

  const renderAuthSection = () => {
    if (!user) {
      return (
        <Button variant="ghost" asChild className="text-white">
          <Link href="/auth">Iniciar Sesión</Link>
        </Button>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            {orderCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
                {orderCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem className="flex flex-col items-start">
            <div className="text-sm font-medium">{user.user_metadata.full_name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
            <div className="text-xs text-gray-500">
              Rol: {userRole || "No definido"}
              {userRole === "driver" && (
                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-blue-500" asChild>
                  <Link href="/driver">Ir a Panel de Driver</Link>
                </Button>
              )}
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Mis Pedidos {orderCount > 0 && `(${orderCount})`}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Link>
          </DropdownMenuItem>
          {userRole === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin/driver-tracking">
                <Truck className="mr-2 h-4 w-4" />
                Rastreo de Drivers
              </Link>
            </DropdownMenuItem>
          )}
          {userRole === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/logistics">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <nav className="bg-[#E31E24] text-white shadow-lg overflow-visible fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          <div className="flex items-center justify-between w-full md:w-auto py-2">
            <Logo variant={isMobile ? "horizontal" : "default"} className="rounded-lg" />
            {isMobile && (
              <div className="flex items-center space-x-2">
                {user && (
                  <Link href="/cart" className="p-2">
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                )}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden p-2">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <MobileMenu />
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>

          {isMobile && (
            <div className="flex justify-center w-full py-2">
              <NavButtonMobile href="/" icon={<Home className="w-5 h-5" />} label="Inicio" />
              <NavButtonMobile href="/marketplace" icon={<ShoppingBag className="w-5 h-5" />} label="Marketplace" />
              <NavButtonMobile href="/cotizaciones" icon={<Calculator className="w-5 h-5" />} label="Cotizaciones" />
            </div>
          )}

          {!isMobile && (
            <>
              <div className="flex items-center justify-center flex-grow">
                <NavButtonDesktop href="/" icon={<Home className="w-5 h-5" />} label="Inicio" />
                <NavButtonDesktop href="/marketplace" icon={<ShoppingBag className="w-5 h-5" />} label="Marketplace" />
                <NavButtonDesktop href="/cotizaciones" icon={<Calculator className="w-5 h-5" />} label="Cotizaciones" />
              </div>
              <div className="flex items-center space-x-2">
                {user && (
                  <Link href="/cart" className="p-2 hover:bg-[#007bff] rounded-full transition-colors duration-300">
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                )}
                {renderAuthSection()}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavButtonDesktop({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="relative flex items-center justify-center text-sm group px-4 py-4 mx-2">
      <div className="absolute inset-0 bg-[#007bff] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform skew-x-[-12deg]"></div>
      <div className="relative z-10 flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
    </Link>
  )
}

function NavButtonMobile({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center px-3">
      <div className="mb-1">{icon}</div>
      <span className="text-xs">{label}</span>
    </Link>
  )
}

